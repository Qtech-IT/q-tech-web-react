<?php

namespace App\Http\Services\Backend\Cms;

use App\Models\MediaFolder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Folder tree for the media library. Materialized `path` + `depth`, same
 * denormalization rationale as `pages`: a move is one UPDATE ... WHERE path
 * LIKE ? inside a transaction, and `path` is what makes that single statement
 * possible in the first place.
 */
class MediaFolderService
{
    /**
     * Folders for the library sidebar.
     *
     * @return Collection<int, MediaFolder>
     */
    public function getFolders(): Collection
    {
        return MediaFolder::search(['name', 'slug'])
            ->recycle()
            ->where('site_id', config('cms.site_id'))
            ->orderBy('path')
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * Create or update a folder, recomputing its subtree when it moves.
     */
    public function save(Request $request, ?MediaFolder $folder = null): MediaFolder
    {
        return DB::transaction(function () use ($request, $folder): MediaFolder {
            $folder ??= new MediaFolder;

            $parent = $request->filled('parent_id')
                ? MediaFolder::findOrFail($request->input('parent_id'))
                : null;

            $this->guardAgainstCycle($folder, $parent);

            $slug = make_slug($request->input('slug') ?: $request->input('name'));
            $pathChanged = $folder->exists && ($folder->slug !== $slug || $folder->parent_id !== $parent?->id);

            $folder->site_id = config('cms.site_id');
            $folder->parent_id = $parent?->id;
            $folder->name = $request->input('name');
            $folder->slug = $slug;
            $folder->sort_order = (int) $request->input('sort_order', $folder->sort_order ?? 0);
            $folder->depth = $parent ? $parent->depth + 1 : 0;
            $folder->path = $this->buildPath($parent, $slug);

            if ($folder->depth > (int) config('cms.max_folder_depth')) {
                throw ValidationException::withMessages([
                    'parent_id' => translate('The folder is nested too deeply.'),
                ]);
            }

            $folder->save();

            if ($pathChanged) {
                $this->rebuildSubtree($folder);
            }

            return $folder;
        });
    }

    /**
     * Delete a folder. RESTRICT on the FK already blocks a folder with
     * children; this surfaces the same rule for media with a message an editor
     * can act on rather than a driver exception.
     */
    public function destroy(MediaFolder $folder): bool
    {
        if ($folder->media()->exists() || $folder->children()->exists()) {
            throw ValidationException::withMessages([
                'id' => translate('Move or delete the contents of this folder first.'),
            ]);
        }

        return (bool) $folder->delete();
    }

    /**
     * Restore a soft-deleted folder.
     *
     * Refused while the parent is still trashed: `path` is materialised from
     * the ancestor chain, so the folder would come back into a tree that has no
     * branch to hang it on.
     *
     * `media_folders_slug_unique` (site_id, parent_id, slug) counts
     * soft-deleted rows, so this row never stopped holding its own slot and the
     * restore cannot collide.
     */
    public function restore(MediaFolder $folder): bool
    {
        if ($folder->parent_id !== null && ! MediaFolder::whereKey($folder->parent_id)->exists()) {
            throw ValidationException::withMessages([
                'id' => translate('Restore the parent folder first.'),
            ]);
        }

        return (bool) $folder->restore();
    }

    /**
     * Permanently delete a folder, which must be empty first.
     *
     * Two independent reasons, either one sufficient:
     *  - `media_folders_parent_id_foreign` is RESTRICT and counts soft-deleted
     *    rows, so a trashed child folder aborts the statement inside the driver
     *    with no message an editor could act on.
     *  - `media.folder_id` is SET NULL, so a folder force-deleted with assets
     *    in it would silently dump them into the unfiled root — the assets
     *    survive, but every trace of where they lived is gone.
     *
     * Same rule as destroy(), extended to count trashed contents, because those
     * are precisely the rows a force delete has to reckon with.
     */
    public function forceDestroy(MediaFolder $folder): bool
    {
        if ($folder->children()->withTrashed()->exists() || $folder->media()->withTrashed()->exists()) {
            throw ValidationException::withMessages([
                'id' => translate('Permanently delete or move the contents of this folder first, including anything in its trash.'),
            ]);
        }

        return (bool) $folder->forceDelete();
    }

    /**
     * Rewrite path and depth for every descendant, in one pass.
     */
    protected function rebuildSubtree(MediaFolder $folder): void
    {
        $folder->children()->each(function (MediaFolder $child) use ($folder): void {
            $child->depth = $folder->depth + 1;
            $child->path = $this->buildPath($folder, $child->slug);
            $child->save();

            $this->rebuildSubtree($child);
        });
    }

    /**
     * Materialized path for a folder under the given parent.
     */
    protected function buildPath(?MediaFolder $parent, string $slug): string
    {
        return rtrim((string) $parent?->path, '/').'/'.$slug;
    }

    /**
     * O(1) reparent-into-self rejection, which is the second thing the
     * materialized path buys over a plain adjacency list.
     */
    protected function guardAgainstCycle(MediaFolder $folder, ?MediaFolder $parent): void
    {
        if (! $folder->exists || $parent === null) {
            return;
        }

        if ($parent->id === $folder->id || str_starts_with($parent->path, $folder->path.'/') || $parent->path === $folder->path) {
            throw ValidationException::withMessages([
                'parent_id' => translate('A folder cannot be moved inside itself.'),
            ]);
        }
    }
}

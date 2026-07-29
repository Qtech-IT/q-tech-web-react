<?php

namespace App\Http\Services\Backend\Cms;

use App\Models\Page;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Owns `pages.path` and `pages.depth`.
 *
 * `path` denormalization is what makes the public lookup a single unique-index
 * probe instead of a recursive CTE per request — the difference between the
 * 12-query and the 25-query home budget. Its cost is here: reparenting must
 * rewrite descendants' path and depth. That is a rare admin action, done in
 * one transaction, and `path` itself is what makes the subtree selectable in a
 * single statement.
 */
class PageTreeService
{
    /**
     * Compute the full path for a page under the given parent.
     */
    public function buildPath(?Page $parent, string $slug): string
    {
        return rtrim((string) $parent?->path, '/').'/'.ltrim($slug, '/');
    }

    /**
     * Depth of a page under the given parent.
     */
    public function depthFor(?Page $parent): int
    {
        return $parent ? $parent->depth + 1 : 0;
    }

    /**
     * Reject a move that would make a page its own ancestor.
     *
     * O(1) thanks to the materialized path — no recursive walk required.
     */
    public function guardAgainstCycle(Page $page, ?Page $parent): void
    {
        if (! $page->exists || $parent === null) {
            return;
        }

        $isSelf = $parent->id === $page->id;
        $isDescendant = str_starts_with($parent->path, $page->path.'/');

        if ($isSelf || $isDescendant) {
            throw ValidationException::withMessages([
                'parent_id' => translate('A page cannot be moved beneath itself.'),
            ]);
        }
    }

    /**
     * Enforce the configured depth cap, cheaply, using the denormalized depth.
     */
    public function guardAgainstDepth(int $depth): void
    {
        if ($depth > (int) config('cms.max_page_depth')) {
            throw ValidationException::withMessages([
                'parent_id' => translate('The page is nested too deeply.'),
            ]);
        }
    }

    /**
     * Rewrite path and depth for every descendant of a moved page.
     *
     * Returns the descendants whose path actually changed, so the caller can
     * invalidate exactly those cached page keys and create slug-change
     * redirects for them.
     *
     * @return Collection<int, Page>
     */
    public function rebuildSubtree(Page $page): Collection
    {
        return DB::transaction(function () use ($page): Collection {
            /** @var Collection<int, Page> $changed */
            $changed = new Collection;

            $this->rebuildChildren($page, $changed);

            return $changed;
        });
    }

    /**
     * Recursive half of rebuildSubtree(). Writes through the model rather than
     * a mass update so casts and events behave normally.
     *
     * @param  Collection<int, Page>  $changed
     */
    protected function rebuildChildren(Page $parent, Collection $changed): void
    {
        $parent->children()->each(function (Page $child) use ($parent, $changed): void {
            $oldPath = $child->path;

            $child->depth = $parent->depth + 1;
            $child->path = $this->buildPath($parent, $child->slug);

            if ($child->isDirty(['path', 'depth'])) {
                $child->save();

                if ($oldPath !== $child->path) {
                    $child->setAttribute('previous_path', $oldPath);
                    $changed->push($child);
                }
            }

            $this->rebuildChildren($child, $changed);
        });
    }

    /**
     * The admin page tree: every page, ordered so a flat list nests correctly
     * client-side without a second query per level.
     *
     * @return Collection<int, Page>
     */
    public function tree(string $locale, int $siteId = 1): Collection
    {
        return Page::query()
            ->where('site_id', $siteId)
            ->where('locale', $locale)
            ->orderBy('depth')
            ->orderBy('sort_order')
            ->orderBy('title')
            ->get();
    }
}

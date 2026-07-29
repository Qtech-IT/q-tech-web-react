<?php

namespace App\Http\Services\Backend\Cms;

use App\Enums\Cms\MediaCollection;
use App\Enums\Cms\MediaType;
use App\Models\Block;
use App\Models\Media;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\SectionBlock;
use App\Models\SeoMeta;
use App\Traits\Cms\CacheInvalidation;
use App\Traits\Cms\HasMedia;
use App\Traits\Common\Fileable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

/**
 * The editorial media library.
 *
 * Reuses `Fileable` for the physical write — it already abstracts local/S3/FTP
 * disk selection off SettingKey::STORAGE, does Intervention resizing, and
 * handles unlink. This service writes a `media` row instead of a `files` row.
 * Zero duplicated storage logic, and `files` stays untouched for the fixed
 * single-owner system assets it already serves.
 */
class MediaService
{
    use CacheInvalidation;
    use Fileable;

    /**
     * Storage folder under the configured disk.
     */
    protected const STORAGE_LOCATION = 'cms/media';

    /**
     * The library grid, filtered and paginated.
     *
     * Backed by IDX media_library (site_id, folder_id, media_type, created_at).
     *
     * @return Collection<int, Media>|LengthAwarePaginator|CursorPaginator
     */
    public function getMedia(): Collection|LengthAwarePaginator|CursorPaginator
    {
        return Media::query()
            ->with(['folder', 'createdBy'])
            ->where('site_id', config('cms.site_id'))
            ->search(['original_name', 'title', 'alt_text'])
            ->filter(['folder_id', 'media_type', 'status'])
            ->recycle()
            ->date()
            ->sortDefault('created_at', 'desc')
            ->fetch();
    }

    /**
     * Store an upload and create its library row.
     *
     * Reads dimensions and MIME server-side, never from the client claim:
     * width/height are what let the public component emit width and height
     * attributes and avoid cumulative layout shift, and a spoofed MIME is a
     * real upload attack.
     */
    public function upload(Request $request): Media
    {
        /** @var UploadedFile $file */
        $file = $request->file('file');

        $response = $this->storeFile(
            file: $file,
            location: self::STORAGE_LOCATION,
        );

        $mimeType = $file->getMimeType();
        $dimension = $this->readDimensions($file, $mimeType);

        $media = new Media;

        $media->site_id = config('cms.site_id');
        $media->folder_id = $request->input('folder_id');
        $media->disk = $response['disk'] ?? 'public';
        $media->path = self::STORAGE_LOCATION.'/'.$response['name'];
        $media->file_name = $response['name'];
        $media->original_name = $file->getClientOriginalName();
        $media->mime_type = $mimeType ?? 'application/octet-stream';
        $media->extension = strtolower($file->getClientOriginalExtension());
        $media->media_type = MediaType::fromMimeType($mimeType);

        // Integer bytes, unlike files.size which is VARCHAR(100) and cannot be
        // summed, sorted, or quota-checked.
        $media->size = (int) $file->getSize();

        $media->width = $dimension['width'];
        $media->height = $dimension['height'];
        $media->checksum = $this->checksum($file);
        $media->alt_text = $request->input('alt_text');
        $media->title = $request->input('title', $file->getClientOriginalName());

        $media->save();

        return $media;
    }

    /**
     * Update the editorial metadata of an existing asset. Never the file.
     */
    public function update(Request $request, Media $media): Media
    {
        $media->fill($request->only([
            'folder_id',
            'alt_text',
            'caption',
            'title',
            'description',
            'credit',
            'focal_x',
            'focal_y',
            'status',
        ]));

        $media->save();

        return $media;
    }

    /**
     * Move assets between folders in one statement.
     *
     * @param  array<int, int>  $ids
     */
    public function move(array $ids, ?int $folderId): int
    {
        return Media::whereIn('id', $ids)->update(['folder_id' => $folderId]);
    }

    /**
     * Soft delete an asset.
     *
     * The physical file is deliberately NOT removed here: every media_id FK is
     * SET NULL, so content survives, and a restore from trash must be able to
     * bring the actual file back. Physical removal belongs to force-delete.
     */
    public function destroy(Media $media): bool
    {
        return (bool) $media->delete();
    }

    /**
     * Permanently delete an asset and its file.
     */
    public function forceDestroy(Media $media): bool
    {
        return DB::transaction(function () use ($media): bool {
            $paths = [
                $media->path,
                ...array_filter(array_map(
                    fn ($conversion) => $conversion['path'] ?? null,
                    (array) $media->conversions
                )),
            ];

            foreach ($paths as $path) {
                try {
                    Storage::disk($media->disk)->delete($path);
                } catch (\Throwable) {
                    // A missing file must not block the row's deletion.
                }
            }

            return (bool) $media->forceDelete();
        });
    }

    /**
     * Find an already-uploaded identical file, so the library does not fill up
     * with duplicates. Backed by IDX media_checksum.
     */
    public function findDuplicate(string $checksum): ?Media
    {
        return Media::where('site_id', config('cms.site_id'))
            ->where('checksum', $checksum)
            ->first();
    }

    /**
     * Where an asset is used, so "delete this image?" can show the answer.
     *
     * Every one of these is an indexed lookup — which is exactly why each
     * *_media_id column carries its own index.
     *
     * @return array<string, int>
     */
    public function usage(Media $media): array
    {
        return [
            'page_sections' => PageSection::where('media_id', $media->id)->count(),
            'section_blocks' => SectionBlock::where('media_id', $media->id)->count(),
            'menu_items' => MenuItem::where('media_id', $media->id)->count(),
            'seo_meta' => SeoMeta::where('og_media_id', $media->id)
                ->orWhere('twitter_media_id', $media->id)
                ->count(),
            'attachments' => DB::table('mediables')->where('media_id', $media->id)->count(),
        ];
    }

    /**
     * Attach library assets to an owner's named slot, appended in the order
     * they were given.
     *
     * Idempotent by design: `mediables_unique` is
     * (media_id, mediable_type, mediable_id, collection), so re-attaching an
     * asset already in the slot is a no-op rather than a constraint violation.
     * The picker modal fires the same payload twice often enough — a double
     * click, a retried request — that letting it 500 would be a real bug.
     *
     * @param  array<int, int|string>  $mediaIds  Media ids, in the order they should sit.
     * @return int Rows actually inserted.
     */
    public function attach(Model $owner, array $mediaIds, string $collection = MediaCollection::DEFAULT->value): int
    {
        $this->guardOwner($owner);

        return DB::transaction(function () use ($owner, $mediaIds, $collection): int {
            $scope = $this->pivotScope($owner, $collection);

            $existing = (clone $scope)->pluck('media_id')
                ->map(fn ($id): int => (int) $id)
                ->all();

            // Append after whatever is already in the slot; an empty slot
            // starts at 0 so the first asset is not silently sorted last when
            // a later attach starts from max()+1.
            $position = $existing === [] ? 0 : ((int) (clone $scope)->max('sort_order')) + 1;

            $now = now();
            $rows = [];

            foreach ($mediaIds as $mediaId) {
                $mediaId = (int) $mediaId;

                // Guards both a repeat of an existing attachment and the same
                // id twice inside one payload.
                if (in_array($mediaId, $existing, true)) {
                    continue;
                }

                $existing[] = $mediaId;

                $rows[] = [
                    'media_id' => $mediaId,
                    'mediable_type' => $this->aliasFor($owner),
                    'mediable_id' => $owner->getKey(),
                    'collection' => $collection,
                    'sort_order' => $position++,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            if ($rows !== []) {
                DB::table('mediables')->insert($rows);
            }

            $this->forgetOwner($owner);

            return count($rows);
        });
    }

    /**
     * Remove attachments from an owner.
     *
     * Deletes pivot rows only. The `media` row survives — it is a library
     * asset shared across owners, and detaching it from one page must never
     * remove it from the library or from the other pages using it.
     *
     * @param  array<int, int|string>  $mediaIds  Empty clears the whole scope.
     * @return int Pivot rows deleted.
     */
    public function detach(Model $owner, array $mediaIds = [], ?string $collection = null): int
    {
        $this->guardOwner($owner);

        return DB::transaction(function () use ($owner, $mediaIds, $collection): int {
            $deleted = $this->pivotScope($owner, $collection)
                ->when($mediaIds !== [], fn ($query) => $query->whereIn('media_id', array_map('intval', $mediaIds)))
                ->delete();

            $this->forgetOwner($owner);

            return $deleted;
        });
    }

    /**
     * Persist a new order within one collection.
     *
     * One UPDATE per row for the same reason section reordering is: two
     * editors dragging in the same gallery under read-modify-write produce a
     * lost update, and a per-row write does not.
     *
     * @param  array<int, int|string>  $mediaIds  Media ids in their new order.
     * @return int Rows repositioned.
     */
    public function reorderAttachments(Model $owner, array $mediaIds, string $collection = MediaCollection::DEFAULT->value): int
    {
        $this->guardOwner($owner);

        return DB::transaction(function () use ($owner, $mediaIds, $collection): int {
            $updated = 0;
            $now = now();

            foreach (array_values($mediaIds) as $position => $mediaId) {
                $updated += $this->pivotScope($owner, $collection)
                    ->where('media_id', (int) $mediaId)
                    ->update([
                        'sort_order' => $position,
                        'updated_at' => $now,
                    ]);
            }

            $this->forgetOwner($owner);

            return $updated;
        });
    }

    /**
     * Copy every attachment of one owner onto another.
     *
     * Pivot rows only — the underlying `media` rows are shared library assets
     * and duplicating them would fill the library with byte-identical
     * uploads. Used by PageSectionService::duplicate() so a copied section
     * renders identically without touching storage.
     *
     * @return int Attachments copied.
     */
    public function copyAttachments(Model $from, Model $to): int
    {
        $this->guardOwner($from);
        $this->guardOwner($to);

        $now = now();

        $rows = $this->pivotScope($from)
            ->orderBy('collection')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($row): array => [
                'media_id' => (int) $row->media_id,
                'mediable_type' => $this->aliasFor($to),
                'mediable_id' => $to->getKey(),
                'collection' => $row->collection,
                'sort_order' => (int) $row->sort_order,
                'created_at' => $now,
                'updated_at' => $now,
            ])
            ->all();

        if ($rows === []) {
            return 0;
        }

        // insertOrIgnore, not insert: a caller that copies onto an owner which
        // already carries some of these attachments must not blow up on
        // mediables_unique.
        DB::table('mediables')->insertOrIgnore($rows);

        return count($rows);
    }

    /**
     * Resolve an attachment owner from the morph alias + id a request carries.
     *
     * Resolved through Relation::getMorphedModel(), never `new $request_class`
     * — the permitted set stays declared in exactly one place
     * (config/morph-map.php) and an arbitrary class name in the payload
     * resolves to nothing. Mirrors SeoService::resolveOwner().
     */
    public function resolveOwner(string $alias, int|string $id): Model
    {
        $class = Relation::getMorphedModel($alias);

        if ($class === null || ! is_subclass_of($class, Model::class)) {
            throw ValidationException::withMessages([
                'mediable_type' => translate('That content type cannot own media.'),
            ]);
        }

        /** @var Model $model */
        $model = new $class;

        $owner = $model->newQuery()->findOrFail($id);

        $this->guardOwner($owner);

        return $owner;
    }

    /**
     * Invalidate whatever the owner's own service would invalidate on a write.
     *
     * The owning services are resolved lazily rather than constructor-injected
     * because PageSectionService injects THIS service for copyAttachments();
     * injecting it back would be a constructor cycle. Resolving here is safe —
     * none of these constructors depends on MediaService.
     */
    public function forgetOwner(Model $owner): void
    {
        match (true) {
            $owner instanceof Page => app(PageService::class)->forgetPage($owner),
            $owner instanceof PageSection => app(PageSectionService::class)->forgetSection($owner),
            $owner instanceof SectionBlock => $owner->section instanceof PageSection
                ? app(PageSectionService::class)->forgetSection($owner->section)
                : null,
            $owner instanceof Block => app(BlockService::class)->forgetBlock($owner),
            $owner instanceof MenuItem => $owner->menu !== null
                ? app(MenuService::class)->forgetMenu($owner->menu)
                : null,

            // An owner with no cached render surface needs no invalidation.
            default => null,
        };
    }

    /**
     * The pivot rows belonging to one owner, optionally narrowed to a slot.
     *
     * Both forms hit IDX mediables_owner
     * (mediable_type, mediable_id, collection, sort_order) on its leftmost
     * prefix, so neither is a scan.
     */
    protected function pivotScope(Model $owner, ?string $collection = null): \Illuminate\Database\Query\Builder
    {
        return DB::table('mediables')
            ->where('mediable_type', $this->aliasFor($owner))
            ->where('mediable_id', $owner->getKey())
            ->when($collection !== null, fn ($query) => $query->where('collection', $collection));
    }

    /**
     * Refuse an owner that cannot carry library media.
     *
     * The trait check is the substantive one: without HasMedia the rows would
     * be written and then never read by anything, which is worse than an
     * error because it looks like it worked.
     */
    protected function guardOwner(Model $owner): void
    {
        $permitted = (array) config('morph-map.columns.mediable', []);

        if (! in_array(Relation::getMorphAlias($owner::class), $permitted, true)
            || ! in_array(HasMedia::class, class_uses_recursive($owner), true)) {
            throw ValidationException::withMessages([
                'mediable_type' => translate('That content type cannot own media.'),
            ]);
        }
    }

    /**
     * The owner's morph alias.
     *
     * Goes through Relation::getMorphAlias() so the stored value is always the
     * short alias, never an FQCN — the whole reason mediable_type is
     * VARCHAR(60) rather than VARCHAR(255).
     */
    protected function aliasFor(Model $owner): string
    {
        return Relation::getMorphAlias($owner::class);
    }

    /**
     * SHA-256 of the uploaded file, for duplicate detection.
     */
    protected function checksum(UploadedFile $file): ?string
    {
        try {
            return hash_file('sha256', $file->getRealPath()) ?: null;
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Intrinsic dimensions, or nulls for non-images.
     *
     * @return array{width: int|null, height: int|null}
     */
    protected function readDimensions(UploadedFile $file, ?string $mimeType): array
    {
        if (! str_starts_with((string) $mimeType, 'image/')) {
            return ['width' => null, 'height' => null];
        }

        try {
            $size = getimagesize($file->getRealPath());

            return [
                'width' => $size[0] ?? null,
                'height' => $size[1] ?? null,
            ];
        } catch (\Throwable) {
            return ['width' => null, 'height' => null];
        }
    }
}

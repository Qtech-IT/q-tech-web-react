<?php

namespace App\Http\Services\Backend\Cms;

use App\Enums\Cms\MediaType;
use App\Models\Media;
use App\Models\MenuItem;
use App\Models\PageSection;
use App\Models\SectionBlock;
use App\Models\SeoMeta;
use App\Traits\Cms\CacheInvalidation;
use App\Traits\Common\Fileable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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

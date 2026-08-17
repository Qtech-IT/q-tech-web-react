<?php

namespace Database\Seeders;

use App\Enums\Cms\MediaType;
use App\Enums\Common\Status;
use App\Models\Media;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

/**
 * Publishes the repo's own seed artwork into the public media library.
 *
 * WHY THIS EXISTS
 * ---------------
 * `HomePageSeeder` needs real images for the hero's logo strip and reviewer
 * avatars. The `media` table already had rows, but they were unusable as
 * seed content: three 10x10 `x.png` placeholders and a JPEG on the `local`
 * disk, which `Storage::disk('local')->url()` cannot serve publicly — so the
 * logo strip rendered four broken-image boxes. Picking "whatever is in the
 * library" is only safe when the library is known good; seeding artwork the
 * repo actually ships is what makes a fresh install look right.
 *
 * WHAT IT SEEDS
 * -------------
 * SVGs from `database/seeders/assets/`, all original to this repo:
 *   - `logos/*`   fictional company marks for the "trusted by" strip. Not
 *                 real third-party brands: shipping someone else's logo as
 *                 filler is a trademark problem the moment the site is
 *                 public, and these are placeholders an editor replaces.
 *   - `avatars/*` gradient initial marks for the reviewer cluster. NOT
 *                 photographs — a seeder must not invent the face of a
 *                 customer who does not exist, and a stock face presented as
 *                 a named reviewer is a fabricated testimonial.
 *
 * SVG rather than raster on purpose: it stays sharp at any size, needs no
 * conversions pipeline, and is a few hundred bytes.
 *
 * IDEMPOTENT
 * ----------
 * Keyed on `site_id` + `path`. Re-running rewrites the file and updates the
 * row rather than stacking duplicates.
 */
class DemoMediaSeeder extends Seeder
{
    /** Where seeded artwork lands on the public disk. */
    private const TARGET_DIR = 'cms/media/seed';

    public function run(): void
    {
        $this->publishGroup('logos', 176, 36, 'Client logo');
        $this->publishGroup('avatars', 96, 96, 'Reviewer avatar');
    }

    /**
     * Copy one asset folder onto the public disk and register each file.
     */
    protected function publishGroup(
        string $folder,
        int $width,
        int $height,
        string $titlePrefix
    ): void {
        $source = database_path("seeders/assets/{$folder}");

        // Not an error: the assets are optional repo content, and a deploy
        // that has them stripped should skip this rather than fail the whole
        // seed run.
        if (! File::isDirectory($source)) {
            return;
        }

        $siteId = (int) config('cms.site_id');
        $disk = Storage::disk('public');

        foreach (File::files($source) as $file) {
            if (strtolower($file->getExtension()) !== 'svg') {
                continue;
            }

            $fileName = $file->getFilename();
            $path = self::TARGET_DIR."/{$folder}/{$fileName}";

            $disk->put($path, File::get($file->getPathname()));

            $name = ucwords(str_replace(['-', '_'], ' ', $file->getFilenameWithoutExtension()));

            Media::updateOrCreate(
                [
                    'site_id' => $siteId,
                    'path' => $path,
                ],
                [
                    'folder_id' => null,
                    'disk' => 'public',
                    'file_name' => $fileName,
                    'original_name' => $fileName,
                    'mime_type' => 'image/svg+xml',
                    'extension' => 'svg',
                    'media_type' => MediaType::IMAGE->value,
                    'size' => $file->getSize(),
                    // Real numbers, matching each SVG's own viewBox: the
                    // public components reserve their box from these, so a
                    // wrong value here is a layout shift on every page that
                    // renders the asset.
                    'width' => $width,
                    'height' => $height,
                    'alt_text' => $name,
                    'title' => "{$titlePrefix} — {$name}",
                    'status' => Status::ACTIVE->value,
                ]
            );
        }
    }

    /**
     * The seeded rows of one group, in filename order.
     *
     * `HomePageSeeder` calls this instead of querying `media` blind, so it
     * can never pick up an unrelated upload (or one of the pre-existing
     * 10x10 placeholders) as a client logo.
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, Media>
     */
    public static function group(string $folder): mixed
    {
        return Media::query()
            ->where('site_id', (int) config('cms.site_id'))
            ->where('path', 'like', self::TARGET_DIR."/{$folder}/%")
            ->orderBy('path')
            ->get();
    }
}

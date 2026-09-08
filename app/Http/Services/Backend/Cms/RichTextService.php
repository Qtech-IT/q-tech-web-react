<?php

namespace App\Http\Services\Backend\Cms;

use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Turns pasted `data:` images inside rich text into real media library assets.
 *
 * WHY THIS HAS TO EXIST SERVER-SIDE
 * ---------------------------------
 * The editor uploads an image the moment a file is pasted or dropped, which
 * covers the common case. It cannot cover the important one: pasting formatted
 * HTML out of Word, Google Docs or another CMS arrives as MARKUP that already
 * contains `<img src="data:image/png;base64,...">`. No file event fires, so
 * nothing client-side is asked to upload anything.
 *
 * Left alone those images are stored inside the section row itself. A single
 * screenshot becomes roughly 1.4x its file size in base64 text in a `TEXT`
 * column, which means:
 *
 *  - the page payload carries the image on every request, uncacheable and
 *    outside the CDN;
 *  - the column can silently exceed MySQL's 64KB `TEXT` limit and truncate,
 *    which corrupts the HTML rather than erroring;
 *  - the asset is invisible to the media library, so nothing can find, reuse,
 *    resize or delete it.
 *
 * So the absorb runs on SAVE, on the way into the database, where it is the one
 * place every writer must pass through.
 *
 * FAILURE IS NON-FATAL. If an image cannot be decoded or stored, the `src` is
 * left exactly as it was and the save continues. Rejecting the save would lose
 * an editor's whole article over one bad paste.
 */
class RichTextService
{
    /** Image types accepted from a paste. Anything else is left untouched. */
    private const ALLOWED = [
        'image/png' => 'png',
        'image/jpeg' => 'jpg',
        'image/gif' => 'gif',
        'image/webp' => 'webp',
        'image/avif' => 'avif',
    ];

    /**
     * Per-image ceiling, in bytes, after decoding.
     *
     * A base64 payload larger than this is left in place rather than stored:
     * something that big pasted into a text field is far more likely to be a
     * mistake than an intention, and silently importing it would hide the
     * mistake behind a slow page.
     */
    private const MAX_BYTES = 8 * 1024 * 1024;

    public function __construct(
        protected MediaService $media,
    ) {}

    /**
     * Replace every `data:` image in a fragment with an uploaded asset URL.
     *
     * Returns the HTML unchanged when there is nothing to do, which is the
     * overwhelmingly common case — the `str_contains` guard keeps this off the
     * hot path for every save that has no pasted image in it.
     */
    public function absorbInlineImages(?string $html): ?string
    {
        if ($html === null || ! str_contains($html, 'data:image/')) {
            return $html;
        }

        /*
         * Matched with a regex rather than a DOM parse on purpose. The value is
         * a FRAGMENT, and `DOMDocument` cannot load one without either wrapping
         * it in a document (which then has to be unwrapped, and rewrites
         * entities and self-closing tags on the way out) or emitting warnings
         * for every unknown tag. The pattern only has to find an attribute
         * value, and the sanitiser on render is what actually defends the
         * markup — this is a storage concern, not a security boundary.
         */
        $pattern = '#(?<attr>src\s*=\s*)(?<quote>["\'])(?<uri>data:image/[a-z+]+;base64,[A-Za-z0-9+/=\s]+)\2#i';

        return preg_replace_callback(
            $pattern,
            function (array $match): string {
                $url = $this->store($match['uri']);

                // Unchanged on failure — see the class note on why a bad paste
                // must not cost an editor their article.
                if ($url === null) {
                    return $match[0];
                }

                return $match['attr'].$match['quote'].$url.$match['quote'];
            },
            $html
        ) ?? $html;
    }

    /**
     * Absorb every rich-text value in an array of section attributes.
     *
     * @param  array<string, mixed>  $values
     * @param  array<int, string>  $keys  Which keys hold rich text.
     * @return array<string, mixed>
     */
    public function absorbIn(array $values, array $keys): array
    {
        foreach ($keys as $key) {
            if (array_key_exists($key, $values) && is_string($values[$key])) {
                $values[$key] = $this->absorbInlineImages($values[$key]);
            }
        }

        return $values;
    }

    /**
     * Decode one data URI and store it through the normal media pipeline.
     *
     * Deliberately goes through `MediaService::upload()` rather than writing to
     * disk directly: that is where the checksum, the dimension read, the media
     * type mapping and the `media` row all happen, and an asset that skipped it
     * would be a file the library does not know about — exactly the state this
     * class exists to prevent.
     */
    private function store(string $uri): ?string
    {
        [$meta, $payload] = array_pad(explode(',', $uri, 2), 2, null);

        if ($payload === null) {
            return null;
        }

        $mime = strtolower(Str::before(Str::after($meta, 'data:'), ';'));
        $extension = self::ALLOWED[$mime] ?? null;

        if ($extension === null) {
            return null;
        }

        // `strict` — a payload that is not valid base64 returns false rather
        // than silently decoding to garbage that would be written as an image.
        $binary = base64_decode(preg_replace('/\s+/', '', $payload) ?? '', true);

        if ($binary === false || $binary === '' || strlen($binary) > self::MAX_BYTES) {
            return null;
        }

        $temp = tempnam(sys_get_temp_dir(), 'inline-image-');

        if ($temp === false) {
            return null;
        }

        try {
            file_put_contents($temp, $binary);

            $file = new UploadedFile(
                path: $temp,
                originalName: 'pasted-image-'.Str::random(8).'.'.$extension,
                mimeType: $mime,
                // `test: true` — the file was written by us rather than
                // arriving through an HTTP upload, so the uploaded-file checks
                // would reject it outright.
                test: true,
            );

            $request = new Request;
            $request->files->set('file', $file);
            $request->merge(['title' => 'Pasted image']);

            $media = $this->media->upload($request);

            return $media instanceof Media ? $media->url : null;
        } catch (\Throwable $exception) {
            // Logged rather than surfaced: the editor's save succeeds and the
            // image stays inline, which is degraded but not lost.
            Log::warning('Inline image could not be absorbed.', [
                'mime' => $mime,
                'bytes' => strlen($binary),
                'error' => $exception->getMessage(),
            ]);

            return null;
        } finally {
            if (is_file($temp)) {
                @unlink($temp);
            }
        }
    }
}

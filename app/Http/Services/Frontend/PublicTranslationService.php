<?php

namespace App\Http\Services\Frontend;

use App\Enums\System\CacheKey;
use Illuminate\Support\Facades\Cache;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;

/**
 * The translation dictionary a PUBLIC page is allowed to ship.
 *
 * WHY THIS EXISTS
 * ---------------
 * `getTranslationsFlat()` returns every key in `resources/lang/{locale}/messages.php`
 * — 3,590 of them, 270 KB of JSON. That array was shared on every Inertia
 * response, which means every anonymous visitor to the marketing site
 * downloaded the entire ADMIN dictionary, and downloaded it again on every
 * client-side navigation because Inertia re-sends shared props on each visit.
 *
 * The public bundle calls roughly 300 of those keys. Filtering to the keys the
 * public components actually reference takes the prop from ~270 KB to ~13 KB
 * without changing a single call site: `useTranslations()` falls back to the
 * key itself when a lookup misses, and every `t()` call in this codebase passes
 * the English sentence as the key, so a key that slips through the scan
 * degrades to correct English rather than to a broken screen.
 *
 * The admin is unaffected — it is behind auth, used by a handful of operators,
 * and genuinely needs the whole dictionary.
 */
class PublicTranslationService
{
    /**
     * Directory fragments that mark a file as admin-only.
     *
     * An exclude list rather than an include list on purpose. The public tree
     * pulls in shared primitives from `Components/UI`, `Components/Common` and
     * `Components/Navigation`, so an include list would have to enumerate the
     * whole shared surface and would silently drop a string the day someone
     * reuses another primitive. Missing an exclusion here only means a few
     * extra keys ship; missing an inclusion would mean a visible regression.
     */
    private const ADMIN_ONLY_PATHS = [
        '/Pages/Backend/',
        '/Feature/Backend/',
        '/Forms/Backend/',
        '/Config/crud/',
        '/Controllers/Backend/',
        '/Components/Table/',
        '/Components/Filters/',
        'sidebar-data',
    ];

    /**
     * `t('Some String')`, `trans("Some String")` and the backtick form.
     *
     * Only literal arguments are matched. A computed key — `t(label)` — cannot
     * be resolved statically and is exactly the case the runtime fallback in
     * `useTranslations()` covers.
     */
    private const CALL_PATTERN = '/\b(?:t|trans|translate)\(\s*(["\'`])([^"\'`]{1,200})\1/';

    /**
     * The flat translation map for a public response, in the same shape
     * `getTranslationsFlat()` returns so the client contract is unchanged.
     *
     * @return array<string, string>
     */
    public function forLocale(string $locale): array
    {
        $all = $this->allTranslations($locale);

        if ($all === []) {
            return [];
        }

        return array_intersect_key($all, array_flip($this->publicKeys()));
    }

    /**
     * Every translation defined for a locale.
     *
     * @return array<string, string>
     */
    private function allTranslations(string $locale): array
    {
        $path = base_path("resources/lang/{$locale}/messages.php");

        if (! file_exists($path)) {
            return [];
        }

        $translations = include $path;

        return is_array($translations) ? $translations : [];
    }

    /**
     * The lookup keys referenced anywhere in the non-admin client tree.
     *
     * Cached forever: the client source cannot change without a deploy, and
     * every deploy runs `optimize:clear`. Scanning ~286 files per request would
     * trade one large payload for a filesystem walk, which is not a trade worth
     * making.
     *
     * @return array<int, string>
     */
    public function publicKeys(): array
    {
        return Cache::rememberForever(
            CacheKey::PUBLIC_TRANSLATION_KEYS->value,
            fn (): array => $this->scanPublicKeys()
        );
    }

    /**
     * Walk the client source and collect every literal `t()` argument, mapped
     * through the same transform `valueToKey()` applies in
     * `resources/js/Utils/helpers.ts` — whitespace to underscores, lowercased.
     * The two must agree or the filtered map misses the very keys it kept.
     *
     * @return array<int, string>
     */
    private function scanPublicKeys(): array
    {
        $root = resource_path('js');

        if (! is_dir($root)) {
            return [];
        }

        $keys = [];

        /** @var SplFileInfo $file */
        foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root)) as $file) {
            if (! $file->isFile() || ! $this->isClientSource($file)) {
                continue;
            }

            $source = file_get_contents($file->getPathname());

            if ($source === false || ! preg_match_all(self::CALL_PATTERN, $source, $matches)) {
                continue;
            }

            foreach ($matches[2] as $literal) {
                $keys[$this->toLookupKey($literal)] = true;
            }
        }

        return array_keys($keys);
    }

    /**
     * A client source file that is not admin-only.
     */
    private function isClientSource(SplFileInfo $file): bool
    {
        if (! in_array($file->getExtension(), ['tsx', 'ts', 'jsx', 'js'], true)) {
            return false;
        }

        $path = str_replace('\\', '/', $file->getPathname());

        foreach (self::ADMIN_ONLY_PATHS as $fragment) {
            if (str_contains($path, $fragment)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Mirror of `valueToKey()` in `resources/js/Utils/helpers.ts`.
     */
    private function toLookupKey(string $literal): string
    {
        return mb_strtolower((string) preg_replace('/\s+/', '_', trim($literal)));
    }
}

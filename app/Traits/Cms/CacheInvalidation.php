<?php

namespace App\Traits\Cms;

use App\Enums\System\CacheKey;
use Illuminate\Support\Facades\Cache;

/**
 * Cache helpers for CMS services.
 *
 * Two rules this encodes, both load-bearing:
 *
 * 1. Invalidation lives in the SERVICE, called explicitly after the write —
 *    exactly as LanguageController does Cache::forget(SITE_LANGUAGES) after
 *    $this->service->save(). Model observers are deliberately avoided for
 *    cache work: they fire inside handleBulkAction()'s lazyById() loop and
 *    would issue N invalidations per bulk operation. Services invalidate once,
 *    after the loop.
 *
 * 2. Cache::forget() cannot glob, and Cache::tags() throws on the `database`
 *    store that config/cache.php defaults to. Wildcard-prone families
 *    therefore maintain an explicit key registry: every key written is
 *    recorded in a set, and invalidation reads that set, forgets each member,
 *    then forgets the set. Works identically on database, redis, and array,
 *    so cache correctness never depends on the store.
 */
trait CacheInvalidation
{
    /**
     * Remember a value and record its key in the given family's registry.
     */
    protected function rememberTracked(string $family, string $key, int $ttlMinutes, callable $callback): mixed
    {
        $this->trackKey($family, $key);

        return Cache::remember($key, $ttlMinutes * 60, $callback);
    }

    /**
     * Add a key to a family's registry set.
     */
    protected function trackKey(string $family, string $key): void
    {
        $registryKey = CacheKey::CMS_KEY_REGISTRY->for($family);
        $keys = Cache::get($registryKey, []);

        if (in_array($key, $keys, true)) {
            return;
        }

        $keys[] = $key;

        Cache::forever($registryKey, $keys);
    }

    /**
     * Forget every key in a family, then the registry itself.
     *
     * This is the substitute for a tag flush, and the reason no call site in
     * the CMS ever needs Cache::tags().
     */
    protected function forgetFamily(string $family): void
    {
        $registryKey = CacheKey::CMS_KEY_REGISTRY->for($family);

        foreach (Cache::get($registryKey, []) as $key) {
            Cache::forget($key);
        }

        Cache::forget($registryKey);
    }

    /**
     * Forget a flat list of keys, skipping nulls so callers can pass
     * conditionally-built keys without guarding each one.
     *
     * @param  array<int, string|null>  $keys
     */
    protected function forgetKeys(array $keys): void
    {
        foreach (array_filter($keys) as $key) {
            Cache::forget($key);
        }
    }
}

<?php

namespace App\Enums\System;

use App\Enums\EnumTrait;

enum CacheKey: string
{
    use EnumTrait;

    case DEFAULT_SETTINGS = 'default_settings';
    case COMPANY_LOGOS = 'company_logos';
    case LANGUAGES = 'languages';
    case SITE_LANGUAGES = 'site_languages';
    case AUTOMATION_EXECUTION_HISTORY = 'automation_execution_history';
    case LAST_CRON_EXECUTION = 'last_cron_execution';
    case HELTH_CHECK = 'health_check';
    case CACHE_TEST = 'cache_test';
    case GUEST_ONBOARDING_COMPLETED = 'guest_onboarding_completed';

    case AUTH_ONBOARDING_COMPLETED = 'auth_onboarding_comleted';
    case LOCATION_TREES = 'location_trees';

    /*
    |--------------------------------------------------------------------------
    | CMS keys
    |--------------------------------------------------------------------------
    | Flat keys only. Never Cache::tags() — the default store is `database`,
    | which has no tag support, and making tags load-bearing would create a
    | class of bug that works in production and silently no-ops in CI.
    | Variable segments are appended with CacheKey::for(), never concatenated
    | at call sites.
    */
    case CMS_PAGE = 'cms:page';
    case CMS_PAGE_IDS = 'cms:page_ids';
    case CMS_MENU = 'cms:menu';
    case CMS_BLOCK = 'cms:block';
    case CMS_SETTINGS = 'cms:settings';
    case CMS_SEO = 'cms:seo';
    case CMS_LIST = 'cms:list';
    case CMS_SITEMAP = 'cms:sitemap';
    case CMS_REDIRECTS = 'cms:redirects';
    case CMS_FEATURED = 'cms:featured';

    /**
     * Registry of live keys for a wildcard-prone family.
     *
     * Cache::forget() cannot glob, so every key built under a wildcard-prone
     * family is also recorded in a set stored at this key + family name, which
     * invalidation reads, forgets, and clears. Works on every cache store,
     * including the `database` default.
     */
    case CMS_KEY_REGISTRY = 'cms:keys';

    /**
     * Build a namespaced cache key from this case plus its variable segments.
     *
     * CacheKey::CMS_PAGE->for(1, 'en', '/services/cloud')
     *   => 'cms:page:1:en:/services/cloud'
     */
    public function for(string|int|null ...$parts): string
    {
        $segments = array_filter(
            array_map(fn (string|int|null $part): string => (string) $part, $parts),
            fn (string $part): bool => $part !== ''
        );

        return implode(':', [$this->value, ...$segments]);
    }
}

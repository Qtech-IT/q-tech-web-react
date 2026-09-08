<?php

use App\Data\Cms\SectionTypes\AboutStoryType;
use App\Data\Cms\SectionTypes\AiInnovationType;
use App\Data\Cms\SectionTypes\ArticleHeaderType;
use App\Data\Cms\SectionTypes\AwardWallType;
use App\Data\Cms\SectionTypes\CaseNarrativeType;
use App\Data\Cms\SectionTypes\CollectionIndexType;
use App\Data\Cms\SectionTypes\ContactHubType;
use App\Data\Cms\SectionTypes\ContentBlocksType;
use App\Data\Cms\SectionTypes\ContentHtmlType;
use App\Data\Cms\SectionTypes\ContentOverviewType;
use App\Data\Cms\SectionTypes\ContentProseType;
use App\Data\Cms\SectionTypes\ContentSplitType;
use App\Data\Cms\SectionTypes\CtaBandType;
use App\Data\Cms\SectionTypes\CtaFinalType;
use App\Data\Cms\SectionTypes\FaqAccordionType;
use App\Data\Cms\SectionTypes\HeroCenteredType;
use App\Data\Cms\SectionTypes\HeroFlowType;
use App\Data\Cms\SectionTypes\HeroSplitType;
use App\Data\Cms\SectionTypes\IndustryServeType;
use App\Data\Cms\SectionTypes\MediaGalleryType;
use App\Data\Cms\SectionTypes\NewsletterSignupType;
use App\Data\Cms\SectionTypes\PortfolioGridType;
use App\Data\Cms\SectionTypes\ProcessTimelineType;
use App\Data\Cms\SectionTypes\ResultsMetricsType;
use App\Data\Cms\SectionTypes\ServiceFeatureType;
use App\Data\Cms\SectionTypes\ServiceGridType;
use App\Data\Cms\SectionTypes\SolutionGridType;
use App\Data\Cms\SectionTypes\StatsCounterType;
use App\Data\Cms\SectionTypes\TeamGridType;
use App\Data\Cms\SectionTypes\TechStackType;
use App\Data\Cms\SectionTypes\TestimonialWallType;
use App\Data\Cms\SectionTypes\WhyChooseType;
use App\Data\Cms\SectionTypes\WorkShowcaseType;

return [
    /*
    |--------------------------------------------------------------------------
    | Default site
    |--------------------------------------------------------------------------
    |
    | There is no `sites` table and there may never be one. Every CMS table
    | carries site_id NOT NULL DEFAULT 1 so multi-site is a migration plus a
    | scope later rather than 33 migrations later.
    |
    */

    'site_id' => (int) env('CMS_SITE_ID', 1),

    /*
    |--------------------------------------------------------------------------
    | Section type registry
    |--------------------------------------------------------------------------
    |
    | One class per section type, indexed by SectionTypeRegistry (bound as a
    | singleton in AppServiceProvider). Phase 1 ships three starter types, not
    | a section library — the point is to exercise every branch of the storage
    | rule so later types have a worked example to copy.
    |
    */

    'section_types' => [
        HeroSplitType::class,
        HeroFlowType::class,
        HeroCenteredType::class,
        StatsCounterType::class,
        CtaBandType::class,
        ServiceGridType::class,
        ContentOverviewType::class,
        ServiceFeatureType::class,
        IndustryServeType::class,
        SolutionGridType::class,
        TechStackType::class,
        WhyChooseType::class,
        ProcessTimelineType::class,
        WorkShowcaseType::class,
        PortfolioGridType::class,
        AiInnovationType::class,
        ResultsMetricsType::class,
        TestimonialWallType::class,
        FaqAccordionType::class,
        TeamGridType::class,
        AwardWallType::class,
        AboutStoryType::class,
        ArticleHeaderType::class,
        ContentBlocksType::class,
        ContentHtmlType::class,
        ContentProseType::class,
        ContentSplitType::class,
        CaseNarrativeType::class,
        CollectionIndexType::class,
        MediaGalleryType::class,
        NewsletterSignupType::class,
        CtaFinalType::class,
        ContactHubType::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Reserved path prefixes
    |--------------------------------------------------------------------------
    |
    | A page at /services/cloud and a service detail route at /services/cloud
    | collide, and that collision is a nightmare to discover after launch.
    | PageSaveRequest rejects any page path whose first segment appears here.
    | Later phases add their module prefixes as they land.
    |
    */

    'reserved_path_prefixes' => [
        'backend',
        'api',
        'preview',
        'storage',
        'sitemap.xml',
        'robots.txt',
    ],

    /*
    |--------------------------------------------------------------------------
    | Locales
    |--------------------------------------------------------------------------
    |
    | The public site is multilingual. The default locale is unprefixed
    | (`/services`); every other ACTIVE `languages` row is served under its
    | code (`/nl/services`). The authoritative default is the
    | `system_language_code` app setting — `default_locale()` — this array only
    | holds the routing and detection rules.
    |
    | `country_map` drives the first-visit auto-switch: a visitor whose country
    | maps to a non-default locale is redirected once to the prefixed URL. The
    | country comes from a proxy header (`country_headers`, in priority order);
    | `ip_lookup` additionally allows an IP-database lookup when no header is
    | present, at the cost of a per-visit call, so it is off by default.
    |
    */

    'locales' => [
        // ISO 3166-1 alpha-2 country code => locale code. First hit wins.
        'country_map' => [
            'nl' => ['NL', 'BE'],
        ],

        // Proxy headers carrying the visitor's country, most-trusted first.
        'country_headers' => [
            'CF-IPCountry',        // Cloudflare
            'X-Vercel-IP-Country', // Vercel
            'X-Country-Code',      // generic / custom edge
        ],

        // Fall back to an IP-address lookup (stevebauman/location) when no
        // header is present. A network call per uncookied visitor — enable
        // only where the app is not behind a country-aware proxy.
        'ip_lookup' => (bool) env('CMS_LOCALE_IP_LOOKUP', false),

        // Cookie remembering the visitor's chosen / detected locale.
        'cookie' => 'locale',
    ],

    /*
    |--------------------------------------------------------------------------
    | Depth caps
    |--------------------------------------------------------------------------
    */

    'max_page_depth' => 4,
    'max_folder_depth' => 6,

    /*
    |--------------------------------------------------------------------------
    | Cache TTLs, in minutes
    |--------------------------------------------------------------------------
    |
    | Flat keys only. Never Cache::tags() — see App\Traits\Cms\CacheInvalidation.
    |
    */

    'ttl' => [
        'page' => 60 * 24,
        'menu' => 60 * 24,
        'block' => 60 * 24,
        'seo' => 60 * 24,
        'listing' => 60,
        'sitemap' => 60 * 6,
    ],
];

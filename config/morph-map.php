<?php

use App\Models\AppSetting;
use App\Models\Block;
use App\Models\Cta;
use App\Models\Media;
use App\Models\MediaFolder;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\Redirect;
use App\Models\SectionBlock;
use App\Models\SeoMeta;
use App\Models\User;

return [
    /*
    |--------------------------------------------------------------------------
    | Morph aliases
    |--------------------------------------------------------------------------
    |
    | Registered NON-ENFORCING in AppServiceProvider::boot(). Reads resolve both
    | aliases and raw FQCNs, so the legacy `files.fileable_type` rows keep
    | working while the backfill migration converts them.
    |
    | The flip to Relation::enforceMorphMap() is deliberately deferred to a
    | later release (schema doc §4.1 step 3), gated on
    |   SELECT DISTINCT fileable_type FROM files WHERE fileable_type LIKE 'App\\%'
    | returning zero rows. Shipping the flip separately means a rollback of this
    | release does not leave enforcement on against un-backfilled data.
    |
    | Keys are snake_case singular, matching the repo's existing naming register.
    | Later phases append their own models here; only classes that exist may be
    | listed, or the map itself fatals at boot.
    |
    */

    'aliases' => [
        // Legacy owners, retrofitted by the files backfill migration.
        'user'        => User::class,
        'app_setting' => AppSetting::class,

        // Core CMS
        'page'          => Page::class,
        'page_section'  => PageSection::class,
        'section_block' => SectionBlock::class,
        'block'         => Block::class,
        'cta'           => Cta::class,

        // Navigation
        'menu'      => Menu::class,
        'menu_item' => MenuItem::class,

        // Media
        'media'        => Media::class,
        'media_folder' => MediaFolder::class,

        // SEO + routing
        'seo_meta' => SeoMeta::class,
        'redirect' => Redirect::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Permitted aliases per morph column
    |--------------------------------------------------------------------------
    |
    | Form Requests validate the incoming `*_type` against these lists with
    | Rule::in(). This is what stops an editor attaching an SEO record to a
    | menu item, and it is enforcement the non-enforcing morph map cannot give.
    |
    | Each key is the morph relation name, not the column name.
    |
    */

    'columns' => [
        // mediables.mediable_type — anything that can own library media.
        'mediable' => [
            'page',
            'page_section',
            'section_block',
            'block',
            'menu_item',
        ],

        // seo_meta.seoable_type — only routable owners. Phase 1 has exactly one.
        'seoable' => [
            'page',
        ],

        // section_blocks.link_target_type — bare entity links from a repeater item.
        'link_target' => [
            'page',
            'block',
        ],

        // ctas.target_type and menu_items.target_type — entity link destinations.
        'target' => [
            'page',
            'block',
        ],
    ],
];

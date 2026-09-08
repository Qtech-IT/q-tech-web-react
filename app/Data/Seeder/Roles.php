<?php

namespace App\Data\Seeder;

class Roles
{
    public const ALL = [
        /**
         * Role Configuration
         * Naming: module.resource.action
         */

        'superadmin' => [
            'label'          => 'Super Admin',
            'description'    => 'Full system access',
            'is_super_admin' => true,
            'order'          => 1,
            'permissions'    => 'all'
        ],

        /*
         * The editorial split. The line that matters is `publish`: a Content
         * Editor may draft and edit anything but cannot make it live, which is
         * the entire reason publish_status is a column separate from `status`.
         */
        'content-editor' => [
            'label'          => 'Content Editor',
            'description'    => 'Can draft and edit content, but cannot publish or delete',
            'is_super_admin' => false,
            'order'          => 10,
            'permissions'    => [
                'page.view', 'page.create', 'page.edit', 'page.translate',
                'section.view', 'section.create', 'section.edit', 'section.reorder',
                'block.view',
                'cta.view', 'cta.create', 'cta.edit',
                'menu.view',
                'media.view', 'media.create', 'media.edit',
                'folder.view',
                'seo-meta.view',
            ],
        ],

        'content-manager' => [
            'label'          => 'Content Manager',
            'description'    => 'Full control of content, including publishing and trash',
            'is_super_admin' => false,
            'order'          => 11,
            'permissions'    => [
                'page.view', 'page.create', 'page.edit', 'page.delete', 'page.publish',
                'page.reorder', 'page.translate', 'page.restore', 'page.force-delete',

                'section.view', 'section.create', 'section.edit', 'section.delete',
                'section.publish', 'section.reorder', 'section.restore', 'section.force-delete',

                'block.view', 'block.create', 'block.edit', 'block.delete', 'block.publish',
                'block.restore', 'block.force-delete',

                'cta.view', 'cta.create', 'cta.edit', 'cta.delete', 'cta.restore', 'cta.force-delete',

                'menu.view', 'menu.create', 'menu.edit', 'menu.delete', 'menu.reorder',
                'menu.restore', 'menu.force-delete',

                'redirect.view', 'redirect.create', 'redirect.edit', 'redirect.delete',
                'redirect.restore', 'redirect.force-delete',

                'media.view', 'media.create', 'media.edit', 'media.delete',
                'folder.view', 'folder.create', 'folder.edit', 'folder.delete',

                'seo-meta.view', 'seo-meta.create', 'seo-meta.edit', 'seo-meta.manage-seo',
                'sitemap.view', 'sitemap.generate',
                'schema.view', 'schema.edit',
            ],
        ],

        /*
         * SEO is frequently owned by someone who must not be able to rewrite
         * the content itself — read access across content, write access only
         * to the SEO surface and to redirects.
         */
        'seo-manager' => [
            'label'          => 'SEO Manager',
            'description'    => 'Manages meta data, redirects and structured data across all content',
            'is_super_admin' => false,
            'order'          => 12,
            'permissions'    => [
                'page.view',
                'section.view',
                'block.view',
                'media.view',

                'seo-meta.view', 'seo-meta.create', 'seo-meta.edit', 'seo-meta.delete',
                'seo-meta.manage-seo',
                'sitemap.view', 'sitemap.generate',
                'schema.view', 'schema.edit',

                'redirect.view', 'redirect.create', 'redirect.edit', 'redirect.delete',
            ],
        ],

        'media-manager' => [
            'label'          => 'Media Manager',
            'description'    => 'Manages the media library only',
            'is_super_admin' => false,
            'order'          => 13,
            'permissions'    => [
                'media.view', 'media.create', 'media.edit', 'media.delete',
                'media.restore', 'media.force-delete',
                'folder.view', 'folder.create', 'folder.edit', 'folder.delete',
                'folder.restore', 'folder.force-delete',
            ],
        ],
    ];
}

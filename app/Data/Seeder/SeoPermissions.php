<?php

namespace App\Data\Seeder;

class SeoPermissions
{
    /**
     * Summary of getAll
     *
     * @return array{seo: array}
     */
    public static function getAll(): array
    {
        return [
            'seo' => [
                'label' => ('SEO'),
                'description' => ('Meta data, sitemap and structured data'),
                'permissions' => [
                    'seo-meta' => [
                        'label' => ('SEO Meta'),
                        'permissions' => [
                            'view' => ('View SEO Meta'),
                            'create' => ('Create SEO Meta'),
                            'edit' => ('Edit SEO Meta'),
                            'delete' => ('Delete SEO Meta'),

                            // Its own action because SEO is frequently owned by
                            // a different person from the content editor.
                            'manage-seo' => ('Manage SEO Panel'),
                        ],
                    ],

                    'sitemap' => [
                        'label' => ('Sitemap'),
                        'permissions' => [
                            'view' => ('View Sitemap'),
                            'generate' => ('Regenerate Sitemap'),
                        ],
                    ],

                    'schema' => [
                        'label' => ('Structured Data'),
                        'permissions' => [
                            'view' => ('View Structured Data'),
                            'edit' => ('Edit Structured Data'),
                        ],
                    ],
                ],
            ],
        ];
    }
}

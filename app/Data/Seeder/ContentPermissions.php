<?php

namespace App\Data\Seeder;

class ContentPermissions
{
    /**
     * Summary of getAll
     *
     * @return array{content: array}
     */
    public static function getAll(): array
    {
        return [
            'content' => [
                'label' => ('Content Management'),
                'description' => ('Pages, sections, reusable blocks, buttons, navigation and redirects'),
                'permissions' => [
                    'page' => [
                        'label' => ('Pages'),
                        'permissions' => [
                            'view' => ('View Pages'),
                            'create' => ('Create Page'),
                            'edit' => ('Edit Page'),
                            'delete' => ('Delete Page'),

                            // Deliberately separate from `edit`: a junior
                            // editor may draft but not publish. This is the
                            // core editorial-workflow control and the reason
                            // publish_status is its own column.
                            'publish' => ('Publish Page'),

                            'reorder' => ('Reorder Pages'),
                            'translate' => ('Translate Page'),

                            // Expected by ModelAction::authorizeBulkAction(),
                            // which maps RESTORE and PERMANENT_DELETE onto
                            // these two policy methods.
                            'restore' => ('Restore Page'),
                            'force-delete' => ('Permanently Delete Page'),
                        ],
                    ],

                    'section' => [
                        'label' => ('Page Sections'),
                        'permissions' => [
                            'view' => ('View Sections'),
                            'create' => ('Create Section'),
                            'edit' => ('Edit Section'),
                            'delete' => ('Delete Section'),
                            'publish' => ('Publish Section'),
                            'reorder' => ('Reorder Sections'),
                            'restore' => ('Restore Section'),
                            'force-delete' => ('Permanently Delete Section'),
                        ],
                    ],

                    'block' => [
                        'label' => ('Global Blocks'),
                        'permissions' => [
                            'view' => ('View Blocks'),
                            'create' => ('Create Block'),
                            'edit' => ('Edit Block'),
                            'delete' => ('Delete Block'),
                            'publish' => ('Publish Block'),
                            'restore' => ('Restore Block'),
                            'force-delete' => ('Permanently Delete Block'),
                        ],
                    ],

                    'cta' => [
                        'label' => ('Call To Actions'),
                        'permissions' => [
                            'view' => ('View CTAs'),
                            'create' => ('Create CTA'),
                            'edit' => ('Edit CTA'),
                            'delete' => ('Delete CTA'),
                            'restore' => ('Restore CTA'),
                            'force-delete' => ('Permanently Delete CTA'),
                        ],
                    ],

                    'menu' => [
                        'label' => ('Navigation'),
                        'permissions' => [
                            'view' => ('View Menus'),
                            'create' => ('Create Menu'),
                            'edit' => ('Edit Menu'),
                            'delete' => ('Delete Menu'),
                            'reorder' => ('Reorder Menu Items'),
                            'restore' => ('Restore Menu'),
                            'force-delete' => ('Permanently Delete Menu'),
                        ],
                    ],

                    'redirect' => [
                        'label' => ('Redirects'),
                        'permissions' => [
                            'view' => ('View Redirects'),
                            'create' => ('Create Redirect'),
                            'edit' => ('Edit Redirect'),
                            'delete' => ('Delete Redirect'),
                            'restore' => ('Restore Redirect'),
                            'force-delete' => ('Permanently Delete Redirect'),
                        ],
                    ],
                ],
            ],
        ];
    }
}

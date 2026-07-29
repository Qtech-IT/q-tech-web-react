<?php

namespace App\Data\Seeder;

class MediaPermissions
{
    /**
     * Summary of getAll
     *
     * @return array{media: array}
     */
    public static function getAll(): array
    {
        return [
            'media' => [
                'label' => ('Media Library'),
                'description' => ('Editorial media library and its folders'),
                'permissions' => [
                    'media' => [
                        'label' => ('Media'),
                        'permissions' => [
                            'view' => ('View Media'),
                            'create' => ('Upload Media'),
                            'edit' => ('Edit Media'),
                            'delete' => ('Delete Media'),
                            'restore' => ('Restore Media'),
                            'force-delete' => ('Permanently Delete Media'),
                        ],
                    ],

                    'folder' => [
                        'label' => ('Media Folders'),
                        'permissions' => [
                            'view' => ('View Folders'),
                            'create' => ('Create Folder'),
                            'edit' => ('Edit Folder'),
                            'delete' => ('Delete Folder'),
                            'restore' => ('Restore Folder'),
                            'force-delete' => ('Permanently Delete Folder'),
                        ],
                    ],
                ],
            ],
        ];
    }
}

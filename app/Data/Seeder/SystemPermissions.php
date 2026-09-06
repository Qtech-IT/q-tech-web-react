<?php

namespace App\Data\Seeder;

class SystemPermissions
{
    /**
     * Summary of getAll
     *
     * @return array{system: array}
     */
    public static function getAll(): array
    {
        return [
            'system' => [
                'label' => ('System Management'),
                'description' => ('System settings and maintenance'),
                'permissions' => [
                    'notification-log' => [
                        'label' => ('Notification Log'),
                        'permissions' => [
                            'view' => ('View Log'),
                            'delete' => ('Delete Log'),
                        ],
                    ],

                    'notification-template' => [
                        'label' => ('Notification Template'),
                        'permissions' => [
                            'view' => ('View Templates'),
                            'edit' => ('Edit Templates'),
                        ],
                    ],

                    'setting' => [
                        'label' => ('Settings'),
                        'permissions' => [
                            'view' => ('View System Info'),
                            'edit' => ('Edit System Settings'),
                        ],
                    ],

                    'mail-configuration' => [
                        'label' => ('Mail Configuration'),
                        'permissions' => [
                            'view' => ('View Configuration'),
                            'edit' => ('Edit Configuration'),
                            'test' => ('Test Configuration'),
                        ],
                    ],

                    'job' => [
                        'label' => ('Queue Job'),
                        'permissions' => [
                            'view' => ('View Job'),
                            'delete' => ('Delete Job'),
                            'retry' => ('Retry Job'),
                            'run' => ('Run Job'),
                        ],
                    ],

                    'backup' => [
                        'label' => ('Backup'),
                        'permissions' => [
                            'view' => ('View Backup'),
                            'create' => ('Create Backup'),
                            'delete' => ('Delete Backup'),
                            'download' => ('Download Backup'),
                        ],
                    ],

                    'language' => [
                        'label' => ('Language'),
                        'permissions' => [
                            'view' => ('View Language'),
                            'create' => ('Create Language'),
                            'edit' => ('Edit Workflow Step'),
                            'delete' => ('Delete Language'),
                            'translate' => ('Translate Language'),
                        ],
                    ],

                    'cache' => [
                        'label' => ('Cache'),
                        'permissions' => [
                            'view' => ('View Cache Info'),
                            'clear' => ('Clear Cache'),
                        ],
                    ],

                    'automation' => [
                        'label' => ('Automation'),
                        'permissions' => [
                            'view' => ('View Automation'),
                            'run' => ('Run Automation'),
                        ],
                    ],

                    'system-info' => [
                        'label' => ('System information'),
                        'permissions' => [
                            'view' => ('View System information'),
                        ],
                    ],
                ],
            ],
        ];
    }
}

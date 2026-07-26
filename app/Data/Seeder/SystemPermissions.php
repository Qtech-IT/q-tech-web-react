<?php

namespace App\Data\Seeder;

class SystemPermissions
{
    /**
     * Summary of getAll
     * @return array{system: array}
     */
    public static function getAll(): array
    {
        return  [
             'system' => [
                'label'       => ('System Management'),
                'description' => ('System settings and maintenance'),
                'permissions' => [
                    'faq' => [
                        'label'       => ('FAQ'),
                        'permissions' => [
                            'view'   => ('View FAQ'),
                            'edit'   => ('Edit FAQ'),
                            'create' => ('Create FAQ'),
                            'delete' => ('Delete FAQ')
                        ]
                    ],

                    'banner' => [
                        'label'       => ('Banner'),
                        'permissions' => [
                            'view'   => ('View Banner'),
                            'edit'   => ('Edit Banner'),
                            'create' => ('Create Banner'),
                            'delete' => ('Delete Banner')
                        ]
                    ],

                    'policy-page' => [
                        'label'       => ('Policy Page'),
                        'permissions' => [
                            'view'   => ('View Policy Page'),
                            'edit'   => ('Edit Policy Page'),
                            'create' => ('Create Policy Page'),
                            'delete' => ('Delete Policy Page')
                        ]
                    ],

                    'crypto' => [
                        'label'       => ('Crypto'),
                        'permissions' => [
                            'view'   => ('View Crypto'),
                            'edit'   => ('Edit Crypto'),
                            'create' => ('Create Crypto')]
                     ],

                     'loan-product' => [
                        'label'       => ('Loan Product'),
                        'permissions' => [
                            'view'   => ('View Loan Product'),
                            'edit'   => ('Edit Loan Product'),
                            'create' => ('Create Loan Product'),
                            'delete' => ('Delete Loan Product')
                        ]
                    ],

                    'loan-request' => [
                        'label'       => ('Loan Request'),
                        'permissions' => [
                            'view'   => ('View Loan Request'),
                            'edit'   => ('Edit Loan Request'),
                            'create' => ('Create Loan Request'),
                            'delete' => ('Delete Loan Request')
                        ]
                    ],

                     'trade-setting' => [
                        'label'       => ('Trade Setting'),
                        'permissions' => [
                            'view'   => ('View Trade Setting'),
                            'edit'   => ('Edit Trade Setting'),
                            'create' => ('Create Trade Setting'),
                            'delete' => ('Delete Trade Setting')
                        ]
                     ],

                    'trade' => [
                        'label'       => ('Trade'),
                        'permissions' => [
                            'view'   => ('View Trade'),
                            'delete' => ('Delete Trade')
                        ]
                    ],

                    'deposit' => [
                        'label'       => ('Deposit Log'),
                        'permissions' => [
                            'view'   => ('View Deposit Log'),
                            'edit'   => ('Edit Deposit Log'),
                            'delete' => ('Delete Deposit Log')
                        ]
                    ],

                    'withdraw' => [
                        'label'       => ('Withdraw Log'),
                        'permissions' => [
                            'view'   => ('View Withdraw Log'),
                            'edit'   => ('Edit Withdraw Log'),
                            'delete' => ('Delete Withdraw Log')
                        ]
                    ],

                     'crypto-wallet-address' => [
                        'label'       => ('Crypto Wallet Address'),
                        'permissions' => [
                            'view'   => ('View Crypto Wallet Address'),
                            'edit'   => ('Edit Crypto Wallet Address'),
                            'create' => ('Create Crypto Wallet Address'),
                            'delete' => ('Delete Crypto Wallet Address')
                        ]
                    ],

                    'kyc-log' => [
                        'label'       => ('KYC Log'),
                        'permissions' => [
                            'view' => ('View KYC Log'),
                            'edit' => ('Edit KYC Log'),
                        ]
                    ],

                    'notification-log' => [
                                'label'       => ('Notification Log'),
                                'permissions' => [
                                    'view'   => ('View Log'),
                                    'delete' => ('Delete Log')
                                ]
                    ],

                                         'notification-template' => [
                                'label'       => ('Notification Template'),
                                'permissions' => [
                                    'view' => ('View Templates'),
                                    'edit' => ('Edit Templates')
                                ]
                                ],

                    'setting' => [
                                    'label'       => ('Settings'),
                                    'permissions' => [
                                        'view' => ('View System Info'),
                                        'edit' => ('Edit System Settings')
                                    ],
                                ],

                    'mail-configuration' => [
                        'label'       => ('Mail Configuration'),
                        'permissions' => [
                            'view' => ('View Configuration'),
                            'edit' => ('Edit Configuration'),
                            'test' => ('Test Configuration')
                        ]
                    ],

                    'job' => [
                                'label'       => ('Queue Job'),
                                'permissions' => [
                                    'view'   => ('View Job'),
                                    'delete' => ('Delete Job'),
                                    'retry'  => ('Retry Job'),
                                    'run'    => ('Run Job')
                                ]
                            ],

                    'backup' => [
                                'label'       => ('Backup'),
                                'permissions' => [
                                    'view'     => ('View Backup'),
                                    'create'   => ('Create Backup'),
                                    'delete'   => ('Delete Backup'),
                                    'download' => ('Download Backup')
                                ]
                            ],

                    'language' => [
                        'label'       => ('Language'),
                        'permissions' => [
                            'view'      => ('View Language'),
                            'create'    => ('Create Language'),
                            'edit'      => ('Edit Workflow Step'),
                            'delete'    => ('Delete Language'),
                            'translate' => ('Translate Language')
                        ]
                    ],

                    'cache' => [
                                    'label'       => ('Cache'),
                                    'permissions' => [
                                        'view'  => ('View Cache Info'),
                                        'clear' => ('Clear Cache')
                                    ]
                                ],

                    'automation' => [
                                        'label'       => ('Automation'),
                                        'permissions' => [
                                            'view' => ('View Automation'),
                                            'run'  => ('Run Automation')
                                        ]
                                    ],

                    'system-info' => [
                        'label'       => ('System information'),
                        'permissions' => [
                            'view' => ('View System information')
                        ]
                    ],
                ]
            ],
        ];
    }
}

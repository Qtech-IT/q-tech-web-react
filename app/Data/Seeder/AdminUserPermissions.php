<?php

namespace App\Data\Seeder;

class AdminUserPermissions
{
    /**
     * Summary of getAll
     * @return array{admin: array}
     */
    public static function getAll(): array
    {
        return  [
            'admin' => [
                'label'       => ('System Admin & User Management'),
                'description' => ('System administration and user management'),
                'permissions' => [
                    'role' => [
                        'label'       => ('Role Management'),
                        'permissions' => [
                            'view'   => ('View Roles'),
                            'create' => ('Create Role'),
                            'edit'   => ('Edit Role'),
                            'delete' => ('Delete Role'),
                            'clone'  => ('Clone Role')
                        ]
                    ],

                    'user' => [
                        'label'       => ('User Management'),
                        'permissions' => [
                            'view'   => ('View Users'),
                            'create' => ('Create User'),
                            'edit'   => ('Edit User'),
                            'delete' => ('Delete User'),
                        ]
                    ],

                    'otp' => [
                        'label'       => ('OTP Code Management'),
                        'permissions' => [
                            'view'   => ('View OTP Codes'),
                            'delete' => ('Delete OTP Codes')
                        ]
                    ],
                ]
            ],
        ];
    }
}

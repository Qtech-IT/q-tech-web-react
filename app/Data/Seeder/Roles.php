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
        ]
    ];
}

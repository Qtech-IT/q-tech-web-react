<?php

namespace Database\Seeders\Permissions;

use Database\Seeders\BasePermissionSeeder;

class AdminModulePermissionSeeder extends BasePermissionSeeder
{
    protected function getModuleName(): string
    {
        return 'admin';
    }
}

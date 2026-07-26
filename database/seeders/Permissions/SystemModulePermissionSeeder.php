<?php

namespace Database\Seeders\Permissions;

use Database\Seeders\BasePermissionSeeder;

class SystemModulePermissionSeeder extends BasePermissionSeeder
{
    protected function getModuleName(): string
    {
        return 'system';
    }
}

<?php

namespace Database\Seeders\Permissions;

use Database\Seeders\BasePermissionSeeder;

class UserModulePermissionSeeder extends BasePermissionSeeder
{
    protected function getModuleName(): string
    {
        return 'user';
    }
}

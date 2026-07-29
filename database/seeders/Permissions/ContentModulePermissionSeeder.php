<?php

namespace Database\Seeders\Permissions;

use Database\Seeders\BasePermissionSeeder;

class ContentModulePermissionSeeder extends BasePermissionSeeder
{
    protected function getModuleName(): string
    {
        return 'content';
    }
}

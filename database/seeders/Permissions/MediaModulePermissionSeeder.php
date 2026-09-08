<?php

namespace Database\Seeders\Permissions;

use Database\Seeders\BasePermissionSeeder;

class MediaModulePermissionSeeder extends BasePermissionSeeder
{
    protected function getModuleName(): string
    {
        return 'media';
    }
}

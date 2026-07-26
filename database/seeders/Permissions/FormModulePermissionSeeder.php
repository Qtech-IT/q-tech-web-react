<?php

namespace Database\Seeders\Permissions;

use Database\Seeders\BasePermissionSeeder;

class FormModulePermissionSeeder extends BasePermissionSeeder
{
    protected function getModuleName(): string
    {
        return 'form';
    }
}

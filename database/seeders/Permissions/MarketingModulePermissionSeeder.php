<?php

namespace Database\Seeders\Permissions;

use Database\Seeders\BasePermissionSeeder;

class MarketingModulePermissionSeeder extends BasePermissionSeeder
{
    protected function getModuleName(): string
    {
        return 'marketing';
    }
}

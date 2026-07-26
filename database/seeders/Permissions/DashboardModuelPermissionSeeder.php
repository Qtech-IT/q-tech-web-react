<?php

namespace Database\Seeders\Permissions;

use Database\Seeders\BasePermissionSeeder;

class DashboardModuelPermissionSeeder extends BasePermissionSeeder
{
    protected function getModuleName(): string
    {
        return 'dashboard';
    }
}

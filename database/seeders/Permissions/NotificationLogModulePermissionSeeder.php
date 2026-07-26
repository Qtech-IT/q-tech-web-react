<?php

namespace Database\Seeders\Permissions;

use Database\Seeders\BasePermissionSeeder;

class NotificationLogModulePermissionSeeder extends BasePermissionSeeder
{
    protected function getModuleName(): string
    {
        return 'notification-log';
    }
}
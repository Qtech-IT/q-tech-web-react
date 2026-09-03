<?php

namespace Database\Seeders\Permissions;

use Database\Seeders\BasePermissionSeeder;

class NotificationTemplateModulePermissionSeeder extends BasePermissionSeeder
{
    protected function getModuleName(): string
    {
        return 'notification-template';
    }
}

<?php

namespace App\Policies;

use App\Models\User;

class AppSettingPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermissionTo('setting.view');
    }

    public function switchLanguage(User $user): bool
    {
        return $user->hasPermissionTo('setting.edit');
    }


    public function viewSystemInfo(User $user): bool
    {
        return $user->hasPermissionTo('system-info.view');
    }

    public function viewAutomation(User $user): bool
    {
        return $user->hasPermissionTo('automation.view');
    }


    public function runAutomation(User $user): bool
    {
        return $user->hasPermissionTo('automation.run');
    }


    public function save(User $user): bool
    {
        return $user->hasPermissionTo('setting.edit');
    }

}

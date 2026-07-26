<?php

namespace App\Policies;

use App\Models\User;

class MailConfigurationPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermissionTo('mail-configuration.view');
    }


    public function test(User $user): bool
    {
        return $user->hasPermissionTo('mail-configuration.test');
    }


    public function update(User $user): bool
    {
        return $user->hasPermissionTo('mail-configuration.edit');
    }

}

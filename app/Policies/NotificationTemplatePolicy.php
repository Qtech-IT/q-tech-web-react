<?php

namespace App\Policies;

use App\Models\User;

class NotificationTemplatePolicy
{

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('notification-template.view');
    }

    public function view(User $user): bool
    {
        return $user->hasPermissionTo('notification-template.view');
    }


    public function update(User $user): bool
    {
        return $user->hasPermissionTo('notification-template.edit');
    }


}

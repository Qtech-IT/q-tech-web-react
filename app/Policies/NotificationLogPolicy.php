<?php

namespace App\Policies;

use App\Models\User;

class NotificationLogPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }
    
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('notification-log.view');
    }

    public function view(User $user): bool
    {
      return  $user->hasPermissionTo('notification-log.view');
    }

    public function delete(User $user): bool
    {
        return $user->hasPermissionTo('notification-log.delete');
    }


}

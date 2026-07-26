<?php

namespace App\Policies;

use App\Models\User;

class CachePolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermissionTo('cache.view');
    }


    public function clear(User $user): bool
    {
        return $user->hasPermissionTo('cache.clear');
    }

}

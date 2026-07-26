<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
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
        return  $user->hasPermissionTo('user.view');
    }

    public function view(User $user): bool
    {
        return  $user->hasPermissionTo('user.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('user.create');
    }

    public function edit(User $user): bool
    {
        return $user->hasPermissionTo('user.edit');
    }

    public function update(User $user): bool
    {
        return $user->hasPermissionTo('user.edit');
    }

    public function export(User $user): bool
    {
        return $user->hasPermissionTo('user.export');
    }

    /**
     * Only superadmin can delete users
     */
    public function delete(User $user): bool
    {
        return $user->hasPermissionTo('user.delete');
    }
}

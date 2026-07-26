<?php

namespace App\Policies;

use App\Models\User;

use Spatie\Permission\Models\Role;


class RolePolicy
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
        return $user->hasPermissionTo('role.view');
    }

    public function view(User $user, Role $role): bool
    {
        return $user->hasPermissionTo('role.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('role.create');
    }

    public function update(User $user, Role $role): bool
    {
        return $user->hasPermissionTo('role.edit');
    }
    
    public function delete(User $user): bool
    {
        return $user->hasPermissionTo('role.delete');
    }


    public function clone(User $user): bool
    {
        return $user->hasPermissionTo('role.clone');
    }

  
}

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
        return isTrashRequest() ? $this->restore($user) : $user->hasPermissionTo('user.view');
    }

    public function view(User $user, ? User $model = null): bool
    {
        return isTrashRequest() ?  $this->restore($user) : $user->hasPermissionTo('user.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('user.create');
    }

    public function edit(User $user, ? User $model = null): bool
    {
        return $user->hasPermissionTo('user.edit');
    }

    public function update(User $user, ? User $model = null): bool
    {
        return $user->hasPermissionTo('user.edit');
    }

    public function export(User $user, ? User $model = null): bool
    {
        return $user->hasPermissionTo('user.export');
    }

    public function import(User $user, ? User $model = null): bool
    {
        return $user->hasPermissionTo('user.import');
    }

    public function bulkAction(User $user, ? User $model = null): bool
    {
        return $user->hasPermissionTo('user.bulk.action');
    }

    /**
     * Only superadmin can delete users
     */
    public function delete(User $user, ? User $model = null): bool
    {
        return $user->hasPermissionTo('user.delete');
    }

    /**
     * Only superadmin can restore deleted users
     */
    public function restore(User $user, ? User $model = null): bool
    {
        return $user->hasPermissionTo('user.restore');
    }

    /**
     * Only superadmin can permanently delete users
     */
    public function forceDelete(User $user, User $model): bool
    {
        return $user->hasPermissionTo('user.permanent_delete');
    }

    /**
     * Only superadmin can impersonate user
     */
    public function impersonate(User $user, User $model): bool
    {
        return $user->hasPermissionTo('user.impersonate');
    }
    }

<?php

namespace App\Policies;

use App\Models\User;

/**
 * Permission names follow BasePermissionSeeder — `{resourceKey}.{action}`, so
 * `subscriber.view`. Read exactly as LanguagePolicy / PagePolicy does.
 *
 * A subscriber row is created by the public form, not the admin, so there is
 * no `create`. `update` is the admin soft-disable / status change; `mail` is
 * the separate right to run a bulk send against the list.
 */
class SubscriberPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('subscriber.view');
    }

    public function view(User $user): bool
    {
        return $user->hasPermissionTo('subscriber.view');
    }

    public function update(User $user): bool
    {
        return $user->hasPermissionTo('subscriber.edit');
    }

    public function delete(User $user): bool
    {
        return $user->hasPermissionTo('subscriber.delete');
    }

    public function restore(User $user): bool
    {
        return $user->hasPermissionTo('subscriber.delete');
    }

    public function forceDelete(User $user): bool
    {
        return $user->hasPermissionTo('subscriber.delete');
    }

    /**
     * Run a bulk templated send against the list.
     */
    public function mail(User $user): bool
    {
        return $user->hasPermissionTo('subscriber.mail');
    }

    public function export(User $user): bool
    {
        return $user->hasPermissionTo('subscriber.export');
    }
}

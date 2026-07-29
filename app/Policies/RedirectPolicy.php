<?php

namespace App\Policies;

use App\Models\User;

/**
 * Permission names follow BasePermissionSeeder::createModulePermissions(),
 * which names them `{resourceKey}.{action}` — so `redirect.view`, `redirect.create`.
 * Read exactly as LanguagePolicy does.
 *
 * isSuperAdminUser() short-circuits ahead of all of this, so a super admin is
 * unaffected by any of the checks below.
 */
class RedirectPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('redirect.view');
    }

    public function view(User $user): bool
    {
        return $user->hasPermissionTo('redirect.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('redirect.create');
    }

    public function update(User $user): bool
    {
        return $user->hasPermissionTo('redirect.edit');
    }

    public function delete(User $user): bool
    {
        return $user->hasPermissionTo('redirect.delete');
    }

    /**
     * Restore from trash. ModelAction::authorizeBulkAction() maps BulkActionType::RESTORE to this method name.
     */
    public function restore(User $user): bool
    {
        return $user->hasPermissionTo('redirect.restore');
    }

    /**
     * Permanent delete. ModelAction::authorizeBulkAction() maps BulkActionType::PERMANENT_DELETE to this method name.
     */
    public function forceDelete(User $user): bool
    {
        return $user->hasPermissionTo('redirect.force-delete');
    }
}

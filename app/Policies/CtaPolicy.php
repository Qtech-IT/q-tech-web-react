<?php

namespace App\Policies;

use App\Models\User;

/**
 * Permission names follow BasePermissionSeeder::createModulePermissions(),
 * which names them `{resourceKey}.{action}` — so `cta.view`, `cta.create`.
 * Read exactly as LanguagePolicy does.
 *
 * isSuperAdminUser() short-circuits ahead of all of this, so a super admin is
 * unaffected by any of the checks below.
 */
class CtaPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('cta.view');
    }

    public function view(User $user): bool
    {
        return $user->hasPermissionTo('cta.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('cta.create');
    }

    public function update(User $user): bool
    {
        return $user->hasPermissionTo('cta.edit');
    }

    public function delete(User $user): bool
    {
        return $user->hasPermissionTo('cta.delete');
    }

    /**
     * Restore from trash. ModelAction::authorizeBulkAction() maps BulkActionType::RESTORE to this method name.
     */
    public function restore(User $user): bool
    {
        return $user->hasPermissionTo('cta.restore');
    }

    /**
     * Permanent delete. ModelAction::authorizeBulkAction() maps BulkActionType::PERMANENT_DELETE to this method name.
     */
    public function forceDelete(User $user): bool
    {
        return $user->hasPermissionTo('cta.force-delete');
    }
}

<?php

namespace App\Policies;

use App\Models\User;

/**
 * Permission names follow BasePermissionSeeder::createModulePermissions(),
 * which names them `{resourceKey}.{action}` — so `block.view`, `block.create`.
 * Read exactly as LanguagePolicy does.
 *
 * isSuperAdminUser() short-circuits ahead of all of this, so a super admin is
 * unaffected by any of the checks below.
 */
class BlockPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('block.view');
    }

    public function view(User $user): bool
    {
        return $user->hasPermissionTo('block.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('block.create');
    }

    public function update(User $user): bool
    {
        return $user->hasPermissionTo('block.edit');
    }

    public function delete(User $user): bool
    {
        return $user->hasPermissionTo('block.delete');
    }

    /**
     * Restore from trash. ModelAction::authorizeBulkAction() maps BulkActionType::RESTORE to this method name.
     */
    public function restore(User $user): bool
    {
        return $user->hasPermissionTo('block.restore');
    }

    /**
     * Permanent delete. ModelAction::authorizeBulkAction() maps BulkActionType::PERMANENT_DELETE to this method name.
     */
    public function forceDelete(User $user): bool
    {
        return $user->hasPermissionTo('block.force-delete');
    }

    /**
     * Publish or schedule a global block.
     */
    public function publish(User $user): bool
    {
        return $user->hasPermissionTo('block.publish');
    }
}

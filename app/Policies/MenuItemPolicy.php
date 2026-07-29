<?php

namespace App\Policies;

use App\Models\User;

/**
 * Permission names follow BasePermissionSeeder::createModulePermissions(),
 * which names them `{resourceKey}.{action}` — so `menu.view`, `menu.create`.
 * Read exactly as LanguagePolicy does.
 *
 * isSuperAdminUser() short-circuits ahead of all of this, so a super admin is
 * unaffected by any of the checks below.
 */
class MenuItemPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('menu.view');
    }

    public function view(User $user): bool
    {
        return $user->hasPermissionTo('menu.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('menu.create');
    }

    public function update(User $user): bool
    {
        return $user->hasPermissionTo('menu.edit');
    }

    public function delete(User $user): bool
    {
        return $user->hasPermissionTo('menu.delete');
    }

    /**
     * Restore from trash. ModelAction::authorizeBulkAction() maps BulkActionType::RESTORE to this method name.
     */
    public function restore(User $user): bool
    {
        return $user->hasPermissionTo('menu.restore');
    }

    /**
     * Permanent delete. ModelAction::authorizeBulkAction() maps BulkActionType::PERMANENT_DELETE to this method name.
     */
    public function forceDelete(User $user): bool
    {
        return $user->hasPermissionTo('menu.force-delete');
    }

    /**
     * Drag-drop the menu tree. Menu items share the `menu` permission resource: an editor who may edit a menu may edit its items, and a separate permission would be a distinction without a difference.
     */
    public function reorder(User $user): bool
    {
        return $user->hasPermissionTo('menu.reorder');
    }
}

<?php

namespace App\Policies;

use App\Models\User;

/**
 * Permission names follow BasePermissionSeeder::createModulePermissions(),
 * which names them `{resourceKey}.{action}` — so `page.view`, `page.create`.
 * Read exactly as LanguagePolicy does.
 *
 * isSuperAdminUser() short-circuits ahead of all of this, so a super admin is
 * unaffected by any of the checks below.
 */
class PagePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('page.view');
    }

    public function view(User $user): bool
    {
        return $user->hasPermissionTo('page.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('page.create');
    }

    public function update(User $user): bool
    {
        return $user->hasPermissionTo('page.edit');
    }

    public function delete(User $user): bool
    {
        return $user->hasPermissionTo('page.delete');
    }

    /**
     * Restore from trash. ModelAction::authorizeBulkAction() maps BulkActionType::RESTORE to this method name.
     */
    public function restore(User $user): bool
    {
        return $user->hasPermissionTo('page.restore');
    }

    /**
     * Permanent delete. ModelAction::authorizeBulkAction() maps BulkActionType::PERMANENT_DELETE to this method name.
     */
    public function forceDelete(User $user): bool
    {
        return $user->hasPermissionTo('page.force-delete');
    }

    /**
     * Move content to published or scheduled. Separate from `edit` on purpose: a junior editor may draft but not publish. This is the core editorial-workflow control and the whole reason publish_status is a distinct column.
     */
    public function publish(User $user): bool
    {
        return $user->hasPermissionTo('page.publish');
    }

    /**
     * Drag-drop sort of the page tree.
     */
    public function reorder(User $user): bool
    {
        return $user->hasPermissionTo('page.reorder');
    }

    /**
     * Edit non-default locales. Mirrors the existing language.translate action.
     */
    public function translate(User $user): bool
    {
        return $user->hasPermissionTo('page.translate');
    }
}

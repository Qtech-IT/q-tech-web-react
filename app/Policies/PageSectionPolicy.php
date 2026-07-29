<?php

namespace App\Policies;

use App\Models\User;

/**
 * Permission names follow BasePermissionSeeder::createModulePermissions(),
 * which names them `{resourceKey}.{action}` — so `section.view`, `section.create`.
 * Read exactly as LanguagePolicy does.
 *
 * isSuperAdminUser() short-circuits ahead of all of this, so a super admin is
 * unaffected by any of the checks below.
 */
class PageSectionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('section.view');
    }

    public function view(User $user): bool
    {
        return $user->hasPermissionTo('section.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('section.create');
    }

    public function update(User $user): bool
    {
        return $user->hasPermissionTo('section.edit');
    }

    public function delete(User $user): bool
    {
        return $user->hasPermissionTo('section.delete');
    }

    /**
     * Restore from trash. ModelAction::authorizeBulkAction() maps BulkActionType::RESTORE to this method name.
     */
    public function restore(User $user): bool
    {
        return $user->hasPermissionTo('section.restore');
    }

    /**
     * Permanent delete. ModelAction::authorizeBulkAction() maps BulkActionType::PERMANENT_DELETE to this method name.
     */
    public function forceDelete(User $user): bool
    {
        return $user->hasPermissionTo('section.force-delete');
    }

    /**
     * Drag-drop sort of sections and their repeater items. SectionBlock inherits this policy — a repeater item has no permission surface of its own.
     */
    public function reorder(User $user): bool
    {
        return $user->hasPermissionTo('section.reorder');
    }

    /**
     * Per-section scheduling, e.g. a campaign banner.
     */
    public function publish(User $user): bool
    {
        return $user->hasPermissionTo('section.publish');
    }
}

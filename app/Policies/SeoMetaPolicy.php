<?php

namespace App\Policies;

use App\Models\User;

/**
 * Permission names follow BasePermissionSeeder::createModulePermissions(),
 * which names them `{resourceKey}.{action}` — so `seo-meta.view`, `seo-meta.create`.
 * Read exactly as LanguagePolicy does.
 *
 * isSuperAdminUser() short-circuits ahead of all of this, so a super admin is
 * unaffected by any of the checks below.
 */
class SeoMetaPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('seo-meta.view');
    }

    public function view(User $user): bool
    {
        return $user->hasPermissionTo('seo-meta.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('seo-meta.create');
    }

    public function update(User $user): bool
    {
        return $user->hasPermissionTo('seo-meta.edit');
    }

    public function delete(User $user): bool
    {
        return $user->hasPermissionTo('seo-meta.delete');
    }

    /**
     * Edit the SEO panel. Frequently a different person from the content editor, which is why it is its own action.
     */
    public function manageSeo(User $user): bool
    {
        return $user->hasPermissionTo('seo-meta.manage-seo');
    }
}

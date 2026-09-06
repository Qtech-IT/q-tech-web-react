<?php

namespace App\Policies;

use App\Models\User;

/**
 * Permission names follow BasePermissionSeeder — `{resourceKey}.{action}`, so
 * `contact-submission.view`. Read exactly as LanguagePolicy / PagePolicy does.
 *
 * A contact enquiry is never created or edited through the admin as a record —
 * it comes from the public form — so there is no `create`. `update` covers the
 * triage-status change; `reply` is the separate right to email a prospect.
 */
class ContactSubmissionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('contact-submission.view');
    }

    public function view(User $user): bool
    {
        return $user->hasPermissionTo('contact-submission.view');
    }

    public function update(User $user): bool
    {
        return $user->hasPermissionTo('contact-submission.edit');
    }

    public function delete(User $user): bool
    {
        return $user->hasPermissionTo('contact-submission.delete');
    }

    public function restore(User $user): bool
    {
        return $user->hasPermissionTo('contact-submission.delete');
    }

    public function forceDelete(User $user): bool
    {
        return $user->hasPermissionTo('contact-submission.delete');
    }

    /**
     * Send a templated reply to one or more enquiries.
     */
    public function reply(User $user): bool
    {
        return $user->hasPermissionTo('contact-submission.reply');
    }

    public function export(User $user): bool
    {
        return $user->hasPermissionTo('contact-submission.export');
    }
}

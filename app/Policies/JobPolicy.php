<?php

namespace App\Policies;

use App\Models\User;

class JobPolicy
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
       return $user->hasPermissionTo('job.view');
    }

    public function view(User $user): bool
    {
        return $this->viewAny( $user);
    }

    public function delete(User $user): bool
    {
        return $user->hasPermissionTo('job.delete');
    }



}

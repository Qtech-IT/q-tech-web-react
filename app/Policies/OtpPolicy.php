<?php

namespace App\Policies;

use App\Models\User;

class OtpPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermissionTo('otp.view');
    }


    public function delete(User $user): bool
    {
        return $user->hasPermissionTo('otp.delete');
    }

}

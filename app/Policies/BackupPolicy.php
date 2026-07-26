<?php

namespace App\Policies;

use App\Models\User;

class BackupPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermissionTo('backup.view');
    }


    public function clear(User $user): bool
    {
        return $user->hasPermissionTo('backup.create');
    }


    public function delete(User $user): bool
    {
        return $user->hasPermissionTo('backup.delete');
    }



    public function download(User $user): bool
    {
        return $user->hasPermissionTo('backup.download');
    }


}

<?php

namespace App\Traits\Common;

trait UsesUuidRouting
{
    /**
     * Use `uid` for Laravel route model binding.
     */
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}

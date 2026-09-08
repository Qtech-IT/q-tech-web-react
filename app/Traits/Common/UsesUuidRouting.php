<?php

namespace App\Traits\Common;

trait UsesUuidRouting
{
    /**
     * Bind routes on the `uuid` column.
     *
     * The column is `uuid`, not `uid` — no table in this application has a
     * `uid` column, and an implicit binding against one raises
     * SQLSTATE[42S22]: Column not found.
     */
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}

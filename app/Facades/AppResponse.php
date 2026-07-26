<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class AppResponse extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'AppResponseBuilder';
    }
}

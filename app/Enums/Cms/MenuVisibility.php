<?php

namespace App\Enums\Cms;

use App\Enums\EnumTrait;

enum MenuVisibility: string
{
    use EnumTrait;

    case ALWAYS = 'always';
    case GUEST = 'guest';
    case AUTH = 'auth';

    /**
     * List all values.
     */
    public static function getValues(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}

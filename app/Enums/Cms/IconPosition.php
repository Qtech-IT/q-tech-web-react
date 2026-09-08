<?php

namespace App\Enums\Cms;

use App\Enums\EnumTrait;

enum IconPosition: string
{
    use EnumTrait;

    case NONE = 'none';
    case LEFT = 'left';
    case RIGHT = 'right';

    /**
     * List all values.
     */
    public static function getValues(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}

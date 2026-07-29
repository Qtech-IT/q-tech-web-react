<?php

namespace App\Enums\Cms;

use App\Enums\EnumTrait;

enum PageType: string
{
    use EnumTrait;

    case STANDARD = 'standard';
    case HOME = 'home';
    case LANDING = 'landing';
    case SYSTEM = 'system';

    /**
     * Page types an editor may never delete.
     */
    public static function undeletable(): array
    {
        return [
            self::HOME->value,
            self::SYSTEM->value,
        ];
    }

    /**
     * List all values.
     */
    public static function getValues(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}

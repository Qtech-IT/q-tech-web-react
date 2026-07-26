<?php

namespace App\Enums\Common;

use App\Enums\EnumTrait;

/**
 * UI theme selection enum
 */
enum Theme: string
{
    use EnumTrait;

    case DARK   = 'dark';
    case LIGHT  = 'light';
    case SYSTEM = 'system';

    /**
     * Human-readable form
     */
    public function values(): string
    {
        return match ($this) {
            self::DARK   => 'Dark',
            self::LIGHT  => 'Light',
            self::SYSTEM => 'System',
        };
    }

    /**
     * Return all values as array
     */
    public static function getValues(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}

<?php

namespace App\Enums\User;

use App\Enums\EnumTrait;

enum RoleType: string
{
    use EnumTrait;

    case DEFAULT = 'default';
    /**
     * Human-readable label
     */
    public function label(): string
    {
        return match ($this) {
            self::DEFAULT => 'Default',
        };
    }

    /**
     * Raw enum values
     */
    public static function getValues(): array
    {
        return array_map(
            fn (self $case) => $case->value,
            self::cases()
        );
    }
    }

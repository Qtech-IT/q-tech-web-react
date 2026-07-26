<?php

namespace App\Enums\User;

use App\Enums\EnumTrait;

enum MaritalStatus: string
{
    use EnumTrait;


    case SINGLE   = 'single';
    case MARRIED  = 'married';
    case DIVORCED = 'divorced';
    case WIDOWED  = 'widowed';
    case OTHER    = 'other';


    /**
     * Human-readable label
     */
    public function label(): string
    {
        return match ($this) {
            self::SINGLE   => 'Single',
            self::MARRIED  => 'Married',
            self::DIVORCED => 'Divorced',
            self::WIDOWED  => 'Widowed',
            self::OTHER    => 'Other'
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

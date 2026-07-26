<?php

namespace App\Enums\User;

use App\Enums\EnumTrait;

enum GenderEnum: string
{
    use EnumTrait;


    case MALE   = 'male';
    case FEMALE = 'female';
    case OTHER  = 'other';  
    
    /**
     * Human-readable label
     */
    public function label(): string
    {
        return match ($this) {
            self::MALE   => 'Male',
            self::FEMALE => 'Female',
            self::OTHER  => 'Other',
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

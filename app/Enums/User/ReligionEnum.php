<?php

namespace App\Enums\User;

use App\Enums\EnumTrait;

enum ReligionEnum: string
{
    use EnumTrait;

    case ISLAM      = 'islam';
    case HINDU      = 'hindu';
    case CHRISTIAN  = 'christian';
    case BUDHIST    = 'buddhist';
    case JAIN       = 'jain';
    case OTHER      = 'other';
    

    /**
     * Human-readable label
     */
    public function label(): string
    {
        return match ($this) {
            self::ISLAM     => 'Islam',
            self::HINDU     => 'Hindu',
            self::CHRISTIAN => 'Christian',
            self::BUDHIST   => 'Buddhist',
            self::JAIN      => 'Jain',
            self::OTHER     => 'Other'
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

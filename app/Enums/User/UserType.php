<?php

namespace App\Enums\User;

use App\Enums\EnumTrait;

enum UserType: string
{
    use EnumTrait;

    case DEFAULT            = 'default';
    case HUB                = 'hub';
    case DEPOT              = 'depot';

    /**
     * Human-readable label
     */
    public function label(): string
    {
        return match ($this) {
            self::DEFAULT => 'Default',
            self::HUB     => 'Hubs',
            self::DEPOT   => 'Depot',
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

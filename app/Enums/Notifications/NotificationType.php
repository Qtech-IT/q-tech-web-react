<?php

namespace App\Enums\Notifications;
use App\Enums\EnumTrait;

enum NotificationType: string
{
    use EnumTrait;
    case INCOMING                = "incoming";
    case OUTGOING                = "outgoing";
    case BOTH                    = "both";


    /**
     * Summary of getValues
     * @return array
     */
    public static function getValues(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }


}

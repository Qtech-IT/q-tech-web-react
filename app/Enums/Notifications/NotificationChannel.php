<?php

namespace App\Enums\Notifications;

use App\Enums\EnumTrait;

enum NotificationChannel: string
{
    use EnumTrait;
    case EMAIL                 = "email";
    case SMS                   = 'sms';
    case DATABASE              = "database";
    case FIREBASE              = "firebase";


    /**
     * Summary of getValues
     * @return array
     */
    public static function getValues(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }



}

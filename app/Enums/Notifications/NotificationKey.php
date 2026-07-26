<?php

namespace App\Enums\Notifications;
use App\Enums\EnumTrait;
enum NotificationKey: string
{
    use EnumTrait;

    case PASSWORD_RESET                = "password_reset";

}

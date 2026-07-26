<?php

namespace App\Enums\System;

use App\Enums\EnumTrait;

enum ErrorEventKey: string
{
    use EnumTrait;

    case UNAUTHORIZED_REQUEST           = "unauthorized_request";
    case NPM_ERROR                      = "npm_error";
    case USER_BLOCKED                   = "user_blocked";


}

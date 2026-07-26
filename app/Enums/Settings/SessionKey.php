<?php

namespace App\Enums\Settings;

use App\Enums\EnumTrait;

enum SessionKey: string
{
    use EnumTrait;
    case PASSWORD_RESET             = 'password_reset';
    case THEME                      = 'theme';
    case LOCALE_ID                  = 'locale_id';
    case LOCALE                     = 'locale';
    case LOCALE_DIRECTION           = 'locale_direction';
    case TWO_STEP_VERIFICATION_INFO = '2fa_verification_info';
    case ONBOARDING_NEXT_STEP       = 'onboarding_next_step';
    case IMPERSONATE_ORIGINAL_ID    = 'impersonate_original_id';
    case PENDING_EMAIL              = 'pending_email';
    case USER_UNIQUE_ID             = 'user_unique_id';

    /**
     * Summary of getValues
     * @return array
     */
    public static function getValues(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}

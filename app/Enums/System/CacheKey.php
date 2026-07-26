<?php

namespace App\Enums\System;

use App\Enums\EnumTrait;

enum CacheKey: string
{
    use EnumTrait;

    case DEFAULT_SETTINGS              = "default_settings";
    case COMPANY_LOGOS                 = "company_logos";
    case LANGUAGES                     = "languages";
    case SITE_LANGUAGES                = "site_languages";
    CASE AUTOMATION_EXECUTION_HISTORY  = 'automation_execution_history';
    CASE LAST_CRON_EXECUTION           = 'last_cron_execution';
    CASE HELTH_CHECK                   = 'health_check';
    CASE CACHE_TEST                    = 'cache_test';
    CASE GUEST_ONBOARDING_COMPLETED    = 'guest_onboarding_completed';
    
    CASE AUTH_ONBOARDING_COMPLETED     = 'auth_onboarding_comleted';
    CASE LOCATION_TREES                = 'location_trees';

    


}

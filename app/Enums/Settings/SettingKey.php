<?php

namespace App\Enums\Settings;

use App\Enums\EnumTrait;

enum SettingKey: string
{
    use EnumTrait;

    case COMPANY_EMAIL = 'company_email';
    case THEME_MODE = 'theme_mode';
    case FONT = 'font';
    case LAYOUT = 'layout';
    case SIDEBAR = 'sidebar';
    case DIRECTION = 'direction';

    case QUICK_ACTIONS = 'quick_actions';
    case COMPANY_NAME = 'company_name';
    case COMPANY_PHONE = 'company_phone';
    case DATE_FORMAT = 'date_format';
    case TIME_FORMAT = 'time_format';
    case PAGINATION_NUMBER = 'pagination_number';
    case DEFAULT_SMS_TEMPLATE = 'default_sms_template';
    case DEFAULT_MAIL_TEMPLATE = 'default_mail_template';
    case DEFAULT_PUSH_TEMPLATE = 'default_push_template';
    case COPY_RIGHT_TEXT = 'copy_right_text';
    case STRONG_PASSWORD = 'strong_password';
    case MAX_FILE_SIZE = 'max_file_size';
    case MAX_FILE_UPLOAD = 'max_file_upload';
    case DATABASE_NOTIFICATIONS = 'database_notifications';
    case ADDRESS = 'address';
    case SUPPORT_LINKS = 'support_links';

    case S3_CONFIGURATION = 's3_configuration';
    case FTP_CONFIGURATION = 'ftp_configuration';
    case STORAGE = 'storage';
    case TIMEZONE = 'timezone';
    case SYSYEM_LANGUAGE_CODE = 'system_language_code';
    case FAVICON = 'favicon';
    case COMPANY_LOGO = 'company_logo';
    case OTP_EXPIRY_SECONDS = 'otp_expiry_seconds';
    case PLAY_STORE_URL = 'play_store_url';
    case APP_STORE_URL = 'app_store_url';
    case MINIMUM_PASSWORD_LENGTH = 'minimum_password_length';
    case LOGIN_ATTEMPT_VALIDATION = 'login_attempt_validation';
    case MAXIMUM_LOGIN_ATTEMPTS = 'maximum_login_attempts';
    case MAINTENANCE_MODE = 'maintenance_mode';
    case SESSION_TIMEOUT = 'session_timeout';
    case MAINTENANCE_TITLE = 'maintenance_title';
    case MAINTENANCE_DESCRIPTION = 'maintenance_description';
    case DEFAULT_CURRENCY = 'default_currency';
    case CURRENCY_SYMBOL = 'currency_symbol';
    case CURRENCY_POSITION = 'currency_position';
    case DECIMAL_SEPARATOR = 'decimal_separator';
    case THOUSAND_SEPARATOR = 'thousand_separator';
    case EXCHANGE_RATE_WITH_USD = 'exchange_rate_with_usd';
    case DECIMAL_PLACES = 'decimal_places';
    case SHOW_CURRENCY_CODE = 'show_currency_code';
    case GUEST_ONBOARDING_COMPLETED = 'guest_onboarding_completed';
    case AUTH_ONBOARDING_COMPLETED = 'auth_onboarding_completed';
    case BULK_UPLOAD_FORMAT = 'bulk_upload_format';
    case EXPORT_FORMAT = 'export_format';
    case MAIL_CONFIGURATION = 'mail_configuration';
    case OFFICE_START_TIME = 'office_start_time';
    case OFFICE_END_TIME = 'office_end_time';
    case LATE_GRACE_MINUTES = 'late_grace_minutes';
    case EARLY_CLOCK_IN_MINUTES = 'early_clock_in_minutes';
    case MAP_TYPE = 'map_type';
    case GOOGLE_MAP_API_KEY = 'google_map_api_key';

    case MINIMUM_DEPOSIT_AMOUNT = 'minimum_deposit_amount';
    case MAXIMUM_DEPOSIT_AMOUNT = 'maximum_deposit_amount';
    case MINIMUM_WITHDRAWAL_AMOUNT = 'minimum_withdrawal_amount';
    case MAXIMUM_WITHDRAWAL_AMOUNT = 'maximum_withdrawal_amount';
    case WITHDRAWAL_FEE = 'withdrawal_fee';
    case DEPOSIT_FEE = 'deposit_fee';
    case EMAIL_VERIFICATION = 'email_verification';
    case KYC_VERIFICATION = 'kyc_verification';

    // ------------------------------
    // CMS
    // ------------------------------
    // Rows, never columns. The boundary rule: a singular scalar that applies
    // to the whole site is a setting; a collection, or anything with per-row
    // ordering, media, or translation, gets its own table. So the default OG
    // image is a setting; social links are menu_items on a `social` menu.
    case SITE_TAGLINE = 'site_tagline';
    case DEFAULT_META_TITLE_SUFFIX = 'default_meta_title_suffix';
    case DEFAULT_META_DESCRIPTION = 'default_meta_description';
    case DEFAULT_OG_MEDIA = 'default_og_media';
    case ORGANIZATION_SCHEMA_TYPE = 'organization_schema_type';
    case ORGANIZATION_LEGAL_NAME = 'organization_legal_name';
    case ORGANIZATION_FOUNDING_YEAR = 'organization_founding_year';
    case GOOGLE_ANALYTICS_ID = 'google_analytics_id';
    case GOOGLE_TAG_MANAGER_ID = 'google_tag_manager_id';
    case GOOGLE_SITE_VERIFICATION = 'google_site_verification';
    case ROBOTS_TXT_EXTRA = 'robots_txt_extra';
    case SITEMAP_ENABLED = 'sitemap_enabled';
    case SITEMAP_CHANGEFREQ = 'sitemap_changefreq';
    case COOKIE_BANNER_ENABLED = 'cookie_banner_enabled';
    case COOKIE_POLICY_PAGE_ID = 'cookie_policy_page_id';
    case PREVIEW_TOKEN_TTL_MINUTES = 'preview_token_ttl_minutes';
    case MEDIA_MAX_IMAGE_DIMENSION = 'media_max_image_dimension';
    case MEDIA_AUTO_WEBP = 'media_auto_webp';

    // ------------------------------
    // INPUT TYPE MAPPING
    // ------------------------------
    public function inputType(): string
    {
        return match ($this) {
            self::COMPANY_EMAIL => InputEnum::EMAIL->value,
            self::COMPANY_PHONE => InputEnum::TEXT->value,
            self::COMPANY_NAME => InputEnum::TEXT->value,

            self::DEFAULT_SMS_TEMPLATE,
            self::DEFAULT_MAIL_TEMPLATE,
            self::DEFAULT_PUSH_TEMPLATE,
            self::MAINTENANCE_DESCRIPTION,
            self::ADDRESS => InputEnum::TEXTAREA->value,

            self::THEME_MODE,
            self::FONT,
            self::LAYOUT,
            self::SIDEBAR,
            self::DIRECTION,
            self::DATE_FORMAT,
            self::TIME_FORMAT,
            self::STORAGE,
            self::TIMEZONE,
            self::CURRENCY_POSITION => InputEnum::SELECT->value,

            self::STRONG_PASSWORD,
            self::DATABASE_NOTIFICATIONS,
            self::MAINTENANCE_MODE,
            self::SHOW_CURRENCY_CODE => InputEnum::SWITCH->value,

            self::MAX_FILE_SIZE,
            self::MAX_FILE_UPLOAD,
            self::MINIMUM_PASSWORD_LENGTH,
            self::MAXIMUM_LOGIN_ATTEMPTS,
            self::SESSION_TIMEOUT,
            self::PAGINATION_NUMBER,
            self::EXCHANGE_RATE_WITH_USD,
            self::DECIMAL_PLACES => InputEnum::NUMBER->value,

            self::DEFAULT_CURRENCY,
            self::CURRENCY_SYMBOL,
            self::DECIMAL_SEPARATOR,
            self::THOUSAND_SEPARATOR => InputEnum::TEXT->value,

            self::FAVICON,
            self::COMPANY_LOGO => InputEnum::FILE->value,

            self::PLAY_STORE_URL,
            self::APP_STORE_URL => InputEnum::URL->value,

            // CMS
            self::DEFAULT_META_DESCRIPTION,
            self::ROBOTS_TXT_EXTRA => InputEnum::TEXTAREA->value,

            self::SITEMAP_ENABLED,
            self::COOKIE_BANNER_ENABLED,
            self::MEDIA_AUTO_WEBP => InputEnum::SWITCH->value,

            self::SITEMAP_CHANGEFREQ,
            self::ORGANIZATION_SCHEMA_TYPE => InputEnum::SELECT->value,

            self::ORGANIZATION_FOUNDING_YEAR,
            self::PREVIEW_TOKEN_TTL_MINUTES,
            self::MEDIA_MAX_IMAGE_DIMENSION,
            self::COOKIE_POLICY_PAGE_ID => InputEnum::NUMBER->value,

            self::DEFAULT_OG_MEDIA => InputEnum::FILE->value,

            default => InputEnum::TEXT->value,
        };
    }
}

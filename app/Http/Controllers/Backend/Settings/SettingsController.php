<?php

namespace App\Http\Controllers\Backend\Settings;

use App\Enums\Common\Status;
use App\Enums\Settings\SessionKey;
use App\Enums\Settings\SettingKey;
use App\Enums\System\CacheKey;
use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Services\Backend\Settings\SettingsService;
use App\Models\AppSetting;
use App\Models\Language;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Env;
use Illuminate\Support\Facades\Cache;
use Inertia\Response as InertiaResponse;

/**
 * Class SettingsController
 *
 * Handles all administrative application settings.
 * Supports general, appearance, logo, storage, security, system, SEO,
 * social login, currency, recaptcha, ticket configuration, and system info.
 * Returns both Inertia or JSON responses based on the request type.
 */
class SettingsController extends Controller
{
    use ModelProperty;

    protected array $modelProperty;

    /**
     * Settings service instance.
     */
    public function __construct(protected SettingsService $settingsService)
    {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix : 'Settings',
            routePrefix: 'backend.users'
        );
    }

    /**
     * Display general settings page.
     */
    public function index(): JsonResponse|InertiaResponse
    {
        $this->authorize('view', 'setting');

        $settings = $this->settingsService->getSettings([
            SettingKey::COMPANY_EMAIL->value,
            SettingKey::COMPANY_NAME->value,
            SettingKey::COMPANY_PHONE->value,
            SettingKey::PAGINATION_NUMBER->value,
            SettingKey::ADDRESS->value,
            SettingKey::COPY_RIGHT_TEXT->value,
            SettingKey::TIME_FORMAT->value,
            SettingKey::DATE_FORMAT->value,
            SettingKey::TIMEZONE->value,
            SettingKey::EMAIL_VERIFICATION->value,
            SettingKey::KYC_VERIFICATION->value,
        ]);

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'] . 'Index', [
                'title'         => translate('General Settings'),
                'component'     => 'GeneralSettingsForm',
                'modelProperty' => $this->modelProperty,
                'data'          => $settings,
            ])
            ->build();
    }

    /**
     * Display appearance settings page.
     */
    public function appearance(): JsonResponse|InertiaResponse
    {
        $this->authorize('view', 'setting');

        $quickActions = site_settings(SettingKey::QUICK_ACTIONS->value);

        $data = [
            'title'         => translate('Appearance Settings'),
            'component'     => 'AppearanceForm',
            'theme_mode'    => site_settings(SettingKey::THEME_MODE->value),
            'font'          => site_settings(SettingKey::FONT->value),
            'layout'        => site_settings(SettingKey::LAYOUT->value),
            'sidebar'       => site_settings(SettingKey::SIDEBAR->value),
            'direction'     => site_settings(SettingKey::DIRECTION->value),
            'quick_actions' => $quickActions ? json_decode($quickActions, true) : [],

            /*
             * Public brand tokens. Read-only pass-through so the appearance
             * screen can pre-fill them — they are saved through the same
             * `settings.store` endpoint as everything else on this page, which
             * already accepts any SettingKey. They drive `--fx-*` on the
             * marketing site ONLY; the admin palette is a separate design
             * system and is not affected by anything here.
             */
            'brand_accent'          => site_settings(SettingKey::BRAND_ACCENT->value),
            'brand_accent_ink'      => site_settings(SettingKey::BRAND_ACCENT_INK->value),
            'brand_accent_dark'     => site_settings(SettingKey::BRAND_ACCENT_DARK->value),
            'brand_accent_ink_dark' => site_settings(SettingKey::BRAND_ACCENT_INK_DARK->value),
            'brand_radius'          => site_settings(SettingKey::BRAND_RADIUS->value),

            // Button fills are authored separately from the accent: the value
            // that reads well as a hairline underline is rarely the right value
            // for a large filled slab.
            'brand_button_primary'       => site_settings(SettingKey::BRAND_BUTTON_PRIMARY->value),
            'brand_button_primary_ink'   => site_settings(SettingKey::BRAND_BUTTON_PRIMARY_INK->value),
            'brand_button_secondary'     => site_settings(SettingKey::BRAND_BUTTON_SECONDARY->value),
            'brand_button_secondary_ink' => site_settings(SettingKey::BRAND_BUTTON_SECONDARY_INK->value),

            'modelProperty' => $this->modelProperty,
        ];

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'] . 'Index', $data)
            ->build();
    }

    /**
     * Display logo settings page.
     */
    public function logo(): JsonResponse|InertiaResponse
    {
        $this->authorize('view', 'setting');

        $data = [
            'title'         => translate('Logo Settings'),
            'component'     => 'LogoForm',
            'modelProperty' => $this->modelProperty,
        ];

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'] . 'Index', $data)
            ->build();
    }

    /**
     * SEO defaults + third-party analytics / ads identifiers.
     *
     * These settings are seeded by `CmsSettingsSeeder` but have no other admin
     * screen — without this page an operator cannot enter a Google Analytics,
     * Tag Manager or AdSense ID at all. Saving goes through the shared
     * `settings.store` endpoint, which already accepts any `SettingKey`.
     */
    public function seo(): JsonResponse|InertiaResponse
    {
        $this->authorize('view', 'setting');

        $data = [
            'title'                      => translate('SEO & Analytics'),
            'component'                  => 'SeoAnalyticsForm',
            'google_analytics_id'        => site_settings(SettingKey::GOOGLE_ANALYTICS_ID->value),
            'google_analytics_enabled'   => site_settings(SettingKey::GOOGLE_ANALYTICS_ENABLED->value, Status::INACTIVE->value),
            'google_tag_manager_id'      => site_settings(SettingKey::GOOGLE_TAG_MANAGER_ID->value),
            'google_tag_manager_enabled' => site_settings(SettingKey::GOOGLE_TAG_MANAGER_ENABLED->value, Status::INACTIVE->value),
            'google_adsense_id'          => site_settings(SettingKey::GOOGLE_ADSENSE_ID->value),
            'google_adsense_enabled'     => site_settings(SettingKey::GOOGLE_ADSENSE_ENABLED->value, Status::INACTIVE->value),
            'google_site_verification'   => site_settings(SettingKey::GOOGLE_SITE_VERIFICATION->value),
            'default_meta_title_suffix'  => site_settings(SettingKey::DEFAULT_META_TITLE_SUFFIX->value),
            'default_meta_description'   => site_settings(SettingKey::DEFAULT_META_DESCRIPTION->value),
            'robots_allow_indexing'      => site_settings(SettingKey::ROBOTS_ALLOW_INDEXING->value, Status::ACTIVE->value),
            'sitemap_enabled'            => site_settings(SettingKey::SITEMAP_ENABLED->value, Status::ACTIVE->value),
            'sitemap_changefreq'         => site_settings(SettingKey::SITEMAP_CHANGEFREQ->value, 'weekly'),
            'robots_ai_crawlers'         => site_settings(SettingKey::ROBOTS_AI_CRAWLERS->value, Status::ACTIVE->value),
            'robots_txt_extra'           => site_settings(SettingKey::ROBOTS_TXT_EXTRA->value),
            'modelProperty'              => $this->modelProperty,
        ];

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'] . 'Index', $data)
            ->build();
    }

    /**
     * Display storage settings page.
     */
    public function storage(): JsonResponse|InertiaResponse
    {
        $this->authorize('view', 'setting');

        $data = [
            'title'         => translate('Storage Settings'),
            'component'     => 'StorageSettingsForm',
            'storage'       => site_settings(SettingKey::STORAGE->value),
            'aws_config'    => json_decode(site_settings(SettingKey::S3_CONFIGURATION->value), true),
            'ftp_config'    => json_decode(site_settings(SettingKey::FTP_CONFIGURATION->value), true),
            'modelProperty' => $this->modelProperty,
        ];

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'] . 'Index', $data)
            ->build();
    }

    /**
     * Display security settings page.
     */
    public function security(): JsonResponse|InertiaResponse
    {
        $this->authorize('view', 'setting');

        $data = [
            'title'                    => translate('Security Settings'),
            'component'                => 'SecuritySettingsForm',
            'minimum_password_length'  => site_settings(SettingKey::MINIMUM_PASSWORD_LENGTH->value, 6),
            'login_attempt_validation' => site_settings(SettingKey::LOGIN_ATTEMPT_VALIDATION->value, Status::INACTIVE->value),
            'session_timeout'          => site_settings(SettingKey::SESSION_TIMEOUT->value, 120),
            'strong_password'          => site_settings(SettingKey::STRONG_PASSWORD->value, Status::INACTIVE->value),
            'maximum_login_attempts'   => site_settings(SettingKey::MAXIMUM_LOGIN_ATTEMPTS->value, 10),
            'otp_expiry_seconds'       => site_settings(SettingKey::OTP_EXPIRY_SECONDS->value),
            'modelProperty'            => $this->modelProperty,
        ];

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'] . 'Index', $data)
            ->build();
    }

    /**
     * Display system settings page.
     */
    public function system(): JsonResponse|InertiaResponse
    {
        $this->authorize('viewSystemInfo', 'setting');

        $data = [
            'title'                  => translate('System Settings'),
            'component'              => 'SystemPreferencesForm',
            'app_debug'              => Env::get('APP_DEBUG') && Env::get('DEBUGBAR_ENABLED'),
            'database_notifications' => site_settings(SettingKey::DATABASE_NOTIFICATIONS->value, Status::INACTIVE->value),
            'modelProperty'          => $this->modelProperty,
        ];

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'] . 'Index', $data)
            ->build();
    }

    /**
     * Display currency settings page.
     */
    public function currency(): JsonResponse|InertiaResponse
    {
        $this->authorize('view', 'setting');

        $data = [
            'title'              => translate('Currency Configuration'),
            'component'          => 'CurrencySettingsForm',
            'default_currency'   => site_settings(SettingKey::DEFAULT_CURRENCY->value, 'USD'),
            'currency_symbol'    => site_settings(SettingKey::CURRENCY_SYMBOL->value, '$'),
            'currency_position'  => site_settings(SettingKey::CURRENCY_POSITION->value, 'left'),
            'decimal_separator'  => site_settings(SettingKey::DECIMAL_SEPARATOR->value, '.'),
            'thousand_separator' => site_settings(SettingKey::THOUSAND_SEPARATOR->value, ','),
            'decimal_places'     => site_settings(SettingKey::DECIMAL_PLACES->value, '2'),
            'show_currency_code' => site_settings(SettingKey::SHOW_CURRENCY_CODE->value, Status::INACTIVE->value),
            'modelProperty'      => $this->modelProperty,
        ];

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'] . 'Index', $data)
            ->build();
    }

    public function support(): JsonResponse|InertiaResponse
    {
        $this->authorize('view', 'setting');

        $support_links = site_settings(SettingKey::SUPPORT_LINKS->value);

        $data = [
            'title'         => translate('Support Configuration'),
            'component'     => 'SupportSettingsForm',
            'support_links' => $support_links ? json_decode($support_links, true) : [],

            'modelProperty' => $this->modelProperty,
        ];

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'] . 'Index', $data)
            ->build();
    }

    /**
     * Display system information page.
     */
    public function systemInformation(): JsonResponse|InertiaResponse
    {
        $this->authorize('view', 'setting');

        $data = [
            'systemInfo'    => $this->settingsService->getSystemInformation(),
            'title'         => translate('System Information'),
            'modelProperty' => $this->modelProperty,
        ];

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'] . 'SystemInfo', $data)
            ->build();
    }

    /**
     * Save or update site settings.
     */
    public function store(Request $request): JsonResponse|InertiaResponse|RedirectResponse
    {
        $this->authorize('save', 'setting');

        $timeFormat = site_settings(SettingKey::TIME_FORMAT->value);

        $rules = [
            'site_settings'                        => ['required', 'array'],
            'site_settings.pagination_number'      => ['nullable', 'numeric', 'min:5', 'max:1000'],
            'site_settings.office_start_time'      => ['nullable', 'date_format:H:i'],
            'site_settings.office_end_time'        => ['nullable', 'date_format:H:i'],
            'site_settings.late_grace_minutes'     => ['nullable', 'numeric', 'min:0'],
            'site_settings.early_clock_in_minutes' => ['nullable', 'numeric', 'min:0'],
        ];
        $allowedKeys = SettingKey::toArray();

        [$keys, $values] = Arr::divide($allowedKeys);

        foreach ($request->input('site_settings') as $key => $value) {
            if (!in_array($key, $values)) {
                $rules[$key] = ['prohibited'];
            }
        }

        $request->validate($rules);

        $result = $this->settingsService->save($request->input('site_settings'));

        return $this->handleResponse($result);
    }

    /**
     * Toggle application debug mode.
     */
    public function toggleAppDebug(Request $request): RedirectResponse
    {
        $this->authorize('save', 'setting');

        $result = $this->settingsService->toggleAppDebug();

        return $this->handleResponse($result);
    }

    /**
     * Summary of switchLanguage
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function switchLanguage(Request $request): RedirectResponse
    {
        $this->authorize('switchLanguage', 'setting');

        $request->validate([
            'id' => 'required|exists:languages,id',
        ]);

        $language = Language::where('id', $request->input('id'))
            ->active()
            ->firstOrFail();

        $direction = $language->direction ?? 'ltr';

        $setting = AppSetting::firstOrNew([
            'slug' => SettingKey::DIRECTION->value,
        ]);

        $setting->title         = key_to_value(SettingKey::DIRECTION->value);
        $setting->setting_value = $direction;
        $setting->save();

        session()->put(SessionKey::LOCALE->value, $language?->code ?? 'en');

        app()->setLocale($language->code);

        Cache::forget(CacheKey::DEFAULT_SETTINGS->value);

        return AppResponse::asSuccess()
            ->withMessage('Language switched successfully')
            ->build();
    }

    public function withdrawDepositConfiguration()
    {
        $this->authorize('view', 'setting');

        $data = [
            'title'                     => translate('Withdraw Deposit Configuration'),
            'component'                 => 'WithdrawDepositConfigurationForm',
            'default_currency'          => site_settings(SettingKey::DEFAULT_CURRENCY->value, 'USD'),
            'currency_symbol'           => site_settings(SettingKey::CURRENCY_SYMBOL->value, '$'),
            'minimum_deposit_amount'    => (float) site_settings(SettingKey::MINIMUM_DEPOSIT_AMOUNT->value, 0),
            'maximum_deposit_amount'    => (float) site_settings(SettingKey::MAXIMUM_DEPOSIT_AMOUNT->value, 0),
            'minimum_withdrawal_amount' => (float) site_settings(SettingKey::MINIMUM_WITHDRAWAL_AMOUNT->value, 0),
            'maximum_withdrawal_amount' => (float) site_settings(SettingKey::MAXIMUM_WITHDRAWAL_AMOUNT->value, 0),
            'withdrawal_fee'            => (float) site_settings(SettingKey::WITHDRAWAL_FEE->value, 0),
            'deposit_fee'               => (float) site_settings(SettingKey::DEPOSIT_FEE->value, 0),
            'modelProperty'             => $this->modelProperty,
        ];

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'] . 'Index', $data)
            ->build();
    }
}

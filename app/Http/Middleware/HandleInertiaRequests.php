<?php

namespace App\Http\Middleware;

use App\Constants\FilePathConstants;
use App\Enums\Settings\SessionKey;
use App\Enums\Settings\SettingKey;
use App\Http\Resources\Backend\LanguageResource;
use App\Http\Resources\Backend\UserResource;
use App\Traits\Common\Fileable;
use App\Traits\Common\ModelAction;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    use Fileable , ModelAction;

    /**
     * Determine the current asset version.
     *
     * @param Request $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default for Inertia.
     *
     * @param Request $request
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            // Authenticated user resource
            'auth' => [
                'user'          => $this->getAuthenticatedUser($request),
                'authorization' => $this->getAuthenticatedUserRolePermissions($request),
            ],

            // Flash messages from session
            'flash' => $this->getFlashMessages($request),

            // Site theme and logo settings
            'site_theme_settings' => $this->getSiteThemeSettings(),
            'logos'               => $this->getSiteLogo(),

            // Current theme (light/dark)
            'theme'           => session(SessionKey::THEME->value, 'light'),
            'copy_right_text' => getCopyRightText(),

            'language_settings' => [
                'available_languages' => formatResourceResponse(site_languages(), LanguageResource::class),
                'current_language'    => fn(): string => app()->getLocale(),
                'translations'        => fn(): mixed => getTranslationsFlat()
            ],
        ];
    }

    /**
     * Get the authenticated user as a resource array.
     *
     * @param Request $request
     * @return array<string, mixed>|null
     */
    private function getAuthenticatedUser(Request $request): ?array
    {
        $user = $request->user();

        return $user ?  (new UserResource($user))->resolve() : null;
    }

    /**
     * Get authenticated user's role and permissions
     */
    private function getAuthenticatedUserRolePermissions(Request $request): array
    {
        try {
            $user = $request->user();

            if (!$user) return [];

            $user->loadMissing('roles.permissions:id,name');

            $role = $user->roles->first();

            if (!$role) return [];

            return [
                'role'        => $this->formatRoleResource($role),
                'permissions' => $role->permissions->pluck('name')->all(),
            ];
        } catch (\Throwable $ex) {
            return [];
        }
    }

    /**
     * Get flash messages from the session.
     *
     * @param Request $request
     * @return array<string, \Closure>
     */
    private function getFlashMessages(Request $request): array
    {
        return [
            'success' => fn () => $request->session()->get('success'),
            'error'   => fn () => $request->session()->get('error'),
            'warning' => fn () => $request->session()->get('warning'),
            'info'    => fn () => $request->session()->get('info'),
            'data'    => fn () => $request->session()->get('flash_data', []),
        ];
    }

    /**
     * Get site logo and favicon URLs.
     *
     * @return array<string, string|null>
     */
    private function getSiteLogo(): array
    {
        $settingKeys = [
            'company_logo' => SettingKey::COMPANY_LOGO,
            'favicon'      => SettingKey::FAVICON,
        ];

        $logos = [];

        foreach ($settingKeys as $key => $settingEnum) {
            $file = site_logo($settingEnum->value)?->file;

            $logos[$key] = $this->getFileURL(
                $file,
                FilePathConstants::getPath($key)['path']
            );
        }

        return $logos;
    }

    /**
     * Get all site theme and general settings.
     *
     * @return array<string, mixed>
     */

    private function getSiteThemeSettings(): array
    {
        $settingKeys = [
                            SettingKey::THEME_MODE->value,
                            SettingKey::COMPANY_NAME->value,
                            SettingKey::FONT->value,
                            SettingKey::LAYOUT->value,
                            SettingKey::SIDEBAR->value,
                            SettingKey::DIRECTION->value,
                            SettingKey::DEFAULT_CURRENCY->value,
                            SettingKey::CURRENCY_SYMBOL->value,
                            SettingKey::MINIMUM_PASSWORD_LENGTH->value
                        ];

        $settings = [];

        foreach ($settingKeys as $key) {
            $settings[$key] = site_settings($key);
        }

        return $settings;
    }
}

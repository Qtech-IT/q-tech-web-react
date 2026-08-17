<?php

namespace App\Http\Middleware;

use App\Constants\FilePathConstants;
use App\Constants\GlobalConfig;
use App\Enums\Settings\SettingKey;
use App\Http\Resources\Backend\LanguageResource;
use App\Http\Resources\Backend\UserResource;
use App\Http\Services\Frontend\NavigationService;
use App\Traits\Common\Fileable;
use App\Traits\Common\ModelAction;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    use Fileable , ModelAction;

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default for Inertia.
     *
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

            // Resolved visitor theme (cookie first, app setting as fallback)
            'theme'           => theme_preference(),
            'theme_settings'  => $this->getThemeSettings(),
            'copy_right_text' => getCopyRightText(),

            'language_settings' => [
                'available_languages' => formatResourceResponse(site_languages(), LanguageResource::class),
                'current_language'    => fn (): string => app()->getLocale(),
                'translations'        => fn (): mixed => getTranslationsFlat(),
            ],

            /*
             * Public navigation, in the shape `resources/js/Types/navigation.ts`
             * declares. Shared rather than per-controller because the header and
             * footer render on every public page, and a controller that forgot
             * to pass it would silently fall back to placeholder links.
             *
             * Guarded to public routes: the admin has its own sidebar and must
             * not pay for this. The service caches per location, so the cost on
             * a public request is a cache read, not a query.
             */
            'navigation' => fn (): ?array => $request->is('backend*')
                ? null
                : app(NavigationService::class)->siteNavigation(),

            /*
             * Public brand tokens, applied as CSS custom properties on the
             * marketing root so an admin can rebrand without a deploy.
             *
             * Public routes only — the admin palette is a separate design
             * system and must not move when someone picks a hero accent.
             */
            /*
             * Shared on EVERY route, admin included.
             *
             * This was public-only at first, on the reasoning that a hero
             * accent is rarely the right colour for a dense data table. That
             * reasoning still holds for the neutral greys the admin is built
             * from — but it does not justify the brand being invisible in the
             * product an operator spends all day in, which is what the client
             * asked for. The admin therefore adopts the brand at its ACCENT
             * points only (primary buttons, active states); its surfaces,
             * borders and text keep the tuned neutral scale, so contrast in
             * tables cannot be broken by a colour chosen for a landing page.
             */
            'brand' => fn (): array => $this->getBrandTokens(),
        ];
    }

    /**
     * Brand tokens for the public design system.
     *
     * Values are admin-authored and land in a `style` attribute, so each is
     * sanitised: anything carrying `;`, `{`, `}` or a `url(`/`expression(`
     * payload is dropped in favour of the built-in default rather than being
     * written into the document. React sets custom properties through
     * `setProperty`, which already prevents breaking out of the declaration,
     * but a setting is a stored value edited by humans and validating it here
     * costs nothing.
     *
     * @return array<string, string>
     */
    private function getBrandTokens(): array
    {
        $defaults = [
            'accent'             => 'oklch(0.55 0.19 258)',
            'accentInk'          => 'oklch(0.99 0 0)',
            'accentDark'         => 'oklch(0.72 0.15 258)',
            'accentInkDark'      => 'oklch(0.16 0.03 258)',
            'radius'             => '0.5rem',
            'buttonPrimary'      => '#111827',
            'buttonPrimaryInk'   => '#ffffff',
            'buttonSecondary'    => 'transparent',
            'buttonSecondaryInk' => '#111827',
        ];

        $keys = [
            'accent'             => SettingKey::BRAND_ACCENT,
            'accentInk'          => SettingKey::BRAND_ACCENT_INK,
            'accentDark'         => SettingKey::BRAND_ACCENT_DARK,
            'accentInkDark'      => SettingKey::BRAND_ACCENT_INK_DARK,
            'radius'             => SettingKey::BRAND_RADIUS,
            'buttonPrimary'      => SettingKey::BRAND_BUTTON_PRIMARY,
            'buttonPrimaryInk'   => SettingKey::BRAND_BUTTON_PRIMARY_INK,
            'buttonSecondary'    => SettingKey::BRAND_BUTTON_SECONDARY,
            'buttonSecondaryInk' => SettingKey::BRAND_BUTTON_SECONDARY_INK,
        ];

        $tokens = [];

        foreach ($keys as $name => $key) {
            $value = trim((string) site_settings($key->value));

            $tokens[$name] = ($value !== '' && !preg_match('/[;{}]|url\s*\(|expression\s*\(/i', $value))
                ? $value
                : $defaults[$name];
        }

        return $tokens;
    }

    /**
     * Get the authenticated user as a resource array.
     *
     * @return array<string, mixed>|null
     */
    private function getAuthenticatedUser(Request $request): ?array
    {
        $user = $request->user();

        return $user ? (new UserResource($user))->resolve() : null;
    }

    /**
     * Get authenticated user's role and permissions
     */
    private function getAuthenticatedUserRolePermissions(Request $request): array
    {
        try {
            $user = $request->user();

            if (!$user) {
                return [];
            }

            $user->loadMissing('roles.permissions:id,name');

            $role = $user->roles->first();

            if (!$role) {
                return [];
            }

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
     * Theme contract shared with the client.
     *
     * The `qtech_theme` cookie is the single source of truth for the active
     * theme. `default` is the admin-configured fallback used only when the
     * visitor has expressed no preference - it never overrides the cookie.
     *
     * @return array<string, mixed>
     */
    private function getThemeSettings(): array
    {
        return [
            'preference'     => theme_preference(),
            'resolved'       => resolved_theme(),
            'default'        => site_settings(SettingKey::THEME_MODE->value),
            'cookie_name'    => GlobalConfig::THEME_COOKIE_NAME,
            'cookie_max_age' => GlobalConfig::THEME_COOKIE_MAX_AGE,
        ];
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
        ];

        $settings = [];

        foreach ($settingKeys as $key) {
            $settings[$key] = site_settings($key);
        }

        return $settings;
    }
}

<?php

namespace App\Http\Middleware;

use App\Enums\Settings\SessionKey;
use App\Enums\Settings\SettingKey;
use App\Http\Services\Frontend\GeoLocaleResolver;
use App\Models\Language;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Response;

/**
 * Resolves the request locale.
 *
 * ADMIN (`/backend/*`) is unchanged: it keeps its own session-driven switch
 * (`SettingsController::switchLanguage`), which the admin UI depends on.
 *
 * PUBLIC uses URL as the source of truth. The default locale is unprefixed;
 * every other active language is served under `/{code}/…`. Precedence:
 *
 *   1. a `/{code}` URL prefix                       -> that locale
 *   2. the `locale` cookie (a remembered choice)    -> that locale
 *   3. country of a first-time visitor              -> 302 to `/{code}…`
 *   4. otherwise                                    -> the default locale
 *
 * The stripped path is stashed as the `cms_path` request attribute so
 * `PageController` resolves `/nl/services` against the page at `/services`.
 */
class LanguageMiddleware
{
    public function __construct(
        private readonly GeoLocaleResolver $geo,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is('backend', 'backend/*', 'api/*')) {
            return $this->handleAdmin($request, $next);
        }

        return $this->handlePublic($request, $next);
    }

    /**
     * Unchanged legacy behaviour: locale from the admin's session, default
     * from the app setting.
     */
    private function handleAdmin(Request $request, Closure $next): Response
    {
        try {
            if (! session()->has(SessionKey::LOCALE->value)) {
                $code = site_settings(SettingKey::SYSYEM_LANGUAGE_CODE->value);
                $language = Language::where('code', $code)->first();
                session()->put(SessionKey::LOCALE->value, $language?->code ?? 'en');
            }

            App::setLocale(session()->get(SessionKey::LOCALE->value, App::getLocale()));
        } catch (\Throwable) {
            // Locale is best-effort; a failure here must not 500 the panel.
        }

        return $next($request);
    }

    private function handlePublic(Request $request, Closure $next): Response
    {
        [$prefix, $path] = split_locale_prefix($request->path());
        $request->attributes->set('cms_path', $path);

        $default = default_locale();
        $cookieName = (string) config('cms.locales.cookie', 'locale');
        $active = active_locale_codes();

        $locale = $default;

        if ($prefix !== null) {
            $locale = $prefix;
        } else {
            $cookie = (string) $request->cookie($cookieName);

            if ($cookie !== '' && in_array($cookie, $active, true)) {
                $locale = $cookie;
            } elseif ($this->shouldAutoRedirect($request)) {
                $detected = $this->geo->detect($request);

                if ($detected !== null) {
                    return $this->redirectToLocale($request, $detected);
                }
            }
        }

        if (! in_array($locale, $active, true)) {
            $locale = $default;
        }

        App::setLocale($locale);
        session()->put(SessionKey::LOCALE->value, $locale);
        session()->put(SessionKey::LOCALE_DIRECTION->value, locale_direction($locale));

        // Remember the resolved locale for the next visit and for the
        // unprefixed form POSTs (contact, subscribe) that carry no prefix.
        Cookie::queue($cookieName, $locale, 60 * 24 * 365);

        return $next($request);
    }

    /**
     * Only redirect a plain top-level GET navigation with no cookie yet — never
     * an asset, an XHR, a form POST or a crawler that already asked for a
     * specific URL.
     */
    private function shouldAutoRedirect(Request $request): bool
    {
        return $request->isMethod('GET')
            && ! $request->ajax()
            && ! $request->wantsJson()
            && $request->acceptsHtml()
            && ! $request->hasHeader('X-Inertia');
    }

    private function redirectToLocale(Request $request, string $locale): Response
    {
        $target = localize_path('/'.ltrim((string) $request->attributes->get('cms_path', $request->path()), '/'), $locale);

        if (filled($request->getQueryString())) {
            $target .= '?'.$request->getQueryString();
        }

        return redirect()->to($target, 302);
    }
}

<?php

namespace App\Http\Services\Frontend;

use App\Enums\Settings\SessionKey;
use App\Models\Language;

/**
 * The public language switcher.
 *
 * WHY THIS IS NOT `SettingsController::switchLanguage()`
 * -----------------------------------------------------
 * That action is the ADMIN's, and it does two things a public visitor must
 * never be able to do: it requires `switchLanguage` authorisation, and it
 * writes the site-wide `direction` AppSetting. A visitor picking Arabic in the
 * footer would flip the text direction for every other visitor and for the
 * admin panel — one person's preference silently becoming global state.
 *
 * This writes the SESSION only. Locale and direction are per-visitor facts and
 * belong in per-visitor storage; `LanguageMiddleware` already reads the locale
 * key on every request, so nothing else has to change.
 */
class LocaleService
{
    /**
     * Switch the current visitor's language.
     *
     * Returns false when the code is not an active site language, which is the
     * only failure mode: the caller turns that into a 404-ish redirect rather
     * than trusting an arbitrary string into the session.
     */
    public function switch(string $code): bool
    {
        // `site_languages()` is the cached ACTIVE set — the same list the
        // footer renders — so a language cannot be selected through a crafted
        // request after an admin deactivates it.
        $language = site_languages()->firstWhere('code', $code);

        if (! $language instanceof Language) {
            return false;
        }

        session()->put(SessionKey::LOCALE->value, $language->code);
        session()->put(SessionKey::LOCALE_ID->value, $language->id);
        session()->put(
            SessionKey::LOCALE_DIRECTION->value,
            $language->direction ?? 'ltr'
        );

        // The cookie is what `LanguageMiddleware` reads first on the next
        // request, and what keeps the unprefixed form POSTs (contact,
        // subscribe) in the chosen language.
        \Illuminate\Support\Facades\Cookie::queue(
            (string) config('cms.locales.cookie', 'locale'),
            $language->code,
            60 * 24 * 365,
        );

        app()->setLocale($language->code);

        return true;
    }
}

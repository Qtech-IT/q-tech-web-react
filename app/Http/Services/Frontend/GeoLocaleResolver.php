<?php

namespace App\Http\Services\Frontend;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stevebauman\Location\Facades\Location;

/**
 * Best-guess locale for a first-time visitor, from their country.
 *
 * Country comes from a proxy header first (`config('cms.locales.country_headers')`
 * — Cloudflare's `CF-IPCountry` and friends), which is free and instant. An
 * IP-database lookup is only attempted when `cms.locales.ip_lookup` is on,
 * because it costs a network round-trip on the request path.
 *
 * The mapping (`cms.locales.country_map`) is country -> locale. A country that
 * maps to nothing, or maps to the default locale, returns null — the caller
 * then leaves the visitor on the unprefixed default and never redirects.
 *
 * This is deliberately a thin, swappable unit: a MaxMind GeoLite2 driver later
 * replaces `countryFromIp()` and nothing else changes.
 */
class GeoLocaleResolver
{
    /**
     * The locale to send a fresh visitor to, or null to leave them on the
     * default. Never returns the default locale itself.
     */
    public function detect(Request $request): ?string
    {
        $country = $this->countryFromHeaders($request) ?? $this->countryFromIp($request);

        if ($country === null) {
            return null;
        }

        $locale = $this->localeForCountry($country);

        if ($locale === null || is_default_locale($locale) || ! in_array($locale, active_locale_codes(), true)) {
            return null;
        }

        return $locale;
    }

    private function countryFromHeaders(Request $request): ?string
    {
        foreach ((array) config('cms.locales.country_headers', []) as $header) {
            $value = trim((string) $request->header($header));

            // Cloudflare sends 'XX' / 'T1' for unknown or Tor; treat as absent.
            if ($value !== '' && preg_match('/^[A-Za-z]{2}$/', $value) && ! in_array(strtoupper($value), ['XX', 'T1'], true)) {
                return strtoupper($value);
            }
        }

        return null;
    }

    private function countryFromIp(Request $request): ?string
    {
        if (! config('cms.locales.ip_lookup', false)) {
            return null;
        }

        try {
            $position = Location::get($request->ip());

            $code = $position?->countryCode;

            return $code ? strtoupper($code) : null;
        } catch (\Throwable $e) {
            Log::warning('Locale IP lookup failed', ['error' => $e->getMessage()]);

            return null;
        }
    }

    private function localeForCountry(string $country): ?string
    {
        foreach ((array) config('cms.locales.country_map', []) as $locale => $countries) {
            if (in_array($country, array_map('strtoupper', (array) $countries), true)) {
                return (string) $locale;
            }
        }

        return null;
    }
}

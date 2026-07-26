<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Language;
use Illuminate\Http\Request;
use App\Enums\Settings\SessionKey;
use App\Enums\Settings\SettingKey;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class LanguageMiddleware
{
	/**
	 * Handle an incoming request.
	 *
	 * Sets the application locale based on the session or default language setting.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function handle(Request $request, Closure $next): Response
	{
		try {
			// Check if session already has a locale
			if (!session()->has(SessionKey::LOCALE->value)) {
				// Fetch the default language
				$systemLanguageCode = site_settings(SettingKey::SYSYEM_LANGUAGE_CODE->value);
				$language           = Language::where('code', $systemLanguageCode)->first();
				session()->put(SessionKey::LOCALE->value, $language?->code ?? 'en');
			}

			// Get locale from session or fallback to app default
			$locale = session()->get(SessionKey::LOCALE->value, App::getLocale());

			App::setLocale($locale);
		} catch (\Exception $ex) {
			// Silently fail if something goes wrong
		}

		return $next($request);
	}
}

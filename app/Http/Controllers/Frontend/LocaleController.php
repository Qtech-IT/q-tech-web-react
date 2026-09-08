<?php

namespace App\Http\Controllers\Frontend;

use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Services\Frontend\LocaleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LocaleController extends Controller
{
    public function __construct(
        protected LocaleService $locales,
    ) {}

    /**
     * Switch the visitor's language from the public site.
     *
     * POST, not GET: this changes server-side session state, so a GET would be
     * followed by every crawler and prefetcher on the internet and would leave
     * visitors in whichever language was linked last.
     */
    public function update(Request $request, string $code): RedirectResponse
    {
        if (! $this->locales->switch($code)) {
            return AppResponse::asError()
                ->withMessage(translate('That language is not available.'))
                ->build();
        }

        // Send the visitor to the SAME page in the new locale, not `back()` —
        // the referer still carries the old locale prefix, so a plain bounce
        // would land them on a URL the middleware immediately corrects.
        return redirect()->to($this->siblingUrl($request, $code));
    }

    /**
     * The referring page's path, re-prefixed for the new locale. Falls back to
     * the locale home when there is no usable referer.
     */
    private function siblingUrl(Request $request, string $code): string
    {
        $referer = (string) $request->headers->get('referer');
        $path = '/';

        if ($referer !== '') {
            $parsed = parse_url($referer, PHP_URL_PATH);

            if (is_string($parsed) && $parsed !== '') {
                [, $path] = split_locale_prefix($parsed);
            }
        }

        return localize_path($path, $code) ?: '/';
    }
}

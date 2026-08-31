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

        return AppResponse::asSuccess()
            ->withMessage(translate('Language switched successfully'))
            ->build();
    }
}

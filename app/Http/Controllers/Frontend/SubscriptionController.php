<?php

namespace App\Http\Controllers\Frontend;

use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\SubscribeRequest;
use App\Http\Services\Frontend\SubscriptionService;
use Illuminate\Http\RedirectResponse;

class SubscriptionController extends Controller
{
    public function __construct(
        protected SubscriptionService $subscriptions,
    ) {}

    /**
     * Record a newsletter signup.
     *
     * Thin by contract: validation is `SubscribeRequest`, the write and the
     * re-subscribe rule are `SubscriptionService`, and rate limiting is on the
     * route. Redirects back so the Inertia form on the page keeps its place
     * rather than navigating.
     */
    public function store(SubscribeRequest $request): RedirectResponse
    {
        // Honeypot: a filled hidden field means a bot. Reply exactly as we
        // would to a real signup but record nothing, so the trap is
        // indistinguishable from success.
        if (blank($request->input('hp_channel'))) {
            $this->subscriptions->subscribe($request->validated(), $request);
        }

        return AppResponse::asSuccess()
            ->withMessage(translate('You are on the list. Check your inbox to confirm.'))
            ->build();
    }
}

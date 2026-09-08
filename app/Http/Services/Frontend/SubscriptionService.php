<?php

namespace App\Http\Services\Frontend;

use App\Enums\Marketing\SubscriberStatus;
use App\Models\Subscriber;
use Illuminate\Http\Request;

/**
 * Newsletter signups.
 *
 * WHY A RE-SUBSCRIBE IS AN UPDATE AND NOT AN ERROR
 * ------------------------------------------------
 * `(site_id, email)` is unique, so a second signup from the same address would
 * otherwise throw an integrity violation and show the visitor a 500 for doing
 * something entirely reasonable. It is handled as an update instead, which
 * also gives the one behaviour that actually matters: someone who unsubscribed
 * and later signs up again is RE-subscribed, with a fresh consent timestamp
 * and IP, rather than silently staying off the list.
 *
 * WHY THE RESPONSE NEVER SAYS "you are already subscribed"
 * -------------------------------------------------------
 * That message turns a public form into an email-enumeration oracle: anyone
 * could test addresses against the list. The caller gets the same success
 * either way; whether the row was created or updated is the service's business.
 */
class SubscriptionService
{
    /**
     * Record a signup, creating or reviving the subscriber.
     *
     * @param  array{email: string, source?: string|null}  $data
     */
    /**
     * `$isSpam` (honeypot tripped) still records the signup, but as an inactive
     * row and with no `subscribed` state, so a real person whose browser
     * autofilled the hidden field is recoverable from the admin instead of
     * silently lost.
     */
    public function subscribe(array $data, Request $request, bool $isSpam = false): Subscriber
    {
        $subscriber = Subscriber::withTrashed()->firstOrNew([
            'site_id' => (int) config('cms.site_id'),
            'email' => $data['email'],
        ]);

        // A previously deleted row is restored rather than duplicated — the
        // unique index covers soft-deleted rows too, so `firstOrNew` on a
        // trashed record and a plain `create()` would collide.
        if ($subscriber->trashed()) {
            $subscriber->restore();
        }

        $subscriber->fill([
            'locale' => app()->getLocale(),
            'source' => $data['source'] ?? null,
            'consent_ip' => $request->ip(),
            'consent_at' => now(),
            'unsubscribed_at' => null,
        ]);

        // Not fillable: consent is set here or nowhere. See the model.
        $subscriber->subscription_status = $isSpam
            ? SubscriberStatus::PENDING
            : SubscriberStatus::SUBSCRIBED;

        if ($isSpam) {
            $subscriber->status = \App\Enums\Common\Status::INACTIVE;
        }

        $subscriber->save();

        if ($isSpam) {
            \Illuminate\Support\Facades\Log::info('Newsletter signup flagged as spam by honeypot', [
                'subscriber' => $subscriber->uuid,
                'ip' => $request->ip(),
            ]);
        }

        return $subscriber;
    }
}

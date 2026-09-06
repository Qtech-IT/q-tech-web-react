<?php

namespace App\Http\Resources\Backend\Marketing;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class SubscriberResource extends BaseResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...$this->getBaseAttributes($request),
            'email' => $this->email,
            'subscription_status' => $this->subscription_status?->value,
            'subscription_status_label' => $this->subscription_status?->values(),
            'locale' => $this->locale,
            'source' => $this->source,
            'consent_ip' => $this->consent_ip,
            'consent_at' => $this->consent_at?->toDateTimeString(),
            'unsubscribed_at' => $this->unsubscribed_at?->toDateTimeString(),
        ];
    }
}

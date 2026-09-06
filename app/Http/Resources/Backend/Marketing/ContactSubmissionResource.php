<?php

namespace App\Http\Resources\Backend\Marketing;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class ContactSubmissionResource extends BaseResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...$this->getBaseAttributes($request),
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'company' => $this->company,
            'message' => $this->message,
            'handling_status' => $this->handling_status?->value,
            'handling_status_label' => $this->handling_status?->values(),
            'locale' => $this->locale,
            'source' => $this->source,
            'ip' => $this->ip,
            'user_agent' => $this->user_agent,
            'read_at' => $this->read_at?->toDateTimeString(),
            'replied_at' => $this->replied_at?->toDateTimeString(),
            'mailed_at' => $this->mailed_at?->toDateTimeString(),
        ];
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BaseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function getBaseAttributes(Request $request): array
    {
        $data = [
            'id' => $this->id,
        ];

        // Only include UUID if it exists
        if (isset($this->uuid)) {
            $data['uuid'] = $this->uuid;
        }

        if (isset($this->status)) {
            $data['status'] = $this->status;
        }

        // Common timestamps
        foreach (['created_at', 'updated_at', 'deleted_at'] as $field) {
            $data[$field] = $this->{$field} ? get_date_time($this->{$field}) : null;

            $data['row_'.$field] = $this->{$field} ? $this->{$field} : null;
        }

        // Common audit fields
        if ($this->relationLoaded('createdBy') && $this->createdBy) {
            $data['createdBy'] = getAuditUserMeta($this->createdBy);
        }

        if ($this->relationLoaded('updatedBy') && $this->updatedBy) {
            $data['updatedBy'] = getAuditUserMeta($this->updatedBy);
        }

        if ($this->relationLoaded('requestedBy') && $this->requestedBy) {
            $data['requestedBy'] = getAuditUserMeta($this->requestedBy);
        }

        return $data;
    }

    /**
     * The non-routable translation overlay (schema doc §8.2), shaped for the
     * admin editor's locale tabs: `{ locale: { 'heading': '…', 'data.x': '…' } }`.
     *
     * A MissingValue when the `translations` relation was not eager-loaded, so
     * the key is simply absent on the public/read payloads that never ask for
     * it. Owners without the HasContentTranslations trait never call this.
     */
    protected function translationPayload(): mixed
    {
        return $this->whenLoaded('translations', fn () => $this->translations
            ->groupBy('locale')
            ->map(fn ($rows) => $rows->pluck('value', 'field')));
    }
}

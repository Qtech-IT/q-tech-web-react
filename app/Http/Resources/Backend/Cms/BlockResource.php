<?php

namespace App\Http\Resources\Backend\Cms;

use App\Http\Resources\BaseResource;
use App\Http\Services\Backend\Cms\SectionTypeRegistry;
use Illuminate\Http\Request;

class BlockResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...$this->getBaseAttributes($request),
            'key' => $this->key,
            'name' => $this->name,
            'description' => $this->description,
            'section_type' => $this->section_type,
            'type_label' => app(SectionTypeRegistry::class)->get($this->section_type)?->label(),

            'is_locked' => $this->is_locked,

            'publish_status' => $this->publish_status,
            // Machine format: these feed `datetime-local` inputs, which only
            // parse `Y-m-d\TH:i`. `get_date_time()` returns the site's
            // DISPLAY format, which the input silently rejects (renders
            // blank) and then posts back verbatim, failing `date`.
            'published_at' => $this->published_at?->format('Y-m-d\TH:i'),
            'published_at_label' => $this->published_at ? get_date_time($this->published_at) : null,
            // Machine format: these feed `datetime-local` inputs, which only
            // parse `Y-m-d\TH:i`. `get_date_time()` returns the site's
            // DISPLAY format, which the input silently rejects (renders
            // blank) and then posts back verbatim, failing `date`.
            'expires_at' => $this->expires_at?->format('Y-m-d\TH:i'),
            'expires_at_label' => $this->expires_at ? get_date_time($this->expires_at) : null,
            'sort_order' => $this->sort_order,

            // How many pages embed this block. Shown before a delete, because
            // the FK is SET NULL — deleting degrades every referencing section
            // to a local copy rather than failing loudly.
            'usages_count' => $this->whenCounted('usages'),

            'is_deleteable' => ! $this->is_locked,

            'body' => new PageSectionResource($this->whenLoaded('body')),
        ];
    }
}

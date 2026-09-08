<?php

namespace App\Http\Resources\Backend\Cms;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class SectionBlockResource extends BaseResource
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
            'translations' => $this->translationPayload(),
            'page_section_id' => $this->page_section_id,
            'parent_id' => $this->parent_id,
            'block_type' => $this->block_type,

            'label' => $this->label,

            // A string by design: "500+" and "24/7" are both legitimate.
            'value' => $this->value,
            'description' => $this->description,
            'body' => $this->body,
            'icon' => $this->icon,

            'media' => new MediaResource($this->whenLoaded('primaryMedia')),
            'cta' => new CtaResource($this->whenLoaded('cta')),

            'link_type' => $this->link_type,
            'link_target_type' => $this->link_target_type,
            'link_target_id' => $this->link_target_id,
            'link_url' => $this->link_url,

            'data' => $this->data,
            'settings' => $this->settings,
            'sort_order' => $this->sort_order,

            'children' => SectionBlockResource::collection($this->whenLoaded('children')),
        ];
    }
}

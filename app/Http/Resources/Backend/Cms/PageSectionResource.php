<?php

namespace App\Http\Resources\Backend\Cms;

use App\Http\Resources\BaseResource;
use App\Http\Services\Backend\Cms\SectionTypeRegistry;
use Illuminate\Http\Request;

class PageSectionResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $registry = app(SectionTypeRegistry::class);

        return [
            ...$this->getBaseAttributes($request),
            'page_id' => $this->page_id,
            'block_id' => $this->block_id,
            'section_type' => $this->section_type,

            // False when a section_type has been removed from the registry.
            // Shipped so the renderer can pick the missing-section fallback
            // deliberately rather than discovering it by throwing.
            'is_known_type' => $registry->has($this->section_type),

            'type_label' => $registry->get($this->section_type)?->label(),
            'preview_component' => $registry->get($this->section_type)?->previewComponent(),

            'name' => $this->name,
            'anchor' => $this->anchor,

            // The six universal scalars.
            'eyebrow' => $this->eyebrow,
            'heading' => $this->heading,
            'subheading' => $this->subheading,
            'body' => $this->body,
            'media' => new MediaResource($this->whenLoaded('primaryMedia')),
            'cta' => new CtaResource($this->whenLoaded('cta')),

            'secondary_cta' => new CtaResource($this->whenLoaded('secondaryCta')),

            'data' => $this->data,
            'settings' => $this->settings,

            'blocks' => SectionBlockResource::collection($this->whenLoaded('blocks')),
            'gallery' => MediaResource::collection($this->whenLoaded('media')),

            // status is emitted by getBaseAttributes(); publish_status is NOT
            // and must be added explicitly. That asymmetry is deliberate — it
            // is the same separation that keeps the shared bulk-action control
            // away from editorial state.
            'publish_status' => $this->publish_status,
            'published_at' => $this->published_at ? get_date_time($this->published_at) : null,
            'expires_at' => $this->expires_at ? get_date_time($this->expires_at) : null,
            'sort_order' => $this->sort_order,
        ];
    }
}

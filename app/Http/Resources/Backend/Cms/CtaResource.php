<?php

namespace App\Http\Resources\Backend\Cms;

use App\Http\Resources\BaseResource;
use App\Http\Services\Backend\Cms\CtaService;
use Illuminate\Http\Request;

class CtaResource extends BaseResource
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
            'label' => $this->label,
            'aria_label' => $this->aria_label,
            'link_type' => $this->link_type,

            // Resolved once, here, through the single implementation — never
            // re-derived in four components.
            'href' => app(CtaService::class)->resolveHref($this->resource),

            'url' => $this->url,
            'route_name' => $this->route_name,
            'route_params' => $this->route_params,
            'page_id' => $this->page_id,
            'page' => $this->whenLoaded('page', fn (): array => [
                'uuid' => $this->page->uuid,
                'title' => $this->page->title,
                'path' => $this->page->path,
            ]),
            'target_type' => $this->target_type,
            'target_id' => $this->target_id,

            'variant' => $this->variant,
            'size' => $this->size,
            'icon' => $this->icon,
            'icon_position' => $this->icon_position,

            'opens_in_new_tab' => $this->opens_in_new_tab,
            'is_download' => $this->is_download,

            // The component composes the final rel: noopener is added
            // unconditionally alongside these tokens whenever the link opens
            // in a new tab, so an editor cannot accidentally remove it.
            'rel' => $this->rel,
            'tracking_id' => $this->tracking_id,
        ];
    }
}

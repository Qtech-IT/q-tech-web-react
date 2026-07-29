<?php

namespace App\Http\Resources\Backend\Cms;

use App\Enums\Cms\MenuLinkType;
use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class MenuItemResource extends BaseResource
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
            'menu_id' => $this->menu_id,
            'parent_id' => $this->parent_id,
            'path' => $this->path,
            'depth' => $this->depth,

            'label' => $this->label,
            'aria_label' => $this->aria_label,
            'description' => $this->description,
            'icon' => $this->icon,
            'media' => new MediaResource($this->whenLoaded('media')),

            'link_type' => $this->link_type,

            // Structural nodes render as a real heading or a separator element,
            // never as a focusable dead link. Shipping this flag means the
            // component decides on data rather than on a null href.
            'is_structural' => in_array($this->link_type?->value, MenuLinkType::nonInteractive(), true),

            'href' => $this->resolveHref(),
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

            'opens_in_new_tab' => $this->opens_in_new_tab,
            'rel' => $this->rel,
            'badge_label' => $this->badge_label,
            'badge_variant' => $this->badge_variant,
            'visibility' => $this->visibility,
            'settings' => $this->settings,
            'sort_order' => $this->sort_order,

            'children' => MenuItemResource::collection($this->whenLoaded('children')),
        ];
    }

    /**
     * Destination for this item, or null when it has none.
     *
     * Null rather than '#': an anchor with href="#" is focusable, announced as
     * a link, and goes nowhere — a WCAG failure the CMS should not be able to
     * author.
     */
    protected function resolveHref(): ?string
    {
        return match ($this->link_type) {
            MenuLinkType::URL, MenuLinkType::ANCHOR => $this->url,
            MenuLinkType::PAGE => $this->relationLoaded('page') ? $this->page?->path : null,
            MenuLinkType::ROUTE => $this->route_name && app('router')->has($this->route_name)
                ? route($this->route_name, (array) $this->route_params, false)
                : null,
            default => null,
        };
    }
}

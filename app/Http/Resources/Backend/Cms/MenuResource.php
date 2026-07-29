<?php

namespace App\Http\Resources\Backend\Cms;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class MenuResource extends BaseResource
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
            'location' => $this->location,
            'max_depth' => $this->max_depth,
            'settings' => $this->settings,
            'is_locked' => $this->is_locked,
            'items_count' => $this->whenCounted('items'),

            'is_deleteable' => ! $this->is_locked,

            'items' => MenuItemResource::collection($this->whenLoaded('items')),
        ];
    }
}

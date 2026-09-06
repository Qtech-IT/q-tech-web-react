<?php

namespace App\Http\Resources\Backend\Cms;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class MediaFolderResource extends BaseResource
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
            'parent_id' => $this->parent_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'path' => $this->path,
            'depth' => $this->depth,
            'sort_order' => $this->sort_order,
            'media_count' => $this->whenCounted('media'),
            'children_count' => $this->whenCounted('children'),
            'children' => MediaFolderResource::collection($this->whenLoaded('children')),
        ];
    }
}

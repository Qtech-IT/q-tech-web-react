<?php

namespace App\Http\Resources\Backend\Cms;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

/**
 * The narrow payload the admin page tree needs.
 *
 * Deliberately not PageResource: the tree renders hundreds of nodes and needs
 * none of the sections, SEO, or settings, and shipping them would make a
 * routine admin screen the heaviest response in the panel.
 */
class PageTreeResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'parent_id' => $this->parent_id,
            'title' => $this->title,
            'slug' => $this->slug,
            'path' => $this->path,
            'depth' => $this->depth,
            'locale' => $this->locale,
            'page_type' => $this->page_type,
            'is_homepage' => $this->is_homepage,
            'status' => $this->status,
            'publish_status' => $this->publish_status,
            'sort_order' => $this->sort_order,
            'children' => PageTreeResource::collection($this->whenLoaded('children')),
        ];
    }
}

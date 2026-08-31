<?php

namespace App\Http\Resources\Frontend;

use App\Http\Resources\Backend\Cms\MediaResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * One page as it appears when ANOTHER page lists it.
 *
 * Deliberately NOT `PageResource`. That one is the admin's shape — audit users,
 * publish timestamps in two formats, `is_deleteable`, the section count — and
 * none of it belongs on a public wire. This is the seven fields a card renders
 * and nothing else, which also means a listing of thirty services ships
 * thirty small objects rather than thirty admin records.
 *
 * No `id`: the public site addresses a page by `path`, and the primary key is
 * not something a visitor ever needs to know.
 */
class PageCardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'title' => $this->title,
            'path' => $this->path,
            'excerpt' => $this->excerpt,
            'icon' => $this->icon,
            'accent' => $this->accent,
            'page_type' => $this->page_type?->value,

            /*
             * The card image, from the `card` media collection.
             *
             * `first()` on an ALREADY-LOADED relation, never a fresh query: the
             * resolver eager-loads `media` constrained to the card collection,
             * so this is an in-memory pick. Written as a relation access it
             * would be one query per card — the exact N+1 a listing is most
             * prone to.
             */
            'media' => $this->whenLoaded(
                'media',
                fn () => ($first = $this->media->first())
                    ? new MediaResource($first)
                    : null
            ),
        ];
    }
}

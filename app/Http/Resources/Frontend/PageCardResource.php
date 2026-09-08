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
             * ISO 8601, formatted on the client.
             *
             * Not `get_date_time()`, which returns the site's display format as
             * a finished string: a listing has to be able to render "14 Mar
             * 2026" on a card and "14 March 2026" in a `<time datetime>`
             * attribute from the same value, and a pre-formatted string can do
             * neither. Sending the instant and letting `Intl` localise it also
             * means a blog index in Arabic dates itself correctly for free.
             *
             * Null is normal — a page may be published with no timestamp only
             * if it is a draft, and drafts never reach a public listing.
             */
            'published_at' => $this->published_at?->toIso8601String(),

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

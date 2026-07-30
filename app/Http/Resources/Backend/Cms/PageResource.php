<?php

namespace App\Http\Resources\Backend\Cms;

use App\Enums\Cms\PageType;
use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class PageResource extends BaseResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'path' => $this->path,
            'depth' => $this->depth,
            'locale' => $this->locale,
            'translation_group_id' => $this->translation_group_id,
            'parent_id' => $this->parent_id,
            'parent' => $this->whenLoaded('parent', fn (): array => [
                'uuid' => $this->parent->uuid,
                'title' => $this->parent->title,
                'path' => $this->parent->path,
            ]),

            'page_type' => $this->page_type,
            'template' => $this->template,
            'is_homepage' => $this->is_homepage,
            'is_indexable' => $this->is_indexable,
            'settings' => $this->settings,

            // getBaseAttributes() already emits `status`; publish_status is a
            // different column with a different owner and must be added here.
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

            // Mirrors the ->published() scope exactly, in memory, so the admin
            // list can badge "live now" without a second query per row.
            'is_live' => $this->isPubliclyVisible(),

            // System and home pages are structurally undeletable; surfaced so
            // the UI disables the control rather than failing on submit.
            'is_deleteable' => ! in_array($this->page_type?->value, PageType::undeletable(), true),

            'sections' => PageSectionResource::collection($this->whenLoaded('sections')),
            'seo' => new SeoMetaResource($this->whenLoaded('seo')),
            'sections_count' => $this->whenCounted('sections'),
        ];
    }
}

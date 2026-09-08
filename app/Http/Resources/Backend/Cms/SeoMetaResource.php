<?php

namespace App\Http\Resources\Backend\Cms;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class SeoMetaResource extends BaseResource
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
            'seoable_type' => $this->seoable_type,
            'seoable_id' => $this->seoable_id,
            'locale' => $this->locale,

            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'meta_keywords' => $this->meta_keywords,
            'canonical_url' => $this->canonical_url,

            'robots_index' => $this->robots_index,
            'robots_follow' => $this->robots_follow,
            'robots_advanced' => $this->robots_advanced,

            'og_title' => $this->og_title,
            'og_description' => $this->og_description,
            'og_type' => $this->og_type,
            'og_media' => new MediaResource($this->whenLoaded('ogMedia')),

            'twitter_card' => $this->twitter_card,
            'twitter_title' => $this->twitter_title,
            'twitter_description' => $this->twitter_description,
            'twitter_media' => new MediaResource($this->whenLoaded('twitterMedia')),

            'schema_type' => $this->schema_type,
            'schema_data' => $this->schema_data,
            'focus_keyword' => $this->focus_keyword,
            'seo_score' => $this->seo_score,
        ];
    }
}

<?php

namespace App\Http\Resources\Backend\Cms;

use App\Enums\Cms\RedirectSource;
use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class RedirectResource extends BaseResource
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
            'from_path' => $this->from_path,
            'to_path' => $this->to_path,
            'status_code' => $this->status_code,
            'is_regex' => $this->is_regex,
            'preserve_query' => $this->preserve_query,
            'source' => $this->source,

            // Auto-created redirects are distinguishable from curated ones, so
            // a bulk cleanup can target the right set.
            'is_automatic' => $this->source === RedirectSource::SLUG_CHANGE,

            // Usage counters exist so dead redirects can be retired rather
            // than accumulating forever.
            'hits' => $this->hits,
            'last_hit_at' => $this->last_hit_at ? get_date_time($this->last_hit_at) : null,
        ];
    }
}

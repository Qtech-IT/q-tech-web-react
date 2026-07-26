<?php

namespace App\Http\Resources\Backend;

use App\Enums\Settings\SettingKey;
use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class PolicyPageResource extends BaseResource
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

            'title'   => ($this->title),
            'translated_title' => translate($this->title),
            'slug'    => $this->slug,
            'content' => $this->content
        ];
    }
}

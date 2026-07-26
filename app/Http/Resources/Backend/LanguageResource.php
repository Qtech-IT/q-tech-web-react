<?php

namespace App\Http\Resources\Backend;

use App\Enums\Settings\SettingKey;
use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class LanguageResource extends BaseResource
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
            'name'          => $this->name,
            'code'          => $this->code,
            'direction'     => $this->direction,
            'is_default'    => $this->code == site_settings(SettingKey::SYSYEM_LANGUAGE_CODE->value),
            'is_deleteable' => ($this->code != site_settings(SettingKey::SYSYEM_LANGUAGE_CODE->value)) &&
                                $this->code != App::getLocale()
        ];
    }
}

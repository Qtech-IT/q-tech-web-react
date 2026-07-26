<?php

namespace App\Http\Resources\Backend;

use App\Constants\FilePathConstants;
use App\Http\Resources\BaseResource;
use App\Traits\Common\Fileable;
use Illuminate\Http\Request;

class BannerResource extends BaseResource
{
     use Fileable;
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
          'image' => $this->getFileURL(
              file: $this->file,
              location: FilePathConstants::getPath('banner')['path']
          ),
        ];
    }
}

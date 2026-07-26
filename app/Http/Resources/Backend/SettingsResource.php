<?php

namespace App\Http\Resources\Backend;

use App\Constants\DefaultSettings;
use App\Constants\FilePathConstants;
use App\Http\Resources\BaseResource;
use App\Traits\Common\Fileable;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingsResource extends BaseResource
{

    use Fileable;
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request
     * @return array
     */
    public function toArray($request): array
    {


       $value =  $this->file
                    ? $this->getFileURL(
                                            $this->file,
                                            FilePathConstants::getPath($this->slug)['path']
                                        )
                    : (DefaultSettings::isKeyContainsJsonValue($this->slug) ? json_decode($this->setting_value , true) : $this->setting_value) ;


       $data =  [ 
            
            ...$this->getBaseAttributes($request),
            'title'      => $this->title,
            'slug'       => $this->slug,
            'value'      => $value ,
            'created_at' => get_date_time($this->created_at)
       ];

       return $data ;

    }
}

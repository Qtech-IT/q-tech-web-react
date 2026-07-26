<?php

namespace App\Http\Resources\Backend;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class NotificationLogResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $data = [
                    ...$this->getBaseAttributes($request),
                    'module'           => $this->module,
                    'custom_data'      => $this->custom_data,
                    'message'          => $this->message,
                    'gateway_response' => $this->gateway_response,
                    'channel'          => $this->channel,
                    'subject'          => $this->custom_data?->subject ?? null,
                ];

        if($this->custom_data &&  isset($this->custom_data?->email) ){
            $data['receiver'] = [
                'name'  => isset($this?->custom_data?->username) 
                             ? $this?->custom_data?->username : '--' ,
                'email' => $this->custom_data->email
            ];
        }

        if($this->relationLoaded('receiver') && $this->receiver){
            $receiver = $this->receiver;
            $data['receiver'] = [
                'name'  => $receiver->name,
                'email' => $receiver->email
            ];
        } 

        return $data;
    }
}

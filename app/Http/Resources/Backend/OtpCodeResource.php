<?php

namespace App\Http\Resources\Backend;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class OtpCodeResource extends BaseResource
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
            'otp'           => $this->otp,
            'type'          => $this->type,
            'expired_at'    => $this->expired_at ? diff_for_humans($this->expired_at) : null,
        ];

        if($this->whenLoaded('otpable') && $this->otpable){
            $receiver = $this->otpable;

            $data['receiver'] = [
                'id'    => $receiver->id,
                'name'  => $receiver?->name ?? null,
                'email' => $receiver?->email ?? null,
                'phone' => $receiver?->phone ?? null,
            ];
        }
        return $data;
    }
}

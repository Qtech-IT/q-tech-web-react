<?php

namespace App\Http\Resources;

use App\Constants\FilePathConstants;
use App\Http\Resources\Backend\CryptoResource;
use App\Http\Resources\Backend\User\UserResource;
use App\Http\Resources\BaseResource;
use App\Traits\Common\Fileable;
use Illuminate\Http\Request;

class WithdrawResource extends BaseResource
{
    use Fileable;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
             ...$this->getBaseAttributes($request),
          'withdrawal_address' => $this->withdrawal_address,
          'amount'             => app_format_currency($this->amount),
          'fee_pct'            => $this->fee_pct,
          'fee_charged'        => app_format_currency($this->fee_charged),
          'final_amount'       => app_format_currency($this->final_amount),
          'status'             => $this->status,
          'note'               => $this->note
        ];

        if($this->user){
            $data['user'] = UserResource::make($this->user);
        }

        return $data;
    }
}

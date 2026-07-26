<?php

namespace App\Http\Resources;

use App\Constants\FilePathConstants;
use App\Http\Resources\Backend\CryptoResource;
use App\Http\Resources\Backend\User\UserResource;
use App\Http\Resources\BaseResource;
use App\Traits\Common\Fileable;
use Illuminate\Http\Request;

class DepositResource extends BaseResource
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
          'network'              => $this->network,
          'amount'               => $this->amount,
          'fee_pct'              => $this->fee_pct,
          'fee_charged'          => $this->fee_charged,
          'amount_credited'      => $this->amount_credited,
          'usd_rate'             => $this->usd_rate,
          'usd_amount'           => $this->usd_amount,
          'status'               => $this->status,
          'note'                 => $this->note,
          'reviewed_at'          => $this->reviewed_at ? get_date_time($this->reviewed_at) : null,
          'deposit_voucher_file' => $this->getFileURL(
              file: $this->file,
              location: FilePathConstants::getPath('deposit_voucher')['path']
          ),
        ];

        if($this->user){
            $data['user'] = UserResource::make($this->user);
        }
        if($this->crypto){
            $data['crypto'] = CryptoResource::make($this->crypto);
        }

        return $data;
    }
}

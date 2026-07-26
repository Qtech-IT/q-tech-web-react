<?php

namespace App\Http\Resources\Backend;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class TradeResource extends BaseResource
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

            'direction'        => $this->direction,
            'amount'           => app_format_currency($this->amount, false, true),
            'open_price'       => app_format_currency($this->open_price, false, true),
            'close_price'      => app_format_currency($this->close_price, false, true),
            'profit_loss'      => app_format_currency($this->profit_loss, false, true),
            'duration_seconds' => $this->duration_seconds,
            'win_pct_applied'  => $this->win_pct_applied,
            'result'           => $this->result,
            'opened_at'        => $this->opened_at?->toDateTimeString(),
            'closes_at'        => $this->closes_at?->toDateTimeString(),
            'closed_at'        => $this->closed_at?->toDateTimeString(),
        ];

            if ($this->relationLoaded('crypto')) {
                $data['crypto'] = new CryptoResource($this->crypto);
            }

            if ($this->relationLoaded('user') && $this->user) {
                $data['user'] = [
                    'id'    => $this->user->id,
                    'name'  => $this->user->name,
                    'email' => $this->user->email,
                ];
            }

        return $data;
    }
}

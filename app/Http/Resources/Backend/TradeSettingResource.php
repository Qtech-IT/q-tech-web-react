<?php

namespace App\Http\Resources\Backend;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class TradeSettingResource extends BaseResource
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

            'label'            => $this->label,
            'duration_seconds' => $this->duration_seconds,
            'is_active'        => $this->is_active,

            // Win percentages
            'win_pct_option_a'  => $this->win_pct_option_a,
            'win_pct_option_b'  => $this->win_pct_option_b,
            'win_pct_option_c'  => $this->win_pct_option_c,
            'display_yield_pct' => $this->display_yield_pct,

            // Amount limits
            'min_trade_amount' => $this->min_trade_amount,
            'max_trade_amount' => $this->max_trade_amount,

            'formatted_min_trade_amount' => app_format_currency($this->min_trade_amount),
            'formatted_max_trade_amount' => app_format_currency($this->max_trade_amount),

            // Presets (cast to array in model)
            'amount_presets' => $this->amount_presets ?? [],
        ];
    }
}

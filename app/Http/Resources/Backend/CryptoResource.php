<?php

namespace App\Http\Resources\Backend;

use App\Constants\FilePathConstants;
use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class CryptoResource extends BaseResource
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
          'name'             => $this->name,
          'symbol'           => $this->symbol,
          'coingecko_id'     => $this->coingecko_id,
          'binance_symbol'   => $this->binance_symbol,
          'usd_price'        => $this->usd_price,
          'format_usd_price' => app_format_currency($this->usd_price),
          'price_change_24h' => $this->price_change_24h,
          'market_cap_usd'   => $this->market_cap_usd,
          'volume_24h_usd'   => $this->volume_24h_usd,
          'price_updated_at' => $this->price_updated_at,
          'sort_order'       => $this->sort_order,
          'images'           => $this->images,
          'meta_data'        => $this->meta_data
        ];
    }
}

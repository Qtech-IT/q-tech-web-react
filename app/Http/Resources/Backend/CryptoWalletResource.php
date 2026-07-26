<?php

namespace App\Http\Resources\Backend;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CryptoWalletResource extends BaseResource
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
          'network'      => $this->network,
          'address'      => $this->address,
          'qr_code_path' => $this->qr_code_path,
          'qr_code_url'  => $this->qr_code_path
            ? Storage::disk('public')->url($this->qr_code_path)
            : null,
          'notes' => $this->notes,
        ];

        if ($this->relationLoaded('crypto') && $this->crypto) {
            $crypto = $this->crypto;
			$data['crypto']  = [
                'crypto' => $crypto->id,
                'name'   => $crypto->name,
                'images' => $crypto->images
            ];
		}

        return $data;
    }
}

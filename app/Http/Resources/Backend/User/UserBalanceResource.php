<?php

namespace App\Http\Resources\Backend\User;

use App\Constants\FilePathConstants;
use App\Http\Resources\Backend\Role\RoleResource;
use App\Http\Resources\BaseResource;
use App\Traits\Common\Fileable;
use Illuminate\Http\Request;

class UserBalanceResource extends BaseResource
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
            'wallet_address'    => $this->wallet_address,
            'available_balance' => $this->available_balance,
            'formatted_balance' => app_format_currency($this->available_balance, false, true),
		];

        if ($this->relationLoaded('user') && $this->user) {
			$data['user'] = [
                'id'    => $this->user->id,
                'name'  => $this->user->name,
                'email' => $this->user->email
            ];
		}

		return $data;
	}
}

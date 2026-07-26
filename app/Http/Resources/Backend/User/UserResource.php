<?php

namespace App\Http\Resources\Backend\User;

use App\Constants\FilePathConstants;
use App\Http\Resources\Backend\Role\RoleResource;
use App\Http\Resources\BaseResource;
use App\Traits\Common\Fileable;
use Illuminate\Http\Request;

class UserResource extends BaseResource
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
			'name'               => $this->name,
			'email'              => $this->email,
			'username'           => $this->username,
			'phone'              => $this->phone,
			'address'            => $this->address,
			'withdrawal_address' => $this->withdrawal_address,
			'is_email_verified'  => !is_null($this->email_verified_at),

			'email_verified_at' => $this->email_verified_at
									   ? get_date_time($this->email_verified_at)
									   : null,

			'img_url' => $this->getFileURL(
			    file: $this->file,
			    location: FilePathConstants::getPath('profile')['path']
			),
			'is_admin'    => (bool) $this->is_admin,
			'last_win_at' => $this->last_win_at ? get_date_time($this->last_win_at) : null,
			'is_winner'   => (bool) $this->is_winner,
			'win_until'   => $this->win_until ? get_date_time($this->win_until) : null,

			'row_win_until' => $this->win_until ,

			'google2fa_secret'        => $this->google2fa_secret,
			'recovery_codes'          => $this->recovery_codes,
			'two_factor_enabled'      => (bool) $this->two_factor_enabled,
			'two_factor_confirmed_at' => $this->two_factor_confirmed_at
											? get_date_time($this->two_factor_confirmed_at)
											: null,
			'is_kyc_verified' => (bool) $this->is_kyc_verified,

			'last_login_at' => $this->last_login_at
											? get_date_time($this->last_login_at)
											: null,
			'last_login_ip' => $this->last_login_ip
		];

		if ($this->relationLoaded('roles')) {
			$data['roles'] = formatResourceResponse($this->roles, RoleResource::class);
		}

		return $data;
	}
}

<?php

namespace App\Http\Resources\Backend\User;

use App\Http\Resources\BaseResource;
use App\Traits\Common\Fileable;
use Illuminate\Http\Request;

class TransactionResource extends BaseResource
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
            'transaction_no' => $this->transaction_no,
            'amount'         => app_format_currency($this->amount, false, true),
            'balance_before' => app_format_currency($this->balance_before, false, true),
            'balance_after'  => app_format_currency($this->balance_after, false, true),
			'type'                    => $this->type,
			'note'                    => $this->note,
			'status'                  => $this->status
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

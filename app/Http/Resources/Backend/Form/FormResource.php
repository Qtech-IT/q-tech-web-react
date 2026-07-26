<?php

namespace App\Http\Resources\Backend\Form;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class FormResource extends BaseResource
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
			'name'         => $this->name,
			'description'  => $this->description,
			'fields_count' => $this?->fields_count ?? 0
		];

		if ($this->relationLoaded('fields') && !$this->fields->isEmpty()) {
			$data['fields'] = formatResourceResponse(
				$this->fields,
				FormFieldResource::class
			);
		}

		return $data;
	}
}

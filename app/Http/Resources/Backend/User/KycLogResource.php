<?php

namespace App\Http\Resources\Backend\User;

use App\Constants\FilePathConstants;
use App\Http\Resources\BaseResource;
use App\Models\File;
use App\Traits\Common\Fileable;
use Illuminate\Http\Request;

class KycLogResource extends BaseResource
{
	use Fileable;

	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{
        $response = (array) $this->data;

		$fileUrls = $this->files->mapWithKeys(function (File $file): array {
			return [
				$file->type => $this->getFileURL(
				    file: $file,
				    location: FilePathConstants::getPath('profile')['path']
				)
			];
		})->toArray();

		$response = array_merge($response, $fileUrls);

		$data = [
			...$this->getBaseAttributes($request),
            'data' => $response,
            'note' => $this->note,
		];

        if ($this->relationLoaded('user') && $this->user) {
			$data['user'] = [
                'id'    => $this->user->id,
                'name'  => $this->user->name,
                'email' => $this->user->email
            ];
		}

        if($this->relationLoaded('files') && !$this->files->isEmpty()){
        }

		return $data;
	}
}

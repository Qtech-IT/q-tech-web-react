<?php

namespace App\Http\Resources;

use App\Constants\FilePathConstants;
use App\Http\Resources\Backend\CryptoResource;
use App\Http\Resources\Backend\LoanProductResource;
use App\Http\Resources\Backend\User\UserResource;
use App\Http\Resources\BaseResource;
use App\Models\File;
use App\Models\LoanProduct;
use App\Traits\Common\Fileable;
use Illuminate\Http\Request;

class LoanRequestResource extends BaseResource
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
          'order_id' => $this->order_id,
          'amount'   => app_format_currency($this->amount),
          'status'   => $this->status,
          'note'     => $this->note,
        ];

        if($this->loanProduct){
            $data['loanProduct'] = LoanProductResource::make($this->loanProduct);
        }

        if($this->user){
            $data['user'] = UserResource::make($this->user);
        }

        $response = [];

		$fileUrls = $this->files->mapWithKeys(function (File $file): array {
			return [
				$file->type => $this->getFileURL(
				    file: $file,
				    location: FilePathConstants::getPath('loan_request')['path']
				)
			];
		})->toArray();

        $response = array_merge($response, $fileUrls);

        $data = array_merge($data, $response);

        return $data;
    }
}

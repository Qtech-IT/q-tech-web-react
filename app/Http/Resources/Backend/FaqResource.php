<?php

namespace App\Http\Resources\Backend;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class FaqResource extends BaseResource
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
          'question' => $this->question,
          't_question' =>  translate($this->question),
          'answer'   => $this->answer,
          't_answer' => translate($this->answer),
        ];
    }
}

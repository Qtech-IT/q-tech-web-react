<?php

namespace App\Http\Resources\Backend;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class LoanProductResource extends BaseResource
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
          'name'                     => $this->name,
          'institution'              => $this->institution,
          'daily_interest_rate'      => $this->daily_interest_rate,
          'minimum_amount'           => ($this->minimum_amount),
          'maximum_amount'           => ($this->maximum_amount),
          'formatted_minimum_amount' => app_format_currency($this->minimum_amount),
          'formatted_maximum_amount' => app_format_currency($this->maximum_amount),
          'repayment_period'         => $this->repayment_period,
          'repayment_method'         => $this->repayment_method
        ];
    }
}

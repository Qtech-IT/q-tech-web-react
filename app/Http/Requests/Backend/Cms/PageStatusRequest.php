<?php

namespace App\Http\Requests\Backend\Cms;

use App\Enums\Common\Status;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * The operational enable/disable toggle only.
 *
 * `value` is constrained to Status::getValues() because this feeds
 * ModelAction::changeStatus(), which writes the column literally named
 * `status`. Editorial state is a different request and a different column —
 * see PagePublishRequest.
 */
class PageStatusRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'id' => ['required', 'exists:pages,id'],
            'value' => ['required', Rule::in(Status::getValues())],
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}

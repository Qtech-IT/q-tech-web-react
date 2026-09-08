<?php

namespace App\Http\Requests\Backend\Cms;

use App\Enums\Common\Status;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * The operational enable/disable toggle for one section.
 *
 * Sibling of PageStatusRequest, and the same distinction applies: `value` is
 * constrained to Status::getValues() because this feeds
 * ModelAction::changeStatus(), which writes the column literally named
 * `status`. A section's editorial state lives in `publish_status` and is set
 * through SectionSaveRequest, never here.
 */
class SectionStatusRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'id' => ['required', 'exists:page_sections,id'],
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

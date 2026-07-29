<?php

namespace App\Http\Requests\Backend\Cms;

use Illuminate\Foundation\Http\FormRequest;

class SectionReorderRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * Ordering is submitted as the full uuid list rather than a single
     * moved-item delta, so the server writes an absolute order and two
     * concurrent drags cannot interleave into a nonsense sequence.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'sections' => ['required', 'array', 'min:1'],
            'sections.*' => ['required', 'uuid', 'exists:page_sections,uuid'],
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

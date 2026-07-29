<?php

namespace App\Http\Requests\Backend\Cms;

use Illuminate\Foundation\Http\FormRequest;

class SectionBlockReorderRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'blocks' => ['required', 'array', 'min:1'],
            'blocks.*' => ['required', 'uuid', 'exists:section_blocks,uuid'],
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

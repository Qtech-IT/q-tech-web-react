<?php

namespace App\Http\Requests\Backend\Cms;

use Illuminate\Foundation\Http\FormRequest;

class PageMoveRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * The cycle check itself lives in PageTreeService::guardAgainstCycle(),
     * not here: it needs the moved page's materialized path, which only the
     * service has loaded.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'parent_id' => ['nullable', 'exists:pages,id'],
            'siblings' => ['required', 'array'],
            'siblings.*' => ['required', 'uuid', 'exists:pages,uuid'],
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

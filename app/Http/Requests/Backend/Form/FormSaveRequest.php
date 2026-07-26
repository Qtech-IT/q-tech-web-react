<?php

namespace App\Http\Requests\Backend\Form;

use App\Enums\Common\Status;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FormSaveRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $formId = $this->route('form');

        return [
            'name' => ['required', 'string', 'max:191',
                                        $formId
                                            ? Rule::unique('forms', 'name')->ignore($formId)
                                            : Rule::unique('forms', 'name')
                                    ],

            'description' => ['nullable', 'string'],
        ];
    }
}

<?php

namespace App\Http\Requests\Backend\Form\Field;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class BulkFormFieldRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ids'    => ['required', 'array'],
            'ids.*'  => ['exists:form_fields,id'],
            'action' => ['required' , new Enum(\App\Enums\Settings\BulkActionType::class)],
        ];
    }
}

<?php

namespace App\Http\Requests\Backend\Form\Field;

use App\Enums\Common\Status;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFormFieldStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id'    => ['required', 'integer', 'exists:form_fields,id'],
            'value' => ['required', Rule::in(Status::getValues())],
        ];
    }
}
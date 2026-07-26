<?php

namespace App\Http\Requests\Backend\Form\Field;

use App\Enums\Common\Status;
use App\Enums\Settings\InputEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\FormField;

class FormFieldSaveRequest extends FormRequest
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
        $form    = $this->route('form');

        $fieldId = $this->route('field'); 

        return [
            'name'             => [
                                        'required',
                                        'string',
                                        'max:191',
                                        Rule::unique('form_fields', 'name')
                                                ->where(fn ($q) => $q->where('form_id', $form?->id))
                                                ->ignore($fieldId)
                                    ],
            'status'           => ['required', Rule::in(Status::getValues())],
            'description'      => ['nullable', 'string'],
            'input_type'       => ['required', Rule::in(InputEnum::getValuesWithoutHtmlText())],
            'values'           => [
                                    Rule::requiredIf(fn () => in_array($this->input('input_type'), [
                                        InputEnum::SELECT->value,
                                        InputEnum::MULTI_SELECT->value,
                                    ])),
                                    'nullable',
                                    'array'
                                ],
            'parent_id'        => ['nullable', 'exists:form_fields,id'],
            'label'            => ['required', 'string', 'max:191'],
            'hint_text'        => ['nullable', 'string', 'max:191'],
            'placeholder'      => ['nullable', 'string', 'max:191'],
            'is_required'      => ['boolean'],
            'is_read_only'     => ['boolean'],
            'is_hidden'        => ['boolean'],
            'default_value'    => ['nullable', 'string'],
            'order_level'      => ['nullable','numeric','min:1','max:9000'],
            'validation_rules' => [
                'nullable',
                'array'
            ],

            'validation_rules.*' => [
                'array'
            ],

            'validation_rules.*.message' => [
                'string',
                'max:255'
            ],

            'validation_rules.*.value' => [
                'nullable'
            ],

        ];
    }
}

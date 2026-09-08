<?php

namespace App\Http\Requests\Backend\Cms;

use App\Enums\Cms\SectionLinkType;
use App\Enums\Common\Status;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SectionBlockSaveRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'page_section_id' => ['required', 'exists:page_sections,id'],
            'parent_id' => ['nullable', 'exists:section_blocks,id'],
            'block_type' => ['required', 'string', 'max:100'],

            'label' => ['nullable', 'string', 'max:191'],

            // A string, not a number: "500+" and "24/7" are both valid values.
            'value' => ['nullable', 'string', 'max:191'],
            'description' => ['nullable', 'string'],
            'body' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:100'],
            'media_id' => ['nullable', 'exists:media,id'],
            'cta_id' => ['nullable', 'exists:ctas,id'],

            'link_type' => ['required', Rule::in(SectionLinkType::getValues())],

            // Constrained to the aliases this column is allowed to hold. The
            // morph map is non-enforcing, so this Rule::in is the actual guard
            // against an arbitrary type string reaching the column.
            'link_target_type' => [
                'nullable',
                Rule::in((array) config('morph-map.columns.link_target', [])),
                Rule::requiredIf(fn (): bool => $this->input('link_type') === SectionLinkType::ENTITY->value),
            ],
            'link_target_id' => [
                'nullable',
                'integer',
                Rule::requiredIf(fn (): bool => $this->input('link_type') === SectionLinkType::ENTITY->value),
            ],
            'link_url' => [
                'nullable',
                'string',
                'max:500',
                Rule::requiredIf(fn (): bool => in_array(
                    $this->input('link_type'),
                    [SectionLinkType::URL->value, SectionLinkType::ANCHOR->value],
                    true
                )),
            ],

            'data' => ['nullable', 'array'],
            'settings' => ['nullable', 'array'],
            'status' => ['required', Rule::in(Status::getValues())],
            'sort_order' => ['nullable', 'integer', 'min:0'],
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

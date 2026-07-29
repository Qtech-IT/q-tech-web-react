<?php

namespace App\Http\Requests\Backend\Cms;

use App\Enums\Cms\CtaLinkType;
use App\Enums\Cms\IconPosition;
use App\Enums\Common\Status;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CtaSaveRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * The conditional required rules are what make link_type meaningful: a
     * `page` CTA with no page_id is a button that goes nowhere, and the
     * component would have to invent a fallback.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $linkType = $this->input('link_type');

        return [
            'label' => ['required', 'string', 'max:191'],

            // Not optional decoration: with eight "Learn more" buttons on a
            // page, the accessible name is the only thing distinguishing them.
            'aria_label' => ['nullable', 'string', 'max:191'],

            'link_type' => ['required', Rule::in(CtaLinkType::getValues())],

            'url' => [
                'nullable',
                'string',
                'max:500',
                Rule::requiredIf(fn (): bool => in_array($linkType, [CtaLinkType::URL->value, CtaLinkType::ANCHOR->value], true)),
            ],
            'route_name' => [
                'nullable',
                'string',
                'max:191',
                Rule::requiredIf(fn (): bool => $linkType === CtaLinkType::ROUTE->value),
            ],
            'route_params' => ['nullable', 'array'],
            'page_id' => [
                'nullable',
                'exists:pages,id',
                Rule::requiredIf(fn (): bool => $linkType === CtaLinkType::PAGE->value),
            ],
            'target_type' => [
                'nullable',
                Rule::in((array) config('morph-map.columns.target', [])),
                Rule::requiredIf(fn (): bool => $linkType === CtaLinkType::ENTITY->value),
            ],
            'target_id' => [
                'nullable',
                'integer',
                Rule::requiredIf(fn (): bool => $linkType === CtaLinkType::ENTITY->value),
            ],

            'variant' => ['required', 'string', 'max:50'],
            'size' => ['required', 'string', 'max:20'],
            'icon' => ['nullable', 'string', 'max:100'],
            'icon_position' => ['required', Rule::in(IconPosition::getValues())],
            'opens_in_new_tab' => ['boolean'],
            'is_download' => ['boolean'],
            'rel' => ['nullable', 'string', 'max:100'],
            'tracking_id' => ['nullable', 'string', 'max:100'],
            'status' => ['required', Rule::in(Status::getValues())],
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

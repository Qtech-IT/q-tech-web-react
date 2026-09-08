<?php

namespace App\Http\Requests\Backend\Cms;

use App\Enums\Cms\MenuLinkType;
use App\Enums\Cms\MenuVisibility;
use App\Enums\Common\Status;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MenuItemSaveRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $linkType = $this->input('link_type');

        // `heading` and `separator` are structural, not navigational, so they
        // must NOT carry a destination — that is the whole reason they exist
        // instead of href="#" fakes.
        $isStructural = in_array($linkType, MenuLinkType::nonInteractive(), true);

        return [
            'menu_id' => ['required', 'exists:menus,id'],
            'parent_id' => ['nullable', 'exists:menu_items,id'],

            'label' => ['required', 'string', 'max:191'],
            'aria_label' => ['nullable', 'string', 'max:191'],
            'description' => ['nullable', 'string', 'max:500'],
            'icon' => ['nullable', 'string', 'max:100'],
            'media_id' => ['nullable', 'exists:media,id'],

            'link_type' => ['required', Rule::in(MenuLinkType::getValues())],

            'url' => [
                'nullable',
                'string',
                'max:500',
                Rule::prohibitedIf($isStructural),
                Rule::requiredIf(fn (): bool => in_array($linkType, [MenuLinkType::URL->value, MenuLinkType::ANCHOR->value], true)),
            ],
            'route_name' => [
                'nullable',
                'string',
                'max:191',
                Rule::requiredIf(fn (): bool => $linkType === MenuLinkType::ROUTE->value),
            ],
            'route_params' => ['nullable', 'array'],
            'page_id' => [
                'nullable',
                'exists:pages,id',
                Rule::requiredIf(fn (): bool => $linkType === MenuLinkType::PAGE->value),
            ],
            'target_type' => [
                'nullable',
                Rule::in((array) config('morph-map.columns.target', [])),
                Rule::requiredIf(fn (): bool => $linkType === MenuLinkType::ENTITY->value),
            ],
            'target_id' => [
                'nullable',
                'integer',
                Rule::requiredIf(fn (): bool => $linkType === MenuLinkType::ENTITY->value),
            ],

            'opens_in_new_tab' => ['boolean'],
            'rel' => ['nullable', 'string', 'max:100'],
            'badge_label' => ['nullable', 'string', 'max:50'],
            'badge_variant' => ['nullable', 'string', 'max:30'],
            'visibility' => ['required', Rule::in(MenuVisibility::getValues())],
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

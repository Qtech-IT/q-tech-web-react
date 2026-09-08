<?php

namespace App\Http\Requests\Backend\Cms;

use Illuminate\Foundation\Http\FormRequest;

class MenuItemMoveRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * The cycle and depth guards live in MenuTreeService, which is the only
     * place holding the moved node's materialized path.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'parent_id' => ['nullable', 'exists:menu_items,id'],
            'siblings' => ['required', 'array'],
            'siblings.*' => ['required', 'uuid', 'exists:menu_items,uuid'],
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

<?php

namespace App\Http\Requests\Backend\Role;

use App\Enums\User\RoleType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoleRequest extends FormRequest
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
     */
    public function rules(): array
    {
        $roleId = $this->route('role')?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles', 'name')->ignore($roleId),
            ],
            'display_name'   => 'required|string|max:255',
            'description'    => 'nullable|string|max:1000',
            'order_index'    => 'nullable|integer|min:0',
            'status'         => 'nullable|string|in:active,inactive',
            'type'           => ['required', Rule::in(RoleType::getValues())],
            'permissions'    => 'nullable|array',
            'permissions.*'  => 'integer|exists:permissions,id',
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
         return [
            'name.required'              => translate('The role name is required.'),
            'name.unique'                => translate('This role name already exists.'),
            'name.max'                   => translate('The role name must not exceed 255 characters.'),
            'display_name.required'      => translate('The display name is required.'),
            'display_name.max'           => translate('The display name must not exceed 255 characters.'),
            'description.max'            => translate('The description must not exceed 1000 characters.'),
            'order_index.integer'        => translate('The order index must be an integer.'),
            'order_index.min'            => translate('The order index must be at least 0.'),
            'status.in'                  => translate('The status must be either active or inactive.'),
            'permissions.array'          => translate('The permissions must be an array.'),
            'permissions.*.integer'      => translate('Each permission must be an integer ID.'),
            'permissions.*.exists'       => translate('One or more permissions do not exist.'),
        ];
    }

   
}
<?php

namespace App\Http\Requests\Backend\AdminUser;

use App\Constants\GlobalConfig;
use App\Enums\Common\Status;
use App\Enums\Settings\SettingKey;
use App\Rules\FileExtensionCheckRule;
use App\Traits\Common\ModelAction;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveUserRequest extends FormRequest
{
    use ModelAction;
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route(param: 'admin_user');

        return [
            'name' => ['required', 'string', 'max:191'],

            'email' => [
                                        'required',
                                        'email',
                                        'max:191',
                                        $userId
                                          ? Rule::unique('users', 'email')->ignore($userId)
                                          : Rule::unique('users', 'email')
                                     ],

            'username' => [
                                        'required',
                                        'string',
                                        'max:191',
                                        $userId
                                          ? Rule::unique('users', 'username')->ignore($userId)
                                          : Rule::unique('users', 'username')
                                        ],

            'role_id' => ['required', 'exists:roles,id'],

            'status' => ['required' ,  Rule::in(Status::getValues())],

            'phone'    => ['nullable', 'string', 'max:100'],
            'password' => [request()->method === 'PATCH'
                                       ? 'nullable'
                                       : $this->getPasswordRules(site_settings(SettingKey::MINIMUM_PASSWORD_LENGTH->value), false)],
            'address'             => ['nullable', 'array'],
            'address.street'      => ['nullable', 'string', 'max:255'],
            'address.city'        => ['nullable', 'string', 'max:100'],
            'address.state'       => ['nullable', 'string', 'max:100'],
            'address.postal_code' => ['nullable', 'string', 'max:20'],
            'address.country'     => ['nullable', 'string', 'max:100'],
            'image'               => ['nullable', 'image', new FileExtensionCheckRule(GlobalConfig::SUPPORTED_IMAGE_MIMES)]
        ];
    }
}

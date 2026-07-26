<?php

namespace App\Http\Requests\Backend\Auth;

use App\Enums\Settings\SettingKey;
use App\Traits\Common\ModelAction;
use Illuminate\Foundation\Http\FormRequest;

class PasswordUpdateRequest extends FormRequest
{
    use ModelAction;
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
       $minlen = site_settings(SettingKey::MINIMUM_PASSWORD_LENGTH->value);

       return [
               'password' => $this->getPasswordRules($minlen ),
            ];
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }
}

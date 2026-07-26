<?php

namespace App\Http\Requests\Backend\Auth;

use App\Constants\GlobalConfig;
use App\Rules\BdPhone;
use App\Rules\FileExtensionCheckRule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        $user = request()->user();
        return [
            'name'     => ['nullable', 'max:191', 'string'],
            'phone'    => ['nullable', 'max:191'],
            'email'    => ['required', 'email:rfc,dns', 'unique:users,email,' . $user->id , 'max:191'],
            'username' => ['required', 'unique:users,username,' . $user->id , 'max:191'],
            'image'    => ['nullable', new FileExtensionCheckRule(GlobalConfig::SUPPORTED_IMAGE_MIMES)]
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }
}

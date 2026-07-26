<?php

namespace App\Http\Requests\Backend\AdminUser;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUser2FARequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'two_factor_enabled' => 'required|boolean',
        ];
    }
}

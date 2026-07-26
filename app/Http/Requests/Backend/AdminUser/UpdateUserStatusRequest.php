<?php

namespace App\Http\Requests\Backend\AdminUser;

use App\Enums\Common\Status;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id'    => ['required', 'integer', 'exists:users,id'],
            'value' => ['required', Rule::in(Status::getValues())],
        ];
    }
}
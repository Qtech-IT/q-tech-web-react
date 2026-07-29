<?php

namespace App\Http\Requests\Backend\Cms;

use App\Enums\Common\Status;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MenuSaveRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $menuId = $this->route('menu')?->id;

        return [
            'key' => [
                'required',
                'string',
                'max:100',
                Rule::unique('menus', 'key')
                    ->where('site_id', config('cms.site_id'))
                    ->ignore($menuId)
                    ->whereNull('deleted_at'),
            ],
            'name' => ['required', 'string', 'max:191'],
            'location' => ['nullable', 'string', 'max:100'],
            'max_depth' => ['required', 'integer', 'min:1', 'max:5'],
            'settings' => ['nullable', 'array'],
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

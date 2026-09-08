<?php

namespace App\Http\Requests\Backend\Cms;

use Illuminate\Foundation\Http\FormRequest;

class FolderSaveRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * Sibling-slug uniqueness is enforced by the
     * UNIQUE (site_id, parent_id, slug) index rather than duplicated here,
     * because the slug is derived server-side and the parent may change in the
     * same request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:191'],
            'slug' => ['nullable', 'string', 'max:191'],
            'parent_id' => ['nullable', 'exists:media_folders,id'],
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

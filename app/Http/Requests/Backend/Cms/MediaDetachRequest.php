<?php

namespace App\Http\Requests\Backend\Cms;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MediaDetachRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * `media_ids` is optional: omitting it clears the whole scope, which is
     * what "empty this gallery" means. `exists:media,id` is deliberately NOT
     * applied — a media row that has since been force-deleted must still be
     * detachable, or its orphan pivot row becomes unremovable through the UI.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'mediable_type' => ['required', 'string', Rule::in((array) config('morph-map.columns.mediable', []))],
            'mediable_id' => ['required', 'integer', 'min:1'],

            'media_ids' => ['nullable', 'array'],
            'media_ids.*' => ['required', 'integer', 'min:1'],

            // Null narrows nothing: the asset is detached from every slot.
            'collection' => ['nullable', 'string', 'max:60', 'regex:/^[a-z0-9_\-]+$/'],
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

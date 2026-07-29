<?php

namespace App\Http\Requests\Backend\Cms;

use App\Enums\Common\Status;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Editorial metadata only. The stored file is never replaced through this
 * request — an in-place file swap would silently change every page already
 * referencing the asset.
 */
class MediaUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'folder_id' => ['nullable', 'exists:media_folders,id'],

            // Accessibility. Nullable because a decorative image correctly
            // carries an empty alt, and forcing text there is worse than none.
            'alt_text' => ['nullable', 'string', 'max:500'],
            'caption' => ['nullable', 'string', 'max:500'],
            'title' => ['nullable', 'string', 'max:191'],
            'description' => ['nullable', 'string'],
            'credit' => ['nullable', 'string', 'max:191'],

            // Focal point for art-directed cropping, normalised 0..1.
            'focal_x' => ['nullable', 'numeric', 'between:0,1'],
            'focal_y' => ['nullable', 'numeric', 'between:0,1'],

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

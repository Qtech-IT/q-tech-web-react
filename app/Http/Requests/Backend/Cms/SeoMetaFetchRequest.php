<?php

namespace App\Http\Requests\Backend\Cms;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Read side of the shared SEO panel.
 *
 * `seoable_type` is constrained to config('morph-map.columns.seoable') exactly
 * as SeoMetaSaveRequest constrains it, so the read and the write agree on which
 * entities may carry SEO settings — and so a crafted alias cannot be turned
 * into an arbitrary model lookup by SeoService::resolveOwner().
 */
class SeoMetaFetchRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'seoable_type' => ['required', Rule::in((array) config('morph-map.columns.seoable', []))],
            'seoable_id' => ['required', 'integer'],
            'locale' => ['nullable', 'string', 'max:10', 'exists:languages,code'],
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

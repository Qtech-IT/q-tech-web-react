<?php

namespace App\Http\Requests\Backend\Cms;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SeoMetaSaveRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            // Constrained to the aliases permitted on this specific morph
            // column. This is what stops an editor attaching an SEO record to
            // a menu item — the non-enforcing morph map cannot.
            'seoable_type' => ['required', Rule::in((array) config('morph-map.columns.seoable', []))],
            'seoable_id' => ['required', 'integer'],
            'locale' => ['required', 'string', 'max:10', 'exists:languages,code'],

            // Widths match the columns exactly; the editor's character counter
            // reads the same numbers.
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'meta_keywords' => ['nullable', 'string', 'max:500'],
            'canonical_url' => ['nullable', 'string', 'max:500'],

            'robots_index' => ['boolean'],
            'robots_follow' => ['boolean'],
            'robots_advanced' => ['nullable', 'string', 'max:191'],

            'og_title' => ['nullable', 'string', 'max:255'],
            'og_description' => ['nullable', 'string', 'max:500'],
            'og_type' => ['nullable', 'string', 'max:50'],
            'og_media_id' => ['nullable', 'exists:media,id'],

            'twitter_card' => ['nullable', 'string', 'max:50'],
            'twitter_title' => ['nullable', 'string', 'max:255'],
            'twitter_description' => ['nullable', 'string', 'max:500'],
            'twitter_media_id' => ['nullable', 'exists:media,id'],

            'schema_type' => ['nullable', 'string', 'max:60'],
            'schema_data' => ['nullable', 'array'],
            'focus_keyword' => ['nullable', 'string', 'max:191'],
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

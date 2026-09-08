<?php

namespace App\Http\Requests\Backend\Cms;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Create a locale variant of a page. `slug` and `title` are optional — the
 * service defaults them to the source page's values and the editor refines
 * them afterwards.
 */
class PageTranslationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'locale' => [
                'required',
                'string',
                'max:10',
                Rule::exists('languages', 'code'),
            ],
            'slug' => ['nullable', 'string', 'max:191'],
            'title' => ['nullable', 'string', 'max:191'],
        ];
    }
}

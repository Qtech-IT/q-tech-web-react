<?php

namespace App\Http\Requests\Backend\Cms;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * One locale's translated strings for a single content owner.
 *
 * `values` is a flat `field => string` map keyed by the dotted paths the
 * section editor emits (`heading`, `data.billing_note`, `label`). The service
 * validates each key against the registry's `translatable: true` descriptors —
 * that check cannot live here because it depends on the bound model's
 * `section_type`.
 *
 * An empty / null value is legal: it deletes the overlay row so the field
 * falls back to the default locale.
 */
class ContentTranslationRequest extends FormRequest
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
                Rule::notIn([default_locale()]),
            ],
            'values' => ['present', 'array'],
            'values.*' => ['nullable', 'string', 'max:20000'],
        ];
    }

    public function messages(): array
    {
        return [
            'locale.not_in' => 'The default language is edited on the content itself, not as a translation.',
        ];
    }

    public function locale(): string
    {
        return (string) $this->input('locale');
    }

    /**
     * @return array<string, string|null>
     */
    public function translations(): array
    {
        return (array) $this->input('values', []);
    }
}

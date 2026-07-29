<?php

namespace App\Http\Requests\Backend\Cms;

use App\Enums\Cms\MediaCollection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MediaAttachRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * `mediable_type` is constrained to the aliases permitted on this specific
     * morph column, exactly as SeoMetaSaveRequest constrains `seoable_type`.
     * The morph map is registered NON-enforcing, so it would happily accept an
     * FQCN the editor should never be able to attach to; this list is the
     * enforcement.
     *
     * `collection` is a length+charset rule rather than Rule::in on
     * MediaCollection, because a section type may declare its own slot name
     * through the registry — the enum is the core set, not a DB constraint
     * (see the enum's own docblock).
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'mediable_type' => ['required', 'string', Rule::in((array) config('morph-map.columns.mediable', []))],
            'mediable_id' => ['required', 'integer', 'min:1'],

            // Ordered: the array order IS the attachment order.
            'media_ids' => ['required', 'array', 'min:1', 'max:100'],
            'media_ids.*' => ['required', 'integer', 'exists:media,id'],

            'collection' => ['nullable', 'string', 'max:60', 'regex:/^[a-z0-9_\-]+$/'],
        ];
    }

    /**
     * Default the slot so the picker can omit it entirely.
     */
    protected function prepareForValidation(): void
    {
        if (! $this->filled('collection')) {
            $this->merge(['collection' => MediaCollection::DEFAULT->value]);
        }
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}

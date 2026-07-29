<?php

namespace App\Http\Requests\Backend\Cms;

use App\Enums\Cms\MediaCollection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MediaAttachmentReorderRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * The full ordered id list is submitted rather than a moved-item delta,
     * for the same reason SectionReorderRequest does: the server then writes
     * an absolute order and two concurrent drags cannot interleave into a
     * nonsense sequence.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'mediable_type' => ['required', 'string', Rule::in((array) config('morph-map.columns.mediable', []))],
            'mediable_id' => ['required', 'integer', 'min:1'],

            'media_ids' => ['required', 'array', 'min:1'],
            'media_ids.*' => ['required', 'integer', 'exists:media,id'],

            // Ordering is only meaningful inside one slot.
            'collection' => ['nullable', 'string', 'max:60', 'regex:/^[a-z0-9_\-]+$/'],
        ];
    }

    /**
     * Default the slot so the caller can omit it entirely.
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

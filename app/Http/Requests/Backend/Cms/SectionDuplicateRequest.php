<?php

namespace App\Http\Requests\Backend\Cms;

use Illuminate\Foundation\Http\FormRequest;

class SectionDuplicateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * The section itself arrives through route-model binding on its uuid, so
     * the only thing a caller may supply is a label for the copy. Everything
     * else about the duplicate — publish state, ordering, uuids — is decided
     * by the service and is deliberately not client-settable: a request that
     * could pass `publish_status` would let the admin UI publish a copy of a
     * live section by accident.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:191'],
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

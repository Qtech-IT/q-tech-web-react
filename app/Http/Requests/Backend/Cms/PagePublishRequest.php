<?php

namespace App\Http\Requests\Backend\Cms;

use App\Enums\Cms\ContentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Editorial state transition, one page at a time.
 *
 * Deliberately NOT a bulk action. ModelAction::authorizeBulkAction() matches
 * on ACTIVE/INACTIVE/DELETE/PERMANENT_DELETE/RESTORE and throws on anything
 * else, and adding a `publish` branch there would route editorial writes
 * through handleBulkAction()'s mass update() — no model events, no cast
 * validation, and silent ENUM coercion on a non-strict connection.
 * Bulk-publishing is dangerous enough that "one at a time, through the policy"
 * is worth more than the convenience.
 */
class PagePublishRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'publish_status' => ['required', Rule::in(ContentStatus::getValues())],
            'published_at' => ['nullable', 'date', Rule::requiredIf(
                fn (): bool => $this->input('publish_status') === ContentStatus::SCHEDULED->value
            )],
            'expires_at' => ['nullable', 'date', 'after:published_at'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'published_at.required' => translate('Choose when this content should go live.'),
            'expires_at.after' => translate('The expiry date must come after the publish date.'),
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

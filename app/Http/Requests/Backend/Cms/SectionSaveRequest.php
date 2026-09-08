<?php

namespace App\Http\Requests\Backend\Cms;

use App\Enums\Cms\ContentStatus;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Common\Status;
use App\Enums\Settings\InputEnum;
use App\Http\Services\Backend\Cms\SectionTypeRegistry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;

/**
 * Dynamic, registry-driven validation.
 *
 * Reads `section_type` from the request, asks the registry for its field
 * descriptors, and compiles data.* / settings.* rules from them.
 *
 * THEN strips every key the descriptor set does not declare. That strip is the
 * important half: without it, a crafted payload writes arbitrary keys into
 * `data`, which then flow into the React renderer. Validation alone does not
 * stop that — only the whitelist does.
 */
class SectionSaveRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $registry = app(SectionTypeRegistry::class);
        $sectionType = $this->input('section_type');

        $rules = [
            'page_id' => ['nullable', 'exists:pages,id', 'required_without:block_id'],
            'block_id' => ['nullable', 'exists:blocks,id', 'required_without:page_id'],

            'section_type' => ['required', 'string', 'max:100', Rule::in($registry->keys())],
            'name' => ['nullable', 'string', 'max:191'],
            'anchor' => ['nullable', 'string', 'max:100'],

            'eyebrow' => ['nullable', 'string', 'max:191'],
            'heading' => ['nullable', 'string', 'max:255'],
            'subheading' => ['nullable', 'string', 'max:500'],
            'body' => ['nullable', 'string'],
            'media_id' => ['nullable', 'exists:media,id'],
            'cta_id' => ['nullable', 'exists:ctas,id'],
            'secondary_cta_id' => ['nullable', 'exists:ctas,id', 'different:cta_id'],

            'data' => ['nullable', 'array'],
            'settings' => ['nullable', 'array'],

            'status' => ['required', Rule::in(Status::getValues())],
            'publish_status' => ['required', Rule::in(ContentStatus::getValues())],
            'published_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after:published_at'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];

        foreach ([FieldStore::DATA, FieldStore::SETTINGS] as $store) {
            foreach ($registry->fieldsFor($sectionType, $store) as $field) {
                $rules[$store->value.'.'.$field['name']] = $this->rulesForField($field);
            }
        }

        return $rules;
    }

    /**
     * Compile the rule list for one field descriptor: its implied rules from
     * `type`, then `required`, then whatever `rules` adds on top.
     *
     * @param  array<string, mixed>  $field
     * @return array<int, mixed>
     */
    protected function rulesForField(array $field): array
    {
        $rules = [($field['required'] ?? false) ? 'required' : 'nullable'];

        $rules = [...$rules, ...match ($field['type'] ?? null) {
            InputEnum::NUMBER->value => ['numeric'],
            InputEnum::SWITCH->value, InputEnum::BOOLEAN->value => ['boolean'],
            InputEnum::EMAIL->value => ['email'],
            InputEnum::URL->value => ['url'],
            InputEnum::DATE->value => ['date'],
            InputEnum::MULTI_SELECT->value => ['array'],
            FieldType::COLOR->value => ['string', 'max:30'],
            FieldType::ICON->value => ['string', 'max:100'],
            default => ['string'],
        }];

        if (is_array($field['options'] ?? null) && $field['options'] !== []) {
            $values = array_column($field['options'], 'value');

            if ($values !== []) {
                $rules[] = Rule::in($values);
            }
        }

        return [...$rules, ...(array) ($field['rules'] ?? [])];
    }

    /**
     * Strip data / settings down to the declared descriptor keys before the
     * payload reaches the service.
     *
     * `version` survives because the registry defaults write it and the lazy
     * data-migration hook reads it; it is never an editor field.
     */
    protected function prepareForValidation(): void
    {
        $registry = app(SectionTypeRegistry::class);
        $sectionType = $this->input('section_type');

        $dataKeys = [...$registry->allowedKeys($sectionType, FieldStore::DATA), 'version'];

        $this->merge([
            'data' => $this->stripTo($this->input('data'), $dataKeys),
            'settings' => $this->stripTo(
                $this->input('settings'),
                $registry->allowedKeys($sectionType, FieldStore::SETTINGS)
            ),
        ]);
    }

    /**
     * @param  array<int, string>  $allowed
     * @return array<string, mixed>|null
     */
    protected function stripTo(mixed $payload, array $allowed): ?array
    {
        if (! is_array($payload)) {
            return null;
        }

        return Arr::only($payload, $allowed);
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}

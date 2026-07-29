<?php

namespace App\Http\Services\Backend\Cms;

use App\Contracts\Cms\SectionTypeContract;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use InvalidArgumentException;

/**
 * Indexes every registered section type and enforces the §4.2 storage rule.
 *
 * Bound as a singleton in AppServiceProvider. The self-check runs at
 * construction in non-production environments only: it is a development
 * assertion that makes an illegal descriptor fail on the developer's first
 * local request, and it must not cost anything in production, where the same
 * check is a CI step (`cms:validate-registry`).
 */
class SectionTypeRegistry
{
    /**
     * Registered types, keyed by key().
     *
     * @var array<string, SectionTypeContract>
     */
    protected array $types = [];

    /**
     * @param  array<int, class-string<SectionTypeContract>>  $typeClasses
     */
    public function __construct(array $typeClasses = [], bool $selfCheck = false)
    {
        foreach ($typeClasses as $class) {
            $this->register(new $class);
        }

        if ($selfCheck) {
            $this->assertValid();
        }
    }

    /**
     * Add a type to the index.
     */
    public function register(SectionTypeContract $type): self
    {
        $key = $type->key();

        if (isset($this->types[$key])) {
            throw new InvalidArgumentException(
                sprintf('Duplicate section type key [%s] registered by [%s].', $key, $type::class)
            );
        }

        $this->types[$key] = $type;

        return $this;
    }

    /**
     * Every registered type.
     *
     * @return array<string, SectionTypeContract>
     */
    public function all(): array
    {
        return $this->types;
    }

    /**
     * Every registered key.
     *
     * @return array<int, string>
     */
    public function keys(): array
    {
        return array_keys($this->types);
    }

    /**
     * Whether a key is known. Callers use this rather than catching, because an
     * unknown section_type must render a fallback, never throw.
     */
    public function has(?string $key): bool
    {
        return $key !== null && isset($this->types[$key]);
    }

    /**
     * Resolve a type, or null when unknown.
     */
    public function get(?string $key): ?SectionTypeContract
    {
        return $key === null ? null : ($this->types[$key] ?? null);
    }

    /**
     * The full descriptor payload the admin section editor renders a form from.
     *
     * Shipped through the standard AppResponse::withComponent() payload
     * alongside the current row.
     *
     * @return array<string, mixed>|null
     */
    public function describe(?string $key): ?array
    {
        $type = $this->get($key);

        if (! $type instanceof SectionTypeContract) {
            return null;
        }

        return [
            'key' => $type->key(),
            'label' => $type->label(),
            'description' => $type->description(),
            'icon' => $type->icon(),
            'group' => $type->group(),
            'fields' => $type->fields(),
            'blockTypes' => $type->blockTypes(),
            'relations' => $type->relations(),
            'previewComponent' => $type->previewComponent(),
            'defaults' => $type->defaults(),
        ];
    }

    /**
     * Types grouped for the admin section picker.
     *
     * @return array<string, array<int, array<string, mixed>>>
     */
    public function grouped(): array
    {
        $grouped = [];

        foreach ($this->types as $type) {
            $grouped[$type->group()][] = [
                'key' => $type->key(),
                'label' => $type->label(),
                'description' => $type->description(),
                'icon' => $type->icon(),
            ];
        }

        return $grouped;
    }

    /**
     * Descriptors for one type filtered to a single storage target.
     *
     * SectionSaveRequest uses this to compile `data.*` / `settings.*` rules and
     * — the important half — to build the whitelist it strips the payload
     * against. Validation alone is not enough: without the strip, a crafted
     * payload writes arbitrary keys into `data`, which then flow straight into
     * the React renderer.
     *
     * @return array<int, array<string, mixed>>
     */
    public function fieldsFor(?string $key, FieldStore $store): array
    {
        $type = $this->get($key);

        if (! $type instanceof SectionTypeContract) {
            return [];
        }

        return array_values(array_filter(
            $type->fields(),
            fn (array $field): bool => ($field['store'] ?? null) === $store->value
        ));
    }

    /**
     * Permitted JSON keys for a storage target — the whitelist itself.
     *
     * @return array<int, string>
     */
    public function allowedKeys(?string $key, FieldStore $store): array
    {
        return array_column($this->fieldsFor($key, $store), 'name');
    }

    /**
     * Run the §4.2 self-check across every registered type.
     *
     * @throws InvalidArgumentException on the first violation
     */
    public function assertValid(): void
    {
        $errors = $this->validate();

        if ($errors !== []) {
            throw new InvalidArgumentException(
                "Section type registry is invalid:\n - ".implode("\n - ", $errors)
            );
        }
    }

    /**
     * Collect every rule violation without throwing, so
     * `cms:validate-registry` can report all of them at once.
     *
     * The four invariants, verbatim from the schema doc:
     *   - repeatable: true MUST pair with store: 'block'
     *   - translatable: true MUST NOT pair with store: 'settings'
     *   - type media/relation MUST NOT pair with store 'data' or 'settings'
     *   - store: 'column' is only legal for the six universal scalar names
     *
     * @return array<int, string>
     */
    public function validate(): array
    {
        $errors = [];

        foreach ($this->types as $key => $type) {
            $seen = [];

            foreach ($type->fields() as $index => $field) {
                $name = $field['name'] ?? null;
                $store = $field['store'] ?? null;
                $ftype = $field['type'] ?? null;
                $where = sprintf('[%s] field #%d (%s)', $key, $index, $name ?? 'unnamed');

                if (blank($name)) {
                    $errors[] = "{$where}: missing `name`.";

                    continue;
                }

                if (isset($seen[$name])) {
                    $errors[] = "{$where}: duplicate field name `{$name}`.";
                }
                $seen[$name] = true;

                if (! in_array($store, FieldStore::getValues(), true)) {
                    $errors[] = "{$where}: `store` must be one of ".implode('|', FieldStore::getValues()).', got `'.var_export($store, true).'`.';

                    continue;
                }

                if (! in_array($ftype, FieldType::allowedFieldTypes(), true)) {
                    $errors[] = "{$where}: unknown field `type` `".var_export($ftype, true).'`.';
                }

                // repeatable: true MUST imply store: 'block'.
                if (($field['repeatable'] ?? false) && $store !== FieldStore::BLOCK->value) {
                    $errors[] = "{$where}: `repeatable` fields must use store `block`, not `{$store}` — "
                        .'a JSON array index is not a stable translation address and cannot be reordered under a race.';
                }

                // store: 'block' MUST be repeatable — otherwise it is a scalar
                // masquerading as a repeater.
                if ($store === FieldStore::BLOCK->value && ! ($field['repeatable'] ?? false)) {
                    $errors[] = "{$where}: store `block` requires `repeatable` to be true.";
                }

                // translatable: true MUST NOT pair with store: 'settings' (I4).
                if (($field['translatable'] ?? false) && $store === FieldStore::SETTINGS->value) {
                    $errors[] = "{$where}: translatable fields may not live in `settings` — "
                        .'nothing in settings is ever returned to a translator.';
                }

                // Media (I2) and relation (I3) references may never sit in JSON.
                $isReference = in_array($ftype, [...FieldType::mediaTypes(), ...FieldType::relationTypes()], true);

                if ($isReference && in_array($store, [FieldStore::DATA->value, FieldStore::SETTINGS->value], true)) {
                    $errors[] = "{$where}: `{$ftype}` fields may not be stored in `{$store}` — "
                        .'a reference inside JSON gets no foreign key and no reverse-lookup index.';
                }

                // store: 'column' is only legal for the six universal scalars.
                if ($store === FieldStore::COLUMN->value && ! in_array($name, FieldStore::UNIVERSAL_SCALARS, true)) {
                    $errors[] = "{$where}: store `column` is only legal for the universal scalars ("
                        .implode(', ', FieldStore::UNIVERSAL_SCALARS)."), not `{$name}`.";
                }
            }

            // Every repeater must be bounded, or a paste can write thousands of
            // section_blocks rows.
            foreach ($type->blockTypes() as $blockType => $definition) {
                if (! isset($definition['max']) || ! is_int($definition['max']) || $definition['max'] < 1) {
                    $errors[] = "[{$key}] blockType `{$blockType}`: a positive integer `max` is required.";
                }
            }

            // The data-drift escape hatch (§16.2) only works if `version` was
            // written from day one.
            if (! array_key_exists('version', $type->defaults()['data'] ?? [])) {
                $errors[] = "[{$key}]: defaults()['data'] must contain a `version` key from day one — "
                    .'retrofitting it means guessing which rows predate which schema.';
            }
        }

        return $errors;
    }
}

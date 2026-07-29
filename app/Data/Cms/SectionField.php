<?php

namespace App\Data\Cms;

use App\Enums\Cms\FieldStore;

/**
 * Builder for a section-type field descriptor.
 *
 * A descriptor is a plain array — the admin form renderer consumes the same
 * shape the existing resources/js/Config/crud/ configs already do. This class
 * exists only so the required keys cannot be forgotten and the store/type
 * pairing is expressed at the call site rather than in a literal.
 */
class SectionField
{
    /**
     * Every recognised descriptor key.
     */
    public const KEYS = [
        'name',
        'label',
        'type',
        'store',
        'translatable',
        'repeatable',
        'required',
        'rules',
        'options',
        'default',
        'help',
        'group',
        'conditional',
    ];

    /**
     * Build a descriptor.
     *
     * @param  string  $name  Field key. A column name, or a JSON key within data/settings.
     * @param  string  $label  Editor label. Pass it through translate() at the call site.
     * @param  string  $type  An InputEnum value or a FieldType value.
     * @param  FieldStore  $store  Where the value is persisted. See FieldStore.
     * @param  array<int, string>  $rules  Extra Laravel rules, merged after the type's implied rules.
     * @param  array<string, mixed>|string|null  $options  Static options array or an enum class name.
     * @param  array<string, mixed>|null  $conditional  ['field' => 'layout', 'value' => 'split'].
     * @return array<string, mixed>
     */
    public static function make(
        string $name,
        string $label,
        string $type,
        FieldStore $store,
        bool $translatable = false,
        bool $repeatable = false,
        bool $required = false,
        array $rules = [],
        array|string|null $options = null,
        mixed $default = null,
        ?string $help = null,
        string $group = 'Content',
        ?array $conditional = null,
    ): array {
        return [
            'name' => $name,
            'label' => $label,
            'type' => $type,
            'store' => $store->value,
            'translatable' => $translatable,
            'repeatable' => $repeatable,
            'required' => $required,
            'rules' => $rules,
            'options' => $options,
            'default' => $default,
            'help' => $help,
            'group' => $group,
            'conditional' => $conditional,
        ];
    }
}

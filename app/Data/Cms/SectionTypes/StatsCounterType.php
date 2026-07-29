<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * Worked example #2 — the canonical repeater.
 *
 * Each stat's number and label are section_blocks rows (`value` and `label`),
 * never a JSON array: they are reordered constantly, they are translated, and
 * `value` is deliberately a string because "500+" and "24/7" are not numbers.
 */
class StatsCounterType implements SectionTypeContract
{
    public function key(): string
    {
        return 'stats.counter';
    }

    public function label(): string
    {
        return translate('Stats Counter');
    }

    public function description(): string
    {
        return translate('A row of key numbers with labels, optionally animated as they scroll into view.');
    }

    public function icon(): string
    {
        return 'trending-up';
    }

    public function group(): string
    {
        return translate('Social Proof');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function fields(): array
    {
        return [
            SectionField::make(
                name: 'eyebrow',
                label: translate('Eyebrow'),
                type: InputEnum::TEXT->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:191'],
            ),

            SectionField::make(
                name: 'heading',
                label: translate('Heading'),
                type: InputEnum::TEXT->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:255'],
            ),

            SectionField::make(
                name: 'subheading',
                label: translate('Subheading'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:500'],
            ),

            SectionField::make(
                name: 'stats',
                label: translate('Stats'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
            ),

            SectionField::make(
                name: 'footnote',
                label: translate('Footnote'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:255'],
                help: translate('Small print beneath the numbers, e.g. a measurement period.'),
            ),

            SectionField::make(
                name: 'animate',
                label: translate('Animate On Scroll'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: true,
                group: 'Layout',
            ),

            SectionField::make(
                name: 'columns',
                label: translate('Columns'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 2, 'label' => '2'],
                    ['value' => 3, 'label' => '3'],
                    ['value' => 4, 'label' => '4'],
                ],
                default: 4,
                group: 'Layout',
            ),
        ];
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function blockTypes(): array
    {
        return [
            'stat' => [
                'label' => translate('Stat'),
                'min' => 1,
                'max' => 8,
                'fields' => [
                    SectionField::make(
                        name: 'value',
                        label: translate('Value'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:191'],
                        help: translate('Stored as text so "500+" and "24/7" are both valid.'),
                    ),
                    SectionField::make(
                        name: 'label',
                        label: translate('Label'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:191'],
                    ),
                    SectionField::make(
                        name: 'description',
                        label: translate('Description'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                    ),
                    SectionField::make(
                        name: 'icon',
                        label: translate('Icon'),
                        type: FieldType::ICON->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                    ),
                ],
            ],
        ];
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function relations(): array
    {
        return [];
    }

    public function previewComponent(): string
    {
        return 'Frontend/Sections/StatsCounter';
    }

    /**
     * @return array{data: array<string, mixed>, settings: array<string, mixed>}
     */
    public function defaults(): array
    {
        return [
            'data' => [
                'version' => 1,
                'footnote' => null,
            ],
            'settings' => [
                'animate' => true,
                'columns' => 4,
            ],
        ];
    }
}

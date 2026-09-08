<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The results band — the handful of numbers a buyer checks before they read
 * anything else: projects delivered, clients, countries, users served, uptime.
 *
 * WHY THIS EXISTS ALONGSIDE `stats.counter`
 * -----------------------------------------
 * `stats.counter` is the plain worked example: a hairline grid, no cards, no
 * colour, meant to sit quietly inside another band. This one is the headline
 * treatment — coloured metric cards, a counted numeral at display scale, and
 * an accent rail per card. They are not two skins of one type because the
 * split is structural rather than cosmetic: this type carries `prefix` /
 * `suffix` as separate fields, and that changes what an editor types.
 *
 * WHY PREFIX AND SUFFIX ARE NOT PART OF THE VALUE
 * ----------------------------------------------
 * "5M+" typed into one field is a string with no numeric target, so it cannot
 * count — `StatValue::parseNumeric` gives up and renders it as typed, which is
 * exactly the right behaviour and exactly not what the editor wanted. Split
 * into `value: "5"`, `suffix: "M+"`, the numeral animates and the affixes sit
 * still beside it, which is also the only version that reads correctly: a "+"
 * that counts up with the number is a visual bug. `value` is still a string
 * column, so "24/7" remains legal and simply does not animate.
 *
 * The affixes live in `data` rather than in columns because they are never
 * queried, never sorted on, and only ever read together with the value they
 * decorate — the storage rule's default for a scalar with no index behind it.
 */
class ResultsMetricsType implements SectionTypeContract
{
    public function key(): string
    {
        return 'results.metrics';
    }

    public function label(): string
    {
        return translate('Results & Metrics');
    }

    public function description(): string
    {
        return translate('A colourful band of headline numbers that count up as they scroll into view.');
    }

    public function icon(): string
    {
        return 'gauge';
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
                label: translate('Headline'),
                type: InputEnum::TEXT->value,
                store: FieldStore::COLUMN,
                translatable: true,
                required: true,
                rules: ['max:255'],
            ),

            SectionField::make(
                name: 'heading_highlight',
                label: translate('Highlighted Words'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:255'],
                help: translate('Comma-separated words from the headline to accent. Plain text only.'),
            ),

            SectionField::make(
                name: 'subheading',
                label: translate('Subheadline'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:500'],
            ),

            SectionField::make(
                name: 'metric',
                label: translate('Metrics'),
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
                help: translate('Small print beneath the numbers, e.g. "Measured across 2019–2025."'),
            ),

            SectionField::make(
                name: 'cta_id',
                label: translate('Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('Optional. Shown beneath the metrics, e.g. "See our case studies".'),
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
                    ['value' => 5, 'label' => '5'],
                ],
                default: 5,
                group: 'Layout',
                help: translate('Five reads as one row of headline numbers on a wide screen and wraps to two on a laptop.'),
            ),

            SectionField::make(
                name: 'align',
                label: translate('Header Alignment'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'center', 'label' => translate('Centered')],
                    ['value' => 'start', 'label' => translate('Left Aligned')],
                ],
                default: 'center',
                group: 'Layout',
            ),

            SectionField::make(
                name: 'theme',
                label: translate('Section Theme'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'default', 'label' => translate('Default')],
                    ['value' => 'subtle', 'label' => translate('Subtle Band')],
                    ['value' => 'inverted', 'label' => translate('Inverted')],
                ],
                default: 'inverted',
                group: 'Layout',
            ),

            SectionField::make(
                name: 'spacing',
                label: translate('Vertical Spacing'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'sm', 'label' => translate('Compact')],
                    ['value' => 'default', 'label' => translate('Default')],
                    ['value' => 'lg', 'label' => translate('Generous')],
                ],
                default: 'default',
                group: 'Layout',
            ),

            // Separate from `animation` on purpose: an editor may want the
            // cards to arrive with the page but the numerals to stay put (or
            // the reverse). Both are ignored under `prefers-reduced-motion`.
            SectionField::make(
                name: 'animate',
                label: translate('Count Numbers Up'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: true,
                group: 'Animation',
                help: translate('Counts each numeral once, the first time it scrolls into view. Never runs for visitors who prefer reduced motion.'),
            ),

            SectionField::make(
                name: 'animation',
                label: translate('Entrance Animation'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'none', 'label' => translate('None')],
                    ['value' => 'fade', 'label' => translate('Fade In')],
                    ['value' => 'rise', 'label' => translate('Rise Up')],
                    ['value' => 'stagger', 'label' => translate('Staggered')],
                ],
                default: 'stagger',
                group: 'Animation',
            ),
        ];
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function blockTypes(): array
    {
        return [
            'metric' => [
                'label' => translate('Metric'),
                'min' => 0,
                'max' => 10,
                'fields' => [
                    SectionField::make(
                        name: 'value',
                        label: translate('Number'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:60'],
                        help: translate('The number ONLY, e.g. "50", "5" or "99.9". Put "+", "%" or "M" in the suffix below so the number can count up.'),
                    ),

                    SectionField::make(
                        name: 'prefix',
                        label: translate('Prefix'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::DATA,
                        translatable: true,
                        rules: ['max:12'],
                        help: translate('Shown before the number and never animated, e.g. "$" or "~".'),
                    ),

                    SectionField::make(
                        name: 'suffix',
                        label: translate('Suffix'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::DATA,
                        translatable: true,
                        rules: ['max:12'],
                        help: translate('Shown after the number and never animated, e.g. "+", "%" or "M+".'),
                    ),

                    SectionField::make(
                        name: 'label',
                        label: translate('Label'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:120'],
                        help: translate('e.g. "Projects Delivered", "System Availability".'),
                    ),

                    SectionField::make(
                        name: 'description',
                        label: translate('Note'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:200'],
                        help: translate('Optional single line under the label — the qualifier that keeps the claim honest.'),
                    ),

                    SectionField::make(
                        name: 'icon',
                        label: translate('Icon'),
                        type: FieldType::ICON->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('Optional. The card is complete without one.'),
                    ),

                    SectionField::make(
                        name: 'accent',
                        label: translate('Accent Colour'),
                        type: InputEnum::SELECT->value,
                        store: FieldStore::SETTINGS,
                        options: [
                            ['value' => 'brand', 'label' => translate('Brand')],
                            ['value' => 'ink', 'label' => translate('Ink')],
                            ['value' => 'amber', 'label' => translate('Amber')],
                            ['value' => 'teal', 'label' => translate('Teal')],
                            ['value' => 'violet', 'label' => translate('Violet')],
                            ['value' => 'rose', 'label' => translate('Rose')],
                        ],
                        group: 'Media',
                        help: translate('Colours this metric\'s rail and icon. Leave empty to colour it automatically by position.'),
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
        return 'Frontend/Sections/ResultsMetrics';
    }

    /**
     * @return array{data: array<string, mixed>, settings: array<string, mixed>}
     */
    public function defaults(): array
    {
        return [
            'data' => [
                'version' => 1,
                'heading_highlight' => null,
                'footnote' => null,
            ],
            'settings' => [
                'columns' => 5,
                'align' => 'center',
                'theme' => 'inverted',
                'spacing' => 'default',
                'animate' => true,
                'animation' => 'stagger',
            ],
        ];
    }
}

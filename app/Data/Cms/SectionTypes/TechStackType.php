<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The tech-stack band — one card per layer of the stack, each holding a
 * wrapped row of the technologies the team actually uses there.
 *
 * WHY CATEGORIES ARE THE REPEATER AND TOOLS ARE A STRING
 * -----------------------------------------------------
 * The obvious modelling — one repeater row per technology, nested under a
 * category — buys nothing an editor wants and costs a nested drag-and-drop
 * for every "we added Redis". A tool is never reordered on its own, carries
 * no image, no link and no state, and a translator wants to see the whole row
 * at once. So the CATEGORY is the row (it has an icon, a colour and an order
 * that matters) and its tools are one comma-separated field on it — the same
 * call, for the same reasons, as `ServiceGridType::tags`.
 *
 * Deliberately no logos: a wall of third-party trademarks is a licensing
 * question, needs an asset per tool, and breaks the moment a brand refreshes.
 * Set in type, the same list is one field to edit and correct in every theme.
 */
class TechStackType implements SectionTypeContract
{
    public function key(): string
    {
        return 'tech.stack';
    }

    public function label(): string
    {
        return translate('Tech Stack');
    }

    public function description(): string
    {
        return translate('A grid of stack layers — icon, layer name and the technologies used there, shown as pills.');
    }

    public function icon(): string
    {
        return 'cpu';
    }

    public function group(): string
    {
        return translate('Services');
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
                name: 'layer',
                label: translate('Stack Layers'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
            ),

            SectionField::make(
                name: 'cta_id',
                label: translate('Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('Optional. Shown beneath the layers, e.g. "How we choose a stack".'),
            ),

            SectionField::make(
                name: 'columns',
                label: translate('Columns'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 2, 'label' => '2'],
                    ['value' => 3, 'label' => '3'],
                ],
                default: 2,
                group: 'Layout',
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
                default: 'default',
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
            'layer' => [
                'label' => translate('Stack Layer'),
                'min' => 0,
                'max' => 8,
                'fields' => [
                    SectionField::make(
                        name: 'label',
                        label: translate('Layer'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:80'],
                        help: translate('e.g. "Front-end", "Data & AI", "Infrastructure".'),
                    ),

                    // The list of tools. Comma-separated, never markup — the
                    // same guard every pill row in this registry uses.
                    SectionField::make(
                        name: 'items',
                        label: translate('Technologies'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::DATA,
                        translatable: true,
                        rules: ['max:500'],
                        help: translate('Comma-separated, e.g. "React, TypeScript, Tailwind, Vite". Shown as pills, in this order.'),
                    ),

                    SectionField::make(
                        name: 'description',
                        label: translate('Note'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:200'],
                        help: translate('Optional single line under the layer name.'),
                    ),

                    SectionField::make(
                        name: 'icon',
                        label: translate('Icon'),
                        type: FieldType::ICON->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('Falls back to a generic mark if left empty.'),
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
                        help: translate('Colours this layer\'s icon and pill borders. Leave empty to colour it automatically by position.'),
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
        return 'Frontend/Sections/TechStack';
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
            ],
            'settings' => [
                'columns' => 2,
                'align' => 'center',
                'theme' => 'default',
                'spacing' => 'default',
                'animation' => 'stagger',
            ],
        ];
    }
}

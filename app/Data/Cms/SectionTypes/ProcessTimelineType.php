<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The process band — a statement and a picture on one side, a numbered
 * timeline of steps on the other, joined by a dashed rule with a marked node
 * at every step.
 *
 * WHY A TIMELINE AND NOT ANOTHER CARD GRID
 * ----------------------------------------
 * Every other repeater section in this registry renders a SET: order is an
 * editor's preference and a visitor can read the items in any sequence. A
 * process is the one thing on a marketing site where order IS the content —
 * step three means nothing before step two — so the rows are numbered, the
 * markup is an ordered list, and the vertical rule exists to say "these
 * follow each other" before a word is read.
 *
 * STORAGE
 * -------
 * `step` is a repeater (§4.2 step 1). Title, description and icon are real
 * `section_blocks` columns; the accent is presentation-only. The step NUMBER
 * is never stored — it is the row's position, so reordering in the admin
 * renumbers the timeline and an editor can never leave a "Step 4, Step 2,
 * Step 3" behind them.
 */
class ProcessTimelineType implements SectionTypeContract
{
    public function key(): string
    {
        return 'process.timeline';
    }

    public function label(): string
    {
        return translate('Our Process');
    }

    public function description(): string
    {
        return translate('A headline, paragraph, button and image on one side; a numbered timeline of steps on the other.');
    }

    public function icon(): string
    {
        return 'list-checks';
    }

    public function group(): string
    {
        return translate('Process');
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
                help: translate('Shown as a small outlined pill above the headline, e.g. "How It Works".'),
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
                label: translate('Paragraph'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:500'],
            ),

            SectionField::make(
                name: 'media_id',
                label: translate('Image'),
                type: FieldType::MEDIA->value,
                store: FieldStore::COLUMN,
                group: 'Media',
                help: translate('Shown beneath the button in a 4:5 frame. Optional — the column simply ends after the button if there is no image.'),
            ),

            SectionField::make(
                name: 'cta_id',
                label: translate('Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('e.g. "Get Started".'),
            ),

            SectionField::make(
                name: 'step',
                label: translate('Steps'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
            ),

            // The word in front of the number. Translatable because "Step" is
            // not a word in every language a page might be published in, and a
            // field because some processes call them phases or sprints.
            SectionField::make(
                name: 'step_label',
                label: translate('Step Word'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:40'],
                group: 'Layout',
                help: translate('Printed before each number, e.g. "Step". Leave empty to show just the number.'),
            ),

            SectionField::make(
                name: 'media_side',
                label: translate('Image Side'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'left', 'label' => translate('Copy and image left, steps right')],
                    ['value' => 'right', 'label' => translate('Steps left, copy and image right')],
                ],
                default: 'left',
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
                help: translate('Maps to the Section component background variants.'),
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
                default: 'lg',
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
            'step' => [
                'label' => translate('Step'),
                'min' => 0,
                'max' => 8,
                'fields' => [
                    SectionField::make(
                        name: 'label',
                        label: translate('Title'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:120'],
                        help: translate('What happens at this step, e.g. "Discovery & Scope". The number is added automatically from the row order.'),
                    ),

                    SectionField::make(
                        name: 'description',
                        label: translate('Description'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:400'],
                    ),

                    SectionField::make(
                        name: 'icon',
                        label: translate('Icon'),
                        type: FieldType::ICON->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('Sits in the marker on the timeline. Falls back to the step number if left empty.'),
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
                        help: translate('Colours this step\'s marker and its number. Leave empty to colour it automatically by position.'),
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
        return 'Frontend/Sections/ProcessTimeline';
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
                'step_label' => 'Step',
            ],
            'settings' => [
                'media_side' => 'left',
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ];
    }
}

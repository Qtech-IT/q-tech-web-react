<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The solutions band — a small set of packaged offers, each with what it is,
 * who it is for, and the two or three things it actually delivers.
 *
 * HOW THIS DIFFERS FROM THE SERVICE SECTIONS
 * ------------------------------------------
 * A service is a discipline the team practises ("front-end engineering"); a
 * solution is a packaged outcome someone can buy ("launch an MVP in twelve
 * weeks"). That difference is the whole reason this type exists rather than
 * another `columns` option on `service.grid`: a solution card has to carry a
 * short list of what is included, which a discipline card never does, and it
 * is read as an offer rather than as a capability.
 *
 * STORAGE
 * -------
 * `solution` is a repeater (§4.2 step 1). Title, description, icon, image and
 * link are real `section_blocks` columns; the bullet list is a translatable
 * comma-separated string in `data` (the same shape, and the same no-markup
 * guard, as `ServiceGridType::tags`); the accent is presentation-only.
 */
class SolutionGridType implements SectionTypeContract
{
    public function key(): string
    {
        return 'solution.grid';
    }

    public function label(): string
    {
        return translate('Solutions');
    }

    public function description(): string
    {
        return translate('A grid of packaged solutions — icon, title, summary and a short list of what is included.');
    }

    public function icon(): string
    {
        return 'rocket';
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
                name: 'solution',
                label: translate('Solutions'),
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
                help: translate('Optional. Shown beneath the cards.'),
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
                default: 3,
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
                default: 'subtle',
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
            'solution' => [
                'label' => translate('Solution'),
                'min' => 0,
                'max' => 9,
                'fields' => [
                    SectionField::make(
                        name: 'label',
                        label: translate('Title'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:120'],
                        help: translate('The offer, e.g. "MVP Launch Programme".'),
                    ),

                    SectionField::make(
                        name: 'description',
                        label: translate('Summary'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:300'],
                        help: translate('Who it is for and what it does, in one or two sentences.'),
                    ),

                    // A comma-separated string, NOT markup and NOT a nested
                    // repeater: three bullets are never reordered on their own
                    // and a translator wants the whole list in one field.
                    SectionField::make(
                        name: 'points',
                        label: translate('Included'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::DATA,
                        translatable: true,
                        rules: ['max:400'],
                        help: translate('Comma-separated bullets shown with a tick, e.g. "Discovery, Design system, Two-week releases".'),
                    ),

                    SectionField::make(
                        name: 'icon',
                        label: translate('Icon'),
                        type: FieldType::ICON->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('Falls back to the card image, then to a generic mark, if left empty.'),
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
                        help: translate('Tints the card and colours its icon and ticks. Leave empty to colour it automatically by position.'),
                    ),

                    SectionField::make(
                        name: 'media_id',
                        label: translate('Icon Image'),
                        type: FieldType::MEDIA->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('Optional. Use instead of the icon for a custom mark.'),
                    ),

                    SectionField::make(
                        name: 'cta_id',
                        label: translate('Card Link'),
                        type: FieldType::CTA->value,
                        store: FieldStore::COLUMN,
                        group: 'Conversion',
                        help: translate('Optional. When set, the whole card becomes clickable and this label appears at the foot of it.'),
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
        return 'Frontend/Sections/SolutionGrid';
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
                'columns' => 3,
                'align' => 'center',
                'theme' => 'subtle',
                'spacing' => 'default',
                'animation' => 'stagger',
            ],
        ];
    }
}

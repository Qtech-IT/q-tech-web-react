<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * A grid of capability cards — "every discipline we cover", each with an
 * icon, a title, a description and a handful of tag pills.
 *
 * The tag list follows `HeroSplitType::$heading_highlight`'s precedent: a
 * plain comma-separated string rather than a second, nested repeater. A tag
 * is never reordered on its own, never carries an icon or a link, and a
 * translator wants to see the whole pill row — "Front-End, React, Angular" —
 * in one field, not scattered across N single-word `section_blocks` rows.
 * That makes it `data` on the block: translatable, but not one-of-many with
 * editor-controlled order, so step 1 of the §4.2 rule does not apply.
 */
class ServiceGridType implements SectionTypeContract
{
    public function key(): string
    {
        return 'service.grid';
    }

    public function label(): string
    {
        return translate('Service Grid');
    }

    public function description(): string
    {
        return translate('A heading with a "see all" link, followed by a grid of capability cards — icon, title, description and tag pills.');
    }

    public function icon(): string
    {
        return 'layout-grid';
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
                help: translate('Small kicker line above the headline.'),
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
                name: 'subheading',
                label: translate('Subheadline'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:500'],
            ),

            // Rendered as a plain text link ("Everything we do →"), not a
            // button — the admin CTA editor's `variant` select already offers
            // `link`, so no extra field is needed to choose the treatment.
            SectionField::make(
                name: 'cta_id',
                label: translate('"See All" Link'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('Optional. Set the button style to "Link" for the text-link treatment shown beside the headline.'),
            ),

            // Step 1: more than one, editor-ordered -> a section_blocks row.
            // The name is singular and must equal the blockTypes() key below.
            SectionField::make(
                name: 'service',
                label: translate('Services'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
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
                default: 3,
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
            'service' => [
                'label' => translate('Service Card'),
                'min' => 0,
                'max' => 12,
                'fields' => [
                    SectionField::make(
                        name: 'label',
                        label: translate('Title'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:120'],
                        help: translate('e.g. "Front-End Development".'),
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
                        help: translate('Falls back to the card image, then to a generic mark, if left empty.'),
                    ),

                    // The icon TILE colour, not the glyph. A select over a
                    // fixed palette rather than a colour picker: the six
                    // options are the only fills the design system has an ink
                    // token for, so an editor cannot land on a tile whose
                    // glyph fails contrast, and cannot drift the page away
                    // from one coherent set of hues.
                    //
                    // Deliberately NO default. A default would make every card
                    // one colour until an editor changed each of them by hand,
                    // which is the exact failure this field exists to prevent.
                    // Left empty, the renderer cycles the palette by card
                    // position (`ACCENT_CYCLE` in `ServiceGrid.tsx`), so an
                    // untouched grid already reads as a set of distinct marks.
                    SectionField::make(
                        name: 'accent',
                        label: translate('Icon Colour'),
                        type: InputEnum::SELECT->value,
                        store: FieldStore::DATA,
                        options: [
                            ['value' => 'brand', 'label' => translate('Brand')],
                            ['value' => 'ink', 'label' => translate('Ink')],
                            ['value' => 'amber', 'label' => translate('Amber')],
                            ['value' => 'teal', 'label' => translate('Teal')],
                            ['value' => 'violet', 'label' => translate('Violet')],
                            ['value' => 'rose', 'label' => translate('Rose')],
                        ],
                        group: 'Media',
                        help: translate('Colour of the icon tile. Leave empty to colour it automatically by the card\'s position in the grid.'),
                    ),

                    SectionField::make(
                        name: 'media_id',
                        label: translate('Icon Image'),
                        type: FieldType::MEDIA->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('Optional. Use instead of the icon for a custom mark.'),
                    ),

                    // A plain comma-separated string, NOT markup: the same
                    // guard as HeroSplitType::heading_highlight applies — an
                    // editor must never be able to smuggle HTML into a pill.
                    SectionField::make(
                        name: 'tags',
                        label: translate('Tags'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::DATA,
                        translatable: true,
                        rules: ['max:255'],
                        help: translate('Comma-separated pills shown under the description, e.g. "React, TypeScript, Next.js".'),
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
        return 'Frontend/Sections/ServiceGrid';
    }

    /**
     * @return array{data: array<string, mixed>, settings: array<string, mixed>}
     */
    public function defaults(): array
    {
        return [
            'data' => [
                'version' => 1,
            ],
            'settings' => [
                'columns' => 3,
                'theme' => 'default',
                'spacing' => 'default',
                'animation' => 'stagger',
            ],
        ];
    }
}

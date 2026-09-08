<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The industries band — a staggered stack of sector cards on one side, a
 * statement and a call to action on the other, and an outlined word set
 * vertically between the two.
 *
 * HOW THIS DIFFERS FROM THE OTHER CARD SECTIONS
 * ---------------------------------------------
 * `service.grid` is a catalogue and `service.featured` is a pitch; both put
 * their cards under a header, in one full-width run. This one is a SPLIT: the
 * cards are the evidence and the copy beside them is the argument, and the
 * two are read together rather than in sequence. That is why the cards here
 * are deliberately small and offset — they are a texture that says "many
 * sectors", not a list anyone is meant to compare item by item.
 *
 * STORAGE
 * -------
 * `industry` is a repeater (§4.2 step 1). Title, description, icon, image and
 * link are real `section_blocks` columns; `heading_highlight` and the vertical
 * `watermark` are translatable JSON on the section; the per-card accent and
 * the layout choices are presentation-only (`settings`).
 */
class IndustryServeType implements SectionTypeContract
{
    public function key(): string
    {
        return 'industry.serve';
    }

    public function label(): string
    {
        return translate('Industries We Serve');
    }

    public function description(): string
    {
        return translate('A staggered stack of industry cards beside a headline, a paragraph and a call to action, with an outlined word set vertically between them.');
    }

    public function icon(): string
    {
        return 'building-2';
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

            // Plain text only, matched against the headline at render time.
            // Same field, same guard and same helper as `HeroSplitType` and
            // `ServiceFeatureType`: an editor must never be able to put markup
            // into a headline.
            SectionField::make(
                name: 'heading_highlight',
                label: translate('Highlighted Words'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:255'],
                help: translate('Comma-separated words from the headline to accent, e.g. "We Serve". Plain text only.'),
            ),

            SectionField::make(
                name: 'subheading',
                label: translate('Paragraph'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:600'],
                help: translate('The body copy beside the cards. Two or three sentences.'),
            ),

            // A real field rather than a hardcoded flourish: it is a WORD, so
            // it is translatable, and a section that cannot change it would
            // read "Services" on an industries page in every language forever.
            // Left empty the rule simply does not render.
            SectionField::make(
                name: 'watermark',
                label: translate('Vertical Word'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:40'],
                group: 'Layout',
                help: translate('Outlined word set vertically between the cards and the copy, e.g. "Services". Shown on large screens only. Leave empty to omit it.'),
            ),

            SectionField::make(
                name: 'cta_id',
                label: translate('Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('The main action beneath the paragraph, e.g. "Let\'s Talk".'),
            ),

            // Rendered as a line of accent text above the button, not as a
            // second button: two buttons of equal weight side by side is how a
            // section ends up with no primary action at all.
            SectionField::make(
                name: 'secondary_cta_id',
                label: translate('Text Link'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('Optional quiet link shown above the button, e.g. "Interested? Share your idea."'),
            ),

            SectionField::make(
                name: 'industry',
                label: translate('Industries'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
            ),

            SectionField::make(
                name: 'content_side',
                label: translate('Copy Side'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'right', 'label' => translate('Cards left, copy right')],
                    ['value' => 'left', 'label' => translate('Copy left, cards right')],
                ],
                default: 'right',
                group: 'Layout',
            ),

            SectionField::make(
                name: 'columns',
                label: translate('Card Columns'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 2, 'label' => '2'],
                    ['value' => 3, 'label' => '3'],
                ],
                default: 2,
                group: 'Layout',
                help: translate('How many columns the card stack uses on a large screen.'),
            ),

            SectionField::make(
                name: 'offset',
                label: translate('Stagger The Columns'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: true,
                group: 'Layout',
                help: translate('Drops every second column so the stack reads as a texture rather than a table. Turn off for a plain aligned grid.'),
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
            'industry' => [
                'label' => translate('Industry'),
                'min' => 0,
                'max' => 12,
                'fields' => [
                    SectionField::make(
                        name: 'label',
                        label: translate('Industry'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:80'],
                        help: translate('e.g. "Retail & eCommerce". These cards are narrow — two or three words.'),
                    ),

                    SectionField::make(
                        name: 'description',
                        label: translate('Description'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:200'],
                        help: translate('One short sentence. Anything longer makes the cards uneven.'),
                    ),

                    SectionField::make(
                        name: 'icon',
                        label: translate('Icon'),
                        type: FieldType::ICON->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('Falls back to the card image, then to a generic mark, if left empty.'),
                    ),

                    // The mark here is the bare glyph in the hue with a bloom
                    // behind it — no tile. `service.grid` fills a tile,
                    // `service.featured` floats a tinted one; this one drops
                    // the container entirely, so three sections can share one
                    // palette without looking like one component repeated.
                    //
                    // No default, as everywhere this palette is used: a single
                    // default hue would make every card identical until an
                    // editor changed each one. Left empty, the renderer cycles
                    // it by position.
                    SectionField::make(
                        name: 'accent',
                        label: translate('Icon Colour'),
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
                        help: translate('Colour of the icon and its glow. Leave empty to colour it automatically by the card\'s position.'),
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
                        help: translate('Optional. When set, the whole card becomes clickable. The label is not shown — the card itself is the link.'),
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
        return 'Frontend/Sections/IndustryServe';
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
                'watermark' => null,
            ],
            'settings' => [
                'content_side' => 'right',
                'columns' => 2,
                'offset' => true,
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ];
    }
}

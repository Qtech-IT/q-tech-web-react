<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The featured-services band — a centered statement with one emphasised word,
 * a row of cards whose icon marks float clear of the card's top corner, and a
 * single call to action beneath the row.
 *
 * HOW THIS DIFFERS FROM `service.grid`
 * ------------------------------------
 * `service.grid` is the CATALOGUE: left-aligned, a "see all" link, tag pills,
 * up to twelve disciplines, built to be scanned. This is the PITCH: four
 * things, centered, each with its own read-more, and one button at the end
 * asking for the meeting. A page uses one or the other — the catalogue on a
 * services page, this on a homepage — and the two exist separately because
 * collapsing them into one type would mean a settings matrix where half the
 * combinations are compositions nobody wants.
 *
 * STORAGE
 * -------
 * `service` is a repeater (§4.2 step 1). Title, description, icon, image and
 * link are real `section_blocks` columns; `heading_highlight` is translatable
 * JSON on the section (the same field, and the same plain-text-only guard, as
 * `HeroSplitType`); the per-card accent is presentation-only (`settings`).
 */
class ServiceFeatureType implements SectionTypeContract
{
    public function key(): string
    {
        return 'service.featured';
    }

    public function label(): string
    {
        return translate('Featured Services');
    }

    public function description(): string
    {
        return translate('A centered headline with an emphasised word, a row of service cards with floating icon marks, and one button beneath them.');
    }

    public function icon(): string
    {
        return 'sparkles';
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

            // Plain text only, matched against the headline at render time —
            // an editor must never be able to put markup in a headline, so
            // this is a list of words rather than a rich-text field. Same
            // field and same helper as `HeroSplitType`.
            SectionField::make(
                name: 'heading_highlight',
                label: translate('Highlighted Words'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:255'],
                help: translate('Comma-separated words from the headline to accent, e.g. "Services". Plain text only.'),
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
                name: 'service',
                label: translate('Services'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
            ),

            // Beneath the row, not beside the headline: this section's job is
            // to end in one action, and a link parked next to the title would
            // give the reader somewhere to leave before they have read the
            // cards.
            SectionField::make(
                name: 'cta_id',
                label: translate('Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('Shown centered beneath the cards, e.g. "Hire Us Today".'),
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
            'service' => [
                'label' => translate('Service Card'),
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
                        help: translate('Keep it to two or three words — the cards sit side by side and a long title wraps to three lines.'),
                    ),

                    SectionField::make(
                        name: 'description',
                        label: translate('Description'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:240'],
                        help: translate('One or two lines. This is a summary, not the service page.'),
                    ),

                    SectionField::make(
                        name: 'icon',
                        label: translate('Icon'),
                        type: FieldType::ICON->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('Falls back to the card image, then to a generic mark, if left empty.'),
                    ),

                    // The mark here is a TINT plus a coloured glyph, not a
                    // solid fill like `service.grid`'s — the same palette
                    // spent a lighter way, so the two sections read as one
                    // family without looking like the same component.
                    //
                    // No default, for the reason the other sections that use
                    // this palette have none: one default hue would make every
                    // mark identical until an editor changed each of them by
                    // hand. Left empty, the renderer cycles by position.
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
                        help: translate('Colour of the icon mark and its glow. Leave empty to colour it automatically by the card\'s position.'),
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
                        label: translate('"Read More" Link'),
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
        return 'Frontend/Sections/ServiceFeature';
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
                'columns' => 4,
                'align' => 'center',
                'theme' => 'subtle',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ];
    }
}

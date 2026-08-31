<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The reasons band — "why choose us" — as a scattered set of tilted cards,
 * each with a floating disc above it and a tinted panel inside.
 *
 * HOW THIS DIFFERS FROM THE OTHER CARD SECTIONS
 * ---------------------------------------------
 * Every other card section in the registry is an INVENTORY: disciplines,
 * solutions, sectors, stack layers — sets a visitor reads to find the item
 * that applies to them. This one is an ARGUMENT. Nobody scans four reasons
 * looking for a particular reason; they take an impression. That is why the
 * cards here are deliberately loose — staggered, tilted, no list, no link —
 * and why the type has no column count beyond two: the composition IS the
 * message, and a tidy four-up grid of it would say something duller.
 *
 * STORAGE
 * -------
 * `reason` is a repeater (§4.2 step 1). Title, description, icon and image
 * are real `section_blocks` columns; the accent is presentation-only. There
 * is no per-card link on purpose — a reason is not a destination.
 */
class WhyChooseType implements SectionTypeContract
{
    public function key(): string
    {
        return 'why.choose';
    }

    public function label(): string
    {
        return translate('Why Choose Us');
    }

    public function description(): string
    {
        return translate('A centered headline over a scattered set of tilted reason cards, each with a floating disc and a tinted panel.');
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
            ),

            SectionField::make(
                name: 'heading',
                label: translate('Headline'),
                type: InputEnum::TEXT->value,
                store: FieldStore::COLUMN,
                translatable: true,
                required: true,
                rules: ['max:255'],
                help: translate('e.g. "Why Choose QTEHUB?"'),
            ),

            SectionField::make(
                name: 'heading_highlight',
                label: translate('Highlighted Words'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:255'],
                help: translate('Comma-separated words from the headline to accent, e.g. "Choose". Plain text only.'),
            ),

            SectionField::make(
                name: 'subheading',
                label: translate('Subheadline'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:400'],
                help: translate('One line under the headline.'),
            ),

            SectionField::make(
                name: 'reason',
                label: translate('Reasons'),
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
                help: translate('Optional. Shown centered beneath the cards.'),
            ),

            // The signature of the composition, and therefore a switch rather
            // than a hardcoded flourish: a page that has to stay sober (a
            // policy page, a client-facing microsite) turns it off and gets
            // the same content as a plain grid.
            SectionField::make(
                name: 'tilt',
                label: translate('Tilt The Cards'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: true,
                group: 'Layout',
                help: translate('Rotates each card a degree or two and staggers the columns. Turn off for a plain aligned grid.'),
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
            'reason' => [
                'label' => translate('Reason'),
                'min' => 0,
                'max' => 6,
                'fields' => [
                    SectionField::make(
                        name: 'label',
                        label: translate('Title'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:80'],
                        help: translate('One or two words, e.g. "Expertise".'),
                    ),

                    SectionField::make(
                        name: 'description',
                        label: translate('Description'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:240'],
                        help: translate('Two or three lines. These cards sit at an angle — anything longer is hard to read.'),
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
                        help: translate('Colours the floating disc, the inner panel and the icon. Leave empty to colour it automatically by position.'),
                    ),

                    SectionField::make(
                        name: 'media_id',
                        label: translate('Icon Image'),
                        type: FieldType::MEDIA->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('Optional. Use instead of the icon for a custom mark.'),
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
        return 'Frontend/Sections/WhyChoose';
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
                'tilt' => true,
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ];
    }
}

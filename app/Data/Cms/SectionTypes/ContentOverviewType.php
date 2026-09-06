<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The service overview band — the professional statement that opens a service
 * page: a headline and an argument for why this discipline matters, set beside
 * a grid of the capabilities that make up the offer, with an optional
 * supporting visual.
 *
 * WHY THIS EXISTS
 * ---------------
 * A service page needs two or three paragraphs of genuine argument — "why
 * performance is a feature you have to defend" — and that used to live in a
 * `content.prose` rich-text band. The editor stored its own utility classes
 * into that HTML, the public renderer stripped them, and the result never
 * matched what the editor showed. This band removes the rich text entirely:
 * the argument is a plain textarea split into paragraphs on blank lines (the
 * `about.story` rule), and the structure a designer wants — the capability
 * cards, the emphasised headline word, the visual — is expressed as real
 * fields that render in the site's own design every time.
 *
 * HOW THIS DIFFERS FROM THE OTHER SERVICE BANDS
 * --------------------------------------------
 *   - `service.grid` is the CATALOGUE of disciplines across the whole agency.
 *   - `service.featured` is the PITCH — four cards and one button on a home page.
 *   - `why.choose` is the ARGUMENT FOR THE AGENCY, not for a discipline.
 *   - THIS is the opening of ONE service page: the case for the discipline
 *     plus the specific capabilities that page is selling.
 *
 * STORAGE
 * -------
 * `pillar` is a repeater (§4.2 step 1) — title, description and icon are real
 * `section_blocks` columns, the per-card accent is presentation-only. The
 * emphasised headline word is translatable JSON on the section, the same
 * plain-text-only field `HeroSplitType` uses.
 */
class ContentOverviewType implements SectionTypeContract
{
    public function key(): string
    {
        return 'content.overview';
    }

    public function label(): string
    {
        return translate('Overview');
    }

    public function description(): string
    {
        return translate('The opening statement of a service, industry or technology page — a headline and argument beside a grid of capability cards, with an optional image. Structured, on-brand fields in place of a free-text section.');
    }

    public function icon(): string
    {
        return 'layout-panel-left';
    }

    public function group(): string
    {
        return translate('Content');
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
                help: translate('Small kicker line above the headline, e.g. the service name.'),
            ),

            SectionField::make(
                name: 'heading',
                label: translate('Headline'),
                type: InputEnum::TEXT->value,
                store: FieldStore::COLUMN,
                translatable: true,
                required: true,
                rules: ['max:200'],
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
                label: translate('Lead Paragraph'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:600'],
                help: translate('Set larger than the body. The sentence somebody skimming the page will read.'),
            ),

            SectionField::make(
                name: 'body',
                label: translate('Argument'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:3000'],
                help: translate('Two or three short paragraphs making the case for this service. Separate paragraphs with a blank line. Plain text — no formatting, no HTML.'),
            ),

            SectionField::make(
                name: 'media_id',
                label: translate('Supporting Image'),
                type: FieldType::MEDIA->value,
                store: FieldStore::COLUMN,
                group: 'Media',
                help: translate('Optional. A product shot or diagram shown beside the argument on the Split layout, or beneath it on Stacked.'),
            ),

            SectionField::make(
                name: 'media_caption',
                label: translate('Image Caption'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:255'],
                group: 'Media',
            ),

            SectionField::make(
                name: 'cta_id',
                label: translate('Primary Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('Optional. Shown beneath the capability cards.'),
            ),

            SectionField::make(
                name: 'secondary_cta_id',
                label: translate('Secondary Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('Optional. A lower-emphasis action beside the primary button.'),
            ),

            SectionField::make(
                name: 'pillar',
                label: translate('Capabilities'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
            ),

            SectionField::make(
                name: 'layout',
                label: translate('Layout'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'split', 'label' => translate('Split (argument and cards side by side)')],
                    ['value' => 'stacked', 'label' => translate('Stacked (argument above the cards)')],
                ],
                default: 'split',
                group: 'Layout',
                help: translate('Split reads as a premium two-column band on desktop. Stacked suits a short argument with many cards.'),
            ),

            SectionField::make(
                name: 'pillar_columns',
                label: translate('Capability Columns'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => '2', 'label' => '2'],
                    ['value' => '3', 'label' => '3'],
                ],
                default: '2',
                group: 'Layout',
                help: translate('Applies on the Stacked layout, and on Split at the widest breakpoint.'),
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
            'pillar' => [
                'label' => translate('Capability'),
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
                        rules: ['max:120'],
                        help: translate('Two to four words, e.g. "Realtime data pipelines".'),
                    ),

                    SectionField::make(
                        name: 'description',
                        label: translate('Description'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:260'],
                        help: translate('One or two lines on what this covers.'),
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
                        help: translate('Leave empty to colour it automatically by the card\'s position.'),
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
        return 'Frontend/Sections/ContentOverview';
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
                'media_caption' => null,
            ],
            'settings' => [
                'layout' => 'split',
                'pillar_columns' => '2',
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ];
    }
}

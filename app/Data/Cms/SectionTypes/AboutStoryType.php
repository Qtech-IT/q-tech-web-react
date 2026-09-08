<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The about band — who the company is, beside one image, with a short row of
 * facts underneath.
 *
 * WHY THE FACTS ARE ONE REPEATER AND NOT TWO
 * ------------------------------------------
 * Draft after draft of an about section grows the same two things: dated
 * milestones ("Founded 2016") and values ("Senior by default"). They look
 * like different content and they are not — both are a short label with an
 * optional lead value and an optional sentence, and splitting them into two
 * repeaters would double the admin form to change nothing an editor sees. One
 * `highlight` row renders as a stat when it has a `value` and as a value card
 * when it does not.
 *
 * WHY `body` IS A TEXTAREA AND NOT RICH TEXT
 * ------------------------------------------
 * The story is two or three paragraphs; blank lines split them. Rich text here
 * would let an editor paste a heading into the middle of a section that
 * already owns its heading level, which is how a page's outline breaks in a
 * way nobody notices until an audit.
 */
class AboutStoryType implements SectionTypeContract
{
    public function key(): string
    {
        return 'about.story';
    }

    public function label(): string
    {
        return translate('About Us');
    }

    public function description(): string
    {
        return translate('The company story beside one image, with a row of milestones or values beneath it.');
    }

    public function icon(): string
    {
        return 'building-2';
    }

    public function group(): string
    {
        return translate('Company');
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
                label: translate('Lead Paragraph'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:500'],
                help: translate('The one paragraph somebody skimming will read. Keep it to two sentences.'),
            ),

            SectionField::make(
                name: 'body',
                label: translate('Story'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:2000'],
                help: translate('Plain text. Separate paragraphs with a blank line.'),
            ),

            SectionField::make(
                name: 'media_id',
                label: translate('Image'),
                type: FieldType::MEDIA->value,
                store: FieldStore::COLUMN,
                group: 'Media',
                help: translate('The team, the studio, the work. Optional — without one the story runs full width.'),
            ),

            SectionField::make(
                name: 'highlight',
                label: translate('Milestones & Values'),
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
            ),

            SectionField::make(
                name: 'cta_id',
                label: translate('Primary Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
            ),

            SectionField::make(
                name: 'secondary_cta_id',
                label: translate('Secondary Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
            ),

            SectionField::make(
                name: 'layout',
                label: translate('Image Position'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'end', 'label' => translate('Right Of The Story')],
                    ['value' => 'start', 'label' => translate('Left Of The Story')],
                ],
                default: 'end',
                group: 'Layout',
                help: translate('Ignored on phones, where the image always leads.'),
            ),

            SectionField::make(
                name: 'media_shape',
                label: translate('Image Shape'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'portrait', 'label' => translate('Portrait (4:5)')],
                    ['value' => 'square', 'label' => translate('Square')],
                    ['value' => 'landscape', 'label' => translate('Landscape (4:3)')],
                ],
                default: 'portrait',
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
            'highlight' => [
                'label' => translate('Milestone Or Value'),
                'min' => 0,
                'max' => 8,
                'fields' => [
                    SectionField::make(
                        name: 'value',
                        label: translate('Lead Value'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:40'],
                        help: translate('Optional, e.g. "2016" or "60+". Leave empty and the row renders as a value rather than a statistic.'),
                    ),

                    SectionField::make(
                        name: 'label',
                        label: translate('Label'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:120'],
                    ),

                    SectionField::make(
                        name: 'description',
                        label: translate('Note'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:200'],
                    ),

                    SectionField::make(
                        name: 'icon',
                        label: translate('Icon'),
                        type: FieldType::ICON->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('Shown only on rows with no lead value — a number and a glyph competing in one small box reads as neither.'),
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
                        help: translate('Leave empty to colour it automatically by position.'),
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
        return 'Frontend/Sections/AboutStory';
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
                'layout' => 'end',
                'media_shape' => 'portrait',
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ];
    }
}

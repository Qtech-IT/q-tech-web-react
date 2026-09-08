<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * One chapter of a case study — the constraint, the build, or the result.
 *
 * WHY THIS EXISTS
 * ---------------
 * A case study detail page used to tell its story in three `content.prose`
 * bands ("The Problem", "What We Built", "What Happened Next") plus a
 * `content.split` for the deliverables list. Every one of those was a
 * rich-text field, and rich text on this site stores the editor's own classes
 * into the HTML which the public renderer then strips — the copy never
 * rendered the way the editor showed it.
 *
 * This is one reusable band that does the job of all four. An editor drops it
 * onto the page once per chapter, labels it ("The Problem"), writes the
 * narrative as plain paragraphs, lists what was delivered as real repeater
 * rows, and optionally sets an image beside it. It renders in the site's
 * design every time, with nothing to strip.
 *
 * HOW THIS DIFFERS FROM `content.split`
 * ------------------------------------
 * `content.split` is a general image-beside-text band with a checklist.
 * `case.narrative` is the same shape tuned for storytelling: the body is plain
 * prose split on blank lines (a `##` line becomes a sub-heading), the list is
 * a "what we delivered" ledger rather than a feature checklist, and the accent
 * carries the case study's own colour through every chapter.
 *
 * STORAGE
 * -------
 * `point` is a repeater (§4.2 step 1) — label, description and icon are real
 * `section_blocks` columns. The narrative is a plain textarea column; the
 * accent and layout are presentation-only settings.
 */
class CaseNarrativeType implements SectionTypeContract
{
    public function key(): string
    {
        return 'case.narrative';
    }

    public function label(): string
    {
        return translate('Case Study Chapter');
    }

    public function description(): string
    {
        return translate('One chapter of a case study — the problem, the approach, or the outcome. A labelled narrative in plain paragraphs, an optional "what we delivered" list, and an optional image.');
    }

    public function icon(): string
    {
        return 'book-open';
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
                label: translate('Chapter Label'),
                type: InputEnum::TEXT->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:191'],
                help: translate('e.g. "The Problem", "Approach", "Outcome".'),
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
                help: translate('Optional. Set larger than the body — the one sentence that frames the chapter.'),
            ),

            SectionField::make(
                name: 'body',
                label: translate('Narrative'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:4000'],
                help: translate('The story, in short paragraphs separated by a blank line. Start a line with "## " to make it a sub-heading. Plain text — no HTML.'),
            ),

            SectionField::make(
                name: 'media_id',
                label: translate('Image'),
                type: FieldType::MEDIA->value,
                store: FieldStore::COLUMN,
                group: 'Media',
                help: translate('Optional. A screenshot or diagram shown beside the narrative on desktop.'),
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
                label: translate('Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('Optional. Shown beneath the narrative.'),
            ),

            SectionField::make(
                name: 'point',
                label: translate('What We Delivered'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
            ),

            SectionField::make(
                name: 'list_heading',
                label: translate('List Heading'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:120'],
                group: 'Layout',
                help: translate('Optional heading above the delivered list, e.g. "What we delivered".'),
            ),

            SectionField::make(
                name: 'media_side',
                label: translate('Image Side'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'end', 'label' => translate('Right')],
                    ['value' => 'start', 'label' => translate('Left')],
                ],
                default: 'end',
                group: 'Layout',
                help: translate('Which side the image sits on at desktop width. The text always comes first for a screen reader.'),
            ),

            SectionField::make(
                name: 'list_columns',
                label: translate('List Columns'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => '1', 'label' => '1'],
                    ['value' => '2', 'label' => '2'],
                ],
                default: '1',
                group: 'Layout',
                help: translate('Two columns suit a long list with no image beside it.'),
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
                default: 'brand',
                group: 'Layout',
                help: translate('Colours the list marks and the image glow. Use the case study\'s own colour on every chapter.'),
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
                default: 'fade',
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
            'point' => [
                'label' => translate('Delivered Item'),
                'min' => 0,
                'max' => 12,
                'fields' => [
                    SectionField::make(
                        name: 'label',
                        label: translate('Item'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:200'],
                        help: translate('One line, e.g. "An append-only audit trail on every state change".'),
                    ),

                    SectionField::make(
                        name: 'description',
                        label: translate('Detail'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:240'],
                        help: translate('Optional. A clause of context under the item.'),
                    ),

                    SectionField::make(
                        name: 'icon',
                        label: translate('Icon'),
                        type: FieldType::ICON->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('Optional. Defaults to a check mark so a mixed list still lines up.'),
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
        return 'Frontend/Sections/CaseNarrative';
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
                'list_heading' => null,
            ],
            'settings' => [
                'media_side' => 'end',
                'list_columns' => '1',
                'accent' => 'brand',
                'theme' => 'default',
                'spacing' => 'default',
                'animation' => 'fade',
            ],
        ];
    }
}

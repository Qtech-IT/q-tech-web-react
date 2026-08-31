<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The split band — an image on one side, an argument and a checklist on the
 * other.
 *
 * WHY THIS AND NOT `about.story`
 * ------------------------------
 * They look alike and they answer different questions. `about.story` is who the
 * company is: plain text, and a row of milestones underneath that render as
 * statistics. This one is what a piece of work INCLUDES — rich text plus a
 * checklist of deliverables — which is the band a service page needs three or
 * four of and an about page needs none of. Merging them would mean one type
 * whose fields half-apply whichever way it is used, and an editor guessing
 * which half to fill in.
 *
 * WHY THE LIST IS A REPEATER AND NOT PART OF THE RICH TEXT
 * -------------------------------------------------------
 * An editor CAN type a `<ul>` into the body, and for a throwaway list they
 * should. The repeater exists because a deliverables list is not prose: each
 * row can carry its own icon and its own note, it must stay on a two-column
 * grid at desktop and collapse to one on a phone, and it needs to survive
 * being re-ordered. None of that is expressible in a `<li>`, and a list styled
 * to look like the repeater but pasted as HTML would drift from it the first
 * time either changes.
 *
 * ALTERNATING SIDES ARE THE EDITOR'S JOB. `media_side` is per section rather
 * than derived from position, because a page that alternates automatically
 * re-flows every band the moment somebody inserts a section above.
 */
class ContentSplitType implements SectionTypeContract
{
    public function key(): string
    {
        return 'content.split';
    }

    public function label(): string
    {
        return translate('Split Content');
    }

    public function description(): string
    {
        return translate('An image beside formatted text and an optional checklist — what a service includes, how a process works, what is delivered.');
    }

    public function icon(): string
    {
        return 'columns-2';
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
            ),

            SectionField::make(
                name: 'body',
                label: translate('Content'),
                type: InputEnum::HTML_TEXT->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:8000'],
                help: translate('Optional. Sits above the checklist. Sub-headings start one level below this section\'s headline.'),
            ),

            SectionField::make(
                name: 'media_id',
                label: translate('Image'),
                type: FieldType::MEDIA->value,
                store: FieldStore::COLUMN,
                group: 'Media',
                help: translate('Optional. Without one the text takes the full measure rather than leaving an empty column.'),
            ),

            SectionField::make(
                name: 'item',
                label: translate('Checklist'),
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
                name: 'media_side',
                label: translate('Image Position'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'start', 'label' => translate('Left Of The Text')],
                    ['value' => 'end', 'label' => translate('Right Of The Text')],
                ],
                default: 'start',
                group: 'Layout',
                help: translate('Alternate this by hand down a page. Ignored on phones, where the image always leads.'),
            ),

            SectionField::make(
                name: 'media_shape',
                label: translate('Image Shape'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'landscape', 'label' => translate('Landscape (4:3)')],
                    ['value' => 'square', 'label' => translate('Square')],
                    ['value' => 'portrait', 'label' => translate('Portrait (4:5)')],
                ],
                default: 'landscape',
                group: 'Layout',
            ),

            SectionField::make(
                name: 'list_columns',
                label: translate('Checklist Columns'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 1, 'label' => '1'],
                    ['value' => 2, 'label' => '2'],
                ],
                default: 1,
                group: 'Layout',
                help: translate('Two columns suit a long list of short items. Applies from large screens up; below that the list is always one column.'),
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
                help: translate('Spent on the checklist marks and the glow behind the image — never on text.'),
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
            'item' => [
                'label' => translate('Checklist Item'),
                'min' => 0,
                'max' => 16,
                'fields' => [
                    SectionField::make(
                        name: 'label',
                        label: translate('Item'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:160'],
                    ),

                    SectionField::make(
                        name: 'description',
                        label: translate('Note'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:300'],
                        help: translate('Optional. A list where only some rows carry a note reads as unfinished — fill in all of them or none.'),
                    ),

                    SectionField::make(
                        name: 'icon',
                        label: translate('Icon'),
                        type: FieldType::ICON->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('Optional. Rows with no icon fall back to the section\'s check mark, so a half-iconed list still lines up.'),
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
        return 'Frontend/Sections/ContentSplit';
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
                'media_side' => 'start',
                'media_shape' => 'landscape',
                'list_columns' => 1,
                'accent' => 'brand',
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ];
    }
}

<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The block composer — long-form content as an ordered list of typed blocks.
 *
 * WHY THIS EXISTS
 * ---------------
 * A blog post and a policy page are genuine documents: headings, paragraphs,
 * lists, quotes, tables, code, the occasional image. That used to be a
 * `content.prose` rich-text field, and rich text on this site stores the
 * editor's own utility classes into the HTML which the public renderer then
 * strips — the copy never rendered the way the editor showed it, and pasting a
 * built design produced "it changed what I pasted".
 *
 * This band removes the editor entirely. The body is a repeater of blocks, one
 * `kind` per row — `paragraph`, `heading`, `list`, `quote`, `image`, `code`,
 * `callout`, `table` — and each renders as clean semantic HTML in the site's
 * own type system (`.fx-prose`). There is nothing to strip because there is
 * nothing pasted: the structure is data.
 *
 * ONE REPEATER, NOT EIGHT
 * -----------------------
 * The block types share a single `block` repeater with a `kind` setting rather
 * than one repeater each, because a document is ONE ordered stream — a heading,
 * then two paragraphs, then a list, then another heading. Separate repeaters
 * each sort independently and cannot interleave, which is exactly the wrong
 * shape for prose. The fields are deliberately overloaded (`body` carries the
 * paragraph text, the list items, the quote, the code, the table rows; `label`
 * carries the heading, the attribution, the caption) and the help text says
 * which applies to each kind.
 *
 * STORAGE
 * -------
 * `block` is a repeater (§4.2 step 1). `body`, `label`, `description`,
 * `media_id` and `icon` are real `section_blocks` columns; `kind` and the
 * per-kind presentation options are `settings`.
 */
class ContentBlocksType implements SectionTypeContract
{
    public function key(): string
    {
        return 'content.blocks';
    }

    public function label(): string
    {
        return translate('Article Body');
    }

    public function description(): string
    {
        return translate('Long-form content built from typed blocks — paragraphs, headings, lists, quotes, images, code, callouts and tables. Renders in the site design with no editor and no HTML to paste.');
    }

    public function icon(): string
    {
        return 'text';
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
                help: translate('Optional. Most articles carry their title in the header band above this one and leave the section header empty.'),
            ),

            SectionField::make(
                name: 'heading',
                label: translate('Section Heading'),
                type: InputEnum::TEXT->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:200'],
                help: translate('Optional.'),
            ),

            SectionField::make(
                name: 'heading_highlight',
                label: translate('Highlighted Words'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:255'],
                help: translate('Comma-separated words from the heading to accent. Plain text only.'),
            ),

            SectionField::make(
                name: 'subheading',
                label: translate('Lead Paragraph'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:600'],
                help: translate('Optional. Set larger than the body.'),
            ),

            SectionField::make(
                name: 'block',
                label: translate('Content Blocks'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
            ),

            SectionField::make(
                name: 'measure',
                label: translate('Reading Width'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'prose', 'label' => translate('Prose (narrow)')],
                    ['value' => 'wide', 'label' => translate('Wide')],
                ],
                default: 'prose',
                group: 'Layout',
                help: translate('Prose keeps lines near 72 characters, which is where long text stays readable. Wide suits a page that is mostly tables.'),
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
                ],
                default: 'none',
                group: 'Animation',
                help: translate('A reference document reads better still — leave this off for policy pages.'),
            ),
        ];
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function blockTypes(): array
    {
        return [
            'block' => [
                'label' => translate('Block'),
                'min' => 0,
                'max' => 80,
                'fields' => [
                    SectionField::make(
                        name: 'kind',
                        label: translate('Block Type'),
                        type: InputEnum::SELECT->value,
                        store: FieldStore::SETTINGS,
                        options: [
                            ['value' => 'paragraph', 'label' => translate('Paragraph')],
                            ['value' => 'heading', 'label' => translate('Heading')],
                            ['value' => 'list', 'label' => translate('List')],
                            ['value' => 'quote', 'label' => translate('Quote')],
                            ['value' => 'image', 'label' => translate('Image')],
                            ['value' => 'code', 'label' => translate('Code')],
                            ['value' => 'callout', 'label' => translate('Callout')],
                            ['value' => 'table', 'label' => translate('Table')],
                        ],
                        default: 'paragraph',
                        help: translate('What this block is. The fields below are shared — the help on each says which block types use it.'),
                    ),

                    SectionField::make(
                        name: 'label',
                        label: translate('Heading / Title / Attribution'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:255'],
                        help: translate('Heading: the heading text. Quote: who said it. Callout: the callout title. Code: an optional filename or language. Image: leave empty.'),
                    ),

                    SectionField::make(
                        name: 'body',
                        label: translate('Text'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:8000'],
                        help: translate('Paragraph / Quote / Callout: the text. List: one item per line. Code: the code, exactly as it should appear. Table: one row per line, cells separated by a pipe "|". Not used for Heading or Image.'),
                    ),

                    SectionField::make(
                        name: 'media_id',
                        label: translate('Image'),
                        type: FieldType::MEDIA->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('Image block only.'),
                    ),

                    SectionField::make(
                        name: 'description',
                        label: translate('Image Caption'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:255'],
                        group: 'Media',
                        help: translate('Image block only. Shown beneath the picture.'),
                    ),

                    SectionField::make(
                        name: 'icon',
                        label: translate('Callout Icon'),
                        type: FieldType::ICON->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('Callout block only. Falls back to an icon chosen by the callout tone.'),
                    ),

                    SectionField::make(
                        name: 'level',
                        label: translate('Heading Level'),
                        type: InputEnum::SELECT->value,
                        store: FieldStore::SETTINGS,
                        options: [
                            ['value' => 'h2', 'label' => translate('Section (H2)')],
                            ['value' => 'h3', 'label' => translate('Sub-section (H3)')],
                            ['value' => 'h4', 'label' => translate('Minor (H4)')],
                        ],
                        default: 'h2',
                        group: 'Layout',
                        conditional: ['field' => 'kind', 'value' => 'heading'],
                        help: translate('Heading block only. The article title above is H1 — start at H2.'),
                    ),

                    SectionField::make(
                        name: 'list_style',
                        label: translate('List Style'),
                        type: InputEnum::SELECT->value,
                        store: FieldStore::SETTINGS,
                        options: [
                            ['value' => 'bullet', 'label' => translate('Bulleted')],
                            ['value' => 'number', 'label' => translate('Numbered')],
                        ],
                        default: 'bullet',
                        group: 'Layout',
                        conditional: ['field' => 'kind', 'value' => 'list'],
                        help: translate('List block only.'),
                    ),

                    SectionField::make(
                        name: 'tone',
                        label: translate('Callout Tone'),
                        type: InputEnum::SELECT->value,
                        store: FieldStore::SETTINGS,
                        options: [
                            ['value' => 'note', 'label' => translate('Note')],
                            ['value' => 'info', 'label' => translate('Info')],
                            ['value' => 'success', 'label' => translate('Success')],
                            ['value' => 'warning', 'label' => translate('Warning')],
                        ],
                        default: 'note',
                        group: 'Layout',
                        conditional: ['field' => 'kind', 'value' => 'callout'],
                        help: translate('Callout block only. Sets the colour and the default icon.'),
                    ),

                    SectionField::make(
                        name: 'media_width',
                        label: translate('Image Width'),
                        type: InputEnum::SELECT->value,
                        store: FieldStore::SETTINGS,
                        options: [
                            ['value' => 'prose', 'label' => translate('Column width')],
                            ['value' => 'wide', 'label' => translate('Wider than the text')],
                        ],
                        default: 'prose',
                        group: 'Layout',
                        conditional: ['field' => 'kind', 'value' => 'image'],
                        help: translate('Image block only.'),
                    ),

                    SectionField::make(
                        name: 'table_header',
                        label: translate('First Row Is A Header'),
                        type: InputEnum::SWITCH->value,
                        store: FieldStore::SETTINGS,
                        default: true,
                        group: 'Layout',
                        conditional: ['field' => 'kind', 'value' => 'table'],
                        help: translate('Table block only.'),
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
        return 'Frontend/Sections/ContentBlocks';
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
                'measure' => 'prose',
                'theme' => 'default',
                'spacing' => 'default',
                'animation' => 'none',
            ],
        ];
    }
}

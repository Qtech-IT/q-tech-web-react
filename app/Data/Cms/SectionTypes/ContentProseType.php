<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The prose band — rich text on a reading measure.
 *
 * WHY THIS TYPE EXISTS AT ALL
 * ---------------------------
 * Every other section in the registry is a STRUCTURE: cards, steps, stats,
 * questions. Structures are what make a page scannable, and they are the right
 * default. But a real service page always has two or three passages that are
 * simply argument — "why video matters to a B2B funnel" — and forcing those
 * into a card grid is how a page ends up with four bands of three boxes each
 * saying one sentence.
 *
 * This is the escape hatch, and having exactly one of it is the point: without
 * it, every passage that does not fit an existing structure becomes a new
 * section type, and the registry grows a long tail of near-duplicates that only
 * their author can tell apart.
 *
 * WHY RICH TEXT HERE WHEN `about.story` REFUSES IT
 * ------------------------------------------------
 * `about.story` is three paragraphs with a known shape, so it takes plain text
 * and splits on blank lines — rich text there would let an editor paste a
 * heading into a section that already owns its heading level. This section's
 * whole job is the passage an editor needs to structure themselves: sub-heads,
 * emphasis, a list, a link out to a case study.
 *
 * The cost is real and is paid on render: stored HTML is sanitised in
 * `RichText.tsx` against an explicit allowlist, because an authenticated editor
 * is not the same thing as a trusted one and a stored payload would execute on
 * every public visit. The `sanitization` middleware is a regex blacklist and is
 * NOT that control.
 *
 * HEADING LEVELS. The band owns an `h2` (or the page's `h1` at position 0) and
 * the editor's own sub-heads start at `h3` — enforced by the renderer's
 * descendant styles rather than by trusting the editor to pick correctly, since
 * a skipped level is invisible until an audit.
 */
class ContentProseType implements SectionTypeContract
{
    public function key(): string
    {
        return 'content.prose';
    }

    public function label(): string
    {
        return translate('Rich Text');
    }

    public function description(): string
    {
        return translate('A passage of formatted text on a comfortable reading measure, with an optional heading and image.');
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
            ),

            SectionField::make(
                name: 'heading',
                label: translate('Headline'),
                type: InputEnum::TEXT->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:255'],
                help: translate('Optional. Without one the passage runs on from the section above it, which is often what a mid-page argument wants.'),
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
                help: translate('Set larger than the body copy. The sentence somebody skimming will read.'),
            ),

            SectionField::make(
                name: 'body',
                label: translate('Content'),
                type: InputEnum::HTML_TEXT->value,
                store: FieldStore::COLUMN,
                translatable: true,
                required: true,
                rules: ['max:20000'],
                help: translate('Sub-headings here start one level below this section\'s own headline, so use them for structure rather than for size.'),
            ),

            SectionField::make(
                name: 'media_id',
                label: translate('Image'),
                type: FieldType::MEDIA->value,
                store: FieldStore::COLUMN,
                group: 'Media',
                help: translate('Optional. Sits above the passage, full measure — this section is one column, so an image beside the text belongs in a Split Content band instead.'),
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
                help: translate('Optional. Shown beneath the passage.'),
            ),

            SectionField::make(
                name: 'measure',
                label: translate('Reading Width'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'prose', 'label' => translate('Prose (narrow)')],
                    ['value' => 'default', 'label' => translate('Page Width')],
                ],
                default: 'prose',
                group: 'Layout',
                help: translate('Prose keeps lines near 72 characters, which is where long text stays readable. Page width suits a passage that is mostly lists.'),
            ),

            SectionField::make(
                name: 'align',
                label: translate('Header Alignment'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'start', 'label' => translate('Left')],
                    ['value' => 'center', 'label' => translate('Centered')],
                ],
                default: 'start',
                group: 'Layout',
                help: translate('Only the heading moves. Body copy is always left-aligned — centred paragraphs give the eye no consistent place to start each line.'),
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
                ],
                default: 'fade',
                group: 'Animation',
            ),
        ];
    }

    /**
     * No repeater. The passage IS the content — a repeater here would be a
     * second way to express paragraphs, competing with the editor already in
     * the body field.
     *
     * @return array<string, array<string, mixed>>
     */
    public function blockTypes(): array
    {
        return [];
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
        return 'Frontend/Sections/ContentProse';
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
                'measure' => 'prose',
                'align' => 'start',
                'theme' => 'default',
                'spacing' => 'default',
                'animation' => 'fade',
            ],
        ];
    }
}

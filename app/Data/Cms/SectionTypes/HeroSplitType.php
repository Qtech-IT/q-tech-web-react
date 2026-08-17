<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * Worked example #1 — every branch of the §4.2 rule appears exactly once here,
 * which is the point of shipping it as a starter type.
 *
 *   heading / eyebrow / body / media / cta  -> column  (step 2)
 *   stats and trust badges, reorderable     -> block   (step 1)
 *   layout, overlay opacity                 -> settings(step 3, no)
 *   scroll-cue label                        -> data    (step 3, yes)
 */
class HeroSplitType implements SectionTypeContract
{
    public function key(): string
    {
        return 'hero.split';
    }

    public function label(): string
    {
        return translate('Split Hero');
    }

    public function description(): string
    {
        return translate('A headline and call to action beside a supporting image, with optional statistics and trust badges.');
    }

    public function icon(): string
    {
        return 'layout-panel-left';
    }

    public function group(): string
    {
        return translate('Hero');
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

            /*
             * Which words in the headline get the accent treatment.
             *
             * A plain comma-separated list, NOT markup: an editor must never be
             * able to put raw HTML into a heading, and the renderer matches
             * these against the headline text rather than trusting a tag.
             * Translatable, so `data` — a translator needs it beside the
             * heading it modifies, since the accented words differ per language.
             */
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
                label: translate('Subheadline'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:500'],
            ),

            SectionField::make(
                name: 'body',
                label: translate('Body'),
                type: InputEnum::HTML_TEXT->value,
                store: FieldStore::COLUMN,
                translatable: true,
            ),

            // I2: a media reference needs an FK and a reverse index, so it can
            // never live in JSON.
            /*
             * One media reference carries the hero visual, image OR video —
             * §3.1 of the schema doc defines `media_id` as "the single primary
             * image/video", and the renderer branches on `media.media_type`.
             *
             * Deliberately NOT two columns: a second media FK has no column on
             * `page_sections`, and putting a media id in JSON would break the
             * SET NULL FK and the reverse-lookup index that powers the
             * "where is this asset used?" report.
             */
            SectionField::make(
                name: 'media_id',
                label: translate('Hero Image or Video'),
                type: FieldType::MEDIA->value,
                store: FieldStore::COLUMN,
                group: 'Media',
                help: translate('Image or video. Renders with width, height and a blurhash placeholder to prevent layout shift.'),
            ),

            SectionField::make(
                name: 'cta_id',
                label: translate('Primary Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
            ),

            // The column already exists on `page_sections`; it only lacked a
            // descriptor, so the admin had no way to set it.
            SectionField::make(
                name: 'secondary_cta_id',
                label: translate('Secondary Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
            ),

            // Step 1: more than one, editor-ordered -> a section_blocks row.
            // Counters are ordered and translatable per row, so a JSON array
            // would give no stable translation address and would need
            // read-modify-write to reorder.
            //
            // The name is SINGULAR and must stay that way: a repeater field
            // names the `blockTypes()` key it owns, and the admin editor binds
            // the two by exact string match. A plural name matches nothing and
            // silently binds the repeater to the wrong block type.
            SectionField::make(
                name: 'stat',
                label: translate('Statistics'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
                group: 'Social Proof',
            ),

            SectionField::make(
                name: 'badge',
                label: translate('Trust Badges'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
                group: 'Social Proof',
            ),

            /*
             * Optional testimonial snippet. Exactly one, so step 1 does not
             * apply and it stays out of `section_blocks`; translatable, so
             * `data` rather than `settings`.
             */
            SectionField::make(
                name: 'testimonial_quote',
                label: translate('Testimonial Quote'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:400'],
                group: 'Social Proof',
            ),

            SectionField::make(
                name: 'testimonial_author',
                label: translate('Testimonial Attribution'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:191'],
                group: 'Social Proof',
                help: translate('Name and role, e.g. "Jane Doe, CTO at Acme".'),
            ),

            // Step 3 -> yes: a translator must see this on its own.
            SectionField::make(
                name: 'scroll_cue_label',
                label: translate('Scroll Cue Label'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:60'],
            ),

            // Step 3 -> no: values come from a fixed set the code defines.
            SectionField::make(
                name: 'layout',
                label: translate('Layout'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'split', 'label' => translate('Split')],
                    ['value' => 'centered', 'label' => translate('Centered')],
                    ['value' => 'full_bleed', 'label' => translate('Full Bleed')],
                ],
                default: 'split',
                group: 'Layout',
            ),

            SectionField::make(
                name: 'media_side',
                label: translate('Image Side'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'left', 'label' => translate('Left')],
                    ['value' => 'right', 'label' => translate('Right')],
                ],
                default: 'right',
                group: 'Layout',
                conditional: ['field' => 'layout', 'value' => 'split'],
            ),

            /*
             * How the hero visual meets the edge of the section. Step 3 -> no:
             * it renames nothing an editor would translate and the renderer
             * only ever branches on a value the code defines, so `settings`
             * rather than `data`. Paired with `media_side` because both are
             * meaningless outside the split layout.
             */
            SectionField::make(
                name: 'media_frame',
                label: translate('Media Treatment'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'panel', 'label' => translate('Full-Height Panel')],
                    ['value' => 'framed', 'label' => translate('Framed Card')],
                ],
                default: 'panel',
                help: translate('"Full-Height Panel" bleeds the image to the section edge at full height with square corners. "Framed Card" insets it as a rounded card.'),
                group: 'Layout',
                conditional: ['field' => 'layout', 'value' => 'split'],
            ),

            SectionField::make(
                name: 'overlay_opacity',
                label: translate('Overlay Opacity'),
                type: InputEnum::NUMBER->value,
                store: FieldStore::SETTINGS,
                rules: ['numeric', 'min:0', 'max:100'],
                default: 0,
                group: 'Layout',
            ),

            /*
             * Presentation only, never translated, chosen from a set the code
             * defines -> settings. The renderer must still honour
             * `prefers-reduced-motion` regardless of what is picked here: an
             * editor's animation choice cannot override a user's accessibility
             * setting.
             */
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
                default: 'rise',
                group: 'Animation',
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
        ];
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function blockTypes(): array
    {
        return [
            /*
             * `max` is a PER-LEVEL sibling cap, not a total row count: eight
             * stats at the top level and eight under each of them are both
             * allowed. Nesting stats is unusual but the repeater supports it,
             * and capping totals would punish it for no reason.
             */
            'stat' => [
                'label' => translate('Statistic'),
                'min' => 0,
                'max' => 8,
                'fields' => [
                    SectionField::make(
                        name: 'value',
                        label: translate('Value'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        required: true,
                        rules: ['max:32'],
                        help: translate('The number itself, e.g. "500" or "99.9".'),
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
                    // Prefix/suffix are separate from `value` so the counter can
                    // animate the number without animating "+" or "%".
                    SectionField::make(
                        name: 'prefix',
                        label: translate('Prefix'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::DATA,
                        translatable: true,
                        rules: ['max:8'],
                    ),
                    SectionField::make(
                        name: 'suffix',
                        label: translate('Suffix'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::DATA,
                        translatable: true,
                        rules: ['max:8'],
                        help: translate('e.g. "+", "%", "k".'),
                    ),
                ],
            ],

            'badge' => [
                'label' => translate('Trust Badge'),
                'min' => 0,
                'max' => 6,
                'fields' => [
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
                        name: 'icon',
                        label: translate('Icon'),
                        type: FieldType::ICON->value,
                        store: FieldStore::COLUMN,
                        help: translate('Optional. Falls back to text if the icon name is unknown.'),
                    ),
                    SectionField::make(
                        name: 'media_id',
                        label: translate('Image'),
                        type: FieldType::MEDIA->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('Use instead of an icon for certification marks.'),
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
        return 'Frontend/Sections/HeroSplit';
    }

    /**
     * @return array{data: array<string, mixed>, settings: array<string, mixed>}
     */
    public function defaults(): array
    {
        return [
            'data' => [
                // Written from day one so the lazy migrate(array $data) hook
                // never has to guess which rows predate which schema.
                'version' => 1,
                'scroll_cue_label' => null,
                'heading_highlight' => null,
                'testimonial_quote' => null,
                'testimonial_author' => null,
            ],
            'settings' => [
                'layout' => 'split',
                'media_side' => 'right',
                'media_frame' => 'panel',
                'overlay_opacity' => 0,
                'animation' => 'rise',
                'theme' => 'default',
                'spacing' => 'lg',
            ],
        ];
    }
}

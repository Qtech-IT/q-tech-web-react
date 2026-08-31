<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The portfolio section — "featured work": a set of case studies, each with a
 * product shot, the client context, one headline result and a link to the
 * full story.
 *
 * WHY IT IS NOT A THIRD CARD GRID
 * -------------------------------
 * `service.grid` already answers "here is a set of equal, comparable things".
 * Work is the opposite problem: the projects are NOT equal — one is the piece
 * the agency leads with, the rest are supporting evidence — and a layout that
 * renders them at identical weight throws away the only editorial decision
 * that matters. So both layouts this type offers are deliberately asymmetric
 * (`ServiceGridType` keeps the symmetric one), and the asymmetry is editor
 * controlled: `spotlight` promotes the first row, `mosaic` alternates spans.
 *
 * STORAGE
 * -------
 * `project` is a repeater (§4.2 step 1: many, editor-ordered). Inside a row,
 * the four scalars that exist as real `section_blocks` columns — title,
 * description, image, link — use them; `category`, `metric_label` and `tags`
 * are translatable JSON (`data`), and `accent`/`size` are presentation-only
 * choices no translator would ever see (`settings`).
 *
 * `value` carries the headline result ("+38%", "3.4s", "24/7") and is a string
 * by design, exactly as the column comment says — a result is not a number.
 */
class WorkShowcaseType implements SectionTypeContract
{
    public function key(): string
    {
        return 'work.showcase';
    }

    public function label(): string
    {
        return translate('Featured Work');
    }

    public function description(): string
    {
        return translate('A portfolio band — one promoted case study plus supporting projects, each with a product shot, a headline result and a link to the full story.');
    }

    public function icon(): string
    {
        return 'gallery-horizontal-end';
    }

    public function group(): string
    {
        return translate('Work');
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

            SectionField::make(
                name: 'subheading',
                label: translate('Subheadline'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:500'],
            ),

            // Same treatment as the service grid's: rendered as a text link
            // beside the headline, because the section's real calls to action
            // are the per-project case study links.
            SectionField::make(
                name: 'cta_id',
                label: translate('"View All Work" Link'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('Optional. Set the button style to "Link" for the text-link treatment shown beside the headline.'),
            ),

            SectionField::make(
                name: 'project',
                label: translate('Projects'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
            ),

            // The two layouts differ in WHICH project is emphasised, not in
            // how many columns there are — a column count would reintroduce
            // the equal-cards grid this section exists to avoid.
            SectionField::make(
                name: 'layout',
                label: translate('Layout'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'spotlight', 'label' => translate('Spotlight — promote the first project')],
                    ['value' => 'mosaic', 'label' => translate('Mosaic — alternating wide and narrow')],
                ],
                default: 'spotlight',
                group: 'Layout',
                help: translate('Spotlight gives the first project in the list a full-width feature. Reorder the projects to change which one is promoted.'),
            ),

            SectionField::make(
                name: 'show_index',
                label: translate('Number The Projects'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: true,
                group: 'Layout',
                help: translate('Shows a running 01 / 02 / 03 counter on each project.'),
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
            'project' => [
                'label' => translate('Project'),
                'min' => 0,
                'max' => 9,
                'fields' => [
                    SectionField::make(
                        name: 'label',
                        label: translate('Project Title'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:120'],
                        help: translate('e.g. "Real-time settlement platform".'),
                    ),

                    // Not the client's name — a sector/discipline line the
                    // reader can place instantly ("Fintech · Platform").
                    // Naming a client is a permission question, so it is never
                    // implied by a field label here.
                    SectionField::make(
                        name: 'category',
                        label: translate('Context Line'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::DATA,
                        translatable: true,
                        rules: ['max:120'],
                        help: translate('Sector and engagement type, e.g. "Fintech · Platform rebuild".'),
                    ),

                    SectionField::make(
                        name: 'description',
                        label: translate('Summary'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:400'],
                        help: translate('One or two sentences on the problem and what shipped.'),
                    ),

                    // A string, not a number: "+38%", "3.4s" and "24/7" are all
                    // legitimate results and none of them survive a numeric
                    // column. Mirrors the `value` column's own comment.
                    SectionField::make(
                        name: 'value',
                        label: translate('Headline Result'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        rules: ['max:60'],
                        group: 'Result',
                        help: translate('The one number this project is remembered for, e.g. "+38%" or "3.4s".'),
                    ),

                    SectionField::make(
                        name: 'metric_label',
                        label: translate('Result Label'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::DATA,
                        translatable: true,
                        rules: ['max:80'],
                        group: 'Result',
                        help: translate('What the number measures, e.g. "faster checkout". Shown beside it.'),
                    ),

                    SectionField::make(
                        name: 'media_id',
                        label: translate('Project Image'),
                        type: FieldType::MEDIA->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('Product shot or screen. Shown in a 16:10 frame — anything wider or taller is cropped to fit. Optional: a project with no image renders a patterned frame instead.'),
                    ),

                    // Presentation only, and the same palette (and the same
                    // no-default reasoning) as `ServiceGridType::accent`:
                    // left empty the renderer cycles it by position, so an
                    // untouched list is already a set of distinguishable
                    // projects rather than one colour repeated N times.
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
                        help: translate('Tints this project\'s image frame and its hover glow. Leave empty to colour it automatically by position.'),
                    ),

                    SectionField::make(
                        name: 'size',
                        label: translate('Tile Width'),
                        type: InputEnum::SELECT->value,
                        store: FieldStore::SETTINGS,
                        options: [
                            ['value' => 'wide', 'label' => translate('Wide')],
                            ['value' => 'standard', 'label' => translate('Standard')],
                        ],
                        group: 'Layout',
                        help: translate('Used by the Mosaic layout only. Leave empty for the automatic wide/narrow rhythm.'),
                    ),

                    // Comma-separated, never markup — the same guard as
                    // `ServiceGridType::tags` and `HeroSplitType::heading_highlight`.
                    SectionField::make(
                        name: 'tags',
                        label: translate('Stack'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::DATA,
                        translatable: true,
                        rules: ['max:255'],
                        help: translate('Comma-separated pills, e.g. "Laravel, React, AWS".'),
                    ),

                    SectionField::make(
                        name: 'cta_id',
                        label: translate('Case Study Link'),
                        type: FieldType::CTA->value,
                        store: FieldStore::COLUMN,
                        group: 'Conversion',
                        help: translate('Optional. When set, the whole project tile becomes clickable.'),
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
        return 'Frontend/Sections/WorkShowcase';
    }

    /**
     * @return array{data: array<string, mixed>, settings: array<string, mixed>}
     */
    public function defaults(): array
    {
        return [
            'data' => [
                'version' => 1,
            ],
            'settings' => [
                'layout' => 'spotlight',
                'show_index' => true,
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ];
    }
}

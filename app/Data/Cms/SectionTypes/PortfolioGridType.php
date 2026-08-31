<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The portfolio wall — "here is the work", shown as screens rather than as
 * stories: a centered header with a pair of calls to action, then a grid of
 * large framed shots that reveal a "view" action on hover.
 *
 * HOW THIS DIFFERS FROM `work.showcase`
 * -------------------------------------
 * They answer two different questions and both belong on a marketing site.
 * `work.showcase` argues — it promotes one engagement, carries a headline
 * result and reads as evidence. This one browses: every tile is the same
 * weight, the screen is the content, and the copy under it is a caption
 * rather than a case. That is why this type has no metric field, no spotlight
 * layout and no per-tile width — adding them would collapse it back into the
 * other section, and an editor would have two ways to build the same band.
 *
 * STORAGE
 * -------
 * `project` is a repeater (§4.2 step 1). Title, caption, shot and link are
 * real `section_blocks` columns; `tags` is translatable JSON (`data`); the
 * accent is presentation-only (`settings`).
 */
class PortfolioGridType implements SectionTypeContract
{
    public function key(): string
    {
        return 'portfolio.grid';
    }

    public function label(): string
    {
        return translate('Portfolio Grid');
    }

    public function description(): string
    {
        return translate('A centered header with two buttons, followed by a grid of framed project screens that reveal a "view project" action on hover.');
    }

    public function icon(): string
    {
        return 'layout-dashboard';
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

            // Two real buttons here, unlike the other two work sections' single
            // text link: this band is where a browsing visitor decides to act,
            // so it carries the page's conversion pair rather than a "see all".
            SectionField::make(
                name: 'cta_id',
                label: translate('Primary Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('Shown beneath the headline, e.g. "Book a Call".'),
            ),

            SectionField::make(
                name: 'secondary_cta_id',
                label: translate('Secondary Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('Optional quieter button beside the first, e.g. "View Pricing".'),
            ),

            SectionField::make(
                name: 'project',
                label: translate('Projects'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
            ),

            SectionField::make(
                name: 'columns',
                label: translate('Columns'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 2, 'label' => '2'],
                    ['value' => 3, 'label' => '3'],
                ],
                default: 2,
                group: 'Layout',
                help: translate('Two columns give each screen room to be read; three suit a longer list of smaller shots.'),
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

            // Drawn from the site's own tokens, never baked into the upload —
            // an editor replacing a screenshot must not have to match a window
            // bar someone painted into the last one.
            SectionField::make(
                name: 'chrome',
                label: translate('Browser Frame'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: true,
                group: 'Layout',
                help: translate('Draws a browser window bar above each screen, so a plain screenshot still reads as a live site.'),
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
                'max' => 12,
                'fields' => [
                    SectionField::make(
                        name: 'label',
                        label: translate('Project Title'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:120'],
                        help: translate('e.g. "Craft — Portfolio landing page".'),
                    ),

                    SectionField::make(
                        name: 'description',
                        label: translate('Caption'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:300'],
                        help: translate('One or two lines under the title.'),
                    ),

                    SectionField::make(
                        name: 'media_id',
                        label: translate('Screen'),
                        type: FieldType::MEDIA->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('The screenshot. Shown in a 16:10 frame — anything wider or taller is cropped to fit. Optional: a project with no screen renders a patterned frame instead.'),
                    ),

                    SectionField::make(
                        name: 'cta_id',
                        label: translate('Project Link'),
                        type: FieldType::CTA->value,
                        store: FieldStore::COLUMN,
                        group: 'Conversion',
                        help: translate('Optional. When set, the project screen becomes clickable and this label appears as the button that fades in over it on hover.'),
                    ),

                    // Same palette, same no-default reasoning, as the other two
                    // sections that use it: left empty the renderer cycles the
                    // hue by position, so an untouched grid is already a set of
                    // distinguishable tiles.
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
                        help: translate('Tints this tile\'s panel, its hover glow and its "view" button. Leave empty to colour it automatically by position.'),
                    ),

                    // Comma-separated, never markup — the same guard as every
                    // other pill row in the registry.
                    SectionField::make(
                        name: 'tags',
                        label: translate('Tags'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::DATA,
                        translatable: true,
                        rules: ['max:255'],
                        help: translate('Optional comma-separated pills, e.g. "Framer, Landing page".'),
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
        return 'Frontend/Sections/PortfolioGrid';
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
                'columns' => 2,
                'align' => 'center',
                'chrome' => true,
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ];
    }
}

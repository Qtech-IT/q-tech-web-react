<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The AI & Innovation band — one card per AI capability the team ships
 * (agents, automation, RAG, chatbots, AI-powered SaaS).
 *
 * WHY THIS IS NOT `service.grid` WITH DIFFERENT COPY
 * -------------------------------------------------
 * A service card answers "what can you build for me". An AI capability card
 * has to answer a second question editors keep trying to cram into the
 * description — "built out of what" — because a buyer evaluating an AI
 * partner is looking for the stack behind the claim (vector store, model,
 * orchestration) as much as the claim itself. So each row carries a
 * comma-separated `items` list rendered as pills, the same call, for the same
 * reasons, as `TechStackType::items` and `ServiceGridType::tags`: the tools
 * are never reordered alone, carry no image and no link, and a translator
 * wants to see the whole row at once.
 *
 * The optional `outcome` line is the third thing every draft of this section
 * grew on its own — "cuts triage time 60%" — and it is deliberately a plain
 * string, not a number: "2x", "60%" and "sub-second" are all legitimate and
 * none of them are arithmetic. Measured claims with a real number behind them
 * belong in `results.metrics`, which counts them.
 *
 * LAYOUT — `bento` promotes the first row to a double-width card. That is a
 * layout choice, not a content one, which is why it lives in settings and not
 * in a per-row "featured" flag: a flag on row 3 with `grid` selected would be
 * stored intent the page cannot honour, and editors would file it as a bug.
 */
class AiInnovationType implements SectionTypeContract
{
    public function key(): string
    {
        return 'ai.innovation';
    }

    public function label(): string
    {
        return translate('AI & Innovation');
    }

    public function description(): string
    {
        return translate('A colourful grid of AI capabilities — icon, title, outcome line and the tools behind each one.');
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
                label: translate('Subheadline'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:500'],
            ),

            SectionField::make(
                name: 'capability',
                label: translate('AI Capabilities'),
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
                help: translate('Small print beneath the cards, e.g. a note on model or data residency.'),
            ),

            SectionField::make(
                name: 'cta_id',
                label: translate('Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('Optional. Shown beneath the cards, e.g. "Talk to our AI team".'),
            ),

            SectionField::make(
                name: 'layout',
                label: translate('Card Layout'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'grid', 'label' => translate('Even Grid')],
                    ['value' => 'bento', 'label' => translate('Bento — First Card Wide')],
                ],
                default: 'bento',
                group: 'Layout',
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
                default: 3,
                group: 'Layout',
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
                default: 'subtle',
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

            // The decorative aurora behind the band. Off is a real choice, not
            // a fallback: on a page that already carries a gradient hero, two
            // washes stacked read as a rendering fault rather than as depth.
            SectionField::make(
                name: 'glow',
                label: translate('Background Glow'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: true,
                group: 'Layout',
                help: translate('A soft aurora behind the cards. Purely decorative and always hidden from assistive tech.'),
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
            'capability' => [
                'label' => translate('AI Capability'),
                'min' => 0,
                'max' => 9,
                'fields' => [
                    SectionField::make(
                        name: 'label',
                        label: translate('Capability'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:120'],
                        help: translate('e.g. "AI Agents", "RAG & Knowledge Search", "AI-Powered SaaS".'),
                    ),

                    SectionField::make(
                        name: 'description',
                        label: translate('Description'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:400'],
                    ),

                    // Plain text, never a number: "2x", "60%" and
                    // "sub-second" are all valid answers here.
                    SectionField::make(
                        name: 'value',
                        label: translate('Outcome'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:80'],
                        help: translate('Optional one-line result, e.g. "Cuts triage time by 60%". Not counted — use a Results & Metrics section for animated numbers.'),
                    ),

                    SectionField::make(
                        name: 'items',
                        label: translate('Stack'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::DATA,
                        translatable: true,
                        rules: ['max:500'],
                        help: translate('Comma-separated, e.g. "LangGraph, OpenAI, pgvector". Shown as pills, in this order.'),
                    ),

                    SectionField::make(
                        name: 'icon',
                        label: translate('Icon'),
                        type: FieldType::ICON->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('Falls back to a generic AI mark if left empty.'),
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
                        help: translate('Colours this card\'s icon, glow and pill borders. Leave empty to colour it automatically by position.'),
                    ),

                    SectionField::make(
                        name: 'cta_id',
                        label: translate('Card Link'),
                        type: FieldType::CTA->value,
                        store: FieldStore::COLUMN,
                        group: 'Conversion',
                        help: translate('Optional. Turns the whole card into a link.'),
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
        return 'Frontend/Sections/AiInnovation';
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
                'layout' => 'bento',
                'columns' => 3,
                'align' => 'center',
                'theme' => 'subtle',
                'spacing' => 'lg',
                'glow' => true,
                'animation' => 'stagger',
            ],
        ];
    }
}

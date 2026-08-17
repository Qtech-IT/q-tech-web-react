<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * A centered headline over an illustrative "how it works" diagram: customer
 * avatars flowing into a central brand hub, out to a team/capability panel,
 * flanked by a comparison callout and a trust callout.
 *
 * Two repeaters carry two genuinely different shapes, which is why there are
 * two rather than one generic "item" list:
 *
 *   `stat`  — the before/after comparison rows (a value, a label, an on/off
 *             state). Reuses the same value/label vocabulary StatsCounterType
 *             already established for "a stored figure with a caption".
 *
 *   `node`  — every avatar/icon chip in the diagram itself: the customer
 *             grid, the input chips feeding the hub, and the output/team
 *             panel. One shape (label + icon-or-image) with a `side` setting
 *             deciding where it renders, rather than three near-identical
 *             repeaters that would drift apart the first time someone edits
 *             one and forgets the other two.
 */
class HeroFlowType implements SectionTypeContract
{
    public function key(): string
    {
        return 'hero.flow';
    }

    public function label(): string
    {
        return translate('Flow Hero');
    }

    public function description(): string
    {
        return translate('A centered headline over an illustrated flow diagram — customers in, your brand at the centre, team/capabilities out — with a comparison callout and a trust callout.');
    }

    public function icon(): string
    {
        return 'workflow';
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
                help: translate('Small kicker line above the headline. Optional — the reference composition has none.'),
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
                rules: ['max:400'],
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
                help: translate('Set its button style to "Outline" for the paired-pill treatment shown in the reference.'),
            ),

            // Step 1: more than one, editor-ordered -> section_blocks.
            SectionField::make(
                name: 'stat',
                label: translate('Comparison Rows'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
                group: 'Diagram',
                help: translate('The small "without / with" callout card. Two rows, in order — first is the "off" state, last is the "on" state.'),
            ),

            SectionField::make(
                name: 'node',
                label: translate('Diagram Nodes'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
                group: 'Diagram',
                help: translate('Every avatar/icon chip in the diagram — customers, hub inputs, and the team/output panel — placed by each row\'s "Position" field.'),
            ),

            SectionField::make(
                name: 'hub_label',
                label: translate('Hub Label'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:60'],
                group: 'Diagram',
                help: translate('Shown inside the central bubble. Leave empty to render the icon alone.'),
            ),

            SectionField::make(
                name: 'customers_caption',
                label: translate('Customers Caption'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:60'],
                group: 'Diagram',
                help: translate('Label above the customer avatar grid, e.g. "Your Customers".'),
            ),

            SectionField::make(
                name: 'team_caption',
                label: translate('Team Caption'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:60'],
                group: 'Diagram',
                help: translate('Label above the team/output panel, e.g. "Your CX Team".'),
            ),

            SectionField::make(
                name: 'highlight_label',
                label: translate('Trust Callout Text'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:80'],
                group: 'Diagram',
                help: translate('The small floating badge card, e.g. "Secured Proxy Protection". Leave empty to hide the card entirely.'),
            ),

            SectionField::make(
                name: 'highlight_icon',
                label: translate('Trust Callout Icon'),
                type: FieldType::ICON->value,
                store: FieldStore::SETTINGS,
                group: 'Diagram',
                default: 'ShieldCheck',
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
                ],
                default: 'rise',
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
            'stat' => [
                'label' => translate('Comparison Row'),
                'min' => 0,
                'max' => 4,
                'fields' => [
                    SectionField::make(
                        name: 'value',
                        label: translate('Value'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        required: true,
                        rules: ['max:16'],
                        help: translate('e.g. "8%" or "75%".'),
                    ),
                    SectionField::make(
                        name: 'label',
                        label: translate('Label'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:60'],
                    ),
                    SectionField::make(
                        name: 'enabled',
                        label: translate('Toggle Shown "On"'),
                        type: InputEnum::SWITCH->value,
                        store: FieldStore::SETTINGS,
                        default: false,
                    ),
                ],
            ],

            'node' => [
                'label' => translate('Diagram Node'),
                'min' => 0,
                'max' => 14,
                'fields' => [
                    SectionField::make(
                        name: 'label',
                        label: translate('Label'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:60'],
                        help: translate('Visible under output/team chips. Used as alt text only for customer avatars.'),
                    ),
                    SectionField::make(
                        name: 'icon',
                        label: translate('Icon'),
                        type: FieldType::ICON->value,
                        store: FieldStore::COLUMN,
                        help: translate('Used when no photo is set below.'),
                    ),
                    SectionField::make(
                        name: 'media_id',
                        label: translate('Photo'),
                        type: FieldType::MEDIA->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                    ),
                    SectionField::make(
                        name: 'side',
                        label: translate('Position'),
                        type: InputEnum::SELECT->value,
                        store: FieldStore::SETTINGS,
                        options: [
                            ['value' => 'customer', 'label' => translate('Customer avatar grid')],
                            ['value' => 'input', 'label' => translate('Hub input chip')],
                            ['value' => 'output', 'label' => translate('Team / output panel')],
                        ],
                        default: 'output',
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
        return 'Frontend/Sections/HeroFlow';
    }

    /**
     * @return array{data: array<string, mixed>, settings: array<string, mixed>}
     */
    public function defaults(): array
    {
        return [
            'data' => [
                'version' => 1,
                'hub_label' => null,
                'customers_caption' => null,
                'team_caption' => null,
                'highlight_label' => null,
            ],
            'settings' => [
                'highlight_icon' => 'ShieldCheck',
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'rise',
            ],
        ];
    }
}

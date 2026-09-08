<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The team grid — the people behind the work, optionally grouped by the part
 * of the org they belong to (leadership, engineering, design, product).
 *
 * WHY THE GROUP IS A STRING ON EACH MEMBER, NOT A NESTED REPEATER
 * --------------------------------------------------------------
 * The obvious shape — a `team` repeater with `member` rows nested inside —
 * costs a two-level drag-and-drop for every "she moved to product" and makes
 * "show everyone, ungrouped" a second layout rather than a switch. A flat
 * list where each member names their group gets both for one text field:
 * `group_by` renders the headings in first-appearance order, and turning it
 * off yields one grid with no other edits. Reordering a member between groups
 * is retyping one word instead of dragging across two lists.
 *
 * WHY THE LINKS ARE FIXED KEYS AND NOT A REPEATER
 * ----------------------------------------------
 * A person's public profiles are a closed set in practice — LinkedIn, GitHub,
 * X, email — and each needs its own icon and its own `rel`/`mailto` handling.
 * A generic link repeater would push that mapping into editor hands (pick the
 * icon, remember the protocol) and produce a different set of icons on every
 * card. Four optional URL fields keep every card consistent and mean an
 * editor pastes a profile URL and is done.
 *
 * PHOTOS ARE OPTIONAL BY DESIGN. Half a team page is usually built before the
 * shoot happens, so a member with no `media_id` renders a monogram in their
 * accent hue rather than a broken frame or a stock face.
 */
class TeamGridType implements SectionTypeContract
{
    public function key(): string
    {
        return 'team.grid';
    }

    public function label(): string
    {
        return translate('Our Team');
    }

    public function description(): string
    {
        return translate('A grid of people — photo, name, role and profile links, optionally grouped by department.');
    }

    public function icon(): string
    {
        return 'users';
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
                label: translate('Subheadline'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:500'],
            ),

            SectionField::make(
                name: 'member',
                label: translate('Team Members'),
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
                help: translate('Small print beneath the grid, e.g. "And 20 more across four time zones."'),
            ),

            SectionField::make(
                name: 'cta_id',
                label: translate('Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('Optional. Shown beneath the grid, e.g. "See open roles".'),
            ),

            /*
             * OFF by default. Grouping splits one band into four stacked
             * mini-sections, which is a directory — useful on a dedicated
             * team page, wrong on a homepage where the section should read as
             * one row of people. Editors who want the directory turn it on.
             */
            SectionField::make(
                name: 'group_by',
                label: translate('Group By Department'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: false,
                group: 'Layout',
                help: translate('Renders a heading per department, in the order each first appears in the list. Off — the default — shows every person in one grid.'),
            ),

            SectionField::make(
                name: 'media_shape',
                label: translate('Photo Shape'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'portrait', 'label' => translate('Portrait (4:5)')],
                    ['value' => 'square', 'label' => translate('Square')],
                ],
                default: 'portrait',
                group: 'Layout',
                help: translate('The frame every photo is cropped into. Portrait suits headshots; square suits a mixed set where some photos are wider than others.'),
            ),

            SectionField::make(
                name: 'stagger_cards',
                label: translate('Stagger The Row'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: false,
                group: 'Layout',
                help: translate('Nudges every second card down on large screens so the row reads as scattered cards rather than as a table. Best kept off for a team that fills more than one row — the offset then reads as a broken grid rather than as a scatter. Dropped below large screens, where there is no row to scatter.'),
            ),

            SectionField::make(
                name: 'columns',
                label: translate('Columns'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 2, 'label' => '2'],
                    ['value' => 3, 'label' => '3'],
                    ['value' => 4, 'label' => '4'],
                ],
                default: 4,
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
            'member' => [
                'label' => translate('Team Member'),
                'min' => 0,
                'max' => 40,
                'fields' => [
                    SectionField::make(
                        name: 'label',
                        label: translate('Name'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:120'],
                    ),

                    SectionField::make(
                        name: 'description',
                        label: translate('Role'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:120'],
                        help: translate('e.g. "Principal Engineer", "Head of Design".'),
                    ),

                    SectionField::make(
                        name: 'value',
                        label: translate('Department'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:60'],
                        help: translate('Groups this person under a heading, e.g. "Leadership", "Engineering". Spell it identically across everyone in the group — the text is the grouping key.'),
                    ),

                    SectionField::make(
                        name: 'body',
                        label: translate('Short Bio'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:400'],
                        help: translate('Optional. One or two sentences — the card stays the same height whether it is there or not.'),
                    ),

                    SectionField::make(
                        name: 'skills',
                        label: translate('Focus Areas'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::DATA,
                        translatable: true,
                        rules: ['max:200'],
                        help: translate('Comma-separated, e.g. "Laravel, Distributed Systems". Shown as small pills.'),
                    ),

                    SectionField::make(
                        name: 'media_id',
                        label: translate('Photo'),
                        type: FieldType::MEDIA->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('Shown in a square frame. Optional — a member with no photo gets a monogram in their accent colour.'),
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
                        help: translate('Colours this card\'s monogram and hover wash. Leave empty to colour it automatically by position.'),
                    ),

                    /*
                     * Four fixed profile fields rather than a link repeater —
                     * see the class docblock. Each is validated as a URL so a
                     * pasted "linkedin.com/in/x" is rejected at save time
                     * rather than rendering as a relative link that 404s on
                     * our own domain.
                     */
                    SectionField::make(
                        name: 'linkedin',
                        label: translate('LinkedIn URL'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::DATA,
                        rules: ['url', 'max:255'],
                        group: 'Conversion',
                        help: translate('Full URL including https://.'),
                    ),

                    SectionField::make(
                        name: 'github',
                        label: translate('GitHub URL'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::DATA,
                        rules: ['url', 'max:255'],
                        group: 'Conversion',
                        help: translate('Full URL including https://.'),
                    ),

                    SectionField::make(
                        name: 'website',
                        label: translate('Personal Site URL'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::DATA,
                        rules: ['url', 'max:255'],
                        group: 'Conversion',
                        help: translate('Full URL including https://.'),
                    ),

                    SectionField::make(
                        name: 'email',
                        label: translate('Email'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::DATA,
                        rules: ['email', 'max:191'],
                        group: 'Conversion',
                        help: translate('Publishing an address puts it in front of scrapers. Prefer a shared inbox over a personal one.'),
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
        return 'Frontend/Sections/TeamGrid';
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
                'group_by' => false,
                'media_shape' => 'portrait',
                'stagger_cards' => false,
                'columns' => 4,
                'align' => 'center',
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ];
    }
}

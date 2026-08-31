<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The FAQ band — questions an editor can add without touching code, answered
 * in a disclosure list.
 *
 * WHY THE ANSWER IS A PLAIN TEXTAREA AND NOT RICH TEXT
 * ---------------------------------------------------
 * An FAQ answer that needs headings, tables or embedded media is not an FAQ
 * answer — it is a page, and the honest fix is a link to one. Keeping this
 * field plain also keeps the section's structured data trustworthy: a
 * `FAQPage` node's `acceptedAnswer` is text, and a rich-text answer would
 * either ship markup into the JSON-LD or quietly diverge from what the page
 * shows. Both are worse than the constraint.
 *
 * WHY `topic` IS A FREE STRING AND NOT AN ENUM
 * -------------------------------------------
 * Every agency's FAQ groups differently — Pricing / Process / Security here,
 * something else at the next client — and an enum would mean a migration
 * every time an editor invents a category. The value is a display-only pill;
 * nothing filters or joins on it, so it lives in the block's `data` bag.
 *
 * The `exclusive` setting is what makes the list behave as a true accordion.
 * It is off by default on purpose: a visitor comparing two answers should be
 * able to hold both open, and forcing one closed to read another is a
 * behaviour people file as a bug far more often than they ask for it.
 */
class FaqAccordionType implements SectionTypeContract
{
    public function key(): string
    {
        return 'faq.accordion';
    }

    public function label(): string
    {
        return translate('FAQ');
    }

    public function description(): string
    {
        return translate('A list of questions that expand to reveal their answers.');
    }

    public function icon(): string
    {
        return 'help-circle';
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
                label: translate('Subheadline'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:500'],
            ),

            SectionField::make(
                name: 'question',
                label: translate('Questions'),
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
                help: translate('Small print beneath the list, e.g. "Still stuck? Email us."'),
            ),

            SectionField::make(
                name: 'cta_id',
                label: translate('Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('Optional. Shown beside or beneath the questions, e.g. "Ask us anything".'),
            ),

            SectionField::make(
                name: 'layout',
                label: translate('Layout'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'stacked', 'label' => translate('Stacked — Header Above')],
                    ['value' => 'split', 'label' => translate('Split — Header Beside')],
                ],
                default: 'split',
                group: 'Layout',
                help: translate('Split keeps the headline and button in view while the reader scrolls the questions.'),
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
                // No `conditional` descriptor: `SectionField` accepts one but
                // nothing in the admin builder consumes it yet, so declaring
                // it here would promise a field that hides itself and ship one
                // that does not. The help text carries the rule instead.
                help: translate('Only applies to the stacked layout — a split header is always left aligned.'),
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
                name: 'open_first',
                label: translate('Open The First Question'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: true,
                group: 'Layout',
                help: translate('Shows one answer on arrival so the list reads as expandable rather than as a menu.'),
            ),

            SectionField::make(
                name: 'exclusive',
                label: translate('One Answer At A Time'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: false,
                group: 'Layout',
                help: translate('Closes the open answer when another is opened. Off lets a reader compare two answers side by side.'),
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
            'question' => [
                'label' => translate('Question'),
                'min' => 0,
                'max' => 24,
                'fields' => [
                    SectionField::make(
                        name: 'label',
                        label: translate('Question'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:255'],
                        help: translate('Write it the way a visitor would ask it, ending in a question mark.'),
                    ),

                    SectionField::make(
                        name: 'body',
                        label: translate('Answer'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:1500'],
                        help: translate('Plain text. If an answer needs headings or images it wants to be a page — link to one instead.'),
                    ),

                    SectionField::make(
                        name: 'topic',
                        label: translate('Topic'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::DATA,
                        translatable: true,
                        rules: ['max:40'],
                        help: translate('Optional pill beside the question, e.g. "Pricing", "Security". Display only — nothing filters on it.'),
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
                        help: translate('Colours this row\'s topic pill and its marker. Leave empty to colour it automatically by position.'),
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
        return 'Frontend/Sections/FaqAccordion';
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
                'layout' => 'split',
                'align' => 'center',
                'theme' => 'default',
                'spacing' => 'lg',
                'open_first' => true,
                'exclusive' => false,
                'animation' => 'stagger',
            ],
        ];
    }
}

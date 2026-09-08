<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The testimonial wall — a grid of quote cards, each carrying the reviewer's
 * company mark, their rating, the quote, and who said it.
 *
 * WHY THE LOGO IS A MEDIA FK AND NOT AN ICON
 * ------------------------------------------
 * A reviewer's company mark is a real brand asset with its own dimensions and
 * its own alt text; it is not one of the ~45 glyphs in the public icon
 * registry and never will be. Media may never live inside a JSON bag
 * (invariant I2 — it needs the FK and the reverse index that powers "where is
 * this asset used"), so `media_id` is a column on the block, exactly as
 * `portfolio.grid` stores its screenshots.
 *
 * WHY THE RATING IS A STRING
 * --------------------------
 * Same call as every other number in this registry: "4.9" and "5/5" are both
 * things an editor legitimately types, and the value is displayed, never
 * summed or sorted. It is also deliberately NOT counted on scroll — a rating
 * ticking up from zero next to a star reads as a loading state, not as a
 * flourish. Counted numbers belong in `results.metrics`.
 *
 * WHY THE QUOTE IS `body` AND NOT `description`
 * ---------------------------------------------
 * `description` is the supporting line on every other block type in this
 * registry, and here that role belongs to the reviewer's handle. Putting the
 * quote — the longest, most important string on the card — in `body` keeps
 * the column meanings consistent across types, which is what lets one admin
 * repeater editor render all of them.
 */
class TestimonialWallType implements SectionTypeContract
{
    public function key(): string
    {
        return 'testimonial.wall';
    }

    public function label(): string
    {
        return translate('Testimonial Wall');
    }

    public function description(): string
    {
        return translate('A grid of review cards — company mark, rating, quote and reviewer.');
    }

    public function icon(): string
    {
        return 'quote';
    }

    public function group(): string
    {
        return translate('Social Proof');
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
                name: 'testimonial',
                label: translate('Testimonials'),
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
                help: translate('Small print beneath the wall, e.g. where the reviews were collected.'),
            ),

            SectionField::make(
                name: 'cta_id',
                label: translate('Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('Optional. Shown beneath the cards, e.g. "Read all reviews".'),
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

            // Lifts and tilts the FIRST card out of the grid, the way a
            // physical card sits on top of a stack. A layout choice, so it
            // lives in settings rather than as a per-row "featured" flag that
            // rows 2..n could set and the layout could not honour.
            SectionField::make(
                name: 'tilt',
                label: translate('Lift The First Card'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: true,
                group: 'Layout',
                help: translate('Tilts and raises the first testimonial on large screens. Reorder the rows to choose which one it is.'),
            ),

            SectionField::make(
                name: 'show_rating',
                label: translate('Show Ratings'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: true,
                group: 'Layout',
                help: translate('Hides every rating at once. A card with no rating value simply omits it either way.'),
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
            'testimonial' => [
                'label' => translate('Testimonial'),
                'min' => 0,
                'max' => 12,
                'fields' => [
                    SectionField::make(
                        name: 'body',
                        label: translate('Quote'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:600'],
                        help: translate('Plain text, no quotation marks — the card adds the marks your language uses.'),
                    ),

                    SectionField::make(
                        name: 'label',
                        label: translate('Reviewer'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:120'],
                        help: translate('The person\'s name, e.g. "Kate Davis".'),
                    ),

                    SectionField::make(
                        name: 'description',
                        label: translate('Handle Or Role'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:120'],
                        help: translate('The quieter second line, e.g. "@katedavis" or "Head of Product".'),
                    ),

                    SectionField::make(
                        name: 'value',
                        label: translate('Rating'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:12'],
                        help: translate('Shown beside a star, e.g. "4.9". Never animated. Leave empty to omit it on this card.'),
                    ),

                    SectionField::make(
                        name: 'media_id',
                        label: translate('Company Mark'),
                        type: FieldType::MEDIA->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('The reviewer\'s company logo. Shown at a fixed height, never cropped. Optional — the reviewer\'s name carries the card without one.'),
                    ),

                    /*
                     * Optional. A review that has a source — a case study, a
                     * G2 listing, the client's own post — is worth more than
                     * one a visitor has to take on faith, and this is where
                     * that proof goes. A card with no link is not clickable
                     * at all rather than being a dead hit area.
                     */
                    SectionField::make(
                        name: 'cta_id',
                        label: translate('Card Link'),
                        type: FieldType::CTA->value,
                        store: FieldStore::COLUMN,
                        group: 'Conversion',
                        help: translate('Optional. Turns the whole card into a link — to the case study behind the quote, or to where the review was published.'),
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
                        help: translate('Colours this card\'s star and hover wash. Leave empty to colour it automatically by position.'),
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
        return 'Frontend/Sections/TestimonialWall';
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
                'columns' => 3,
                'align' => 'center',
                'theme' => 'subtle',
                'spacing' => 'lg',
                'tilt' => true,
                'show_rating' => true,
                'animation' => 'stagger',
            ],
        ];
    }
}

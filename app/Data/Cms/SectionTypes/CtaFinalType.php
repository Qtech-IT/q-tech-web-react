<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The closing call to action — one dark panel, the page's last ask, sitting
 * directly above the footer.
 *
 * WHY THIS IS NOT `cta.band`
 * --------------------------
 * `cta.band` is a mid-page interruption: a full-bleed strip that separates two
 * content sections. This one is the page's ENDING, and it has a structural job
 * that band does not — `merge_footer` paints the lower half of the section in
 * the footer's own colour so the panel reads as resting on the footer rather
 * than floating above a seam. That coupling is the entire design, and it
 * cannot be a setting on a section that is also used mid-page.
 *
 * WHY THE PANEL TONE IS A CHOICE AND THE INK IS NOT
 * -------------------------------------------------
 * An editor picks the panel's hue; nothing lets them pick the text colour on
 * it. The panel is always dark and its copy is always the knocked-out ink that
 * pairs with the chosen hue, because "dark panel, dark text" is one careless
 * click away otherwise and this is the last thing a visitor reads.
 */
class CtaFinalType implements SectionTypeContract
{
    public function key(): string
    {
        return 'cta.final';
    }

    public function label(): string
    {
        return translate('Final CTA');
    }

    public function description(): string
    {
        return translate('The closing ask — a dark panel with buttons and optional artwork, designed to sit on the footer.');
    }

    public function icon(): string
    {
        return 'rocket';
    }

    public function group(): string
    {
        return translate('Conversion');
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
                rules: ['max:400'],
            ),

            SectionField::make(
                name: 'media_id',
                label: translate('Panel Artwork'),
                type: FieldType::MEDIA->value,
                store: FieldStore::COLUMN,
                group: 'Media',
                help: translate('Sits at the panel\'s trailing edge on large screens and is hidden on phones, where it would push the buttons below the fold. Decorative — it is never announced.'),
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
            ),

            SectionField::make(
                name: 'footnote',
                label: translate('Footnote'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:255'],
                help: translate('Small print inside the panel, e.g. "No obligation. We reply within one business day."'),
            ),

            SectionField::make(
                name: 'tone',
                label: translate('Panel Colour'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'ink', 'label' => translate('Ink')],
                    ['value' => 'brand', 'label' => translate('Brand')],
                    ['value' => 'violet', 'label' => translate('Violet')],
                    ['value' => 'teal', 'label' => translate('Teal')],
                    ['value' => 'amber', 'label' => translate('Amber')],
                    ['value' => 'rose', 'label' => translate('Rose')],
                ],
                default: 'ink',
                group: 'Layout',
                help: translate('The panel is always dark; this tints it. Text colour is not editable — see why in the type\'s notes.'),
            ),

            SectionField::make(
                name: 'align',
                label: translate('Content Alignment'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'start', 'label' => translate('Left Aligned')],
                    ['value' => 'center', 'label' => translate('Centered')],
                ],
                default: 'start',
                group: 'Layout',
                help: translate('Centred ignores the artwork — a centred headline with a picture beside it has no axis.'),
            ),

            SectionField::make(
                name: 'merge_footer',
                label: translate('Merge Into The Footer'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: true,
                group: 'Layout',
                help: translate('Paints the lower half of this section in the footer\'s colour so the panel sits on it. Only correct for the LAST section on a page — turn it off anywhere else.'),
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
                    ['value' => 'stagger', 'label' => translate('Staggered')],
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
        return 'Frontend/Sections/CtaFinal';
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
                'tone' => 'ink',
                'align' => 'start',
                'merge_footer' => true,
                'spacing' => 'default',
                'animation' => 'rise',
            ],
        ];
    }
}

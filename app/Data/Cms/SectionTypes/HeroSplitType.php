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
 *   trust-badge logos, reorderable          -> block   (step 1)
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
        return translate('A headline and call to action beside a supporting image, with an optional row of trust logos.');
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
            SectionField::make(
                name: 'media_id',
                label: translate('Hero Image'),
                type: FieldType::MEDIA->value,
                store: FieldStore::COLUMN,
                group: 'Media',
                help: translate('Renders with width, height and a blurhash placeholder to prevent layout shift.'),
            ),

            SectionField::make(
                name: 'cta_id',
                label: translate('Primary Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
            ),

            // Step 1: more than one, editor-ordered -> a section_blocks row.
            SectionField::make(
                name: 'logos',
                label: translate('Trust Logos'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
                group: 'Social Proof',
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

            SectionField::make(
                name: 'overlay_opacity',
                label: translate('Overlay Opacity'),
                type: InputEnum::NUMBER->value,
                store: FieldStore::SETTINGS,
                rules: ['numeric', 'min:0', 'max:100'],
                default: 0,
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
            'logo' => [
                'label' => translate('Trust Logo'),
                'min' => 0,
                'max' => 12,
                'fields' => [
                    SectionField::make(
                        name: 'label',
                        label: translate('Client Name'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:191'],
                    ),
                    SectionField::make(
                        name: 'media_id',
                        label: translate('Logo'),
                        type: FieldType::MEDIA->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
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
            ],
            'settings' => [
                'layout' => 'split',
                'media_side' => 'right',
                'overlay_opacity' => 0,
            ],
        ];
    }
}

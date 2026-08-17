<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * A large centered headline, one compound pill button, a reviewer/rating
 * trust row, and a "loved by" logo strip underneath.
 *
 * Two repeaters, two different shapes:
 *
 *   `reviewer` — small avatar chips in the trust row. Rarely needs more than
 *                four or five, so it is capped tight; a name is optional and
 *                only ever used as alt text, never displayed.
 *
 *   `logo`     — the client/partner strip. `media_id` is required here
 *                (a logo repeater row with no logo is not a row worth
 *                keeping), unlike every other MEDIA field in this codebase.
 */
class HeroCenteredType implements SectionTypeContract
{
    public function key(): string
    {
        return 'hero.centered';
    }

    public function label(): string
    {
        return translate('Centered Hero');
    }

    public function description(): string
    {
        return translate('A large centered headline with one button, a reviewer/rating trust row, and a logo strip beneath.');
    }

    public function icon(): string
    {
        return 'layout-template';
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
                help: translate('Optional — the reference composition has none.'),
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
                label: translate('Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('Set an icon (e.g. an arrow) to fill the round badge at the end of the pill.'),
            ),

            SectionField::make(
                name: 'trust_label',
                label: translate('Trust Row Text'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:120'],
                group: 'Trust Row',
                help: translate('e.g. "Trusted by 1,000+ clients". Leave empty to hide the whole trust row, including avatars and rating.'),
            ),

            SectionField::make(
                name: 'rating_value',
                label: translate('Rating (0–5)'),
                type: InputEnum::NUMBER->value,
                store: FieldStore::SETTINGS,
                rules: ['numeric', 'min:0', 'max:5'],
                default: 4.5,
                group: 'Trust Row',
            ),

            SectionField::make(
                name: 'reviewer',
                label: translate('Reviewer Avatars'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
                group: 'Trust Row',
            ),

            SectionField::make(
                name: 'logos_caption',
                label: translate('Logo Strip Caption'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:120'],
                group: 'Logo Strip',
                help: translate('e.g. "Loved by 1,000+ big and small brands". Leave empty (with no logos) to hide the strip.'),
            ),

            SectionField::make(
                name: 'logo',
                label: translate('Client Logos'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
                group: 'Logo Strip',
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
            'reviewer' => [
                'label' => translate('Reviewer Avatar'),
                'min' => 0,
                'max' => 6,
                'fields' => [
                    SectionField::make(
                        name: 'media_id',
                        label: translate('Photo'),
                        type: FieldType::MEDIA->value,
                        store: FieldStore::COLUMN,
                        required: true,
                        group: 'Media',
                    ),
                    SectionField::make(
                        name: 'label',
                        label: translate('Name'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:120'],
                        help: translate('Alt text only — never shown.'),
                    ),
                ],
            ],

            'logo' => [
                'label' => translate('Client Logo'),
                'min' => 0,
                'max' => 8,
                'fields' => [
                    SectionField::make(
                        name: 'media_id',
                        label: translate('Logo'),
                        type: FieldType::MEDIA->value,
                        store: FieldStore::COLUMN,
                        required: true,
                        group: 'Media',
                    ),
                    SectionField::make(
                        name: 'label',
                        label: translate('Company Name'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:120'],
                        help: translate('Alt text only — never shown.'),
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
        return 'Frontend/Sections/HeroCentered';
    }

    /**
     * @return array{data: array<string, mixed>, settings: array<string, mixed>}
     */
    public function defaults(): array
    {
        return [
            'data' => [
                'version' => 1,
                'trust_label' => null,
                'logos_caption' => null,
            ],
            'settings' => [
                'rating_value' => 4.5,
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'rise',
            ],
        ];
    }
}

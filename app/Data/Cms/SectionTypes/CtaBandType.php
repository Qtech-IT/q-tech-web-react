<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * Worked example #3 — the conversion band, and the type the seeded global
 * block uses. Deliberately has no repeater, to show that blockTypes() may be
 * empty and the registry check still passes.
 */
class CtaBandType implements SectionTypeContract
{
    public function key(): string
    {
        return 'cta.band';
    }

    public function label(): string
    {
        return translate('CTA Band');
    }

    public function description(): string
    {
        return translate('A full-width conversion band with a headline and up to two buttons. Usually authored once as a global block.');
    }

    public function icon(): string
    {
        return 'megaphone';
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
                label: translate('Heading'),
                type: InputEnum::TEXT->value,
                store: FieldStore::COLUMN,
                translatable: true,
                required: true,
                rules: ['max:255'],
            ),

            SectionField::make(
                name: 'subheading',
                label: translate('Supporting Line'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:500'],
            ),

            SectionField::make(
                name: 'cta_id',
                label: translate('Primary Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                required: true,
                group: 'Conversion',
            ),

            SectionField::make(
                name: 'media_id',
                label: translate('Background Image'),
                type: FieldType::MEDIA->value,
                store: FieldStore::COLUMN,
                group: 'Media',
            ),

            SectionField::make(
                name: 'consent_note',
                label: translate('Consent Note'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:500'],
                help: translate('Privacy or consent copy shown under the buttons.'),
            ),

            SectionField::make(
                name: 'tone',
                label: translate('Tone'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'accent', 'label' => translate('Accent')],
                    ['value' => 'muted', 'label' => translate('Muted')],
                    ['value' => 'inverted', 'label' => translate('Inverted')],
                ],
                default: 'accent',
                group: 'Layout',
            ),

            SectionField::make(
                name: 'align',
                label: translate('Alignment'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'center', 'label' => translate('Center')],
                    ['value' => 'between', 'label' => translate('Space Between')],
                ],
                default: 'center',
                group: 'Layout',
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
        return 'Frontend/Sections/CtaBand';
    }

    /**
     * @return array{data: array<string, mixed>, settings: array<string, mixed>}
     */
    public function defaults(): array
    {
        return [
            'data' => [
                'version' => 1,
                'consent_note' => null,
            ],
            'settings' => [
                'tone' => 'accent',
                'align' => 'center',
            ],
        ];
    }
}

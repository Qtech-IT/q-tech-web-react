<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The credentials wall — awards, ISO certifications, cloud and vendor
 * certifications, partner badges and industry recognition, in one grid.
 *
 * WHY ONE SECTION TYPE AND NOT FOUR
 * ---------------------------------
 * An award, an ISO certificate, an AWS partner badge and an analyst mention
 * are the same card: a mark, a name, who issued it, when, and a link that
 * proves it. Splitting them into separate types would mean four registry
 * entries, four admin forms and four almost-identical components — and an
 * editor who wants them in one band would still have to fake it. They share
 * a type and are separated by `kind`, which is what the grouping headings
 * and the category pills read.
 *
 * WHY `kind` IS AN ENUMERATED SELECT AND `topic` ELSEWHERE IS FREE TEXT
 * --------------------------------------------------------------------
 * Unlike an FAQ topic, this value drives LAYOUT: `group_by` renders one
 * heading per kind, and free text would split "Certification" and
 * "Certifications" into two sections of the page. The five options below
 * cover what a credentials wall actually holds; anything that does not fit
 * belongs under Recognition rather than in a sixth option nobody maintains.
 *
 * WHY `verify` IS A CTA AND NOT A URL STRING
 * -----------------------------------------
 * A credential link is an outbound claim of proof — it wants a real label
 * ("Verify on AWS"), new-tab and `rel` handling, and the tracking id every
 * other outbound link on the site gets. `CtaService` already resolves all of
 * that; a bare URL column would reimplement a worse version of it here.
 *
 * TRADEMARK NOTE: the seeded marks are FICTIONAL. Shipping a real vendor's
 * badge is a licensing question — every partner programme has rules about
 * its mark — so the badge slot ships empty-capable and an editor uploads the
 * asset their programme actually granted them.
 */
class AwardWallType implements SectionTypeContract
{
    public function key(): string
    {
        return 'award.wall';
    }

    public function label(): string
    {
        return translate('Awards & Certifications');
    }

    public function description(): string
    {
        return translate('A grid of credentials — award, certification, partner badge or recognition, each with its issuer, year and proof link.');
    }

    public function icon(): string
    {
        return 'award';
    }

    public function group(): string
    {
        return translate('Social Proof');
    }

    /**
     * The five kinds a credentials wall actually holds.
     *
     * Shared by the field descriptor and by anything that needs to validate a
     * stored value, so the list exists in exactly one place.
     *
     * @return array<int, array<string, string>>
     */
    public static function kindOptions(): array
    {
        return [
            ['value' => 'award', 'label' => translate('Award')],
            ['value' => 'certification', 'label' => translate('Certification')],
            ['value' => 'partner', 'label' => translate('Partner Badge')],
            ['value' => 'compliance', 'label' => translate('Compliance')],
            ['value' => 'recognition', 'label' => translate('Industry Recognition')],
        ];
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
                name: 'credential',
                label: translate('Credentials'),
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
                help: translate('Small print beneath the wall, e.g. "Certificates available on request."'),
            ),

            SectionField::make(
                name: 'cta_id',
                label: translate('Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('Optional. Shown beneath the wall, e.g. "Request our compliance pack".'),
            ),

            SectionField::make(
                name: 'group_by',
                label: translate('Group By Kind'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: true,
                group: 'Layout',
                help: translate('Renders a heading per kind — Awards, Certifications, Partner Badges — in the order each first appears. Off shows one flat grid.'),
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
            'credential' => [
                'label' => translate('Credential'),
                'min' => 0,
                'max' => 24,
                'fields' => [
                    SectionField::make(
                        name: 'label',
                        label: translate('Title'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:160'],
                        help: translate('The credential as it is written on the certificate, e.g. "ISO/IEC 27001:2022".'),
                    ),

                    SectionField::make(
                        name: 'description',
                        label: translate('Issuer'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:160'],
                        help: translate('Who awarded it, e.g. "Amazon Web Services", "BSI".'),
                    ),

                    SectionField::make(
                        name: 'value',
                        label: translate('Year'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:24'],
                        help: translate('Text, not a number — "2024", "2022–2025" and "Renewed 2025" are all valid.'),
                    ),

                    SectionField::make(
                        name: 'body',
                        label: translate('Note'),
                        type: InputEnum::TEXTAREA->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:300'],
                        help: translate('Optional. What the credential actually covers — the line that stops it reading as a logo wall.'),
                    ),

                    SectionField::make(
                        name: 'kind',
                        label: translate('Kind'),
                        type: InputEnum::SELECT->value,
                        store: FieldStore::DATA,
                        options: self::kindOptions(),
                        default: 'certification',
                        help: translate('Drives the pill on the card and the heading it groups under.'),
                    ),

                    SectionField::make(
                        name: 'media_id',
                        label: translate('Badge'),
                        type: FieldType::MEDIA->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('The official mark, shown at a fixed height and never cropped. Upload only a badge your programme has actually granted you — vendor marks are licensed. Optional: a card with no badge falls back to its icon.'),
                    ),

                    SectionField::make(
                        name: 'icon',
                        label: translate('Fallback Icon'),
                        type: FieldType::ICON->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                        help: translate('Used when there is no badge image. Falls back to a generic award mark.'),
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
                        help: translate('Colours this card\'s pill, icon and hover wash. Leave empty to colour it automatically by kind.'),
                    ),

                    SectionField::make(
                        name: 'cta_id',
                        label: translate('Verification Link'),
                        type: FieldType::CTA->value,
                        store: FieldStore::COLUMN,
                        group: 'Conversion',
                        help: translate('Optional. Links to the issuer\'s public record, e.g. "Verify on AWS". A claim a visitor can check is worth more than one they cannot.'),
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
        return 'Frontend/Sections/AwardWall';
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
                'group_by' => true,
                'columns' => 3,
                'align' => 'center',
                'theme' => 'subtle',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ];
    }
}

<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The gallery — a set of images with captions, shown as a grid or a slider.
 *
 * WHY THE IMAGES ARE REPEATER ROWS AND NOT THE `media` COLLECTION
 * --------------------------------------------------------------
 * A page section can already carry many images through the `mediables` pivot,
 * and that is how `gallery` was originally imagined. It is the wrong shape
 * here for one reason: a pivot row holds an image and a sort order, and
 * nothing else. A gallery image needs a caption, and frequently an alt text
 * specific to how it is being used rather than the library's generic one.
 *
 * A repeater row gives each image its own fields and its own reorder handle,
 * and it costs nothing extra — `media_id` on the row is still a real foreign
 * key, so the reverse index that answers "what uses this asset?" still works.
 *
 * WHY A SLIDER IS A SETTING AND NOT A SEPARATE TYPE
 * ------------------------------------------------
 * The content is identical; only the presentation differs. Two types would
 * mean an editor who wants to switch has to delete the section and re-upload
 * everything, and would double the surface for the same idea.
 *
 * THE SLIDER IS NOT A CAROUSEL THAT MOVES ON ITS OWN. There is no autoplay
 * setting and there will not be one: content that moves without being asked is
 * a WCAG 2.2.2 failure unless it can be paused, it steals attention from
 * whatever the reader was actually reading, and on a portfolio the reader is
 * the one deciding which shot to look at.
 */
class MediaGalleryType implements SectionTypeContract
{
    public function key(): string
    {
        return 'media.gallery';
    }

    public function label(): string
    {
        return translate('Gallery');
    }

    public function description(): string
    {
        return translate('A set of images with captions — shown as a grid, or as a slider with thumbnails.');
    }

    public function icon(): string
    {
        return 'images';
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
                name: 'shot',
                label: translate('Images'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
            ),

            SectionField::make(
                name: 'cta_id',
                label: translate('Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
            ),

            SectionField::make(
                name: 'display',
                label: translate('Display'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'slider', 'label' => translate('Slider With Thumbnails')],
                    ['value' => 'grid', 'label' => translate('Grid')],
                ],
                default: 'slider',
                group: 'Layout',
                help: translate('A slider shows one image large with the rest as thumbnails — right for screens where detail matters. A grid shows everything at once.'),
            ),

            SectionField::make(
                name: 'ratio',
                label: translate('Image Shape'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'wide', 'label' => translate('Wide (16:9)')],
                    ['value' => 'screen', 'label' => translate('Screen (16:10)')],
                    ['value' => 'classic', 'label' => translate('Classic (4:3)')],
                    ['value' => 'square', 'label' => translate('Square')],
                ],
                default: 'screen',
                group: 'Layout',
                help: translate('Applied to every image, so a mixed set still lines up. Uploads are cropped to fill it.'),
            ),

            SectionField::make(
                name: 'columns',
                label: translate('Grid Columns'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 2, 'label' => '2'],
                    ['value' => 3, 'label' => '3'],
                ],
                default: 2,
                group: 'Layout',
                help: translate('Used only by the grid display.'),
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
                    ['value' => 'stagger', 'label' => translate('Staggered')],
                ],
                default: 'fade',
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
            'shot' => [
                'label' => translate('Image'),
                'min' => 0,
                'max' => 24,
                'fields' => [
                    SectionField::make(
                        name: 'media_id',
                        label: translate('Image'),
                        type: FieldType::MEDIA->value,
                        store: FieldStore::COLUMN,
                        required: true,
                    ),

                    SectionField::make(
                        name: 'label',
                        label: translate('Caption'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:160'],
                        help: translate('Shown under the image. Optional — a gallery where only some shots are captioned reads as unfinished, so caption all or none.'),
                    ),

                    SectionField::make(
                        name: 'description',
                        label: translate('Alt Text Override'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:255'],
                        help: translate('Only when the library\'s alt text is wrong for this context. Leave empty to use the asset\'s own.'),
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
        return 'Frontend/Sections/MediaGallery';
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
            ],
            'settings' => [
                'display' => 'slider',
                'ratio' => 'screen',
                'columns' => 2,
                'theme' => 'subtle',
                'spacing' => 'lg',
                'animation' => 'fade',
            ],
        ];
    }
}

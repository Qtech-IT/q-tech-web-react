<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The article header — the opening block of a blog post or a case study.
 *
 * HOW THIS DIFFERS FROM A HERO
 * ----------------------------
 * A marketing hero sells: a headline, a promise, two buttons. An article header
 * ORIENTS: what kind of piece this is, who wrote it, when, how long it will
 * take, and what it is about. Those are the fields a reader scans before
 * deciding to commit, and none of them exist on `hero.split` — which is why
 * blog posts built on a marketing hero always end up with the date jammed into
 * the eyebrow and the author missing entirely.
 *
 * WHY THE DATE IS A FIELD AND NOT `pages.published_at`
 * ----------------------------------------------------
 * It looks like duplication and it is deliberate. A section may never know what
 * page it is on — that is the invariant that lets the same section render in a
 * global block, in the admin preview, and on any page an editor drags it to. A
 * section that read the owning page's publish timestamp would render blank in
 * two of those three places.
 *
 * It also happens to be correct editorially: `published_at` is when the CMS
 * made the row visible, which after a re-publish or a migration is rarely the
 * date the piece was written. The displayed date is a claim about the article;
 * the column is a fact about the row.
 *
 * THE META ROW DEGRADES ITEM BY ITEM. An article with no author renders the
 * date alone; one with neither renders no row at all rather than an empty rule.
 *
 * THERE IS NO AUTHOR PHOTO FIELD. `page_sections` has exactly one `media_id`
 * column and the lead image owns it; a second MEDIA field stored to COLUMN
 * would write to the same place and one of the two would silently win. The
 * byline renders the author's initials in an accent disc instead, which needs
 * no upload, is identical in shape for every author, and cannot go missing.
 */
class ArticleHeaderType implements SectionTypeContract
{
    public function key(): string
    {
        return 'article.header';
    }

    public function label(): string
    {
        return translate('Article Header');
    }

    public function description(): string
    {
        return translate('The opening block of a blog post or case study — category, title, byline, date, reading time and a lead image.');
    }

    public function icon(): string
    {
        return 'newspaper';
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
                label: translate('Category'),
                type: InputEnum::TEXT->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:191'],
                help: translate('Engineering, Design, Delivery — what kind of piece this is.'),
            ),

            SectionField::make(
                name: 'heading',
                label: translate('Title'),
                type: InputEnum::TEXT->value,
                store: FieldStore::COLUMN,
                translatable: true,
                required: true,
                rules: ['max:255'],
            ),

            SectionField::make(
                name: 'subheading',
                label: translate('Standfirst'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:500'],
                help: translate('The paragraph under the title. One or two sentences saying what the reader will get.'),
            ),

            SectionField::make(
                name: 'author_name',
                label: translate('Author'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                rules: ['max:120'],
                group: 'Byline',
            ),

            SectionField::make(
                name: 'author_role',
                label: translate('Author Role'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:120'],
                group: 'Byline',
                help: translate('Shown under the name, e.g. "Principal Engineer".'),
            ),

            SectionField::make(
                name: 'published_label',
                label: translate('Date'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:60'],
                group: 'Byline',
                help: translate('Written as you want it read, e.g. "14 March 2026". Free text on purpose — see this type\'s note on why it is not the publish timestamp.'),
            ),

            SectionField::make(
                name: 'read_time',
                label: translate('Reading Time'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:40'],
                group: 'Byline',
                help: translate('e.g. "6 min read". Roughly 200 words a minute.'),
            ),

            SectionField::make(
                name: 'media_id',
                label: translate('Lead Image'),
                type: FieldType::MEDIA->value,
                store: FieldStore::COLUMN,
                group: 'Media',
                help: translate('Optional. Sits beneath the header at full measure.'),
            ),

            SectionField::make(
                name: 'tag',
                label: translate('Tags'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
            ),

            SectionField::make(
                name: 'show_share',
                label: translate('Show Share Links'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: true,
                group: 'Layout',
                help: translate('Copy-link, LinkedIn and X. Plain links and a clipboard call — no third-party scripts, so nothing is loaded from a social network unless a reader actually clicks.'),
            ),

            SectionField::make(
                name: 'align',
                label: translate('Alignment'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'start', 'label' => translate('Left')],
                    ['value' => 'center', 'label' => translate('Centered')],
                ],
                default: 'start',
                group: 'Layout',
            ),

            SectionField::make(
                name: 'media_shape',
                label: translate('Lead Image Shape'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'wide', 'label' => translate('Wide (21:9)')],
                    ['value' => 'landscape', 'label' => translate('Landscape (16:9)')],
                    ['value' => 'classic', 'label' => translate('Classic (4:3)')],
                ],
                default: 'landscape',
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
            'tag' => [
                'label' => translate('Tag'),
                'min' => 0,
                'max' => 8,
                'fields' => [
                    SectionField::make(
                        name: 'label',
                        label: translate('Tag'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:60'],
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
        return 'Frontend/Sections/ArticleHeader';
    }

    /**
     * @return array{data: array<string, mixed>, settings: array<string, mixed>}
     */
    public function defaults(): array
    {
        return [
            'data' => [
                'version' => 1,
                'author_name' => null,
                'author_role' => null,
                'published_label' => null,
                'read_time' => null,
            ],
            'settings' => [
                'show_share' => true,
                'align' => 'start',
                'media_shape' => 'landscape',
                'theme' => 'default',
                'spacing' => 'default',
                'animation' => 'rise',
            ],
        ];
    }
}

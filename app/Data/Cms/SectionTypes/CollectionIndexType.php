<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\ResolvesCollection;
use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Cms\MediaCollection;
use App\Enums\Cms\PageType;
use App\Enums\Settings\InputEnum;
use App\Http\Resources\Frontend\PageCardResource;
use App\Models\Page;
use App\Models\PageSection;

/**
 * The index band — a grid of OTHER PAGES.
 *
 * This is what makes `/services` a real index instead of a hand-maintained
 * list. An editor publishes a new service page and it appears here; they
 * unpublish one and it leaves. There is no second edit, and therefore no way
 * for the index and the pages it indexes to disagree — which is the failure
 * mode of every "list of services" built as a card repeater.
 *
 * It is also why services never needed their own table. The listing that a
 * `services` model would have justified is this section, and because it lists
 * PAGES it lists technologies, legal pages and anything else the tree grows
 * with no further work.
 *
 * TWO SOURCES, AND WHY NEITHER IS A PAGE PICKER
 * ---------------------------------------------
 * `children` lists the children of whatever page this section sits on. No id is
 * stored, so re-parenting or renaming the index page cannot strand it, and the
 * common case — an index at the root of its own subtree — needs no
 * configuration at all.
 *
 * `page_type` lists every page of one type wherever it lives, for a footer
 * index of legal pages or a "all technologies" band on a page that is not their
 * parent.
 *
 * A stored `parent_id` was the third option and is the one that rots: it
 * survives in the JSON long after the page it names is deleted, and the section
 * then renders an empty grid that looks like a bug rather than a configuration
 * mistake.
 *
 * MANUAL ORDER IS THE DEFAULT. Sorting by title reads as tidy and is almost
 * always wrong — the most important service is rarely the one starting with A —
 * so the default follows `sort_order`, which is the order an editor already
 * dragged the pages into in the page tree.
 */
class CollectionIndexType implements ResolvesCollection, SectionTypeContract
{
    /** Sources a `source` setting may name. */
    public const SOURCE_CHILDREN = 'children';

    public const SOURCE_PAGE_TYPE = 'page_type';

    /** Hard ceiling on rendered cards, whatever `limit` says. */
    public const MAX_ITEMS = 48;

    public function key(): string
    {
        return 'collection.index';
    }

    public function label(): string
    {
        return translate('Page Index');
    }

    public function description(): string
    {
        return translate('A grid of other pages — every service, technology or policy — kept in step automatically as pages are published.');
    }

    public function icon(): string
    {
        return 'layout-grid';
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
                name: 'empty_message',
                label: translate('Empty Message'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:255'],
                help: translate('Shown when nothing matches — before the first page of this kind is published. Leave blank to hide the whole section instead.'),
            ),

            SectionField::make(
                name: 'cta_id',
                label: translate('Button'),
                type: FieldType::CTA->value,
                store: FieldStore::COLUMN,
                group: 'Conversion',
                help: translate('Optional. Shown beneath the grid.'),
            ),

            SectionField::make(
                name: 'source',
                label: translate('What To List'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => self::SOURCE_CHILDREN, 'label' => translate('Pages Beneath This One')],
                    ['value' => self::SOURCE_PAGE_TYPE, 'label' => translate('Every Page Of One Type')],
                ],
                default: self::SOURCE_CHILDREN,
                group: 'Source',
                help: translate('"Beneath this one" needs no other setting and keeps working if the page is renamed or moved.'),
            ),

            SectionField::make(
                name: 'page_type',
                label: translate('Page Type'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: $this->pageTypeOptions(),
                default: PageType::SERVICE->value,
                group: 'Source',
                help: translate('Used only when listing every page of one type. Ignored otherwise.'),
            ),

            SectionField::make(
                name: 'order',
                label: translate('Order'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'manual', 'label' => translate('Page Tree Order')],
                    ['value' => 'title', 'label' => translate('Title, A–Z')],
                    ['value' => 'recent', 'label' => translate('Most Recently Published')],
                ],
                default: 'manual',
                group: 'Source',
                help: translate('Page tree order is the order you dragged them into in Pages.'),
            ),

            SectionField::make(
                name: 'limit',
                label: translate('Maximum Cards'),
                type: InputEnum::NUMBER->value,
                store: FieldStore::SETTINGS,
                default: 12,
                group: 'Source',
                help: translate('Leave at zero for no limit. Capped at 48 whatever is entered — a page that lists more than that needs pagination, not a longer grid.'),
            ),

            SectionField::make(
                name: 'layout',
                label: translate('Card Style'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'card', 'label' => translate('Image Cards')],
                    ['value' => 'icon', 'label' => translate('Icon Cards')],
                    ['value' => 'list', 'label' => translate('Compact List')],
                ],
                default: 'card',
                group: 'Layout',
                help: translate('Image cards fall back to the icon, and icon cards to the page\'s initial, so a half-illustrated set still lines up.'),
            ),

            SectionField::make(
                name: 'searchable',
                label: translate('Show A Search Box'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: false,
                group: 'Source',
                help: translate('Searches the title and summary of the listed pages. Worth switching on once a listing is long enough that scanning it stops working — roughly a dozen items.'),
            ),

            SectionField::make(
                name: 'paginate',
                label: translate('Paginate'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: false,
                group: 'Source',
                help: translate('Splits the listing into pages instead of rendering everything at once. Off, the Maximum Cards value is the whole list.'),
            ),

            SectionField::make(
                name: 'per_page',
                label: translate('Cards Per Page'),
                type: InputEnum::NUMBER->value,
                store: FieldStore::SETTINGS,
                default: 9,
                group: 'Source',
                help: translate('Used only when Paginate is on.'),
            ),

            SectionField::make(
                name: 'show_date',
                label: translate('Show Publish Date'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: false,
                group: 'Layout',
                help: translate('For blog posts and case studies, where recency is part of what a reader is judging. Off for services and policies, where a date only makes the page look stale.'),
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
                    ['value' => 'start', 'label' => translate('Left')],
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
     * The pages this section lists.
     *
     * ONE query, with the card media eager-loaded in a second. Never a lazy
     * `->media` inside the resource — a thirty-service index would be thirty-one
     * queries, and a listing is where that mistake is easiest to make and
     * hardest to notice on a seeded database with four rows in it.
     *
     * @return array<int, array<string, mixed>>
     */
    public function resolveCollection(PageSection $section, Page $page): array
    {
        $settings = (array) ($section->settings ?? []);
        $source = $settings['source'] ?? self::SOURCE_CHILDREN;

        $query = Page::query()
            ->where('site_id', $page->site_id)
            ->where('locale', $page->locale)
            ->published()
            // An index must never list itself, which `children` cannot do but
            // `page_type` can the moment somebody types the index page's own
            // type into it.
            ->whereKeyNot($page->getKey())
            ->with([
                'media' => fn ($relation) => $relation->wherePivot(
                    'collection',
                    MediaCollection::CARD->value
                ),
            ]);

        if ($source === self::SOURCE_PAGE_TYPE) {
            $type = $settings['page_type'] ?? PageType::SERVICE->value;

            // An unrecognised stored value would otherwise match nothing and
            // render as an empty grid that looks like a bug.
            if (! in_array($type, PageType::getValues(), true)) {
                $type = PageType::SERVICE->value;
            }

            $query->where('page_type', $type);
        } else {
            $query->where('parent_id', $page->getKey());
        }

        match ($settings['order'] ?? 'manual') {
            'title' => $query->orderBy('title'),
            'recent' => $query->orderByDesc('published_at'),
            // `sort_order` is not unique among siblings, so a stable tiebreak
            // is required or two cards swap places between requests for no
            // reason the editor can see.
            default => $query->orderBy('sort_order')->orderBy('id'),
        };

        /*
         * Search, when the editor has switched it on.
         *
         * Title and excerpt only. Section bodies are not searched: they live in
         * `page_sections` across several columns and two JSON bags, so matching
         * them means either a join per column or a full-text index this schema
         * does not have — and a listing that matches on text the card does not
         * show returns results a reader cannot explain.
         *
         * `LIKE` with an escaped term rather than a raw one: `%` and `_` are
         * wildcards, so an unescaped search for "100%" silently matches
         * everything.
         */
        $searchable = (bool) ($settings['searchable'] ?? false);
        $term = $searchable ? trim((string) request()->query('q', '')) : '';

        if ($term !== '') {
            $escaped = str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $term);

            $query->where(function ($builder) use ($escaped): void {
                $builder
                    ->where('title', 'like', '%'.$escaped.'%')
                    ->orWhere('excerpt', 'like', '%'.$escaped.'%');
            });
        }

        $limit = (int) ($settings['limit'] ?? 0);
        $ceiling = $limit > 0 ? min($limit, self::MAX_ITEMS) : self::MAX_ITEMS;

        if (! ($settings['paginate'] ?? false)) {
            $items = PageCardResource::collection($query->limit($ceiling)->get())->resolve();

            return [
                'items' => $items,
                'meta' => [
                    'total' => count($items),
                    'per_page' => count($items),
                    'current_page' => 1,
                    'last_page' => 1,
                    'paginated' => false,
                    'searchable' => $searchable,
                    'term' => $term,
                ],
            ];
        }

        /*
         * Paginated. Counted BEFORE the page slice so "showing 10 of 47" is
         * the real total rather than the size of the current page, and clamped
         * so a hand-typed `?page=999` lands on the last real page instead of
         * an empty grid that looks like the listing broke.
         */
        $perPage = max(1, min((int) ($settings['per_page'] ?? 9), self::MAX_ITEMS));
        $total = (clone $query)->toBase()->getCountForPagination();
        $lastPage = max(1, (int) ceil($total / $perPage));
        $current = max(1, min((int) request()->query('page', 1), $lastPage));

        $rows = $query
            ->forPage($current, $perPage)
            ->get();

        return [
            'items' => PageCardResource::collection($rows)->resolve(),
            'meta' => [
                'total' => $total,
                'per_page' => $perPage,
                'current_page' => $current,
                'last_page' => $lastPage,
                'paginated' => true,
                'searchable' => $searchable,
                'term' => $term,
            ],
        ];
    }

    /**
     * Page types worth indexing.
     *
     * `home` and `system` are excluded: one of each exists and neither is
     * content somebody browses to from a grid.
     *
     * @return array<int, array<string, string>>
     */
    protected function pageTypeOptions(): array
    {
        $excluded = [PageType::HOME->value, PageType::SYSTEM->value];

        return collect(PageType::cases())
            ->reject(fn (PageType $case): bool => in_array($case->value, $excluded, true))
            ->map(fn (PageType $case): array => [
                'value' => $case->value,
                'label' => translate(ucfirst($case->value)),
            ])
            ->values()
            ->all();
    }

    /**
     * No repeater — the whole point is that the rows are other pages. A block
     * list here would be the hand-maintained duplicate this type exists to
     * remove.
     *
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
        return 'Frontend/Sections/CollectionIndex';
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
                'empty_message' => null,
            ],
            'settings' => [
                'source' => self::SOURCE_CHILDREN,
                'page_type' => PageType::SERVICE->value,
                'order' => 'manual',
                'limit' => 12,
                'layout' => 'card',
                'searchable' => false,
                'paginate' => false,
                'per_page' => 9,
                'show_date' => false,
                'columns' => 3,
                'align' => 'center',
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ];
    }
}

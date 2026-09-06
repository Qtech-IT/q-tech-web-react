<?php

namespace Database\Seeders\Cms;

use App\Enums\Cms\ContentStatus;
use App\Enums\Cms\CtaLinkType;
use App\Enums\Cms\IconPosition;
use App\Enums\Cms\MediaCollection;
use App\Enums\Cms\MenuLinkType;
use App\Enums\Cms\PageType;
use App\Enums\Common\Status;
use App\Enums\System\CacheKey;
use App\Http\Services\Frontend\NavigationService;
use App\Models\Block;
use App\Models\Cta;
use App\Models\Media;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\SectionBlock;
use App\Traits\Cms\CacheInvalidation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Shared primitives for every seeder that writes CMS content.
 *
 * WHY THIS EXISTS
 * ---------------
 * A page section is fourteen columns, and eight of them are the same on every
 * row a seeder will ever write: site, status, publish status, a published_at
 * that must be non-null AND in the past, an empty expires_at, and a `data`
 * array that must carry a `version` key. Writing that by hand once per section
 * is how the first seeder ended up 1,300 lines long; writing it by hand in
 * seven seeders is how one of them quietly gets `published_at` wrong and its
 * pages never appear.
 *
 * These are deliberately PRIMITIVES, not band builders. `section()` knows about
 * the columns every section shares and nothing about what a hero or an FAQ is —
 * composition stays in the family seeder, where the content lives. A base class
 * that knew how to build a hero would need a parameter for every field of every
 * section type, which is the same duplication wearing a hat.
 *
 * PUBLISHED, IN THE PAST
 * ----------------------
 * `Publishable::scopePublished()` filters on `published_at <= now()`, so a null
 * published_at is indistinguishable from an unpublished row. Every default here
 * stamps `now()->subMinute()` for that reason — the single most common way a
 * seeded page silently fails to render.
 */
abstract class CmsContentSeeder extends Seeder
{
    // Seeders write PageSection/SectionBlock rows directly rather than through
    // PageSectionService, so they owe the same cache invalidation that service
    // performs after every save.
    use CacheInvalidation;
    use CarriesSectionUuids;

    /** Cached so a seeder does not re-read config once per section. */
    private ?int $siteId = null;

    private ?string $locale = null;

    protected function siteId(): int
    {
        return $this->siteId ??= (int) config('cms.site_id');
    }

    protected function locale(): string
    {
        return $this->locale ??= get_system_locale();
    }

    /**
     * Create or update one page, keyed on the unique index.
     *
     * Keyed on `site_id` + `locale` + `path` because that IS `pages_path_unique`
     * — matching the index means a re-run updates the row that already owns the
     * URL rather than colliding with it.
     *
     * @param  array<string, mixed>  $attributes
     */
    protected function page(string $path, array $attributes): Page
    {
        $path = '/'.trim($path, '/');

        return Page::updateOrCreate(
            [
                'site_id' => $this->siteId(),
                'locale' => $this->locale(),
                'path' => $path,
            ],
            [
                // `uuid` is not fillable anywhere in this schema — `HasUuid`
                // assigns it on `creating`, so passing one is silently dropped.
                'translation_group_id' => (string) Str::uuid(),
                'slug' => $attributes['slug'] ?? basename($path),
                'parent_id' => $attributes['parent_id'] ?? null,
                'depth' => $attributes['depth'] ?? substr_count(ltrim($path, '/'), '/'),
                'title' => $attributes['title'],
                'excerpt' => $attributes['excerpt'] ?? null,
                'icon' => $attributes['icon'] ?? null,
                'accent' => $attributes['accent'] ?? null,
                'page_type' => $attributes['page_type'] ?? PageType::STANDARD->value,
                'template' => $attributes['template'] ?? 'default',
                'is_homepage' => false,
                'is_indexable' => $attributes['is_indexable'] ?? true,
                'status' => Status::ACTIVE->value,
                'publish_status' => ContentStatus::PUBLISHED->value,
                'published_at' => $attributes['published_at'] ?? now()->subMinute(),
                'expires_at' => null,
                'sort_order' => $attributes['sort_order'] ?? 0,
            ]
        );
    }

    /**
     * Replace a page's sections.
     *
     * `forceDelete`, not `delete`: `page_sections` soft-deletes, so a plain
     * delete would leave every previous run's rows in the table, still holding
     * their `sort_order`, growing without limit. Blocks cascade with them.
     */
    protected function clearSections(Page $page): void
    {
        // Keeps every section's route key stable across the delete below —
        // see `CarriesSectionUuids` for why that matters.
        $this->carrySectionUuids($page);

        PageSection::where('page_id', $page->id)->forceDelete();
    }

    /**
     * One section, with the shared columns filled in.
     *
     * `data.version` is forced present — the schema requires it so a later
     * `migrate(array $data)` hook never has to guess which rows predate which
     * shape, and a seeder omitting it writes exactly the rows that hook cannot
     * interpret.
     *
     * @param  array<string, mixed>  $attributes
     */
    protected function section(Page $page, string $type, int $sort, array $attributes = []): PageSection
    {
        $data = $attributes['data'] ?? [];
        $data['version'] = $data['version'] ?? 1;

        $section = new PageSection;

        $section->fill([
            'site_id' => $this->siteId(),
            'page_id' => $page->id,
            'section_type' => $type,
            'name' => $attributes['name'] ?? null,
            'anchor' => $attributes['anchor'] ?? null,
            'eyebrow' => $attributes['eyebrow'] ?? null,
            'heading' => $attributes['heading'] ?? null,
            'subheading' => $attributes['subheading'] ?? null,
            'body' => $attributes['body'] ?? null,
            'media_id' => $attributes['media_id'] ?? null,
            'cta_id' => $attributes['cta_id'] ?? null,
            'secondary_cta_id' => $attributes['secondary_cta_id'] ?? null,
            'data' => $data,
            'settings' => $attributes['settings'] ?? [],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => $sort,
        ]);

        $section->save();

        return $section;
    }

    /**
     * One repeater row.
     *
     * NOTE ON `accent`: the block types disagree about where it lives —
     * `service.grid` stores it in `data`, most others in `settings`. That is a
     * property of each section type, not something this method can normalise,
     * so callers pass whichever the type declares. Getting it wrong is silent:
     * the card renders with the cycled hue and nothing errors.
     *
     * @param  array<string, mixed>  $attributes
     */
    protected function block(PageSection $section, string $type, int $sort, array $attributes = []): SectionBlock
    {
        return SectionBlock::create([
            'page_section_id' => $section->id,
            'parent_id' => $attributes['parent_id'] ?? null,
            'block_type' => $type,
            'label' => $attributes['label'] ?? null,
            'value' => $attributes['value'] ?? null,
            'description' => $attributes['description'] ?? null,
            'body' => $attributes['body'] ?? null,
            'icon' => $attributes['icon'] ?? null,
            'media_id' => $attributes['media_id'] ?? null,
            'cta_id' => $attributes['cta_id'] ?? null,
            'data' => $attributes['data'] ?? [],
            'settings' => $attributes['settings'] ?? [],
            'status' => Status::ACTIVE->value,
            'sort_order' => $sort,
        ]);
    }

    /**
     * Flatten a passage of seeded HTML into the plain-text shape the structured
     * narrative bands expect: paragraphs separated by a blank line, and a
     * heading rendered as a `## ` line.
     *
     * Seed copy was authored as small HTML fragments (`<p>`, the occasional
     * `<h3>`). The structured sections that replaced the rich-text bands take a
     * plain textarea, so this converts once at seed time — walking the fragment
     * in document order so a mid-passage sub-heading keeps its place.
     */
    protected function htmlToNarrative(string $html): string
    {
        $doc = new \DOMDocument;
        libxml_use_internal_errors(true);
        $doc->loadHTML(
            '<?xml encoding="UTF-8"><div>'.$html.'</div>',
            LIBXML_NOERROR | LIBXML_NOWARNING
        );
        libxml_clear_errors();

        $blocks = [];

        foreach ($doc->getElementsByTagName('div')->item(0)?->childNodes ?? [] as $node) {
            if (! $node instanceof \DOMElement) {
                continue;
            }

            $text = trim((string) preg_replace('/\s+/', ' ', $node->textContent));

            if ($text === '') {
                continue;
            }

            $blocks[] = in_array(strtolower($node->tagName), ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], true)
                ? '## '.$text
                : $text;
        }

        return implode("\n\n", $blocks);
    }

    /**
     * A `content.overview` section — the argument for a service, industry or
     * technology, beside a grid of capability cards.
     *
     * `spec` keys: `name`, `eyebrow`, `heading`, `lead`, `highlight`, `html`
     * (the source argument fragment), `media_id`, `fallback_pillars` (used when
     * the HTML carries no `<li>` list), `pillar_icons` (cycled onto the cards),
     * `settings` (merged over the defaults).
     *
     * @param  array<string, mixed>  $spec
     */
    protected function overviewSection(Page $page, int $sort, array $spec): PageSection
    {
        [$paragraphs, $pillars] = $this->splitArgument($spec['html'] ?? '');

        if ($pillars === [] && ! empty($spec['fallback_pillars'])) {
            $pillars = $spec['fallback_pillars'];
        }

        $section = $this->section($page, 'content.overview', $sort, [
            'name' => $spec['name'] ?? ($page->title.' Overview'),
            'eyebrow' => $spec['eyebrow'] ?? null,
            'heading' => $spec['heading'] ?? null,
            'subheading' => $spec['lead'] ?? null,
            'body' => implode("\n\n", $paragraphs),
            'media_id' => $spec['media_id'] ?? null,
            'data' => [
                'heading_highlight' => $spec['highlight'] ?? null,
                'media_caption' => null,
            ],
            'settings' => array_merge([
                'layout' => $pillars === [] ? 'stacked' : 'split',
                'pillar_columns' => '2',
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ], $spec['settings'] ?? []),
        ]);

        $icons = array_values($spec['pillar_icons'] ?? []);
        $accents = ['brand', 'teal', 'violet', 'amber', 'rose', 'ink'];

        foreach ($pillars as $position => $pillar) {
            $this->block($section, 'pillar', $position, [
                'label' => $pillar['label'],
                'description' => $pillar['description'] ?? null,
                'icon' => $icons[$position] ?? null,
                'settings' => ['accent' => $accents[$position % count($accents)]],
            ]);
        }

        return $section;
    }

    /**
     * Split an argument's HTML into plain paragraphs and capability rows.
     *
     * `<p>` becomes a paragraph. A `<li>` opening with `<strong>` becomes a
     * card — the bold run is the title, the rest the description. A `<li>` with
     * no bold lead keeps its first few words as a title so nothing is lost.
     *
     * @return array{0: array<int, string>, 1: array<int, array{label: string, description: string}>}
     */
    protected function splitArgument(string $html): array
    {
        if (trim($html) === '') {
            return [[], []];
        }

        $doc = new \DOMDocument;
        libxml_use_internal_errors(true);
        $doc->loadHTML('<?xml encoding="UTF-8"><div>'.$html.'</div>', LIBXML_NOERROR | LIBXML_NOWARNING);
        libxml_clear_errors();

        $paragraphs = [];

        foreach ($doc->getElementsByTagName('p') as $node) {
            $text = trim((string) preg_replace('/\s+/', ' ', $node->textContent));

            if ($text !== '') {
                $paragraphs[] = $text;
            }
        }

        $pillars = [];

        foreach ($doc->getElementsByTagName('li') as $node) {
            $full = trim((string) preg_replace('/\s+/', ' ', $node->textContent));

            if ($full === '') {
                continue;
            }

            $strong = $node->getElementsByTagName('strong')->item(0);
            $lead = $strong ? trim((string) preg_replace('/\s+/', ' ', $strong->textContent)) : '';

            if ($lead !== '' && str_starts_with($full, $lead)) {
                $label = rtrim($lead, " .\u{00A0}");
                $description = ltrim(mb_substr($full, mb_strlen($lead)), " .\u{00A0}");
            } else {
                $label = rtrim(Str::words($full, 3, ''), " .\u{00A0}");
                $description = $full;
            }

            $pillars[] = [
                'label' => $label,
                'description' => $description !== '' ? $description : $label,
            ];
        }

        return [$paragraphs, $pillars];
    }

    /**
     * A `content.blocks` section whose blocks are converted, once, from a
     * passage of seeded HTML.
     *
     * The old blog and policy bodies were authored as HTML fragments for a
     * rich-text field. `content.blocks` is structured — one typed block per row
     * — so this walks the fragment in document order and emits a `block` row
     * per element: `<p>` → paragraph, `<h2..h4>` → heading, `<ul>/<ol>` → list,
     * `<blockquote>` → quote, `<pre>` → code, `<table>` → table.
     *
     * @param  array<string, mixed>  $settings
     */
    protected function articleBody(Page $page, int $sort, string $html, array $settings = []): PageSection
    {
        $section = $this->section($page, 'content.blocks', $sort, [
            'name' => ($page->title ?? 'Article').' Body',
            'settings' => array_merge([
                'measure' => 'prose',
                'theme' => 'default',
                'spacing' => 'default',
                'animation' => 'none',
            ], $settings),
        ]);

        foreach ($this->htmlToBlocks($html) as $i => $spec) {
            $this->block($section, 'block', $i, [
                'label' => $spec['label'] ?? null,
                'body' => $spec['body'] ?? null,
                'settings' => array_merge(['kind' => $spec['kind']], $spec['settings'] ?? []),
            ]);
        }

        return $section;
    }

    /**
     * Convert a passage of seeded HTML into ordered `content.blocks` specs.
     *
     * @return array<int, array{kind: string, label?: ?string, body?: ?string, settings?: array<string, mixed>}>
     */
    protected function htmlToBlocks(string $html): array
    {
        $doc = new \DOMDocument;
        libxml_use_internal_errors(true);
        $doc->loadHTML(
            '<?xml encoding="UTF-8"><div>'.$html.'</div>',
            LIBXML_NOERROR | LIBXML_NOWARNING
        );
        libxml_clear_errors();

        $collapse = fn (string $text): string => trim((string) preg_replace('/[ \t]+/', ' ', $text));
        $specs = [];

        foreach ($doc->getElementsByTagName('div')->item(0)?->childNodes ?? [] as $node) {
            if (! $node instanceof \DOMElement) {
                continue;
            }

            $tag = strtolower($node->tagName);
            $text = $collapse(preg_replace('/\s*\n\s*/', ' ', $node->textContent) ?? '');

            if ($text === '' && $tag !== 'table') {
                continue;
            }

            $specs[] = match (true) {
                in_array($tag, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], true) => [
                    'kind' => 'heading',
                    'label' => $text,
                    'settings' => ['level' => $tag === 'h2' || $tag === 'h1' ? 'h2' : ($tag === 'h3' ? 'h3' : 'h4')],
                ],
                in_array($tag, ['ul', 'ol'], true) => [
                    'kind' => 'list',
                    'body' => $this->listItems($node, $collapse),
                    'settings' => ['list_style' => $tag === 'ol' ? 'number' : 'bullet'],
                ],
                $tag === 'blockquote' => ['kind' => 'quote', 'body' => $text],
                $tag === 'pre' => ['kind' => 'code', 'body' => trim($node->textContent)],
                $tag === 'table' => [
                    'kind' => 'table',
                    'body' => $this->tableRows($node, $collapse),
                    'settings' => ['table_header' => $node->getElementsByTagName('th')->length > 0],
                ],
                default => ['kind' => 'paragraph', 'body' => $text],
            };
        }

        return $specs;
    }

    /**
     * `<li>` text content, one per line.
     */
    private function listItems(\DOMElement $list, callable $collapse): string
    {
        $items = [];

        foreach ($list->getElementsByTagName('li') as $li) {
            $text = $collapse(preg_replace('/\s*\n\s*/', ' ', $li->textContent) ?? '');

            if ($text !== '') {
                $items[] = $text;
            }
        }

        return implode("\n", $items);
    }

    /**
     * `<tr>` rows as pipe-separated cells, one row per line.
     */
    private function tableRows(\DOMElement $table, callable $collapse): string
    {
        $rows = [];

        foreach ($table->getElementsByTagName('tr') as $tr) {
            $cells = [];

            foreach ($tr->childNodes as $cell) {
                if ($cell instanceof \DOMElement && in_array(strtolower($cell->tagName), ['th', 'td'], true)) {
                    $cells[] = $collapse(preg_replace('/\s*\n\s*/', ' ', $cell->textContent) ?? '');
                }
            }

            if ($cells !== []) {
                $rows[] = implode(' | ', $cells);
            }
        }

        return implode("\n", $rows);
    }

    /**
     * A button, keyed on its tracking id so a re-run updates rather than
     * duplicates.
     *
     * Every button on a seeded page is a real `ctas` row — which is what makes
     * them editable, reusable and reportable from the admin rather than being
     * strings frozen into a section.
     *
     * @param  array<string, mixed>  $spec
     */
    protected function cta(string $trackingId, array $spec): Cta
    {
        return Cta::updateOrCreate(
            [
                'site_id' => $this->siteId(),
                'tracking_id' => $trackingId,
            ],
            [
                'label' => $spec['label'],
                'link_type' => CtaLinkType::URL->value,
                'url' => $spec['url'],
                'variant' => $spec['variant'] ?? 'default',
                'size' => $spec['size'] ?? 'lg',
                'icon' => $spec['icon'] ?? null,
                'icon_position' => IconPosition::RIGHT->value,
                'status' => Status::ACTIVE->value,
            ]
        );
    }

    /**
     * The closing "talk to us" band every marketing page ends on.
     *
     * Here rather than in each family seeder because it is genuinely identical
     * everywhere — same tone, same two buttons, same footer weld — and the only
     * thing that varies is the sentence.
     *
     * @param  array<string, mixed>  $spec
     */
    protected function closingBand(Page $page, int $sort, array $spec): PageSection
    {
        $key = $spec['key'];

        return $this->section($page, 'cta.final', $sort, [
            'name' => 'Closing CTA',
            'eyebrow' => $spec['eyebrow'] ?? 'Next Step',
            'heading' => $spec['heading'],
            'subheading' => $spec['subheading'] ?? null,
            'cta_id' => $this->cta($key.'-close-primary', [
                'label' => $spec['primary_label'] ?? 'Book A Scoping Call',
                'url' => $spec['primary_url'] ?? '/contact',
                'icon' => 'ArrowRight',
            ])->id,
            'secondary_cta_id' => $this->cta($key.'-close-secondary', [
                'label' => $spec['secondary_label'] ?? 'See Our Work',
                'url' => $spec['secondary_url'] ?? '/case-studies',
                'variant' => 'outline',
            ])->id,
            'data' => [
                'heading_highlight' => $spec['highlight'] ?? null,
                'footnote' => $spec['footnote'] ?? null,
            ],
            'settings' => [
                'tone' => 'ink',
                'align' => 'start',
                // Welds the panel to the footer rather than leaving a seam of
                // page background between the two.
                'merge_footer' => true,
                'spacing' => 'default',
                'animation' => 'rise',
            ],
        ]);
    }

    /**
     * A `collection.index` band listing this page's children.
     *
     * `source: children` stores no page id, so renaming or re-parenting the
     * index cannot strand it and a newly published child appears with no second
     * edit. See `CollectionIndexType`.
     *
     * @param  array<string, mixed>  $spec
     */
    protected function indexBand(Page $page, int $sort, array $spec): PageSection
    {
        return $this->section($page, 'collection.index', $sort, [
            'name' => $spec['name'] ?? 'Index',
            'anchor' => $spec['anchor'] ?? null,
            'eyebrow' => $spec['eyebrow'] ?? null,
            'heading' => $spec['heading'] ?? null,
            'subheading' => $spec['subheading'] ?? null,
            'data' => [
                'heading_highlight' => $spec['highlight'] ?? null,
                'empty_message' => $spec['empty_message'] ?? null,
            ],
            'settings' => [
                'source' => $spec['source'] ?? 'children',
                'page_type' => $spec['page_type'] ?? PageType::SERVICE->value,
                'order' => $spec['order'] ?? 'manual',
                'limit' => $spec['limit'] ?? 24,
                'layout' => $spec['layout'] ?? 'card',
                // Dated listings — blog, case studies — where recency is part
                // of what a reader is judging. Off elsewhere, where a date only
                // makes a service page look stale.
                'show_date' => $spec['show_date'] ?? false,
                'searchable' => $spec['searchable'] ?? false,
                'paginate' => $spec['paginate'] ?? false,
                'per_page' => $spec['per_page'] ?? 9,
                'columns' => $spec['columns'] ?? 3,
                'align' => $spec['align'] ?? 'center',
                'theme' => $spec['theme'] ?? 'default',
                'spacing' => $spec['spacing'] ?? 'lg',
                'animation' => 'stagger',
            ],
        ]);
    }

    /**
     * Attach one library image to a page's CARD collection.
     *
     * WHY THE PIVOT AND NOT A COLUMN
     * ------------------------------
     * Media never lives in a column on the owner or inside a JSON bag. It goes
     * through `mediables`, which is what gives it a foreign key and a reverse
     * index — so "what uses this asset?" is answerable before somebody deletes
     * it, and a card image is not silently orphaned when a page is removed.
     *
     * `syncWithoutDetaching` on a single-item array would leave a previous
     * image attached in the same collection, so the collection is detached
     * first: a page has one card image, and a re-run must replace it rather
     * than accumulate a second.
     */
    protected function attachCard(Page $page, ?Media $media): void
    {
        if (! $media instanceof Media) {
            return;
        }

        $page->media()->wherePivot('collection', MediaCollection::CARD->value)->detach();

        $page->media()->attach($media->id, [
            'collection' => MediaCollection::CARD->value,
            'sort_order' => 0,
        ]);
    }

    /**
     * Re-point existing navigation entries at pages that now exist.
     *
     * BY `page_id`, NOT BY URL, for three reasons that are all properties of
     * `menu_items.page_id`:
     *
     * - Renaming a page in the tree moves the menu with it. A stored URL keeps
     *   pointing at the old address and relies on the redirect, which is a
     *   safety net rather than navigation.
     * - `NavigationService::linkType()` maps a `url` item to `external` and
     *   everything else to `internal`, so a URL link forces a full page load on
     *   every click of the primary nav. A page link routes through Inertia.
     * - Deleting a page a menu points at is caught by the broken-link report
     *   rather than discovered by a visitor.
     *
     * Matched on the item's LABEL because that is what an editor recognises and
     * what survives the URL changing underneath it. Items whose label is not in
     * the map are left exactly as they are — a seeder must not quietly rewrite
     * navigation nobody asked it to touch.
     *
     * @param  array<string, Page>  $byLabel  Menu item label => page to link.
     */
    protected function linkMenuItems(array $byLabel): int
    {
        $linked = 0;

        foreach ($byLabel as $label => $page) {
            /*
             * URL and unlinked entries are claimed; so are entries ALREADY
             * pointing at this same page.
             *
             * The second half is what makes this idempotent. Without it a
             * second run skips everything it converted on the first, which
             * matters because the status reset below is the only thing that
             * un-hides an entry `NavigationRepairSeeder` hid before its page
             * existed. Re-matching a page link to the page it already names is
             * a no-op on link_type and the fix for its visibility.
             *
             * Entries pointing at a DIFFERENT page are left alone — that is an
             * editor's decision, not stale data.
             */
            $items = MenuItem::where('label', $label)
                ->where(function ($query) use ($page) {
                    $query
                        ->whereIn('link_type', [MenuLinkType::URL->value, MenuLinkType::NONE->value])
                        ->orWhere(fn ($sub) => $sub
                            ->where('link_type', MenuLinkType::PAGE->value)
                            ->where('page_id', $page->id));
                })
                ->get();

            foreach ($items as $item) {
                $item->update([
                    'link_type' => MenuLinkType::PAGE->value,
                    'page_id' => $page->id,
                    'url' => null,
                    /*
                     * Re-activated as part of linking.
                     *
                     * `NavigationRepairSeeder` hides entries whose target does
                     * not exist, and it can only judge URL links — once an item
                     * is a page link there is no URL left to check. Without
                     * this, an entry hidden on one run and given a real page on
                     * the next would stay invisible forever, with nothing in
                     * either seeder able to notice. Pointing an item at a page
                     * that exists is exactly the moment it should come back.
                     */
                    'status' => Status::ACTIVE->value,
                ]);

                $linked++;
            }
        }

        if ($linked > 0) {
            // The presented navigation tree is cached; without this the menu
            // keeps serving the old hrefs until the cache expires on its own.
            app(NavigationService::class)->forget();
        }

        return $linked;
    }

    /**
     * Promote a section's content into a reusable global block.
     *
     * THE PROBLEM THIS SOLVES
     * -----------------------
     * The same FAQ was authored twice — once on the homepage and once on
     * `/faq` — and the same about copy twice more. Two copies of one answer is
     * two answers the moment somebody edits one of them, and nothing in the
     * CMS would ever tell you they had diverged.
     *
     * A block is authored ONCE. Its content lives in a `page_sections` row with
     * `page_id` NULL, and every page that wants it holds a lightweight
     * reference row instead of a copy. `PageSectionService::resolveShared()`
     * swaps the content in at render time.
     *
     * HOW THE MOVE WORKS
     * ------------------
     * The source section is not copied — it is RE-OWNED. Its `page_id` is
     * nulled and its `block_id` set, which turns the row itself into the
     * block's body, and the page gets a reference in its place at the same
     * position. Copying instead would leave the original behind as a third
     * divergent version, which is the problem rather than the fix.
     *
     * PLACEMENTS ARE PER PAGE. The same block sits fifteenth on the homepage
     * and first on the page dedicated to it, so each reference carries its own
     * `sort_order` — taking the source section's position for every page would
     * bury a page's headline content halfway down it.
     *
     * @param  array<int, array{page: Page, sort_order: int, anchor?: string|null}>  $placements
     */
    protected function shareSection(
        PageSection $section,
        string $key,
        string $name,
        array $placements = [],
        ?string $description = null,
    ): Block {
        $block = Block::updateOrCreate(
            ['site_id' => $this->siteId(), 'key' => $key],
            [
                'name' => $name,
                'description' => $description,
                'section_type' => $section->section_type,
                // Not locked: an editor may delete this once nothing uses it.
                // Locking is for blocks a hard-coded layout slot resolves by
                // key, which these are not.
                'is_locked' => false,
                'status' => Status::ACTIVE->value,
                'publish_status' => ContentStatus::PUBLISHED->value,
                'published_at' => now()->subMinute(),
                'sort_order' => 0,
            ]
        );

        // Any previous body for this block, from an earlier run.
        PageSection::whereNull('page_id')
            ->where('block_id', $block->id)
            ->whereKeyNot($section->getKey())
            ->forceDelete();

        // Re-own the row: it stops being a page's section and becomes the
        // block's body. Its repeater rows come with it untouched, which is why
        // this is a move rather than a copy.
        $section->page_id = null;
        $section->block_id = $block->id;
        $section->save();

        foreach ($placements as $placement) {
            $page = $placement['page'] ?? null;

            if (! $page instanceof Page) {
                continue;
            }

            $this->referenceBlock(
                $page,
                $block,
                (int) ($placement['sort_order'] ?? 0),
                $placement['anchor'] ?? null,
            );
        }

        return $block;
    }

    /**
     * Place a reference to a global block on a page.
     *
     * The reference carries no content — only where it sits and, optionally, an
     * anchor for a jump link, which is a property of the page rather than of
     * the shared content.
     */
    protected function referenceBlock(
        Page $page,
        Block $block,
        int $sortOrder,
        ?string $anchor = null,
    ): PageSection {
        return PageSection::updateOrCreate(
            [
                'page_id' => $page->id,
                'block_id' => $block->id,
            ],
            [
                'site_id' => $this->siteId(),
                'section_type' => $block->section_type,
                'name' => $block->name,
                'anchor' => $anchor,
                'data' => ['version' => 1],
                'settings' => [],
                'status' => Status::ACTIVE->value,
                'publish_status' => ContentStatus::PUBLISHED->value,
                'published_at' => now()->subMinute(),
                'sort_order' => $sortOrder,
            ]
        );
    }

    /** Drop the cached render payloads this seeder's writes have invalidated. */
    protected function flushPageCache(): void
    {
        $this->forgetFamily(CacheKey::CMS_PAGE->value);
    }
}

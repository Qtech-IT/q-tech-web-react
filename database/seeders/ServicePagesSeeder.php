<?php

namespace Database\Seeders;

use App\Enums\Cms\ContentStatus;
use App\Enums\Cms\CtaLinkType;
use App\Enums\Cms\IconPosition;
use App\Enums\Cms\MenuLinkType;
use App\Enums\Cms\MenuVisibility;
use App\Enums\Cms\PageType;
use App\Enums\Common\Status;
use App\Enums\System\CacheKey;
use App\Models\Cta;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\SectionBlock;
use App\Traits\Cms\CacheInvalidation;
use Database\Seeders\Cms\CarriesSectionUuids;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * The services tree: `/services` and the six pages beneath it.
 *
 * WHAT THIS DEMONSTRATES
 * ----------------------
 * That a "service" needs no model, no table, no controller and no routes. Every
 * page here is an ordinary `Page` row with `page_type = service`, parented to
 * the index, resolving through the same catch-all as everything else. The
 * index is not a hand-maintained list either — it is one `collection.index`
 * section that reads the tree, so publishing a seventh service makes it appear
 * with no second edit.
 *
 * Adding `/technologies` or `/privacy-policy` later is this file with different
 * words in it. No code.
 *
 * IDEMPOTENT
 * ----------
 * Pages are keyed on `site_id` + `locale` + `path`, which is exactly the unique
 * index on `pages`; sections are force-deleted per page before being rewritten,
 * so a re-run replaces content rather than stacking a second copy. Safe to call
 * from `DatabaseSeeder` on every deploy.
 *
 * DEMO CONTENT
 * ------------
 * The copy is written for QTECH and is plausible, but it is placeholder: the
 * numbers in the hero stats, the timelines in the FAQs and the deliverable
 * lists are illustrative and must be reviewed before launch. Nothing here names
 * a client, quotes a person who does not exist, or claims a certification.
 */
class ServicePagesSeeder extends Seeder
{
    // A seeder writes `PageSection` rows directly rather than through
    // `PageSectionService`, so it has to do that service's cache invalidation
    // itself — or the 12h cached payload keeps serving pre-seed content.
    use CacheInvalidation;
    use CarriesSectionUuids;

    /** The index page's own path. Everything below hangs off it. */
    private const ROOT_PATH = '/services';

    public function run(): void
    {
        $siteId = (int) config('cms.site_id');
        $locale = get_system_locale();

        $index = $this->indexPage($siteId, $locale);

        foreach ($this->services() as $position => $service) {
            $page = $this->servicePage($index, $siteId, $locale, $position, $service);

            $this->buildServicePage($page, $siteId, $service);
        }

        // After the children, so its `collection.index` has something to list
        // the first time anybody looks at it.
        $this->buildIndexPage($index, $siteId);

        $this->linkNavigation($index);

        $this->forgetFamily(CacheKey::CMS_PAGE->value);
    }

    /**
     * Point the header's Services menu at the pages that now exist.
     *
     * BY `page_id`, NOT BY URL. Three things follow from that choice, and all
     * three are the reason `menu_items.page_id` exists:
     *
     * - Renaming a service in the page tree moves the menu with it. A stored
     *   URL would keep pointing at the old address and rely on the redirect,
     *   which is a safety net rather than navigation.
     * - `NavigationService::linkType()` maps a `url` item to `external` and
     *   everything else to `internal`, so a URL link forces a full page load
     *   on every click of the primary nav. A page link routes through Inertia.
     * - Deleting a page that a menu points at is reported by the broken-link
     *   check rather than discovered by a visitor.
     *
     * Only the first column is rewritten — it held four links to pages that
     * were never created (`/services/staff-augmentation` and friends). The two
     * heading columns below it are left exactly as an editor arranged them.
     */
    protected function linkNavigation(Page $index): void
    {
        $parent = MenuItem::whereHas(
            'menu',
            fn ($query) => $query->where('location', 'header')
        )->whereNull('parent_id')->where('label', 'Services')->first();

        if (! $parent instanceof MenuItem) {
            return;
        }

        // The top-level trigger pointed at `/service` — singular, and a page
        // that has never existed.
        $parent->update([
            'link_type' => MenuLinkType::PAGE->value,
            'page_id' => $index->id,
            'url' => null,
        ]);

        $pages = Page::where('parent_id', $index->id)
            ->orderBy('sort_order')
            ->get();

        foreach ($pages as $position => $page) {
            MenuItem::updateOrCreate(
                [
                    'menu_id' => $parent->menu_id,
                    'parent_id' => $parent->id,
                    'label' => $page->title,
                ],
                [
                    // The materialised ancestor path `MenuTreeService` owns.
                    // NOT NULL with no default, and this seeder writes rows
                    // directly rather than through that service, so it has to
                    // compute the same value the service would.
                    'path' => $parent->path.$parent->id.'/',
                    'depth' => $parent->depth + 1,
                    'description' => $page->excerpt,
                    'icon' => $page->icon,
                    'link_type' => MenuLinkType::PAGE->value,
                    'page_id' => $page->id,
                    'url' => null,
                    'visibility' => MenuVisibility::ALWAYS->value,
                    'status' => Status::ACTIVE->value,
                    'sort_order' => $position,
                ]
            );
        }

        /*
         * The four placeholder links this column used to hold. Removed by
         * label, not by a blanket delete of the column: the editor may have
         * added their own entries since, and a seeder must not eat them.
         */
        MenuItem::where('parent_id', $parent->id)
            ->whereIn('label', [
                'Staff Augmentation',
                'Dedicated Teams',
                'Software Outsourcing',
                'AI Transformation',
            ])
            ->delete();

        $this->renumberPanel($parent, $pages->pluck('id')->all());
    }

    /**
     * Renumber the Services panel so the real pages lead it.
     *
     * Necessary because `sort_order` is not unique among siblings and this
     * method adds six rows to a column that already had its own: numbering the
     * new links 0–5 collided with the existing heading columns, and the tie was
     * broken by insertion id — which put one service page below a heading it
     * has nothing to do with.
     *
     * Service links take the first block of numbers in page-tree order;
     * everything else keeps its RELATIVE order and follows. Deterministic, so
     * re-running produces the same arrangement rather than rotating the panel.
     *
     * @param  array<int, int>  $pageIds
     */
    protected function renumberPanel(MenuItem $parent, array $pageIds): void
    {
        $children = MenuItem::where('parent_id', $parent->id)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        [$linked, $rest] = $children->partition(
            fn (MenuItem $item): bool => in_array($item->page_id, $pageIds, true)
        );

        // Page-tree order, not menu order — the page tree is where an editor
        // arranges services, and the nav should follow that one source.
        $ordered = $linked
            ->sortBy(fn (MenuItem $item): int => array_search($item->page_id, $pageIds, true))
            ->values()
            ->concat($rest->values());

        foreach ($ordered as $position => $item) {
            if ($item->sort_order !== $position) {
                $item->update(['sort_order' => $position]);
            }
        }
    }

    /**
     * The `/services` landing page.
     *
     * `standard`, not `service`: it is the index OF services, and typing it as
     * one would make it list itself the moment somebody switched the index band
     * to "every page of one type".
     */
    protected function indexPage(int $siteId, string $locale): Page
    {
        return Page::updateOrCreate(
            [
                'site_id' => $siteId,
                'locale' => $locale,
                'path' => self::ROOT_PATH,
            ],
            [
                'translation_group_id' => (string) Str::uuid(),
                'slug' => 'services',
                'parent_id' => null,
                'depth' => 0,
                'title' => 'Services',
                'excerpt' => 'Engineering, design and delivery for teams shipping software that has to hold up.',
                'icon' => 'LayoutGrid',
                'accent' => 'brand',
                'page_type' => PageType::STANDARD->value,
                'template' => 'default',
                'is_homepage' => false,
                'is_indexable' => true,
                'status' => Status::ACTIVE->value,
                'publish_status' => ContentStatus::PUBLISHED->value,
                // Non-null AND in the past: `scopePublished` filters on
                // `published_at <= now()`, so null is indistinguishable from
                // unpublished.
                'published_at' => now()->subMinute(),
                'expires_at' => null,
                'sort_order' => 1,
            ]
        );
    }

    /**
     * One service page.
     *
     * The card metadata — excerpt, icon, accent — is what `collection.index`
     * renders on `/services`. It lives on the page rather than on the index
     * section precisely so that the summary travels with the page it describes
     * and cannot go stale when the page is rewritten.
     */
    protected function servicePage(
        Page $index,
        int $siteId,
        string $locale,
        int $position,
        array $service,
    ): Page {
        return Page::updateOrCreate(
            [
                'site_id' => $siteId,
                'locale' => $locale,
                'path' => self::ROOT_PATH.'/'.$service['slug'],
            ],
            [
                'translation_group_id' => (string) Str::uuid(),
                'slug' => $service['slug'],
                'parent_id' => $index->id,
                'depth' => 1,
                'title' => $service['title'],
                'excerpt' => $service['excerpt'],
                'icon' => $service['icon'],
                'accent' => $service['accent'],
                'page_type' => PageType::SERVICE->value,
                'template' => 'default',
                'is_homepage' => false,
                'is_indexable' => true,
                'status' => Status::ACTIVE->value,
                'publish_status' => ContentStatus::PUBLISHED->value,
                'published_at' => now()->subMinute(),
                'expires_at' => null,
                'sort_order' => $position,
            ]
        );
    }

    /**
     * The index page's own bands: a hero, the auto-updating grid, and a close.
     */
    protected function buildIndexPage(Page $page, int $siteId): void
    {
        $this->carrySectionUuids($page);
        $this->clearSections($page);

        $primary = $this->cta($siteId, 'services-index-primary', [
            'label' => 'Start A Conversation',
            'url' => '/contact',
            'variant' => 'default',
            'size' => 'lg',
            'icon' => 'ArrowRight',
        ]);

        PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'hero.centered',
            'name' => 'Services Hero',
            'anchor' => null,
            'eyebrow' => 'What We Do',
            'heading' => 'Software Teams Hire Us To Finish',
            'subheading' => 'Six disciplines, one bench, and a delivery process that survives contact with a real deadline. Every engagement is scoped by the people who will build it.',
            'body' => null,
            'media_id' => null,
            'cta_id' => $primary->id,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                'heading_highlight' => 'Finish',
            ],
            'settings' => [
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'rise',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 0,
        ]);

        /*
         * The index band itself.
         *
         * `source: children` — no page id is stored anywhere, so renaming or
         * re-parenting `/services` cannot strand this, and a new child appears
         * without anyone editing this section.
         */
        PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'collection.index',
            'name' => 'All Services',
            'anchor' => 'all-services',
            'eyebrow' => null,
            'heading' => 'Every Discipline We Practise',
            'subheading' => 'Engaged individually or as one delivery team. Most clients start with one and add the next once the first has shipped.',
            'body' => null,
            'media_id' => null,
            'cta_id' => null,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                'heading_highlight' => 'Discipline',
                'empty_message' => 'Our service pages are being written. Get in touch and we will talk you through what we do.',
            ],
            'settings' => [
                'source' => 'children',
                'page_type' => PageType::SERVICE->value,
                'order' => 'manual',
                'limit' => 12,
                'layout' => 'icon',
                'columns' => 3,
                'align' => 'center',
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 1,
        ]);

        $this->addClosing($page, $siteId, 2, [
            'key' => 'services-index',
            'eyebrow' => 'Next Step',
            'heading' => 'Tell Us What You Are Building',
            'highlight' => 'Building',
            'subheading' => 'A scoping call with the engineer who would lead the work — not a salesperson reading a deck.',
            'footnote' => 'Most calls are 30 minutes. You leave with an approach whether or not you hire us.',
        ]);
    }

    /**
     * One service page's bands, from its spec.
     *
     * Every band is conditional on its content existing, so a lighter service
     * simply omits keys rather than needing a second builder. That is also what
     * lets an editor delete a band in the admin without this seeder's structure
     * implying it must come back.
     */
    protected function buildServicePage(Page $page, int $siteId, array $service): void
    {
        $this->carrySectionUuids($page);
        $this->clearSections($page);

        $sort = 0;

        $this->addHero($page, $siteId, $sort++, $service);

        if (isset($service['argument'])) {
            $this->addProse($page, $siteId, $sort++, $service);
        }

        if (isset($service['offerings'])) {
            $this->addOfferings($page, $siteId, $sort++, $service);
        }

        if (isset($service['includes'])) {
            $this->addIncludes($page, $siteId, $sort++, $service);
        }

        if (isset($service['benefits'])) {
            $this->addBenefits($page, $siteId, $sort++, $service);
        }

        if (isset($service['steps'])) {
            $this->addProcess($page, $siteId, $sort++, $service);
        }

        if (isset($service['faqs'])) {
            $this->addFaq($page, $siteId, $sort++, $service);
        }

        $this->addClosing($page, $siteId, $sort, [
            'key' => $service['slug'],
            'eyebrow' => 'Next Step',
            'heading' => $service['close_heading'],
            'highlight' => $service['close_highlight'] ?? null,
            'subheading' => $service['close_body'],
            'footnote' => 'No obligation, and no deck. Thirty minutes with the person who would lead the work.',
        ]);
    }

    /* --------------------------------------------------------------------- */
    /* Band builders */
    /* --------------------------------------------------------------------- */

    protected function addHero(Page $page, int $siteId, int $sort, array $service): void
    {
        $primary = $this->cta($siteId, $service['slug'].'-hero-primary', [
            'label' => 'Book A Scoping Call',
            'url' => '/contact',
            'variant' => 'default',
            'size' => 'lg',
            'icon' => 'ArrowRight',
        ]);

        $secondary = $this->cta($siteId, $service['slug'].'-hero-secondary', [
            'label' => 'See Our Work',
            'url' => '/case-studies',
            'variant' => 'outline',
            'size' => 'lg',
            'icon' => null,
        ]);

        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'hero.split',
            'name' => $service['title'].' Hero',
            'anchor' => null,
            'eyebrow' => 'Services',
            'heading' => $service['hero_heading'],
            'subheading' => $service['hero_subheading'],
            'body' => null,
            'media_id' => null,
            'cta_id' => $primary->id,
            'secondary_cta_id' => $secondary->id,
            'data' => [
                'version' => 1,
                'heading_highlight' => $service['hero_highlight'] ?? null,
                'scroll_cue_label' => null,
                'testimonial_quote' => null,
                'testimonial_author' => null,
            ],
            'settings' => [
                'layout' => 'split',
                'media_side' => 'right',
                'media_frame' => 'panel',
                'overlay_opacity' => 0,
                'animation' => 'rise',
                'theme' => 'default',
                'spacing' => 'lg',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => $sort,
        ]);

        foreach ($service['stats'] ?? [] as $position => $stat) {
            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'stat',
                'label' => $stat['label'],
                'value' => $stat['value'],
                'description' => null,
                'body' => null,
                'icon' => null,
                'media_id' => null,
                'cta_id' => null,
                'data' => [
                    'prefix' => $stat['prefix'] ?? null,
                    'suffix' => $stat['suffix'] ?? null,
                ],
                'settings' => [],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /** The argument — why this discipline is worth paying for. */
    protected function addProse(Page $page, int $siteId, int $sort, array $service): void
    {
        PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'content.prose',
            'name' => $service['title'].' Argument',
            'anchor' => null,
            'eyebrow' => null,
            'heading' => $service['argument']['heading'],
            'subheading' => $service['argument']['lead'] ?? null,
            'body' => $service['argument']['html'],
            'media_id' => null,
            'cta_id' => null,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                'heading_highlight' => $service['argument']['highlight'] ?? null,
                'media_caption' => null,
            ],
            'settings' => [
                'measure' => 'prose',
                'align' => 'start',
                'theme' => 'default',
                'spacing' => 'default',
                'animation' => 'fade',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => $sort,
        ]);
    }

    /** What the service actually covers, as a card grid. */
    protected function addOfferings(Page $page, int $siteId, int $sort, array $service): void
    {
        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'service.grid',
            'name' => $service['title'].' Offerings',
            'anchor' => 'what-we-do',
            'eyebrow' => 'What We Deliver',
            'heading' => $service['offerings_heading'],
            'subheading' => $service['offerings_subheading'] ?? null,
            'body' => null,
            'media_id' => null,
            'cta_id' => null,
            'secondary_cta_id' => null,
            'data' => ['version' => 1],
            'settings' => [
                'columns' => 3,
                'theme' => 'subtle',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => $sort,
        ]);

        foreach ($service['offerings'] as $position => $card) {
            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'service',
                'label' => $card['label'],
                'value' => null,
                'description' => $card['description'],
                'body' => null,
                'icon' => $card['icon'],
                'media_id' => null,
                'cta_id' => null,
                // `service.grid` stores its accent in `data`, unlike most block
                // types — see `ServiceGridType`. Getting this wrong is silent:
                // the card renders with the cycled hue and nothing errors.
                'data' => ['accent' => $card['accent']],
                'settings' => [],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /** The deliverables checklist beside an image. */
    protected function addIncludes(Page $page, int $siteId, int $sort, array $service): void
    {
        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'content.split',
            'name' => $service['title'].' Inclusions',
            'anchor' => 'included',
            'eyebrow' => 'Every Engagement Includes',
            'heading' => $service['includes_heading'],
            'subheading' => null,
            'body' => $service['includes_html'] ?? null,
            'media_id' => null,
            'cta_id' => null,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                'heading_highlight' => null,
                'footnote' => null,
            ],
            'settings' => [
                'media_side' => 'start',
                'media_shape' => 'landscape',
                // Two columns: these lists run to ten short rows, and one
                // column of them is a very tall band next to a fixed image.
                'list_columns' => 2,
                'accent' => $service['accent'],
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => $sort,
        ]);

        foreach ($service['includes'] as $position => $item) {
            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'item',
                'label' => $item,
                'value' => null,
                'description' => null,
                'body' => null,
                'icon' => null,
                'media_id' => null,
                'cta_id' => null,
                'data' => [],
                'settings' => [],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /** What the client gets out of it, as reason cards. */
    protected function addBenefits(Page $page, int $siteId, int $sort, array $service): void
    {
        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'why.choose',
            'name' => $service['title'].' Benefits',
            'anchor' => 'benefits',
            'eyebrow' => 'Why It Pays Off',
            'heading' => $service['benefits_heading'],
            'subheading' => null,
            'body' => null,
            'media_id' => null,
            'cta_id' => null,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                'heading_highlight' => null,
            ],
            'settings' => [
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => $sort,
        ]);

        foreach ($service['benefits'] as $position => $benefit) {
            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'reason',
                'label' => $benefit['label'],
                'value' => null,
                'description' => $benefit['description'],
                'body' => null,
                'icon' => $benefit['icon'],
                'media_id' => null,
                'cta_id' => null,
                'data' => [],
                // `why.choose` stores its accent in `settings`, unlike
                // `service.grid` above.
                'settings' => ['accent' => $benefit['accent']],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /** How the work runs, start to finish. */
    protected function addProcess(Page $page, int $siteId, int $sort, array $service): void
    {
        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'process.timeline',
            'name' => $service['title'].' Process',
            'anchor' => 'process',
            'eyebrow' => 'How We Work',
            'heading' => $service['process_heading'],
            'subheading' => $service['process_subheading'] ?? null,
            'body' => null,
            'media_id' => null,
            'cta_id' => null,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                'heading_highlight' => null,
                'step_label' => 'Step',
            ],
            'settings' => [
                'media_side' => 'left',
                'theme' => 'subtle',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => $sort,
        ]);

        foreach ($service['steps'] as $position => $step) {
            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'step',
                'label' => $step['label'],
                'value' => null,
                'description' => $step['description'],
                'body' => null,
                'icon' => $step['icon'],
                'media_id' => null,
                'cta_id' => null,
                'data' => [],
                'settings' => ['accent' => $step['accent']],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /** The questions a buyer actually asks before signing. */
    protected function addFaq(Page $page, int $siteId, int $sort, array $service): void
    {
        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'faq.accordion',
            'name' => $service['title'].' FAQ',
            'anchor' => 'faq',
            'eyebrow' => 'Questions',
            'heading' => 'Before You Ask Us',
            'subheading' => null,
            'body' => null,
            'media_id' => null,
            'cta_id' => null,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                'heading_highlight' => null,
                'footnote' => null,
            ],
            'settings' => [
                'layout' => 'split',
                'align' => 'center',
                'theme' => 'default',
                'spacing' => 'lg',
                'open_first' => true,
                'exclusive' => false,
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => $sort,
        ]);

        foreach ($service['faqs'] as $position => $faq) {
            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'question',
                'label' => $faq['q'],
                'value' => null,
                'description' => null,
                'body' => $faq['a'],
                'icon' => null,
                'media_id' => null,
                'cta_id' => null,
                // `topic` is DATA on this type; `accent` is SETTINGS.
                'data' => ['topic' => $faq['topic'] ?? null],
                'settings' => [],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /** The closing band, welded to the footer. */
    protected function addClosing(Page $page, int $siteId, int $sort, array $spec): void
    {
        $primary = $this->cta($siteId, $spec['key'].'-close-primary', [
            'label' => 'Book A Scoping Call',
            'url' => '/contact',
            'variant' => 'default',
            'size' => 'lg',
            'icon' => 'ArrowRight',
        ]);

        $secondary = $this->cta($siteId, $spec['key'].'-close-secondary', [
            'label' => 'See All Services',
            'url' => self::ROOT_PATH,
            'variant' => 'outline',
            'size' => 'lg',
            'icon' => null,
        ]);

        PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'cta.final',
            'name' => 'Closing CTA',
            'anchor' => null,
            'eyebrow' => $spec['eyebrow'],
            'heading' => $spec['heading'],
            'subheading' => $spec['subheading'],
            'body' => null,
            'media_id' => null,
            'cta_id' => $primary->id,
            'secondary_cta_id' => $secondary->id,
            'data' => [
                'version' => 1,
                'heading_highlight' => $spec['highlight'] ?? null,
                'footnote' => $spec['footnote'] ?? null,
            ],
            'settings' => [
                'tone' => 'ink',
                'align' => 'start',
                'merge_footer' => true,
                'spacing' => 'default',
                'animation' => 'rise',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => $sort,
        ]);
    }

    /* --------------------------------------------------------------------- */
    /* Helpers */
    /* --------------------------------------------------------------------- */

    /**
     * Wipe a page's sections before rewriting them.
     *
     * `forceDelete`, not `delete`: `page_sections` soft-deletes, and a
     * soft-deleted row still holds its slot in the unique keys and would
     * accumulate on every re-run. Blocks go with it by cascade.
     */
    protected function clearSections(Page $page): void
    {
        PageSection::where('page_id', $page->id)->forceDelete();
    }

    /**
     * A CTA, keyed on its tracking id so a re-run updates rather than
     * duplicates. Every button on these pages is a real `ctas` row, which is
     * what makes them editable — and reportable — from the admin.
     */
    protected function cta(int $siteId, string $trackingId, array $spec): Cta
    {
        return Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => $trackingId,
            ],
            [
                'label' => $spec['label'],
                'link_type' => CtaLinkType::URL->value,
                'url' => $spec['url'],
                'variant' => $spec['variant'],
                'size' => $spec['size'],
                'icon' => $spec['icon'],
                'icon_position' => IconPosition::RIGHT->value,
                'status' => Status::ACTIVE->value,
            ]
        );
    }

    /* --------------------------------------------------------------------- */
    /* Content */
    /* --------------------------------------------------------------------- */

    /**
     * The six services.
     *
     * The first is built to full depth — hero, argument, offerings, inclusions,
     * benefits, process, FAQ, close — as the worked example an editor opens to
     * see how a service page is assembled. The others carry the bands that
     * actually earn their place on a shorter page, which is also the honest
     * recommendation: eight bands is a lot of scrolling for a service nobody
     * has questions about yet.
     *
     * @return array<int, array<string, mixed>>
     */
    protected function services(): array
    {
        return [
            [
                'slug' => 'custom-software-development',
                'title' => 'Custom Software Development',
                'icon' => 'Code2',
                'accent' => 'brand',
                'excerpt' => 'Bespoke platforms built around how your business actually works, not around what an off-the-shelf tool will allow.',

                'hero_heading' => 'Software Built For The Way You Already Work',
                'hero_highlight' => 'Already Work',
                'hero_subheading' => 'When the process that makes you money does not fit a SaaS subscription, the software should bend to the business. We design, build and hand over platforms your team owns outright.',
                'stats' => [
                    ['value' => '50', 'suffix' => '+', 'label' => 'Platforms delivered'],
                    ['value' => '10', 'suffix' => '+', 'label' => 'Countries served'],
                    ['value' => '99.9', 'suffix' => '%', 'label' => 'Uptime maintained'],
                ],

                'argument' => [
                    'heading' => 'Why Custom, And When Not To',
                    'highlight' => 'When Not To',
                    'lead' => 'Custom software is the right answer less often than agencies admit — and when it is right, it is decisive.',
                    'html' => '<p>Most companies should buy, not build. If a process is genuinely standard, an off-the-shelf product will beat anything bespoke on cost and on time-to-value, and we will tell you so on the first call.</p><p>Custom development earns its budget in three situations:</p><ul><li><strong>The process is the moat.</strong> When the way you route work, price a job or manage inventory is what makes you better than competitors, encoding it in someone else\'s product means capping it at their roadmap.</li><li><strong>The integrations are the product.</strong> Six systems that must agree with each other in real time is not a licensing problem; it is an engineering one.</li><li><strong>The licence cost has overtaken the build cost.</strong> Per-seat pricing that made sense at thirty people rarely does at three hundred.</li></ul><p>Outside those cases, we would rather configure something that exists and spend your budget on the part that is genuinely yours.</p>',
                ],

                'offerings_heading' => 'What A Build Covers',
                'offerings_subheading' => 'One team across the whole lifecycle, so nothing is thrown over a wall halfway through.',
                'offerings' => [
                    ['label' => 'Discovery & Technical Scoping', 'description' => 'Two weeks mapping the process, the constraints and the integrations before a line of code is written. You keep the artefacts whether or not you continue.', 'icon' => 'Search', 'accent' => 'brand'],
                    ['label' => 'Architecture & Data Modelling', 'description' => 'The schema and service boundaries that decide what will be cheap to change in year three, reviewed before implementation starts.', 'icon' => 'Network', 'accent' => 'ink'],
                    ['label' => 'Application Engineering', 'description' => 'The build itself — typed, tested, reviewed, and shipped in increments you can see running rather than in one reveal at the end.', 'icon' => 'Code2', 'accent' => 'violet'],
                    ['label' => 'Systems Integration', 'description' => 'ERP, CRM, payment, logistics and legacy databases made to agree with each other, with the failure modes handled rather than hoped away.', 'icon' => 'Workflow', 'accent' => 'teal'],
                    ['label' => 'Data Migration', 'description' => 'Moving twenty years of records out of the system nobody wants to touch, with reconciliation you can audit line by line.', 'icon' => 'Database', 'accent' => 'amber'],
                    ['label' => 'Handover & Enablement', 'description' => 'Documentation, runbooks and paired sessions until your team ships a feature without us. That is the goal, not an upsell risk.', 'icon' => 'Users', 'accent' => 'rose'],
                ],

                'includes_heading' => 'What You Get, On Every Engagement',
                'includes_html' => '<p>These are not line items to negotiate away. They are what makes the difference between software you own and software you are stuck with.</p>',
                'includes' => [
                    'A written technical scope before any build commitment',
                    'Source code in your own repository from day one',
                    'Automated test coverage on every core business flow',
                    'CI/CD pipelines you can run without us',
                    'Infrastructure as code, in your cloud account',
                    'Architecture decision records explaining every major choice',
                    'Accessibility to WCAG AA on every screen we build',
                    'Security review before each production release',
                    'Runbooks for the failure modes we know about',
                    'A named engineer who was in the first scoping call',
                ],

                'benefits_heading' => 'What Changes After Launch',
                'benefits' => [
                    ['label' => 'The Process Stops Leaking', 'description' => 'Work that lived in spreadsheets and inboxes becomes a system of record, and the handoffs that used to be lost become states you can measure.', 'icon' => 'Gauge', 'accent' => 'brand'],
                    ['label' => 'Change Gets Cheap', 'description' => 'A tested codebase with clear boundaries means the fourth feature costs about what the second did, instead of three times as much.', 'icon' => 'TrendingUp', 'accent' => 'teal'],
                    ['label' => 'The Licence Bill Stops Growing', 'description' => 'Per-seat costs stop scaling with headcount. The build is capital; the running cost is hosting.', 'icon' => 'Target', 'accent' => 'amber'],
                    ['label' => 'You Stop Waiting On A Roadmap', 'description' => 'The thing your business needs next is a sprint away rather than a feature request in somebody else\'s backlog.', 'icon' => 'Timer', 'accent' => 'violet'],
                ],

                'process_heading' => 'How A Build Runs',
                'process_subheading' => 'Six stages, each ending in something you can look at rather than a status update.',
                'steps' => [
                    ['label' => 'Discovery', 'description' => 'We map the process as it really runs, including the workarounds. Ends in a written scope, an architecture sketch and a cost range.', 'icon' => 'Search', 'accent' => 'brand'],
                    ['label' => 'Architecture', 'description' => 'Data model, service boundaries and integration contracts, reviewed with your team before anyone starts building.', 'icon' => 'Network', 'accent' => 'ink'],
                    ['label' => 'Build', 'description' => 'Two-week increments, each ending in working software on a staging environment you can use.', 'icon' => 'Code2', 'accent' => 'violet'],
                    ['label' => 'Integration', 'description' => 'Connecting the systems that have to agree, and proving the reconciliation before anything goes near production.', 'icon' => 'Workflow', 'accent' => 'teal'],
                    ['label' => 'Launch', 'description' => 'Migration, cutover and a rollback plan we have actually rehearsed. Usually a weekend, occasionally a phased switch.', 'icon' => 'Rocket', 'accent' => 'amber'],
                    ['label' => 'Handover', 'description' => 'Documentation and paired delivery until your team ships without us. Support afterwards is a choice, not a dependency.', 'icon' => 'Users', 'accent' => 'rose'],
                ],

                'faqs' => [
                    ['q' => 'How long does a custom platform take?', 'a' => 'A focused internal tool is usually eight to twelve weeks. A platform replacing a core business system is six to nine months, delivered in increments you can use before the end. Anyone quoting a firm date before discovery is guessing.', 'topic' => 'Timelines'],
                    ['q' => 'Do we own the code?', 'a' => 'Entirely, and from the first commit — it lives in your repository, not ours. There is no licence, no escrow arrangement and no clause that makes leaving expensive.', 'topic' => 'Ownership'],
                    ['q' => 'What if we want to take it in-house later?', 'a' => 'That is the intended outcome. Handover — documentation, runbooks, paired delivery — is part of every engagement rather than a separate purchase, and we would rather be re-hired for the next thing than retained out of dependency.', 'topic' => 'Ownership'],
                    ['q' => 'Can you work with our existing team?', 'a' => 'Yes, and it is usually the better structure. We embed alongside your engineers, share the same board and review each other\'s pull requests, which also means the knowledge stays with you as it is built.', 'topic' => 'Working together'],
                    ['q' => 'What happens if the scope changes mid-build?', 'a' => 'It will — the useful question is how it is handled. Work is quoted per increment rather than as one fixed lump, so a change of direction re-prioritises the next two weeks instead of triggering a contract renegotiation.', 'topic' => 'Commercials'],
                ],

                'close_heading' => 'Bring Us The Process Nothing Fits',
                'close_highlight' => 'Nothing Fits',
                'close_body' => 'Describe how the work actually flows today, including the spreadsheet nobody admits to. We will tell you whether it needs custom software — and say so plainly if it does not.',
            ],

            [
                'slug' => 'web-application-development',
                'title' => 'Web Application Development',
                'icon' => 'Globe',
                'accent' => 'violet',
                'excerpt' => 'Fast, accessible web applications that hold their performance as the feature set and the user count grow.',

                'hero_heading' => 'Web Applications That Stay Fast As They Grow',
                'hero_highlight' => 'Stay Fast',
                'hero_subheading' => 'Most web apps are quick on launch day and slow by the second year. We build the architecture, the test coverage and the performance budget that stop that happening.',
                'stats' => [
                    ['value' => '95', 'suffix' => '+', 'label' => 'Lighthouse performance'],
                    ['value' => '100', 'suffix' => '%', 'label' => 'WCAG AA coverage'],
                ],

                'argument' => [
                    'heading' => 'Performance Is A Feature You Have To Defend',
                    'lead' => 'Speed is not something you add at the end. It is something you stop losing.',
                    'html' => '<p>Every web application starts fast, because on day one it does almost nothing. Performance is lost gradually — an analytics script here, an unpaginated list there, a component that re-renders the whole page on every keystroke.</p><p>We treat it as a budget rather than a milestone: a page weight and an interaction cost agreed up front, measured in CI, and enforced on every pull request. A change that breaks the budget fails the build, which is the only mechanism we have found that actually holds.</p><p>The same applies to accessibility. Retrofitting WCAG AA onto a finished application costs several times what building to it does, and produces a worse result.</p>',
                ],

                'offerings_heading' => 'What We Build',
                'offerings' => [
                    ['label' => 'Customer Portals', 'description' => 'Self-service for accounts, orders and documents — the screens that take load off your support inbox.', 'icon' => 'Users', 'accent' => 'violet'],
                    ['label' => 'Internal Dashboards', 'description' => 'Operational views built on real query performance, so they still open in under a second at a million rows.', 'icon' => 'Gauge', 'accent' => 'teal'],
                    ['label' => 'SaaS Products', 'description' => 'Multi-tenant applications with billing, roles and audit trails designed in rather than bolted on.', 'icon' => 'Boxes', 'accent' => 'brand'],
                    ['label' => 'Marketplaces & Booking', 'description' => 'Two-sided flows where availability, payment and notification all have to stay consistent under contention.', 'icon' => 'Network', 'accent' => 'amber'],
                    ['label' => 'API Platforms', 'description' => 'Documented, versioned interfaces your partners can build against without a support ticket per integration.', 'icon' => 'Server', 'accent' => 'ink'],
                    ['label' => 'Progressive Web Apps', 'description' => 'Installable, offline-tolerant applications for teams working somewhere with unreliable connectivity.', 'icon' => 'Smartphone', 'accent' => 'rose'],
                ],

                'includes_heading' => 'Non-Negotiables On Every Build',
                'includes' => [
                    'A performance budget enforced in CI',
                    'WCAG AA compliance verified on every screen',
                    'Server-side rendering or static generation where it helps',
                    'Typed end to end, database through to interface',
                    'Automated tests on every critical user journey',
                    'Error tracking and structured logging from day one',
                    'A component library your team can extend',
                    'Responsive from 320px with no horizontal overflow',
                ],

                'process_heading' => 'How A Web Build Runs',
                'steps' => [
                    ['label' => 'Scope', 'description' => 'User journeys, data shape and the performance budget, agreed before design starts.', 'icon' => 'Search', 'accent' => 'violet'],
                    ['label' => 'Design System', 'description' => 'Components, tokens and states — including the empty, loading and error ones nobody remembers to design.', 'icon' => 'PenTool', 'accent' => 'brand'],
                    ['label' => 'Build', 'description' => 'Two-week increments against a staging environment you can use throughout.', 'icon' => 'Code2', 'accent' => 'teal'],
                    ['label' => 'Harden', 'description' => 'Load testing, accessibility audit and a security review before launch rather than after the first incident.', 'icon' => 'ShieldCheck', 'accent' => 'amber'],
                    ['label' => 'Launch & Monitor', 'description' => 'Ship, then watch the real numbers for a fortnight and fix what production teaches us.', 'icon' => 'Activity', 'accent' => 'rose'],
                ],

                'faqs' => [
                    ['q' => 'Which stack do you use?', 'a' => 'Usually Laravel with React and TypeScript, on PostgreSQL or MySQL. We are not religious about it — if your team already runs something else well, building on what they can maintain beats building on what we prefer.', 'topic' => 'Technology'],
                    ['q' => 'Can you take over an existing application?', 'a' => 'Often, yes. We start with a paid audit — architecture, test coverage, dependency health, the riskiest files — and give you an honest read on whether it is worth continuing or replacing. Sometimes the answer is that it is fine and needs nothing.', 'topic' => 'Existing code'],
                    ['q' => 'Do you do design as well as engineering?', 'a' => 'Yes. Product design, the component library and the build come from one team, which removes the handover where most detail is lost.', 'topic' => 'Scope'],
                    ['q' => 'How do you handle accessibility?', 'a' => 'It is built in, not audited on. Semantic markup, keyboard paths and contrast are part of the component library, so every screen inherits them rather than each one being fixed individually.', 'topic' => 'Accessibility'],
                ],

                'close_heading' => 'Show Us The App That Got Slow',
                'close_body' => 'Whether it is a rebuild or a rescue, the first conversation is the same: what it does, who uses it, and where it hurts.',
            ],

            [
                'slug' => 'mobile-app-development',
                'title' => 'Mobile App Development',
                'icon' => 'Smartphone',
                'accent' => 'teal',
                'excerpt' => 'iOS and Android applications that feel native, hold their sessions, and pass review the first time.',

                'hero_heading' => 'Mobile Apps People Keep On The Home Screen',
                'hero_highlight' => 'Home Screen',
                'hero_subheading' => 'An app earns its place by being fast on the phone somebody actually owns — not the newest one. We build for the device in your customer\'s pocket.',
                'stats' => [
                    ['value' => '5', 'prefix' => '', 'suffix' => 'M+', 'label' => 'Users served'],
                    ['value' => '4.6', 'suffix' => '★', 'label' => 'Average store rating'],
                ],

                'argument' => [
                    'heading' => 'Native, Cross-Platform, Or Neither',
                    'lead' => 'The framework argument matters far less than most vendors pretend. The decision that matters is whether you need an app at all.',
                    'html' => '<p>A responsive web application covers most of what companies ask an app to do, costs less to build and needs no store review to ship a fix. We will say so when it applies.</p><p>An app is the right call when you need the things only an app gets: reliable push notification, background location, offline-first data, camera or biometric access, or a home-screen icon that drives genuine repeat use.</p><p>Once that is settled, the framework follows the requirement. Cross-platform is the default for its economics; native is right when the app lives or dies on graphics performance, deep OS integration or day-one support for a new platform feature.</p>',
                ],

                'offerings_heading' => 'What We Build',
                'offerings' => [
                    ['label' => 'Consumer Applications', 'description' => 'Apps that have to survive an app store rating — onboarding, performance and polish treated as features.', 'icon' => 'Smartphone', 'accent' => 'teal'],
                    ['label' => 'Field & Operations Apps', 'description' => 'Offline-first tools for people working in warehouses, on sites and in vans, where the signal is not a given.', 'icon' => 'Workflow', 'accent' => 'amber'],
                    ['label' => 'Companion Apps', 'description' => 'The mobile surface of a platform you already run, sharing its API and its identity rather than forking them.', 'icon' => 'Boxes', 'accent' => 'violet'],
                    ['label' => 'Secure & Regulated Apps', 'description' => 'Biometric authentication, certificate pinning and encrypted local storage for finance and health workloads.', 'icon' => 'ShieldCheck', 'accent' => 'ink'],
                ],

                'includes_heading' => 'Included In Every App Engagement',
                'includes' => [
                    'Store submission handled, on both platforms',
                    'Crash reporting and release-over-release monitoring',
                    'Offline behaviour designed, not left to chance',
                    'Push notification infrastructure',
                    'Deep links and share targets',
                    'Accessibility with the OS screen readers',
                    'Tested on mid-range hardware, not only flagships',
                    'A rollback path for a bad release',
                ],

                'faqs' => [
                    ['q' => 'iOS and Android at the same time?', 'a' => 'Usually, from one cross-platform codebase, which is what makes releasing to both affordable. Where a platform genuinely needs different behaviour we write it natively rather than forcing an abstraction over it.', 'topic' => 'Platforms'],
                    ['q' => 'Do you handle the app store submissions?', 'a' => 'Yes, including the review rejections. Store listings, screenshots, privacy declarations and the back-and-forth with review are part of the engagement.', 'topic' => 'Release'],
                    ['q' => 'What about the backend?', 'a' => 'We build it, or we integrate with the one you have. An app is a client — most of what determines whether it feels fast is the API behind it.', 'topic' => 'Scope'],
                    ['q' => 'How long until something is in the store?', 'a' => 'A focused first release is typically twelve to sixteen weeks including review. Scope discipline matters more than team size here; the fastest route to a shipped app is a smaller first version.', 'topic' => 'Timelines'],
                ],

                'close_heading' => 'Tell Us Who Opens It, And How Often',
                'close_body' => 'The honest answer to that question decides whether you need an app, a mobile web experience, or neither. We will work through it with you before quoting anything.',
            ],

            [
                'slug' => 'cloud-and-devops',
                'title' => 'Cloud & DevOps',
                'icon' => 'Server',
                'accent' => 'ink',
                'excerpt' => 'Infrastructure you can reason about, deployments you can trust, and a cloud bill that matches what you actually use.',

                'hero_heading' => 'Infrastructure That Stops Being A Risk',
                'hero_highlight' => 'Stops Being A Risk',
                'hero_subheading' => 'Deployments that take an afternoon and a person who knows the incantation are an operational risk, not a process. We replace them with something repeatable.',
                'stats' => [
                    ['value' => '99.9', 'suffix' => '%', 'label' => 'Availability maintained'],
                    ['value' => '40', 'suffix' => '%', 'label' => 'Typical cloud saving'],
                ],

                'argument' => [
                    'heading' => 'Most Cloud Bills Are Paying For Fear',
                    'lead' => 'Over-provisioning is what teams buy when they have no confidence in their own deploy process.',
                    'html' => '<p>When a release is risky, the instinct is to make everything bigger — spare capacity as insurance against a problem nobody can diagnose quickly. That is usually where a third of the bill goes.</p><p>The fix is not a cheaper instance type. It is confidence: infrastructure described in code so environments actually match, deployments automated so they are boring, monitoring that tells you what broke rather than that something did, and a rollback that has been rehearsed.</p><p>Cost comes down as a consequence. Teams that trust their pipeline stop paying for headroom they never use.</p>',
                ],

                'offerings_heading' => 'What We Do',
                'offerings' => [
                    ['label' => 'Infrastructure As Code', 'description' => 'Terraform-managed environments that are reproducible, reviewable and identical from staging to production.', 'icon' => 'Server', 'accent' => 'ink'],
                    ['label' => 'CI/CD Pipelines', 'description' => 'Automated test, build and deploy, with the rollback path built and rehearsed rather than documented and hoped for.', 'icon' => 'Workflow', 'accent' => 'brand'],
                    ['label' => 'Containerisation', 'description' => 'Docker and orchestration for applications that need to scale horizontally without a manual step.', 'icon' => 'Boxes', 'accent' => 'teal'],
                    ['label' => 'Observability', 'description' => 'Metrics, structured logs and traces wired to alerts that fire on symptoms customers feel, not on CPU graphs.', 'icon' => 'Activity', 'accent' => 'violet'],
                    ['label' => 'Cost Optimisation', 'description' => 'Right-sizing, reserved capacity and the unused resources every account accumulates, with the savings measured.', 'icon' => 'TrendingUp', 'accent' => 'amber'],
                    ['label' => 'Migration', 'description' => 'On-premise to cloud, or cloud to cloud, planned around the cutover window your business can actually tolerate.', 'icon' => 'Network', 'accent' => 'rose'],
                ],

                'includes_heading' => 'What A DevOps Engagement Leaves Behind',
                'includes' => [
                    'Every environment described in version-controlled code',
                    'A deploy any engineer on your team can run',
                    'A rollback that has been tested, not just written down',
                    'Alerting tuned to symptoms, not to raw metrics',
                    'Secrets managed properly, out of the repository',
                    'Automated backups with a rehearsed restore',
                    'A documented on-call runbook',
                    'A cost breakdown by service and environment',
                ],

                'faqs' => [
                    ['q' => 'Which cloud providers do you work with?', 'a' => 'AWS most often, then Azure and Google Cloud. The practices — infrastructure as code, automated deploys, real observability — matter far more than the provider, and we will not push a migration that has no case behind it.', 'topic' => 'Platforms'],
                    ['q' => 'Can you take over an existing setup?', 'a' => 'Yes. We start with an audit of what is running, what it costs and where the single points of failure are, and the first deliverable is that picture — often the first time anyone has had one.', 'topic' => 'Existing systems'],
                    ['q' => 'Do we need a full-time DevOps hire?', 'a' => 'Eventually, if you are scaling. The aim of this engagement is that the answer is "not yet": automated infrastructure needs far less attention than hand-built infrastructure, and we would rather leave you needing us less.', 'topic' => 'Team'],
                ],

                'close_heading' => 'Send Us Your Cloud Bill',
                'close_body' => 'It is the fastest way for us to tell you something useful. We will read it against what you are actually running and tell you where the money is going.',
            ],

            [
                'slug' => 'ai-and-automation',
                'title' => 'AI & Automation',
                'icon' => 'Sparkles',
                'accent' => 'amber',
                'excerpt' => 'Applied AI grounded in your own data, measured against a business number rather than a demo.',

                'hero_heading' => 'AI That Answers From Your Data, Not The Internet',
                'hero_highlight' => 'Your Data',
                'hero_subheading' => 'A chatbot that invents an answer costs more than it saves. We build retrieval-grounded systems that cite their source and say when they do not know.',
                'stats' => [
                    ['value' => '60', 'suffix' => '%', 'label' => 'Typical ticket deflection'],
                    ['value' => '8', 'label' => 'Weeks to first production use', 'suffix' => ''],
                ],

                'argument' => [
                    'heading' => 'Start With The Number You Want To Move',
                    'highlight' => 'The Number',
                    'lead' => 'The failed AI projects we get called in to rescue almost all started with the technology rather than with the problem.',
                    'html' => '<p>"We should do something with AI" produces a demo that impresses a board and never reaches production, because nobody agreed in advance what it was supposed to change.</p><p>The projects that work start somewhere much more boring: a specific number, and a threshold at which the thing is worth keeping. Support tickets deflected. Hours spent re-keying invoices. Time from enquiry to quote.</p><p>Once that exists, the engineering follows. <strong>Retrieval-augmented generation</strong> grounds answers in your own documents so the model quotes rather than invents. <strong>Evaluation sets</strong> — real questions with known-good answers — turn "it seems better" into a measurement. <strong>Human review</strong> stays on the path for anything consequential, because a confident wrong answer to a customer is more expensive than no answer at all.</p>',
                ],

                'offerings_heading' => 'Where It Actually Pays',
                'offerings' => [
                    ['label' => 'Retrieval Chatbots (RAG)', 'description' => 'Assistants answering from your documentation and policies, with citations and an honest "I do not know".', 'icon' => 'MessageCircle', 'accent' => 'amber'],
                    ['label' => 'Document Processing', 'description' => 'Invoices, contracts and forms turned into structured data, with confidence scores routing the uncertain ones to a person.', 'icon' => 'Search', 'accent' => 'brand'],
                    ['label' => 'Workflow Automation', 'description' => 'The repetitive judgement calls between two systems — triage, routing, classification — handled and audited.', 'icon' => 'Workflow', 'accent' => 'teal'],
                    ['label' => 'AI Agents', 'description' => 'Multi-step tasks with tool access, run inside boundaries you set and with a log of every action taken.', 'icon' => 'Bot', 'accent' => 'violet'],
                    ['label' => 'AI-Powered Features', 'description' => 'Search, summarisation and drafting built into a product you already run, rather than bolted on beside it.', 'icon' => 'Sparkles', 'accent' => 'rose'],
                    ['label' => 'Evaluation & Guardrails', 'description' => 'The test suite, the refusal behaviour and the human-review path that make an AI feature safe to leave running.', 'icon' => 'ShieldCheck', 'accent' => 'ink'],
                ],

                'includes_heading' => 'How We Keep It Honest',
                'includes' => [
                    'An agreed business metric before any build',
                    'An evaluation set of real questions and known answers',
                    'Answers grounded in your data, with citations',
                    'A measured refusal rate rather than confident guessing',
                    'Human review on anything consequential',
                    'Cost per request tracked against the value it creates',
                    'Your data kept out of vendor training by contract',
                    'A documented path to switch model providers',
                ],

                'faqs' => [
                    ['q' => 'Will our data be used to train someone\'s model?', 'a' => 'No. We deploy under enterprise agreements that contractually exclude training on your inputs, and where the data is sensitive enough we run open models in your own infrastructure instead.', 'topic' => 'Data'],
                    ['q' => 'What if it gives a customer a wrong answer?', 'a' => 'That is the risk that decides the design. Retrieval grounding, a tuned refusal threshold and human review on consequential paths are all aimed at it — and we measure the wrong-answer rate rather than assuming it away.', 'topic' => 'Risk'],
                    ['q' => 'How much does it cost to run?', 'a' => 'Per-request inference cost is modelled during scoping against expected volume, and tracked in production. For most support and document workloads it is a small fraction of the labour it replaces — but we would rather show you the number than assert it.', 'topic' => 'Commercials'],
                    ['q' => 'Do we need a data science team?', 'a' => 'For this kind of applied work, no. It is largely software engineering — retrieval, evaluation, integration — rather than model training.', 'topic' => 'Team'],
                ],

                'close_heading' => 'Name The Number You Want To Move',
                'close_body' => 'Tickets, hours, days-to-quote — whichever it is. If AI is not the cheapest way to move it, we will tell you what is.',
            ],

            [
                'slug' => 'ux-ui-design',
                'title' => 'UX & UI Design',
                'icon' => 'PenTool',
                'accent' => 'rose',
                'excerpt' => 'Product design that engineers can build from, with the empty, loading and error states designed rather than improvised.',

                'hero_heading' => 'Design That Survives Being Built',
                'hero_highlight' => 'Being Built',
                'hero_subheading' => 'A beautiful mockup with no error state is a specification with a hole in it. We design the whole system, including the parts nobody screenshots.',
                'stats' => [
                    ['value' => '100', 'suffix' => '%', 'label' => 'WCAG AA on delivery'],
                ],

                'argument' => [
                    'heading' => 'The States Nobody Designs Are The Ones Users Hit',
                    'lead' => 'Every product looks good with three perfect rows of demo data.',
                    'html' => '<p>Real software is mostly edge cases. The list before anything is in it. The name that is forty characters long. The upload that failed halfway. The screen on a connection that dropped.</p><p>When those are not designed, they get improvised during the build — usually as a spinner, a blank box, or a red sentence quoting a stack trace. That is where a product stops feeling considered.</p><p>We design the full set for every component: empty, loading, partial, error, and success. It makes handover shorter, because there is nothing left for an engineer to invent, and it makes the finished product feel like somebody thought about the bad days as well as the good ones.</p>',
                ],

                'offerings_heading' => 'What We Deliver',
                'offerings' => [
                    ['label' => 'Product Discovery', 'description' => 'User interviews, journey mapping and the problem definition that stops a team building the wrong thing well.', 'icon' => 'Search', 'accent' => 'rose'],
                    ['label' => 'Interface Design', 'description' => 'Screens designed at every breakpoint from 320px up, with real content rather than placeholder text.', 'icon' => 'PenTool', 'accent' => 'violet'],
                    ['label' => 'Design Systems', 'description' => 'A component library with tokens, states and usage rules — the thing that keeps a product coherent after the designers leave.', 'icon' => 'Boxes', 'accent' => 'brand'],
                    ['label' => 'Accessibility Design', 'description' => 'Contrast, focus order, keyboard paths and screen-reader behaviour decided in design rather than patched in QA.', 'icon' => 'ShieldCheck', 'accent' => 'teal'],
                    ['label' => 'Prototyping', 'description' => 'Interactive prototypes for testing a flow with real users before it becomes expensive to change.', 'icon' => 'Workflow', 'accent' => 'amber'],
                    ['label' => 'Design Ops', 'description' => 'The handover artefacts, naming and tokens that let engineering build from the file without a translation layer.', 'icon' => 'Users', 'accent' => 'ink'],
                ],

                'includes_heading' => 'In Every Design Handover',
                'includes' => [
                    'Every component in all five states',
                    'Designs at every breakpoint from 320px up',
                    'Contrast verified against WCAG AA',
                    'Focus order and keyboard paths specified',
                    'Design tokens exported for the codebase',
                    'Copy written, not lorem ipsum',
                    'Motion specified with a reduced-motion alternative',
                    'A walkthrough session with the engineers building it',
                ],

                'faqs' => [
                    ['q' => 'Can you work from our existing brand?', 'a' => 'Yes — most engagements do. We extend brand guidelines into a product design system, which is a different discipline from brand design and usually the piece that is missing.', 'topic' => 'Scope'],
                    ['q' => 'Do you hand over Figma files?', 'a' => 'Figma files, exported tokens, and a walkthrough with the engineers. If we are also building it, the component library is the handover and the file is documentation.', 'topic' => 'Handover'],
                    ['q' => 'What if we already have developers?', 'a' => 'Then the handover matters more, not less. We design to the constraints of your stack and run the walkthrough with your engineers so nothing has to be reinterpreted.', 'topic' => 'Working together'],
                ],

                'close_heading' => 'Show Us The Screen People Complain About',
                'close_body' => 'One screen is usually enough to see what is wrong with the system behind it. Send it over and we will tell you what we see.',
            ],
        ];
    }
}

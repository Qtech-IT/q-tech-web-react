<?php

namespace Database\Seeders;

use App\Enums\Cms\MenuLinkType;
use App\Enums\Cms\MenuVisibility;
use App\Enums\Common\Status;
use App\Http\Services\Frontend\NavigationService;
use App\Models\MenuItem;
use App\Models\Page;
use Database\Seeders\Cms\CmsContentSeeder;

/**
 * Repopulate the header's mega panels from pages that actually exist.
 *
 * THE PROBLEM THIS SOLVES
 * -----------------------
 * The panels were authored with real density — a column of services, two
 * columns of twenty-four technologies, a featured case-study callout — and
 * almost none of it resolved. Once every URL started resolving through the page
 * tree, `NavigationRepairSeeder` correctly hid the broken entries, and the
 * panels went from richly populated to nearly empty. Both states were wrong:
 * the first promised pages that did not exist, the second threw away the
 * information architecture to avoid it.
 *
 * This rebuilds the columns from the page tree, so the density comes back and
 * every link in it goes somewhere. A column is generated from a query rather
 * than a hand-written list, which means publishing a technology page puts it in
 * the menu on the next run instead of requiring somebody to remember.
 *
 * WHAT IT DOES NOT TOUCH
 * ----------------------
 * The panel `settings` — intro copy, column titles, the footer link — are an
 * editor's words and are left alone except for the featured callout's href,
 * which pointed at two case studies that have never existed.
 *
 * The generated columns are marked in `settings.generated` so a later run can
 * replace its own rows without eating entries an editor added by hand beside
 * them.
 */
class MegaMenuSeeder extends CmsContentSeeder
{
    public function run(): void
    {
        $services = $this->children('/services');
        $technologies = $this->children('/technologies');
        $industries = $this->children('/industries');

        $this->buildServicesPanel($services, $technologies, $industries);
        $this->buildColumn('Technologies', 'Languages & Platforms', $technologies);
        $this->buildColumn('Industries', 'Sectors We Work In', $industries);
        $this->addTestimonialsEntry();
        $this->addCaseStudiesEntry();
        $this->repairFeaturedLinks();

        app(NavigationService::class)->forget();
        $this->flushPageCache();
    }

    /**
     * The Services panel: what we do, then two cross-cutting columns.
     *
     * The second and third columns are the "nothing links with nothing" fix.
     * A visitor on the Services panel is choosing an engagement, and the two
     * questions they actually have next are "do you know my sector" and "do you
     * work in my stack" — both of which are now one click away rather than
     * needing a trip back to the top-level nav.
     *
     * @param  \Illuminate\Support\Collection<int, Page>  $services
     * @param  \Illuminate\Support\Collection<int, Page>  $technologies
     * @param  \Illuminate\Support\Collection<int, Page>  $industries
     */
    protected function buildServicesPanel($services, $technologies, $industries): void
    {
        $parent = $this->topLevel('Services');

        if (! $parent instanceof MenuItem) {
            return;
        }

        // The services themselves sit directly under the trigger, with no
        // heading — they are the panel's subject, not one category within it.
        $this->syncColumn($parent, null, $services, 0);

        /*
         * Sort orders well past the services above them.
         *
         * `sort_order` is not unique among siblings and the six service links
         * already occupy 0–5. Numbering these columns 1 and 2 interleaved them
         * with the services, so the panel rendered three services, a column,
         * one more service, another column — the tie broken by insertion id,
         * which is not a decision anybody made.
         */
        $this->syncColumn($parent, 'By Industry', $industries, 100);
        $this->syncColumn($parent, 'By Technology', $technologies, 101);

        /*
         * The two original heading columns held twenty-four links to pages
         * that were never written. They are retired rather than deleted:
         * hidden, so the panel is clean, but still present in the menu builder
         * for an editor who wants the list back once those pages exist.
         */
        MenuItem::where('parent_id', $parent->id)
            ->whereIn('label', ['Top Services', 'Enterprise Focused'])
            ->update(['status' => Status::INACTIVE->value]);
    }

    /**
     * A single-column panel: one heading, one generated list beneath it.
     *
     * @param  \Illuminate\Support\Collection<int, Page>  $pages
     */
    protected function buildColumn(string $trigger, string $heading, $pages): void
    {
        $parent = $this->topLevel($trigger);

        if (! $parent instanceof MenuItem) {
            return;
        }

        $this->syncColumn($parent, $heading, $pages, 0);
    }

    /**
     * Create or update one column of page links under a trigger.
     *
     * Rows this seeder previously generated are removed first, so a page that
     * has since been unpublished leaves the menu instead of lingering. Rows an
     * editor added by hand carry no `generated` flag and survive untouched.
     *
     * @param  \Illuminate\Support\Collection<int, Page>  $pages
     */
    protected function syncColumn(
        MenuItem $parent,
        ?string $heading,
        $pages,
        int $position,
    ): void {
        if ($pages->isEmpty()) {
            return;
        }

        $container = $parent;

        if ($heading !== null) {
            /*
             * Reuse an existing heading column before creating one.
             *
             * The Technologies and Industries panels each already had an
             * UNTITLED heading holding their links. Creating a second, titled
             * column beside it rendered every page twice — once in the column
             * this seeder generated and once in the one the editor had. Adopt
             * the existing column and give it a title instead: same rows, one
             * list, and the editor's own structure preserved.
             */
            $existing = MenuItem::where('parent_id', $parent->id)
                ->where('link_type', MenuLinkType::HEADING->value)
                ->orderByRaw('CASE WHEN label = ? THEN 0 ELSE 1 END', [$heading])
                ->orderByRaw("CASE WHEN label IS NULL OR label = '' THEN 0 ELSE 1 END")
                ->orderBy('sort_order')
                ->first();

            $container = MenuItem::updateOrCreate(
                $existing instanceof MenuItem
                    ? ['id' => $existing->id]
                    : [
                        'menu_id' => $parent->menu_id,
                        'parent_id' => $parent->id,
                        'label' => $heading,
                    ],
                [
                    'menu_id' => $parent->menu_id,
                    'parent_id' => $parent->id,
                    'label' => $heading,
                    'path' => $parent->path.$parent->id.'/',
                    'depth' => $parent->depth + 1,
                    // A column title is a real heading element, never a
                    // focusable dead link — `MenuLinkType::HEADING` is what
                    // tells the front end to render it as one.
                    'link_type' => MenuLinkType::HEADING->value,
                    'url' => null,
                    'page_id' => null,
                    'visibility' => MenuVisibility::ALWAYS->value,
                    'status' => Status::ACTIVE->value,
                    'sort_order' => $position,
                    'settings' => ['generated' => true],
                ]
            );
        }

        // Clear this seeder's previous rows for this container only.
        MenuItem::where('parent_id', $container->id)
            ->whereJsonContains('settings->generated', true)
            ->where('link_type', MenuLinkType::PAGE->value)
            ->delete();

        foreach ($pages->values() as $index => $page) {
            /*
             * If a sibling already points at this page, update it rather than
             * adding a second row for the same destination.
             *
             * The editor's column called one page "Logistics"; the page is
             * titled "Logistics & Supply Chain". Keying only on the label
             * produced both, side by side, going to the same URL. Matching on
             * `page_id` first means the EDITOR'S wording wins — they chose a
             * shorter label for a menu on purpose — and this seeder supplies
             * only what it is authoritative about: the destination, the
             * description and the ordering.
             */
            $existingByPage = MenuItem::where('parent_id', $container->id)
                ->where('page_id', $page->id)
                ->first();

            MenuItem::updateOrCreate(
                $existingByPage instanceof MenuItem
                    ? ['id' => $existingByPage->id]
                    : [
                        'menu_id' => $parent->menu_id,
                        'parent_id' => $container->id,
                        'label' => $page->title,
                    ],
                [
                    'menu_id' => $parent->menu_id,
                    'parent_id' => $container->id,
                    // Only set on creation — an existing row keeps whatever an
                    // editor named it.
                    'label' => $existingByPage->label ?? $page->title,
                    'path' => $container->path.$container->id.'/',
                    'depth' => $container->depth + 1,
                    // The excerpt doubles as the menu description, so the panel
                    // explains each link rather than listing bare titles — and
                    // it cannot drift from the page, because it IS the page's.
                    'description' => $page->excerpt,
                    'icon' => $page->icon,
                    'link_type' => MenuLinkType::PAGE->value,
                    'page_id' => $page->id,
                    'url' => null,
                    'visibility' => MenuVisibility::ALWAYS->value,
                    'status' => Status::ACTIVE->value,
                    'sort_order' => $index,
                    'settings' => ['generated' => true],
                ]
            );
        }
    }

    /**
     * Testimonials, filed under About.
     *
     * The page was created but nothing linked to it, which is the same failure
     * as a broken link seen from the other side: content nobody can reach.
     */
    protected function addTestimonialsEntry(): void
    {
        $page = Page::where('path', '/testimonials')->first();
        $about = $this->topLevel('About');

        if (! $page instanceof Page || ! $about instanceof MenuItem) {
            return;
        }

        $column = MenuItem::where('parent_id', $about->id)
            ->where('label', 'Inside QTECH')
            ->first() ?? $about;

        MenuItem::updateOrCreate(
            [
                'menu_id' => $about->menu_id,
                'parent_id' => $column->id,
                'label' => 'Testimonials',
            ],
            [
                'path' => $column->path.$column->id.'/',
                'depth' => $column->depth + 1,
                'description' => $page->excerpt,
                'icon' => $page->icon,
                'link_type' => MenuLinkType::PAGE->value,
                'page_id' => $page->id,
                'url' => null,
                'visibility' => MenuVisibility::ALWAYS->value,
                'status' => Status::ACTIVE->value,
                'sort_order' => 20,
            ]
        );
    }

    /**
     * Case Studies, as a sibling of Our Work in the top bar.
     *
     * Both destinations now exist and they are different content — the
     * portfolio shows what we built, the case studies argue why it worked — so
     * each needs its own entry. Placed immediately after "Our Work" because
     * that is the order a visitor reads them in: look at the work, then read
     * about one.
     */
    protected function addCaseStudiesEntry(): void
    {
        $page = Page::where('path', '/case-studies')->first();
        $ourWork = $this->topLevel('Our Work');

        if (! $page instanceof Page || ! $ourWork instanceof MenuItem) {
            return;
        }

        MenuItem::updateOrCreate(
            [
                'menu_id' => $ourWork->menu_id,
                'parent_id' => null,
                'label' => 'Case Studies',
            ],
            [
                'path' => $ourWork->path,
                'depth' => $ourWork->depth,
                'description' => $page->excerpt,
                'link_type' => MenuLinkType::PAGE->value,
                'page_id' => $page->id,
                'url' => null,
                'visibility' => MenuVisibility::ALWAYS->value,
                'status' => Status::ACTIVE->value,
                // Half a step after Our Work. `sort_order` is an integer, so
                // the neighbours are renumbered rather than squeezed between.
                'sort_order' => $ourWork->sort_order + 1,
            ]
        );

        // Push everything that followed along by one, preserving their order.
        MenuItem::where('menu_id', $ourWork->menu_id)
            ->whereNull('parent_id')
            ->where('sort_order', '>', $ourWork->sort_order)
            ->where('label', '!=', 'Case Studies')
            ->increment('sort_order');
    }

    /**
     * Point each panel's featured callout at a case study that exists.
     *
     * They referenced `/case-studies/lumen-retail` and
     * `/case-studies/arcadia-health` — invented slugs from before the studies
     * were written. The client names and result lines are left as the editor
     * wrote them; only the destination is corrected, and only where the current
     * one resolves to nothing.
     */
    protected function repairFeaturedLinks(): void
    {
        $targets = [
            'Technologies' => '/case-studies/retail-peak-readiness',
            'Industries' => '/case-studies/patient-portal-accessibility',
            'About' => '/case-studies/settlement-platform-rebuild',
            'Services' => '/case-studies/logistics-control-tower',
        ];

        foreach ($targets as $label => $href) {
            $item = $this->topLevel($label);

            if (! $item instanceof MenuItem) {
                continue;
            }

            $settings = (array) ($item->settings ?? []);
            $current = $settings['featured']['link']['href'] ?? null;

            if ($current === null || Page::where('path', $current)->exists()) {
                continue;
            }

            $settings['featured']['link']['href'] = $href;
            $item->update(['settings' => $settings]);
        }
    }

    /** @return \Illuminate\Support\Collection<int, Page> */
    protected function children(string $path)
    {
        $parent = Page::where('path', $path)->first();

        if (! $parent instanceof Page) {
            return collect();
        }

        return Page::where('parent_id', $parent->id)
            ->published()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }

    protected function topLevel(string $label): ?MenuItem
    {
        return MenuItem::whereHas('menu', fn ($q) => $q->where('location', 'header'))
            ->whereNull('parent_id')
            ->where('label', $label)
            ->first();
    }
}

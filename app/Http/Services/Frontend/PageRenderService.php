<?php

namespace App\Http\Services\Frontend;

use App\Contracts\Cms\ResolvesCollection;
use App\Enums\System\CacheKey;
use App\Http\Resources\Backend\Cms\PageSectionResource;
use App\Http\Services\Backend\Cms\PageSectionService;
use App\Http\Services\Backend\Cms\SectionTypeRegistry;
use App\Http\Services\Backend\Cms\SeoService;
use App\Http\Services\Cms\ContentTranslator;
use App\Models\Page;
use App\Models\PageSection;
use App\Traits\Cms\CacheInvalidation;

/**
 * Assembles the payload one public page needs to render.
 *
 * Deliberately separate from `PageService`, which is the admin's write-side
 * service: the read path has different concerns (publish filtering, SEO
 * resolution, caching) and mixing them would mean every admin save paid for
 * public-render logic it never uses.
 *
 * Nothing here trusts the section type to exist. A type removed from code while
 * rows still reference it is a normal state during a refactor, so unknown types
 * are dropped from the public payload rather than allowed to break the page.
 */
class PageRenderService
{
    use CacheInvalidation;

    public function __construct(
        protected PageSectionService $sections,
        protected SeoService $seo,
        protected SectionTypeRegistry $registry,
        protected ContentTranslator $translator,
    ) {}

    /**
     * The page whose sections are the structure to render.
     *
     * For the default locale that is the page itself. For any other locale it
     * is the default-locale sibling in the same `translation_group_id` — the
     * one that actually owns `page_sections` rows. A locale page with no
     * published sibling falls back to its own (usually empty) section set
     * rather than 500ing.
     */
    protected function structurePage(Page $page): Page
    {
        if (is_default_locale($page->locale)) {
            return $page;
        }

        return Page::query()
            ->where('site_id', (int) config('cms.site_id'))
            ->where('translation_group_id', $page->translation_group_id)
            ->where('locale', default_locale())
            ->published()
            ->first() ?? $page;
    }

    /**
     * Flatten a published section tree into every model the overlay can
     * translate: the sections themselves, their repeater items, and nested
     * child items. `getPublished()` has already swapped shared-block
     * references for the block body, so a `PageSection` here is always the
     * thing that carries the text.
     *
     * @param  \Illuminate\Support\Collection<int, PageSection>  $sections
     * @return \Illuminate\Support\Collection<int, \Illuminate\Database\Eloquent\Model>
     */
    protected function translatableModels($sections)
    {
        $models = collect();

        foreach ($sections as $section) {
            $models->push($section);

            if (! $section->relationLoaded('blocks')) {
                continue;
            }

            foreach ($section->blocks as $block) {
                $models->push($block);

                if ($block->relationLoaded('children')) {
                    foreach ($block->children as $child) {
                        $models->push($child);
                    }
                }
            }
        }

        return $models;
    }

    /**
     * The homepage, or null when no page is flagged as one.
     *
     * Returning null rather than throwing lets the controller decide between a
     * 404 and an empty shell — a brand-new install has no homepage yet, and that
     * is not an error.
     */
    public function homepage(): ?Page
    {
        return $this->localeAware(
            fn (string $locale): ?Page => Page::query()
                ->where('site_id', (int) config('cms.site_id'))
                ->where('is_homepage', true)
                ->where('locale', $locale)
                ->published()
                ->first()
        );
    }

    /**
     * Resolve a page by its public path, for every non-home route.
     */
    public function byPath(string $path): ?Page
    {
        $normalized = $this->normalizePath($path);

        return $this->localeAware(
            fn (string $locale): ?Page => Page::query()
                ->where('site_id', (int) config('cms.site_id'))
                ->where('path', $normalized)
                ->where('locale', $locale)
                ->published()
                ->first()
        );
    }

    /**
     * Run a locale-filtered page lookup for the active locale, falling back to
     * the default locale when that locale has no row yet.
     *
     * A visitor who switches to Dutch on a page nobody has translated should
     * see the English page, not a 404 — "English is always the fallback".
     * Phase B layers locale-prefixed URLs and redirects on top of this; the
     * fallback stays as the floor.
     */
    protected function localeAware(callable $lookup): ?Page
    {
        $active = get_system_locale();

        $page = $lookup($active);

        if ($page === null && ! is_default_locale($active)) {
            $page = $lookup(default_locale());
        }

        return $page;
    }

    /**
     * The editable "page not found" page, or null when none is authored.
     *
     * A `system` page at `/404` lets the 404 be built in the page builder like
     * anything else — the alternative is a hardcoded React screen, which is
     * exactly the "never hardcode content" rule this CMS exists to avoid. The
     * controller falls back to a bare translated shell when it is missing, so
     * a fresh install still returns an honest 404.
     */
    public function notFoundPage(): ?Page
    {
        return $this->localeAware(
            fn (string $locale): ?Page => Page::query()
                ->where('site_id', (int) config('cms.site_id'))
                ->where('path', '/404')
                ->where('locale', $locale)
                ->published()
                ->first()
        );
    }

    /**
     * The ancestor trail for a page, ending with the page itself.
     *
     * Built from the DENORMALIZED PATH, not by walking `parent_id`. Walking the
     * chain is one query per level — the N+1 that `pages.path` exists to make
     * unnecessary. Splitting `/services/video-and-animation` yields the single
     * ancestor path `/services`, and one `whereIn` against `pages_path_unique`
     * resolves every level at once however deep the tree gets.
     *
     * An unpublished or missing ancestor is skipped rather than rendered as a
     * dead crumb: a draft parent is a normal state while a section of the site
     * is being built, and linking a visitor to a 404 is worse than a shorter
     * trail.
     *
     * @return array<int, array{title: string, path: string|null}>
     */
    public function breadcrumbs(Page $page): array
    {
        $home = ['title' => translate('Home'), 'path' => localize_path('/', $page->locale) ?: '/'];

        if ($page->is_homepage || $page->path === '/') {
            return [];
        }

        $segments = array_values(array_filter(explode('/', trim((string) $page->path, '/'))));

        // Every ancestor path, shallowest first, excluding the page itself.
        $ancestorPaths = [];
        $carry = '';

        foreach (array_slice($segments, 0, -1) as $segment) {
            $carry .= '/'.$segment;
            $ancestorPaths[] = $carry;
        }

        $titles = $ancestorPaths === []
            ? collect()
            : Page::query()
                ->where('site_id', (int) config('cms.site_id'))
                ->where('locale', $page->locale)
                ->whereIn('path', $ancestorPaths)
                ->published()
                ->pluck('title', 'path');

        $trail = [$home];

        foreach ($ancestorPaths as $path) {
            $title = $titles->get($path);

            if (filled($title)) {
                $trail[] = ['title' => (string) $title, 'path' => localize_path($path, $page->locale)];
            }
        }

        // The current page closes the trail with no link — it is where the
        // visitor already is, and a self-link is a WCAG annoyance rather than
        // navigation.
        $trail[] = ['title' => (string) $page->title, 'path' => null];

        return $trail;
    }

    /**
     * Canonical stored form of an incoming path: leading slash, no trailing
     * slash. Matches `Redirect::normalizePath()` so a path that misses a page
     * is looked up in the redirect table in exactly the form it was stored.
     */
    public function normalizePath(string $path): string
    {
        $path = '/'.trim($path, '/');

        return $path === '/' ? '/' : rtrim($path, '/');
    }

    /**
     * Everything the React page needs: sections, SEO, and the type descriptors
     * that map a `section_type` to a component.
     *
     * @return array<string, mixed>
     */
    public function payload(Page $page): array
    {
        // Sections are locale-neutral structure owned by the default-locale
        // page (schema doc §8.2). A non-default locale reuses that structure
        // and overlays its translated text; it only owns its own URL, title
        // and SEO record.
        $structure = $this->structurePage($page);
        $sections = $this->sections->getPublished($structure);

        if (! is_default_locale($page->locale)) {
            $this->translator->hydrate($this->translatableModels($sections), $page->locale);
        }

        // Only the types actually present are shipped. Sending the whole
        // registry would put every admin-only field schema on the public wire
        // for no benefit.
        $presentTypes = $sections
            ->pluck('section_type')
            ->unique()
            ->filter(fn (?string $key): bool => $this->registry->has($key))
            ->values();

        /*
         * A deliberately minimal descriptor, NOT `registry->describe()`.
         *
         * Two reasons. First, the public renderer only needs to map a
         * `section_type` to a component — the admin's field schemas, validation
         * rules and block definitions are useless to a visitor and would bloat
         * every page. Second, `describe()` returns `blockTypes` in camelCase
         * while `SectionTypeResource` and `resources/js/Types/cms.ts` both use
         * `block_types`; emitting the raw descriptor here would put a third,
         * subtly different shape on the wire, which is exactly how the earlier
         * "unknown section type" lookup bug happened.
         */
        $descriptors = $presentTypes->mapWithKeys(function (string $key): array {
            $type = $this->registry->get($key);

            return [$key => [
                'key' => $key,
                'label' => $type?->label(),
                'component' => $type?->previewComponent(),
            ]];
        })->all();

        $renderable = $sections->filter(
            fn ($section): bool => $this->registry->has($section->section_type)
        )->values();

        return [
            'page' => [
                'uuid' => $page->uuid,
                'title' => $page->title,
                // Locale-prefixed for a non-default locale, so every link the
                // client renders from this stays inside the locale.
                'path' => localize_path($page->path, $page->locale),
                'locale' => $page->locale,
                'page_type' => $page->page_type?->value,
            ],
            'sections' => PageSectionResource::collection($renderable)->resolve(),
            'sectionTypes' => $descriptors,
            'seo' => $this->seo->resolve($page),
            // Structural, not collection data — it changes only when this page
            // or an ancestor is renamed, both of which already bust this cache.
            // Safe to cache alongside the payload, unlike a listing.
            'breadcrumbs' => $this->breadcrumbs($page),
            // hreflang set for this page: every published locale sibling plus
            // x-default. Consumed by PageWrapper's <Head>.
            'alternates' => $this->alternates($page),
        ];
    }

    /**
     * The published locale variants of a page, for `<link rel="alternate">`.
     *
     * Keyed by the `translation_group_id` all siblings share. `x-default`
     * points at the default-locale row. Paths are locale-prefixed and
     * root-relative; the client makes them absolute.
     *
     * @return array<int, array{hreflang: string, href: string}>
     */
    protected function alternates(Page $page): array
    {
        if (blank($page->translation_group_id)) {
            return [];
        }

        $siblings = Page::query()
            ->where('site_id', (int) config('cms.site_id'))
            ->where('translation_group_id', $page->translation_group_id)
            ->published()
            ->get(['locale', 'path']);

        if ($siblings->count() < 2) {
            return [];
        }

        $out = $siblings
            ->map(fn (Page $sibling): array => [
                'hreflang' => $sibling->locale,
                'href' => localize_path($sibling->path, $sibling->locale),
            ])
            ->values()
            ->all();

        $default = $siblings->firstWhere('locale', default_locale());

        if ($default !== null) {
            $out[] = [
                'hreflang' => 'x-default',
                'href' => localize_path($default->path, $default->locale),
            ];
        }

        return $out;
    }

    /**
     * Cached payload. The whole rendered page is one cache entry, because a
     * public visitor always wants all of it and assembling it piecemeal would
     * mean several reads per request.
     *
     * Collections are attached AFTER the cache read — see `withCollections()`
     * for why they must not be inside it.
     *
     * @return array<string, mixed>
     */
    public function cachedPayload(Page $page): array
    {
        $payload = $this->rememberTracked(
            CacheKey::CMS_PAGE->value,
            CacheKey::CMS_PAGE->for('render', $page->uuid, $page->locale),
            60 * 12,
            fn (): array => $this->payload($page)
        );

        return $this->withCollections($page, $payload);
    }

    /**
     * Attach the rows of any section that lists OTHER pages.
     *
     * WHY THIS IS NOT PART OF `payload()`
     * -----------------------------------
     * The page cache is keyed on the index page's own uuid and is invalidated
     * when that page is saved. A listing baked into it would therefore go stale
     * on an event that never touches the index page at all: publishing a new
     * service updates the service, not `/services`, so the new card would not
     * appear for twelve hours and the editor's only clue would be that
     * publishing appeared to do nothing.
     *
     * Resolving out here costs one extra query per index section per request,
     * on the small number of pages that carry one. That is the correct trade
     * against a listing that silently lies.
     *
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    protected function withCollections(Page $page, array $payload): array
    {
        $sections = $payload['sections'] ?? [];

        if (! is_array($sections) || $sections === []) {
            return $payload;
        }

        $payload['sections'] = array_map(function (array $section) use ($page): array {
            $type = $this->registry->get($section['section_type'] ?? null);

            if (! $type instanceof ResolvesCollection) {
                return $section;
            }

            /*
             * The resolver needs the section MODEL for its settings, and the
             * cached payload holds only an array. Re-reading it by uuid is one
             * indexed lookup on the handful of pages that carry an index band,
             * and it keeps the contract taking a model rather than a loose
             * array whose shape nothing enforces.
             */
            $model = PageSection::where('uuid', $section['uuid'] ?? '')->first();

            $resolved = $model instanceof PageSection
                ? $type->resolveCollection($model, $page)
                : ['items' => [], 'meta' => []];

            $section['collection'] = $resolved['items'];
            // Kept as a sibling key rather than nested inside `collection`, so
            // the rows stay a plain array the renderer can map over without
            // reaching past a wrapper on every listing that has no pagination.
            $section['collection_meta'] = $resolved['meta'];

            return $section;
        }, $sections);

        return $payload;
    }
}

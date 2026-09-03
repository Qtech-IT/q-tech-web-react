<?php

namespace App\Http\Services\Frontend;

use App\Contracts\Cms\ResolvesCollection;
use App\Enums\System\CacheKey;
use App\Http\Resources\Backend\Cms\PageSectionResource;
use App\Http\Services\Backend\Cms\PageSectionService;
use App\Http\Services\Backend\Cms\SectionTypeRegistry;
use App\Http\Services\Backend\Cms\SeoService;
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
    ) {}

    /**
     * The homepage, or null when no page is flagged as one.
     *
     * Returning null rather than throwing lets the controller decide between a
     * 404 and an empty shell — a brand-new install has no homepage yet, and that
     * is not an error.
     */
    public function homepage(): ?Page
    {
        return Page::query()
            ->where('site_id', (int) config('cms.site_id'))
            ->where('is_homepage', true)
            ->where('locale', get_system_locale())
            ->published()
            ->first();
    }

    /**
     * Resolve a page by its public path, for every non-home route.
     */
    public function byPath(string $path): ?Page
    {
        return Page::query()
            ->where('site_id', (int) config('cms.site_id'))
            ->where('path', $this->normalizePath($path))
            ->where('locale', get_system_locale())
            ->published()
            ->first();
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
        return Page::query()
            ->where('site_id', (int) config('cms.site_id'))
            ->where('path', '/404')
            ->where('locale', get_system_locale())
            ->published()
            ->first();
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
        $home = ['title' => translate('Home'), 'path' => '/'];

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
                $trail[] = ['title' => (string) $title, 'path' => $path];
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
        $sections = $this->sections->getPublished($page);

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
                'path' => $page->path,
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
        ];
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

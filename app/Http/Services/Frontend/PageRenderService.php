<?php

namespace App\Http\Services\Frontend;

use App\Enums\System\CacheKey;
use App\Http\Resources\Backend\Cms\PageSectionResource;
use App\Http\Services\Backend\Cms\PageSectionService;
use App\Http\Services\Backend\Cms\SectionTypeRegistry;
use App\Http\Services\Backend\Cms\SeoService;
use App\Models\Page;
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
            ->where('path', '/'.ltrim($path, '/'))
            ->where('locale', get_system_locale())
            ->published()
            ->first();
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
            ],
            'sections' => PageSectionResource::collection($renderable)->resolve(),
            'sectionTypes' => $descriptors,
            'seo' => $this->seo->resolve($page),
        ];
    }

    /**
     * Cached payload. The whole rendered page is one cache entry, because a
     * public visitor always wants all of it and assembling it piecemeal would
     * mean several reads per request.
     *
     * @return array<string, mixed>
     */
    public function cachedPayload(Page $page): array
    {
        return $this->rememberTracked(
            CacheKey::CMS_PAGE->value,
            CacheKey::CMS_PAGE->for('render', $page->uuid, $page->locale),
            60 * 12,
            fn (): array => $this->payload($page)
        );
    }
}

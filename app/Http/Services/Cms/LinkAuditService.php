<?php

namespace App\Http\Services\Cms;

use App\Enums\Cms\CtaLinkType;
use App\Enums\Cms\MenuLinkType;
use App\Enums\Cms\SectionLinkType;
use App\Models\Cta;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\Redirect;
use App\Models\SectionBlock;
use Illuminate\Support\Collection;

/**
 * Walks every internal link the CMS holds and reports the ones that resolve to
 * nothing: a menu item or CTA pointing at a deleted page, an in-content link to
 * a path no page owns, a named route that no longer exists, a redirect whose
 * target 404s, and published pages with no inbound link at all.
 *
 * Read-only. `cms:audit-links` runs it; a non-empty result is a launch blocker,
 * not a warning.
 */
class LinkAuditService
{
    /** @var array<string, true> lowercased published default-locale paths */
    private array $livePaths = [];

    /** @var array<string, true> redirect `from_path`s */
    private array $redirectPaths = [];

    /** @var array<int, true> ids of pages that have at least one inbound link */
    private array $linkedPageIds = [];

    /**
     * @return array<int, array{type: string, source: string, detail: string, target: string|null}>
     */
    public function run(): array
    {
        $this->warmIndexes();

        return [
            ...$this->auditMenuItems(),
            ...$this->auditCtas(),
            ...$this->auditSectionBlockLinks(),
            ...$this->auditRedirects(),
            ...$this->auditOrphanPages(),
        ];
    }

    private function warmIndexes(): void
    {
        $siteId = (int) config('cms.site_id');
        $default = default_locale();

        Page::query()
            ->where('site_id', $siteId)
            ->where('locale', $default)
            ->published()
            ->get(['id', 'path'])
            ->each(function (Page $page): void {
                $this->livePaths[strtolower($page->path)] = true;
            });

        Redirect::query()
            ->where('site_id', $siteId)
            ->get(['from_path'])
            ->each(function (Redirect $redirect): void {
                $this->redirectPaths[strtolower(Redirect::normalizePath($redirect->from_path))] = true;
            });
    }

    /** A root-relative internal path that resolves to a live page or a redirect. */
    private function pathResolves(?string $path): bool
    {
        if ($path === null || $path === '' || ! str_starts_with($path, '/')) {
            return false;
        }

        $clean = strtolower(rtrim(strtok($path, '#?'), '/')) ?: '/';

        return isset($this->livePaths[$clean]) || isset($this->redirectPaths[$clean]);
    }

    private function routeExists(?string $name): bool
    {
        return filled($name) && app('router')->has($name);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function auditMenuItems(): array
    {
        $findings = [];

        // Only ACTIVE items: NavigationRepairSeeder deactivates an item whose
        // target is gone, and a hidden link is not a live dead end.
        MenuItem::query()
            ->where('status', \App\Enums\Common\Status::ACTIVE->value)
            ->with('menu:id,key')
            ->get()
            ->each(function (MenuItem $item) use (&$findings): void {
                $type = $item->link_type instanceof MenuLinkType
                    ? $item->link_type
                    : MenuLinkType::tryFrom((string) $item->link_type);

                $source = "menu:{$item->menu?->key} · “{$item->label}”";

                if ($type === MenuLinkType::PAGE) {
                    if ($item->page_id === null || ! Page::whereKey($item->page_id)->exists()) {
                        $findings[] = $this->finding('menu-item', $source, 'links to a page that no longer exists', (string) $item->page_id);

                        return;
                    }
                    $this->linkedPageIds[(int) $item->page_id] = true;
                }

                if ($type === MenuLinkType::ROUTE && ! $this->routeExists($item->route_name)) {
                    $findings[] = $this->finding('menu-item', $source, 'names a route that is not registered', $item->route_name);
                }

                if ($type === MenuLinkType::URL && $item->url !== null && str_starts_with((string) $item->url, '/') && ! $this->pathResolves($item->url)) {
                    $findings[] = $this->finding('menu-item', $source, 'internal URL resolves to no page or redirect', $item->url);
                }
            });

        return $findings;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function auditCtas(): array
    {
        $findings = [];

        Cta::query()->get()->each(function (Cta $cta) use (&$findings): void {
            $type = $cta->link_type instanceof CtaLinkType
                ? $cta->link_type
                : CtaLinkType::tryFrom((string) $cta->link_type);

            $source = "cta · “{$cta->label}”";

            if ($type === CtaLinkType::PAGE) {
                if ($cta->page_id === null || ! Page::whereKey($cta->page_id)->exists()) {
                    $findings[] = $this->finding('cta', $source, 'links to a page that no longer exists', (string) $cta->page_id);

                    return;
                }
                $this->linkedPageIds[(int) $cta->page_id] = true;
            }

            if ($type === CtaLinkType::ROUTE && ! $this->routeExists($cta->route_name)) {
                $findings[] = $this->finding('cta', $source, 'names a route that is not registered', $cta->route_name);
            }

            if ($type === CtaLinkType::URL && $cta->url !== null && str_starts_with((string) $cta->url, '/') && ! $this->pathResolves($cta->url)) {
                $findings[] = $this->finding('cta', $source, 'internal URL resolves to no page or redirect', $cta->url);
            }
        });

        return $findings;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function auditSectionBlockLinks(): array
    {
        $findings = [];

        SectionBlock::query()
            ->whereNotNull('link_type')
            ->where('link_type', '!=', SectionLinkType::NONE->value)
            ->get()
            ->each(function (SectionBlock $block) use (&$findings): void {
                $type = $block->link_type instanceof SectionLinkType
                    ? $block->link_type
                    : SectionLinkType::tryFrom((string) $block->link_type);

                $source = 'section-block · “'.($block->label ?: $block->uuid).'”';

                if ($type === SectionLinkType::PAGE) {
                    $id = $block->link_target_id;
                    if ($id === null || ! Page::whereKey($id)->exists()) {
                        $findings[] = $this->finding('section-link', $source, 'links to a page that no longer exists', (string) $id);

                        return;
                    }
                    $this->linkedPageIds[(int) $id] = true;
                }

                if ($type === SectionLinkType::URL && $block->link_url !== null && str_starts_with((string) $block->link_url, '/') && ! $this->pathResolves($block->link_url)) {
                    $findings[] = $this->finding('section-link', $source, 'internal URL resolves to no page or redirect', $block->link_url);
                }
            });

        return $findings;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function auditRedirects(): array
    {
        $findings = [];

        Redirect::query()
            ->where('site_id', (int) config('cms.site_id'))
            ->get(['from_path', 'to_path'])
            ->each(function (Redirect $redirect) use (&$findings): void {
                $to = Redirect::normalizePath($redirect->to_path);
                $source = "redirect · {$redirect->from_path}";

                if (str_starts_with($to, '/') && ! $this->pathResolves($to)) {
                    $findings[] = $this->finding('redirect', $source, 'target resolves to no page', $to);
                }

                if (Redirect::normalizePath($redirect->from_path) === $to) {
                    $findings[] = $this->finding('redirect', $source, 'redirects to itself', $to);
                }
            });

        return $findings;
    }

    /**
     * Published default-locale pages with no menu item, CTA or in-content link
     * pointing at them — "every page needs a link".
     *
     * @return array<int, array<string, mixed>>
     */
    private function auditOrphanPages(): array
    {
        $siteId = (int) config('cms.site_id');

        $pages = Page::query()
            ->where('site_id', $siteId)
            ->where('locale', default_locale())
            ->where('is_homepage', false)
            ->published()
            ->get(['id', 'parent_id', 'path', 'title']);

        // A child of a published page is reachable by drilling into that
        // parent's listing (a `collection.index` section resolves the cards
        // dynamically, so the link is never stored) — not an orphan.
        $publishedIds = $pages->pluck('id')->flip();

        return $pages
            ->reject(fn (Page $page): bool => isset($this->linkedPageIds[(int) $page->id])
                || ($page->parent_id !== null && $publishedIds->has($page->parent_id)))
            ->map(fn (Page $page): array => $this->finding(
                'orphan-page',
                "page · “{$page->title}”",
                'is published but nothing links to it',
                $page->path,
            ))
            ->values()
            ->all();
    }

    /**
     * @return array{type: string, source: string, detail: string, target: string|null}
     */
    private function finding(string $type, string $source, string $detail, ?string $target): array
    {
        return compact('type', 'source', 'detail', 'target');
    }

    /**
     * Group a result set by finding type, for a compact report.
     *
     * @param  array<int, array<string, mixed>>  $findings
     * @return Collection<string, Collection<int, array<string, mixed>>>
     */
    public function group(array $findings): Collection
    {
        return collect($findings)->groupBy('type');
    }
}

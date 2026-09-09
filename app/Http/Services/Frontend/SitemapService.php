<?php

namespace App\Http\Services\Frontend;

use App\Enums\Cms\PageType;
use App\Enums\Common\Status;
use App\Enums\Settings\SettingKey;
use App\Enums\System\CacheKey;
use App\Models\Page;
use App\Traits\Cms\CacheInvalidation;
use Illuminate\Support\Collection;
use XMLWriter;

/**
 * Builds `/sitemap.xml` and `/robots.txt` for the public site.
 *
 * Read-side only. Nothing here writes, so it carries no invalidation of its
 * own — the two cache entries it fills are already forgotten on the events that
 * change their inputs:
 *
 *  - the sitemap XML (`CMS_SITEMAP`) is forgotten by
 *    `PageService::forgetPage()` and `SeoService::forgetSeo()`, which every
 *    page/SEO write and the scheduled-content janitor go through;
 *  - the robots.txt body (`CMS_SETTINGS:robots`) and the sitemap are both
 *    forgotten by `SettingsService::save()`, so an admin toggling any SEO
 *    setting sees it on the very next request.
 *
 * The URL set is one indexed query with no lazy access, so a crawler hit that
 * misses the cache is still a single round trip.
 */
class SitemapService
{
    use CacheInvalidation;

    /**
     * A single flat sitemap is served up to this many URLs. A marketing site
     * will never approach it; past it the service emits a sitemap index split
     * by locale instead, so the 50,000-URL protocol limit is never breached.
     */
    private const FLAT_LIMIT = 45000;

    /**
     * The rendered sitemap XML, cached as the string.
     *
     * `$part` selects one locale's URL set when the flat file has grown into a
     * per-locale index; null renders the whole thing (flat) or the index
     * document itself.
     */
    public function xml(?string $part = null): string
    {
        $siteId = (int) config('cms.site_id');

        return $this->rememberTracked(
            CacheKey::CMS_SITEMAP->value,
            CacheKey::CMS_SITEMAP->for($siteId, $part ?: 'all'),
            (int) config('cms.ttl.sitemap', 360),
            function () use ($part): string {
                $entries = $this->entries();

                if ($entries->count() <= self::FLAT_LIMIT) {
                    return $this->renderUrlSet($entries);
                }

                if ($part !== null) {
                    return $this->renderUrlSet($entries->where('locale', $part)->values());
                }

                return $this->renderIndex($entries->pluck('locale')->unique()->values());
            }
        );
    }

    /**
     * The generated robots.txt body, cached as the string.
     */
    public function robotsTxt(): string
    {
        return $this->rememberTracked(
            CacheKey::CMS_SETTINGS->value,
            CacheKey::CMS_SETTINGS->for('robots'),
            60,
            fn (): string => $this->buildRobotsTxt(),
        );
    }

    /**
     * AI assistants and answer engines. Given their own group so the site can
     * state a position on them explicitly rather than leaving it implied by the
     * `*` group — and so a single setting can flip the whole set to blocked.
     *
     * @var array<int, string>
     */
    private const AI_CRAWLERS = [
        'GPTBot',
        'ChatGPT-User',
        'OAI-SearchBot',
        'ClaudeBot',
        'Claude-Web',
        'anthropic-ai',
        'PerplexityBot',
        'Perplexity-User',
        'Google-Extended',
        'Applebot-Extended',
        'CCBot',
        'Bytespider',
        'Amazonbot',
        'cohere-ai',
        'Meta-ExternalAgent',
    ];

    /**
     * Query strings that only ever produce a duplicate of a canonical URL —
     * campaign and click-ID parameters. Blocking the patterns keeps a crawler
     * from spending its budget re-fetching the same page under a hundred
     * tagged links. The site also emits `rel=canonical`, so this is belt and
     * braces, not the only defence.
     *
     * @var array<int, string>
     */
    private const TRACKING_PARAMS = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
        'fbclid', 'gclid', 'gclsrc', 'dclid', 'wbraid', 'gbraid',
        'msclkid', 'mc_cid', 'mc_eid', 'igshid', 'ttclid', 'twclid', 'ref',
    ];

    /**
     * The robots.txt body.
     */
    private function buildRobotsTxt(): string
    {
        // Master switch. Off => every crawler is turned away, whole stop. This
        // is what a staging copy sets so it never lands in an index; it is also
        // the "we are not ready" state for a fresh install.
        $allowIndexing = site_settings(SettingKey::ROBOTS_ALLOW_INDEXING->value, Status::ACTIVE->value) === Status::ACTIVE->value;

        if (! $allowIndexing) {
            return "User-agent: *\nDisallow: /\n";
        }

        $groups = [];

        // The default group: everyone, allowed everywhere except the app's own
        // prefixes and campaign-tagged duplicates.
        $rules = ['Allow: /'];

        foreach ($this->disallowedPrefixes() as $prefix) {
            $rules[] = 'Disallow: /'.trim($prefix, '/').'/';
        }

        foreach (self::TRACKING_PARAMS as $param) {
            $rules[] = 'Disallow: /*?*'.$param.'=';
        }

        $groups[] = "User-agent: *\n".implode("\n", $rules);

        // AI assistants and answer engines — welcomed or blocked as one set.
        $aiAllowed = site_settings(SettingKey::ROBOTS_AI_CRAWLERS->value, Status::ACTIVE->value) === Status::ACTIVE->value;
        $agents = implode("\n", array_map(fn (string $ua): string => 'User-agent: '.$ua, self::AI_CRAWLERS));

        $groups[] = $aiAllowed
            ? "# AI assistants and answer engines are welcome to read public content.\n".$agents."\nAllow: /"
            : "# AI assistants and answer engines are not permitted.\n".$agents."\nDisallow: /";

        $body = implode("\n\n", $groups);

        if ($this->sitemapEnabled()) {
            $body .= "\n\nSitemap: ".url('/sitemap.xml');
        }

        $extra = trim((string) site_settings(SettingKey::ROBOTS_TXT_EXTRA->value, ''));

        if ($extra !== '') {
            $body .= "\n\n".$extra;
        }

        return $body."\n";
    }

    /**
     * Whether `/sitemap.xml` should be served at all.
     *
     * Requires BOTH the sitemap switch and the master indexing switch: a site
     * that turns crawlers away in robots.txt has no business also handing them
     * a sitemap.
     */
    public function sitemapEnabled(): bool
    {
        $indexingAllowed = site_settings(SettingKey::ROBOTS_ALLOW_INDEXING->value, Status::ACTIVE->value) === Status::ACTIVE->value;

        return $indexingAllowed
            && site_settings(SettingKey::SITEMAP_ENABLED->value, Status::ACTIVE->value) === Status::ACTIVE->value;
    }

    /**
     * Every public, indexable, published page across all locales — one query.
     *
     * `is_indexable` is the column duplicated from `seo_meta.robots_index` on
     * purpose, so the decision survives a page that has no SEO row. System
     * pages (`/404` and friends) are filtered in PHP rather than in SQL because
     * `page_type` is nullable and `whereNotIn` would also drop the NULL rows.
     *
     * @return Collection<int, Page>
     */
    public function entries(): Collection
    {
        return Page::query()
            ->where('site_id', (int) config('cms.site_id'))
            ->where('is_indexable', true)
            ->published()
            ->orderBy('depth')
            ->orderBy('path')
            ->get(['id', 'translation_group_id', 'locale', 'path', 'is_homepage', 'depth', 'page_type', 'updated_at'])
            ->reject(fn (Page $page): bool => $page->page_type === PageType::SYSTEM)
            ->values();
    }

    /**
     * Render a `<urlset>` with an hreflang alternate block per URL.
     *
     * @param  Collection<int, Page>  $entries
     */
    private function renderUrlSet(Collection $entries): string
    {
        $changefreq = (string) site_settings(SettingKey::SITEMAP_CHANGEFREQ->value, 'weekly');
        $default = default_locale();

        // translation_group_id => [locale => absolute url], for the alternates.
        $groups = $entries
            ->groupBy('translation_group_id')
            ->map(fn (Collection $rows): array => $rows
                ->mapWithKeys(fn (Page $p): array => [$p->locale => $this->loc($p)])
                ->all());

        $writer = new XMLWriter;
        $writer->openMemory();
        $writer->setIndent(true);
        $writer->startDocument('1.0', 'UTF-8');
        $writer->startElement('urlset');
        $writer->writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
        $writer->writeAttribute('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');

        foreach ($entries as $page) {
            $alternates = $groups->get($page->translation_group_id, []);

            $writer->startElement('url');
            $writer->writeElement('loc', $this->loc($page));

            if ($page->updated_at !== null) {
                $writer->writeElement('lastmod', $page->updated_at->toAtomString());
            }

            $writer->writeElement('changefreq', $changefreq);
            $writer->writeElement('priority', $this->priority($page));

            if (count($alternates) > 1) {
                foreach ($alternates as $locale => $href) {
                    $this->alternate($writer, $locale, $href);
                }

                if (isset($alternates[$default])) {
                    $this->alternate($writer, 'x-default', $alternates[$default]);
                }
            }

            $writer->endElement();
        }

        $writer->endElement();
        $writer->endDocument();

        return $writer->outputMemory();
    }

    /**
     * Render a `<sitemapindex>` pointing at one child sitemap per locale.
     *
     * @param  Collection<int, string>  $locales
     */
    private function renderIndex(Collection $locales): string
    {
        $writer = new XMLWriter;
        $writer->openMemory();
        $writer->setIndent(true);
        $writer->startDocument('1.0', 'UTF-8');
        $writer->startElement('sitemapindex');
        $writer->writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

        foreach ($locales as $locale) {
            $writer->startElement('sitemap');
            $writer->writeElement('loc', url('/sitemap.xml?part='.$locale));
            $writer->writeElement('lastmod', now()->toAtomString());
            $writer->endElement();
        }

        $writer->endElement();
        $writer->endDocument();

        return $writer->outputMemory();
    }

    private function alternate(XMLWriter $writer, string $hreflang, string $href): void
    {
        $writer->startElement('xhtml:link');
        $writer->writeAttribute('rel', 'alternate');
        $writer->writeAttribute('hreflang', $hreflang);
        $writer->writeAttribute('href', $href);
        $writer->endElement();
    }

    /**
     * Absolute, locale-prefixed URL for a page.
     */
    private function loc(Page $page): string
    {
        $path = $page->path === '/' ? '/' : $page->path;

        return url(localize_path($path, $page->locale) ?: '/');
    }

    /**
     * Homepage is 1.0; every level deeper loses 0.15, floored at 0.3.
     */
    private function priority(Page $page): string
    {
        if ($page->is_homepage || $page->path === '/') {
            return '1.0';
        }

        return number_format(max(0.3, 0.9 - ($page->depth * 0.15)), 1);
    }

    /**
     * Reserved prefixes a crawler should never follow — the CMS's own
     * `reserved_path_prefixes` minus the two files this feature serves.
     *
     * @return array<int, string>
     */
    private function disallowedPrefixes(): array
    {
        return array_values(array_diff(
            (array) config('cms.reserved_path_prefixes'),
            ['sitemap.xml', 'robots.txt', 'storage'],
        ));
    }
}

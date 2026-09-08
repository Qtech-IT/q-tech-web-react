<?php

namespace Database\Seeders;

use App\Models\Block;
use App\Models\Page;
use App\Models\PageSection;
use Database\Seeders\Cms\CmsContentSeeder;

/**
 * Promote duplicated content into reusable blocks.
 *
 * WHY
 * ---
 * The FAQ existed twice — eight questions on the homepage and ten fuller ones
 * on `/faq` — and the newsletter twice more. Two copies of one answer become
 * two DIFFERENT answers the first time somebody edits one, and nothing in the
 * CMS would ever surface the divergence.
 *
 * Each block below is authored once and referenced from every page that shows
 * it, so editing it updates all of them. The admin can already list those
 * pages: `Block::usages()`.
 *
 * SELF-HEALING, AND WHY THAT MATTERS
 * ----------------------------------
 * A page seeder's `clearSections()` deletes every section on its page —
 * including a reference to a shared block. So re-running `HomePageSeeder`
 * alone silently un-shares the homepage's FAQ and re-creates a local copy,
 * putting the site straight back into the divergence this fixes.
 *
 * `share()` therefore reconciles rather than converts: it finds the block if it
 * exists, adopts a source only if the block has no body yet, deletes local
 * duplicates on every listed page, and rebuilds the references. Running it
 * after any combination of page seeders converges on the same state.
 */
class SharedBlocksSeeder extends CmsContentSeeder
{
    public function run(): void
    {
        /*
         * THE FAQ IS DELIBERATELY NOT SHARED.
         *
         * It was, and it was a mistake worth recording. A block carries its
         * section's PRESENTATION as well as its content — `layout`, `align`,
         * `theme`, the heading and the eyebrow all live on the same row — so
         * sharing the FAQ did not merely unify ten answers, it pushed the
         * `/faq` page's stacked, left-aligned treatment onto the homepage's
         * split, centred band and replaced its headline. The homepage's design
         * changed as a side effect of a content decision, which is not a trade
         * anybody agreed to.
         *
         * `referenceBlock()` can now override settings per page (see
         * `CmsContentSeeder`), so this is fixable rather than impossible — but
         * the homepage's FAQ is also a deliberately shorter, punchier eight
         * questions than the reference page's ten, and that is an editorial
         * choice, not duplication to be optimised away. Two audiences, two
         * lengths, two designs.
         *
         * The newsletter below is the case sharing is actually for: identical
         * content, and a consent statement that must not drift.
         */

        /*
         * The consent wording is why this one matters more than it looks: it is
         * a compliance statement, and a site carrying three slightly different
         * versions of it has three different consent records to defend.
         */
        $this->share(
            key: 'global.newsletter',
            name: 'Newsletter Signup',
            sectionType: 'newsletter.signup',
            paths: ['/', '/blog'],
            description: 'The subscription block, including its consent wording. Shared so the consent statement cannot drift between pages.',
        );

        $this->flushPageCache();
    }

    /**
     * Reconcile one shared block across the pages that should show it.
     *
     * `paths` is ordered by authority: the first page holding a local copy
     * supplies the block's body if it does not have one yet. Every page keeps
     * the position its own author gave the band — the same block sits
     * fifteenth on the homepage and first on the page dedicated to it.
     *
     * @param  array<int, string>  $paths
     */
    protected function share(
        string $key,
        string $name,
        string $sectionType,
        array $paths,
        ?string $description = null,
    ): void {
        $pages = collect($paths)
            ->map(fn (string $path): ?Page => Page::where('site_id', $this->siteId())->where('path', $path)->first())
            ->filter()
            ->values();

        if ($pages->isEmpty()) {
            return;
        }

        $block = Block::where('site_id', $this->siteId())->where('key', $key)->first();
        $body = $block?->body;

        /*
         * Where each page wants the band, captured BEFORE anything is deleted.
         *
         * Read from a local copy where one exists, otherwise from the existing
         * reference — which is the case after a page seeder has been re-run and
         * only some pages have local copies again.
         */
        $placements = [];

        foreach ($pages as $page) {
            $local = PageSection::where('page_id', $page->id)
                ->where('section_type', $sectionType)
                ->whereNull('block_id')
                ->first();

            $reference = PageSection::where('page_id', $page->id)
                ->whereNotNull('block_id')
                ->when($block, fn ($q) => $q->where('block_id', $block->id))
                ->first();

            $existing = $local ?? $reference;

            if ($existing === null) {
                continue;
            }

            $placements[] = [
                'page' => $page,
                'sort_order' => $existing->sort_order,
                'anchor' => $existing->anchor,
                'local' => $local,
            ];
        }

        if ($placements === []) {
            return;
        }

        // Adopt a body only when the block has none — otherwise the block IS
        // the source of truth and local copies are duplicates to remove.
        if ($body === null) {
            $source = collect($placements)->pluck('local')->filter()->first();

            if ($source === null) {
                return;
            }

            $block = $this->shareSection($source, $key, $name, [], $description);

            // The adopted row is no longer a local copy of anything.
            $placements = array_map(
                fn (array $p): array => $p['local']?->is($source) ? [...$p, 'local' => null] : $p,
                $placements
            );
        }

        foreach ($placements as $placement) {
            $placement['local']?->forceDelete();

            $this->referenceBlock(
                $placement['page'],
                $block,
                (int) $placement['sort_order'],
                $placement['anchor'],
            );
        }
    }
}

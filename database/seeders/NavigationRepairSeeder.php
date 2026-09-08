<?php

namespace Database\Seeders;

use App\Enums\Cms\MenuLinkType;
use App\Enums\Common\Status;
use App\Http\Services\Frontend\NavigationService;
use App\Models\MenuItem;
use App\Models\Page;
use Database\Seeders\Cms\CmsContentSeeder;

/**
 * Deactivate navigation entries that point at pages nobody has written.
 *
 * WHY THIS IS NEEDED NOW AND WAS NOT BEFORE
 * -----------------------------------------
 * The header menu shipped with roughly ninety URL links, most of them to
 * root-level paths that have never existed — `/java`, `/big-data`,
 * `/erp-development` and so on. Until the site had a route that resolves
 * arbitrary URLs those links were inert; nothing served them and nothing
 * rendered. Now that every URL resolves through the CMS page tree, each one is
 * a visitor landing on a 404 from the primary navigation.
 *
 * WHY DEACTIVATE RATHER THAN DELETE
 * ---------------------------------
 * These are an editor's own words and their own information architecture,
 * representing a decision about what the company wants to sell. Deleting them
 * destroys that; `NavigationService` already filters on `status`, so setting an
 * item inactive removes it from the public menu while leaving it visible and
 * restorable in the menu builder. The moment somebody writes `/technologies/go`
 * they re-enable the entry and point it at the page.
 *
 * WHY NOT POINT THEM ALL AT THE INDEX PAGES
 * -----------------------------------------
 * Because a link labelled "Salesforce" that lands on a page listing eight other
 * technologies is a worse experience than no link: the visitor concludes the
 * site is broken rather than that the page does not exist yet. A menu should
 * only promise what it can deliver.
 *
 * IDEMPOTENT and reversible: re-running re-checks every item against the pages
 * that exist at that moment, and re-activates any whose page has since been
 * written.
 *
 * CTAs are exempt entirely — see the note in the loop.
 */
class NavigationRepairSeeder extends CmsContentSeeder
{
    public function run(): void
    {
        $paths = Page::pluck('path')->flip();

        $deactivated = 0;
        $restored = 0;

        $items = MenuItem::where('link_type', MenuLinkType::URL->value)
            ->whereNotNull('url')
            ->get();

        foreach ($items as $item) {
            $url = (string) $item->url;

            // Only internal paths are ours to judge. An external URL, a
            // `mailto:` or an in-page anchor is not something the page tree can
            // confirm or deny.
            if (! str_starts_with($url, '/')) {
                continue;
            }

            /*
             * A CTA is never hidden, even when its target does not exist yet.
             *
             * `settings.is_cta` marks the bar's primary conversion action —
             * "Schedule a Call". Its destination is a commitment the business
             * has made about where enquiries go, and it is frequently a route
             * the application will own rather than a CMS page. Hiding it
             * because the page tree cannot see a `/contact` row removes the
             * single most important control in the header to fix a link that
             * the people who own it already know about.
             *
             * A broken content link is a bad visitor experience. A missing
             * primary CTA is a broken business.
             */
            if (! empty($item->settings['is_cta'])) {
                continue;
            }

            $target = rtrim(strtok($url, '#?'), '/') ?: '/';
            $resolves = $paths->has($target);

            if (! $resolves && $item->status === Status::ACTIVE) {
                $item->update(['status' => Status::INACTIVE->value]);
                $deactivated++;

                continue;
            }

            /*
             * The other direction matters just as much. A previous run hid an
             * entry because its page did not exist; once somebody writes that
             * page the entry should come back on its own rather than staying
             * hidden until a person remembers this seeder did it.
             */
            if ($resolves && $item->status === Status::INACTIVE) {
                $item->update(['status' => Status::ACTIVE->value]);
                $restored++;
            }
        }

        app(NavigationService::class)->forget();
        $this->flushPageCache();

        $this->command?->info(
            "Navigation repair: {$deactivated} entries hidden (no page), {$restored} restored."
        );
    }
}

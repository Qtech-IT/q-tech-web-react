<?php

namespace Database\Seeders\Cms;

use App\Models\Page;
use App\Models\PageSection;

/**
 * Keeps a page section's uuid stable across a re-seed.
 *
 * THE PROBLEM
 * -----------
 * Every content seeder replaces a page's sections by force-deleting them and
 * writing fresh rows. `page_sections.uuid` is the ROUTE KEY — the admin
 * addresses a section as `/backend/page-sections/{uuid}` — so each re-seed
 * issued a brand-new identity for every section on the page.
 *
 * The consequence is invisible until it bites: a page builder already open in a
 * browser is holding uuids that no longer exist, and the next save returns 404
 * with nothing on screen to explain it. The same applies to a bookmarked
 * section, a duplicate request in flight, and the reorder endpoint.
 *
 * HOW IT WORKS
 * ------------
 * `carrySectionUuids()` snapshots the page's current `name => uuid` map before
 * anything is deleted, and registers a one-time `creating` listener that hands
 * the old uuid back to the replacement row. `HasUuid` only generates one when
 * the attribute is empty, so a carried value simply wins.
 *
 * Keyed on `name` — the seeder-authored internal label, unique per page in
 * practice. A section whose name changes is treated as new, which is correct:
 * it is no longer the same thing.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * It does not make re-seeding safe for edited content. A re-seed still
 * overwrites whatever an editor wrote in that section — that is what a seeder
 * is for. This makes the section's IDENTITY stable, not its content.
 */
trait CarriesSectionUuids
{
    /**
     * Snapshotted uuids, keyed by page id then section name.
     *
     * Static because the listener below is registered on the model rather than
     * on an instance, and two seeders in one run must share the same map.
     *
     * @var array<int, array<string, string>>
     */
    private static array $carriedSectionUuids = [];

    /** Registered once per process, not once per seeder. */
    private static bool $carryListenerBound = false;

    /**
     * Remember this page's section uuids before they are deleted.
     *
     * Safe to call more than once per page: a second call re-reads whatever is
     * live at that moment, and entries already consumed by the listener are
     * gone from the map rather than stale.
     */
    protected function carrySectionUuids(Page $page): void
    {
        self::$carriedSectionUuids[$page->id] = PageSection::where('page_id', $page->id)
            ->whereNotNull('name')
            ->pluck('uuid', 'name')
            ->all();

        $this->bindCarryListener();
    }

    /**
     * Hand a carried uuid to a replacement row as it is created.
     *
     * A model listener rather than a change at each `PageSection::create()`
     * call site: there are roughly thirty of those across the seeders, and one
     * missed would be a section that silently keeps changing identity — the
     * exact bug this exists to remove.
     *
     * Each entry is consumed on use, so two sections sharing a name on one page
     * cannot both claim the uuid and produce a duplicate-key failure.
     */
    private function bindCarryListener(): void
    {
        if (self::$carryListenerBound) {
            return;
        }

        self::$carryListenerBound = true;

        PageSection::creating(function (PageSection $section): void {
            /*
             * No `filled($section->uuid)` guard, deliberately.
             *
             * `HasUuid` registers its own `creating` listener when the model
             * class boots, which is long before a seeder runs — so by the time
             * this fires the uuid is ALREADY populated with a fresh one, and a
             * "only if empty" check made this whole trait a no-op.
             *
             * Overwriting is safe because the map is only ever populated by an
             * explicit `carrySectionUuids()` call and each entry is consumed
             * once. Nothing else can reach it.
             */
            if ($section->page_id === null || blank($section->name)) {
                return;
            }

            $carried = self::$carriedSectionUuids[$section->page_id][$section->name] ?? null;

            if ($carried === null) {
                return;
            }

            unset(self::$carriedSectionUuids[$section->page_id][$section->name]);

            $section->uuid = $carried;
        });
    }
}

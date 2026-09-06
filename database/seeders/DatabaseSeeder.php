<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // LanguageSeeder::class,
            // PermissionSeeder::class,
            // AdminSeeder::class,
            NotificationTemplateSeeder::class,

            // // CMS. Ordered after PermissionSeeder so the CMS roles it creates
            // // have permissions to sync, and after LanguageSeeder because
            // // menus and pages are seeded per locale.
            // CmsSettingsSeeder::class,
            // CoreMenusSeeder::class,
            // GlobalBlocksSeeder::class,

            // Publishes the repo's own seed artwork (client logos, reviewer
            // avatars) to the public disk. MUST run before HomePageSeeder,
            // which attaches those exact rows to the hero's repeaters.
            DemoMediaSeeder::class,

            // Without this the public homepage has no Page row to render and
            // falls back to its empty shell — header and footer, no sections.
            HomePageSeeder::class,

            /*
             * The rest of the public site.
             *
             * ORDER MATTERS in one direction only: each of these re-points
             * header and footer menu entries at the pages it creates, and the
             * last writer wins where two seeders claim the same label. They are
             * listed so the most specific claim runs last — CompanyPagesSeeder
             * owns 'Certifications' and 'FAQs', LegalPagesSeeder owns
             * 'Privacy Policy' and friends, and neither overlaps the others.
             *
             * Every one is idempotent (pages keyed on the path unique index,
             * sections force-deleted and rewritten), so re-running the whole
             * set on deploy replaces content rather than stacking it.
             */
            ServicePagesSeeder::class,
            TechnologyPagesSeeder::class,
            IndustryPagesSeeder::class,
            // Before the case studies, so `linkMenuItems` claims 'Our Work'
            // for the portfolio and the case studies take their own label.
            WorkPagesSeeder::class,
            CaseStudyPagesSeeder::class,
            BlogPagesSeeder::class,
            CompanyPagesSeeder::class,
            LegalPagesSeeder::class,

            /*
             * LAST, deliberately. It hides every menu entry whose target page
             * does not exist, so it has to run after everything that creates
             * pages — otherwise it would hide entries for pages that were
             * about to be written two lines further down.
             */
            /*
             * Rebuilds the header's mega panels from the page tree, so the
             * columns carry real destinations instead of the invented URLs
             * they shipped with. After every page seeder, before the repair.
             */
            MegaMenuSeeder::class,

            /*
             * Promotes duplicated content (the FAQ, the newsletter) into
             * reusable blocks. MUST run after every page seeder, because it
             * re-owns sections those seeders create — and because a page
             * seeder's `clearSections()` would delete the references.
             */
            SharedBlocksSeeder::class,

            NavigationRepairSeeder::class,
        ]);
    }
}

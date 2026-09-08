<?php

namespace Database\Seeders;

use App\Enums\Cms\ContentStatus;
use App\Enums\Cms\CtaLinkType;
use App\Enums\Cms\IconPosition;
use App\Enums\Cms\PageType;
use App\Enums\Common\Status;
use App\Enums\System\CacheKey;
use App\Models\Cta;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\SectionBlock;
use App\Traits\Cms\CacheInvalidation;
use Database\Seeders\Cms\CarriesSectionUuids;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * The homepage and its hero.
 *
 * WHY THIS EXISTS
 * ---------------
 * `PageRenderService::homepage()` looks for a published `Page` flagged
 * `is_homepage` for the current site and locale. Nothing in the repository ever
 * created one — the CMS seeders in `DatabaseSeeder` are commented out and there
 * has never been a page seeder at all — so the public homepage rendered its
 * documented "fresh install" empty shell: header, footer, and no sections. The
 * hero component was complete and correct and still could not appear, because
 * there was no row for it to render.
 *
 * This seeder is the minimum content that makes the public site show something,
 * and doubles as the worked example an editor can open in the page builder to
 * see how a section is put together.
 *
 * IDEMPOTENT
 * ----------
 * Keyed on `site_id` + `locale` + `path`, which is exactly the unique index on
 * `pages`. Re-running replaces the hero and the services grid rather than
 * stacking a second copy, so this is safe to call from `DatabaseSeeder` on
 * every deploy.
 *
 * COMPOSITION
 * -----------
 * The page is nineteen sections deep, in `sort_order`: the hero, the capability
 * grid, the featured-work band (`seedWorkShowcase()`), the portfolio wall
 * (`seedPortfolioGrid()`), the featured-services pitch
 * (`seedServiceFeature()`), the industries band (`seedIndustryServe()`), the
 * solutions grid (`seedSolutionGrid()`), the tech stack (`seedTechStack()`)
 * the reasons band (`seedWhyChoose()`), the process timeline
 * (`seedProcessTimeline()`), the AI capabilities band
 * (`seedAiInnovation()`), the results strip (`seedResultsMetrics()`) and the
 * testimonial wall (`seedTestimonialWall()`), the team grid
 * (`seedTeamGrid()`), the credentials wall (`seedAwardWall()`) and the FAQ
 * (`seedFaqAccordion()`), the about band (`seedAboutStory()`), the newsletter
 * (`seedNewsletterSignup()`) and the closing CTA (`seedCtaFinal()`).
 *
 * That is more than any real homepage should carry — it is a showroom of the
 * registry, not a recommendation. Each seeder owns exactly one section type
 * and force-deletes only its own rows, so removing a band from the page means
 * deleting one call here and nothing else.
 *
 * The hero is `hero.centered` (see `seedHeroCentered()`): a large centered
 * headline, one compound pill button, a reviewer/rating trust row, and a
 * logo strip. It replaced two earlier seeds — `hero.split`, then
 * `hero.flow` — and this method force-deletes all three types before
 * writing, so re-running it also cleans up whichever came before.
 */
class HomePageSeeder extends Seeder
{
    // Only for forgetFamily() below — a seeder writes sections directly
    // rather than through PageSectionService, so it has to do the same
    // invalidation that service does after every save().
    use CacheInvalidation;
    use CarriesSectionUuids;

    public function run(): void
    {
        $siteId = (int) config('cms.site_id');
        $locale = get_system_locale();

        // `uuid` is not fillable anywhere in this schema — `HasUuid` assigns it
        // on `creating`, so passing one here would be silently discarded.
        $page = Page::updateOrCreate(
            [
                'site_id' => $siteId,
                'locale' => $locale,
                'path' => '/',
            ],
            [
                'translation_group_id' => (string) Str::uuid(),
                'slug' => 'home',
                'depth' => 0,
                'title' => 'Home',
                'page_type' => PageType::HOME->value,
                'template' => 'default',
                'is_homepage' => true,
                'is_indexable' => true,
                'status' => Status::ACTIVE->value,
                'publish_status' => ContentStatus::PUBLISHED->value,
                // Must be non-null AND in the past: `Publishable::scopePublished`
                // filters on `published_at <= now()`, so a null here is
                // indistinguishable from an unpublished page.
                'published_at' => now()->subMinute(),
                'expires_at' => null,
                'sort_order' => 0,
            ]
        );

        /*
         * Snapshot every section uuid on this page before the seeders below
         * force-delete and rewrite them. `page_sections.uuid` is the admin's
         * route key, so without this a re-seed silently invalidates any page
         * builder already open on the homepage and its next save 404s.
         */
        $this->carrySectionUuids($page);

        $this->seedHeroCentered($page, $siteId);
        $this->seedServiceGrid($page, $siteId);
        $this->seedWorkShowcase($page, $siteId);
        $this->seedPortfolioGrid($page, $siteId);
        $this->seedServiceFeature($page, $siteId);
        $this->seedIndustryServe($page, $siteId);
        $this->seedSolutionGrid($page, $siteId);
        $this->seedTechStack($page, $siteId);
        $this->seedWhyChoose($page, $siteId);
        $this->seedProcessTimeline($page, $siteId);
        $this->seedAiInnovation($page, $siteId);
        $this->seedResultsMetrics($page, $siteId);
        $this->seedTestimonialWall($page, $siteId);
        $this->seedTeamGrid($page, $siteId);
        $this->seedAwardWall($page, $siteId);
        $this->seedFaqAccordion($page, $siteId);
        $this->seedAboutStory($page, $siteId);
        $this->seedNewsletterSignup($page, $siteId);
        $this->seedCtaFinal($page, $siteId);

        // `PageSectionService::save()` calls this after every write; a seeder
        // that writes `PageSection`/`SectionBlock` rows directly has to do it
        // too, or the cached homepage payload (`PageRenderService`, 12h TTL)
        // keeps serving the pre-seed content until it expires on its own.
        $this->forgetFamily(CacheKey::CMS_PAGE->value);
    }

    /**
     * The homepage hero — a large centered headline, one compound pill
     * button, a reviewer/rating trust row, and a logo strip.
     *
     * Force-deletes every earlier hero type this seeder has ever written
     * (`hero.split`, then `hero.flow`) before creating this one, so
     * re-running it always leaves exactly one hero on the page no matter
     * which version last ran.
     */
    protected function seedHeroCentered(Page $page, int $siteId): void
    {
        PageSection::where('page_id', $page->id)
            ->whereIn('section_type', ['hero.split', 'hero.flow', 'hero.centered'])
            ->forceDelete();

        $cta = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-hero-primary',
            ],
            [
                'label' => 'Schedule a Call',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/contact',
                'variant' => 'default',
                'size' => 'lg',
                'status' => Status::ACTIVE->value,
            ]
        );

        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'hero.centered',
            'name' => 'Homepage Hero',
            'anchor' => null,
            'eyebrow' => null,
            'heading' => 'Shipping Reliable Software With Senior Engineering Teams',
            'subheading' => 'QTEHUB pairs your product team with vetted, senior engineers and a delivery process built for accountability, from kickoff to release.',
            'body' => null,
            'media_id' => null,
            'cta_id' => $cta->id,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                'trust_label' => 'Trusted by 400+ product teams',
                'logos_caption' => 'Our Trusted Companies',
            ],
            'settings' => [
                'rating_value' => 4.8,
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'rise',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 0,
        ]);

        /*
         * Both repeaters below take their images from `DemoMediaSeeder`'s
         * own published set rather than "whatever image is newest in the
         * library". That query is what previously pulled in three 10x10
         * `x.png` placeholders and a `local`-disk JPEG with no public URL,
         * and rendered the strip as four broken-image boxes.
         *
         * Each still degrades on its own: `HeroCentered` falls back to a
         * generic person mark for an avatar with no media, and drops any
         * logo row whose media is missing — so a deploy without the seed
         * assets renders a correct hero rather than a broken one.
         */
        $avatars = DemoMediaSeeder::group('avatars');
        $logos = DemoMediaSeeder::group('logos');

        // Names are the avatars' alt text only — `HeroCentered` never
        // displays them — so these are role labels, not invented customers
        // presented as named, quotable testimonials.
        $reviewerLabels = [
            'Engineering lead at a fintech client',
            'CTO at a logistics client',
            'Head of product at a health client',
            'VP engineering at a retail client',
        ];

        foreach ($reviewerLabels as $position => $label) {
            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'reviewer',
                'label' => $label,
                'value' => null,
                'description' => null,
                'body' => null,
                'icon' => null,
                'media_id' => $avatars->get($position)?->id,
                'cta_id' => null,
                'data' => [],
                'settings' => [],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }

        foreach ($logos as $position => $logo) {
            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'logo',
                'label' => $logo->alt_text ?: $logo->original_name,
                'value' => null,
                'description' => null,
                'body' => null,
                'icon' => null,
                'media_id' => $logo->id,
                'cta_id' => null,
                'data' => [],
                'settings' => [],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /**
     * The capability grid directly beneath the hero — one card per discipline,
     * each with an icon, a title, a description and a handful of tag pills.
     *
     * Replaced wholesale, same reasoning as the hero above: a card list is
     * defined by its rows, and reconciling `section_blocks` by hand on every
     * re-run is how duplicates happen. Cascades clear the cards with it.
     */
    protected function seedServiceGrid(Page $page, int $siteId): void
    {
        PageSection::where('page_id', $page->id)
            ->where('section_type', 'service.grid')
            ->forceDelete();

        $cta = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-services-see-all',
            ],
            [
                'label' => 'Everything We Do',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/services',
                'variant' => 'link',
                'size' => 'default',
                'icon' => 'ArrowRight',
                'icon_position' => IconPosition::RIGHT->value,
                'status' => Status::ACTIVE->value,
            ]
        );

        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'service.grid',
            'name' => 'Homepage Services',
            'anchor' => 'services',
            'eyebrow' => null,
            'heading' => 'Every Discipline, Engineered For Scale',
            'subheading' => 'One vetted bench spanning the full delivery lifecycle, from the first design file to the release that ships.',
            'body' => null,
            'media_id' => null,
            'cta_id' => $cta->id,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
            ],
            'settings' => [
                'columns' => 3,
                'theme' => 'default',
                'spacing' => 'default',
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 1,
        ]);

        $cards = [
            [
                'label' => 'Front-End Engineering',
                'description' => 'Interfaces built for performance, accessibility and scale, with a component system your team can keep extending.',
                'icon' => 'Code2',
                'accent' => 'amber',
                'tags' => 'React, TypeScript, Next.js',
            ],
            [
                'label' => 'Back-End Engineering',
                'description' => 'Secure, well-tested services that hold up under real production load, from the first API to the tenth integration.',
                'icon' => 'Database',
                'accent' => 'ink',
                'tags' => 'Laravel, Node.js, PostgreSQL',
            ],
            [
                'label' => 'AI & Machine Learning',
                'description' => 'Applied AI that earns its place in the product — grounded in your data, measured against real business outcomes.',
                'icon' => 'Sparkles',
                'accent' => 'brand',
                'tags' => 'LLMs, RAG, Python',
            ],
            [
                'label' => 'Mobile Development',
                'description' => 'Native-feeling iOS and Android apps with smooth performance, stable sessions and secure data handling.',
                'icon' => 'Smartphone',
                'accent' => 'teal',
                'tags' => 'Swift, Kotlin, React Native',
            ],
            [
                'label' => 'UX/UI Design',
                'description' => 'Product design with clear user flows, a reusable component library and layouts built accessible from the start.',
                'icon' => 'PenTool',
                'accent' => 'violet',
                'tags' => 'Figma, Design Systems',
            ],
            [
                'label' => 'QA & Testing',
                'description' => 'Release-ready software validated end to end, with manual and automated coverage across every core flow.',
                'icon' => 'ShieldCheck',
                'accent' => 'rose',
                'tags' => 'Automation, Regression, Performance',
            ],
        ];

        foreach ($cards as $position => $card) {
            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'service',
                'label' => $card['label'],
                'value' => null,
                'description' => $card['description'],
                'body' => null,
                'icon' => $card['icon'],
                'media_id' => null,
                'cta_id' => null,
                'data' => [
                    'tags' => $card['tags'],
                    // Cycled rather than repeated: the tile hue is how a
                    // visitor tells one card from another at a glance, so two
                    // adjacent cards never share one.
                    'accent' => $card['accent'],
                ],
                'settings' => [],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /**
     * The portfolio band beneath the services grid — four case studies in the
     * `spotlight` layout, so the first row is promoted to a full-width feature
     * and the other three run as an offset two-up.
     *
     * DEMO CONTENT, NOT CLAIMS
     * ------------------------
     * Every project here is illustrative and must be replaced before the site
     * goes live. Nothing names a real client, and nothing is written as a
     * quotable customer statement — the context lines are sectors ("Fintech ·
     * Platform rebuild"), and the headline numbers are placeholders in the
     * same spirit as the hero's "400+ product teams". A seeder inventing a
     * named client's measured result would be a fabricated reference, which is
     * a different thing entirely from filler copy an editor overwrites.
     *
     * Replaced wholesale on every run, same reasoning as the two sections
     * above: a list is defined by its rows, and reconciling `section_blocks`
     * by hand is how duplicates happen.
     */
    protected function seedWorkShowcase(Page $page, int $siteId): void
    {
        PageSection::where('page_id', $page->id)
            ->where('section_type', 'work.showcase')
            ->forceDelete();

        $cta = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-work-see-all',
            ],
            [
                'label' => 'All Case Studies',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/case-studies',
                'variant' => 'link',
                'size' => 'default',
                'icon' => 'ArrowRight',
                'icon_position' => IconPosition::RIGHT->value,
                'status' => Status::ACTIVE->value,
            ]
        );

        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'work.showcase',
            'name' => 'Homepage Featured Work',
            'anchor' => 'work',
            'eyebrow' => 'Selected Work',
            'heading' => 'Systems We Built, Still Running In Production',
            'subheading' => 'A sample of recent engagements — what the team was asked to solve, and what shipped.',
            'body' => null,
            'media_id' => null,
            'cta_id' => $cta->id,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
            ],
            'settings' => [
                'layout' => 'spotlight',
                'show_index' => true,
                'theme' => 'subtle',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 2,
        ]);

        /*
         * Shots come from `DemoMediaSeeder`'s own `work` group rather than
         * from "whatever is newest in the library" — the same guard the hero
         * uses, and for the same reason. A deploy without the seed assets
         * simply gets projects with no image, which `WorkShowcase` renders as
         * a patterned frame rather than a broken box.
         */
        // Keyed by file name, NOT by position: `group()` orders by path, so
        // indexing it positionally paired each project with whichever shot
        // happened to sort into that slot — and since the tile hue and the
        // artwork's own palette are chosen to agree, a mismatch there is
        // visible as a blue frame around an amber screenshot.
        $shots = DemoMediaSeeder::group('work')->keyBy('file_name');

        $projects = [
            [
                'label' => 'Real-Time Settlement Platform',
                'case_study' => 'settlement-platform-rebuild',
                'shot' => 'settlement-platform.svg',
                'category' => 'Fintech · Platform rebuild',
                'description' => 'A batch settlement engine replaced with an event-driven service that clears continuously, with a full audit trail and reconciliation built in from day one.',
                'value' => '4.2x',
                'metric_label' => 'faster clearing',
                'accent' => 'brand',
                'size' => 'wide',
                'tags' => 'Laravel, PostgreSQL, Kafka, AWS',
            ],
            [
                'label' => 'Logistics Control Tower',
                'case_study' => 'logistics-control-tower',
                'shot' => 'logistics-control-tower.svg',
                'category' => 'Supply chain · Operations',
                'description' => 'One live view across carriers, warehouses and exceptions, replacing a spreadsheet handover between three teams.',
                'value' => '−38%',
                'metric_label' => 'exception handling time',
                'accent' => 'amber',
                'size' => 'standard',
                'tags' => 'React, TypeScript, Node.js',
            ],
            [
                'label' => 'Patient Portal & Scheduling',
                'case_study' => 'patient-portal-accessibility',
                'shot' => 'patient-portal.svg',
                'category' => 'Health · Product design & build',
                'description' => 'Appointments, records and reminders in one accessible interface, designed to WCAG AA and shipped on iOS, Android and web.',
                'value' => 'AA',
                'metric_label' => 'accessibility conformance',
                'accent' => 'teal',
                'size' => 'standard',
                'tags' => 'React Native, Laravel, FHIR',
            ],
            [
                'label' => 'Headless Retail Storefront',
                'case_study' => 'retail-peak-readiness',
                'shot' => 'retail-storefront.svg',
                'category' => 'Commerce · Replatform',
                'description' => 'A storefront rebuilt on a headless stack so merchandising ships without a release, with page weight cut hard on mobile.',
                'value' => '1.1s',
                'metric_label' => 'largest contentful paint',
                'accent' => 'violet',
                'size' => 'wide',
                'tags' => 'Next.js, GraphQL, Edge caching',
            ],
        ];

        foreach ($projects as $position => $project) {
            $projectCta = Cta::updateOrCreate(
                [
                    'site_id' => $siteId,
                    'tracking_id' => 'home-work-'.$position,
                ],
                [
                    'label' => 'Read the case study',
                    'link_type' => CtaLinkType::URL->value,
                    /*
                     * The ACTUAL study, not `/work` — a path that has never
                     * existed, so every one of these four links 404'd.
                     *
                     * This is the join the homepage was missing: the band
                     * showed four projects using the same artwork as the four
                     * case-study pages, with different titles and no link
                     * between them, so the site told the same story twice and
                     * connected it nowhere. `case_study` names the page each
                     * card is a summary OF.
                     */
                    'url' => '/case-studies/'.$project['case_study'],
                    'variant' => 'link',
                    'size' => 'default',
                    'icon' => 'ArrowRight',
                    'icon_position' => IconPosition::RIGHT->value,
                    'status' => Status::ACTIVE->value,
                ]
            );

            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'project',
                'label' => $project['label'],
                'value' => $project['value'],
                'description' => $project['description'],
                'body' => null,
                'icon' => null,
                'media_id' => $shots->get($project['shot'])?->id,
                'cta_id' => $projectCta->id,
                'data' => [
                    'category' => $project['category'],
                    'metric_label' => $project['metric_label'],
                    'tags' => $project['tags'],
                ],
                // Presentation only — hue and mosaic width. Set explicitly so
                // the seeded page is deterministic; left empty in the admin,
                // the renderer cycles both by position instead.
                'settings' => [
                    'accent' => $project['accent'],
                    'size' => $project['size'],
                ],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /**
     * The portfolio wall beneath the case-study band — four project screens in
     * a two-up grid, each revealing its "view project" button on hover.
     *
     * WHY BOTH BANDS
     * --------------
     * `work.showcase` argues one engagement in depth; this browses the shelf.
     * They are seeded together because the pair is the composition the
     * homepage is meant to have — a promoted story, then the wall of screens
     * behind it — and because having both live is the only way an editor can
     * see which of the two a new page actually needs.
     *
     * Sits on the DEFAULT background: the band above it is `subtle`, and two
     * tinted bands in a row erase the boundary between them.
     *
     * DEMO CONTENT
     * ------------
     * The four projects are illustrative, exactly as in `seedWorkShowcase()`.
     * No real client is named, the screens are composed here rather than
     * captured from anyone's site, and every string is placeholder copy an
     * editor overwrites.
     */
    protected function seedPortfolioGrid(Page $page, int $siteId): void
    {
        PageSection::where('page_id', $page->id)
            ->where('section_type', 'portfolio.grid')
            ->forceDelete();

        $primaryCta = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-portfolio-primary',
            ],
            [
                'label' => 'Book a Call',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/contact',
                'variant' => 'default',
                'size' => 'lg',
                'status' => Status::ACTIVE->value,
            ]
        );

        $secondaryCta = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-portfolio-secondary',
            ],
            [
                'label' => 'See How We Work',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/services/custom-software-development#process',
                'variant' => 'outline',
                'size' => 'lg',
                'icon' => 'ArrowRight',
                'icon_position' => IconPosition::RIGHT->value,
                'status' => Status::ACTIVE->value,
            ]
        );

        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'portfolio.grid',
            'name' => 'Homepage Portfolio',
            'anchor' => 'portfolio',
            'eyebrow' => 'Our Portfolio',
            'heading' => 'Recent Builds, Shipped And Live',
            'subheading' => 'Product sites, platforms and apps designed and engineered end to end. Every screen below is work the team shipped, not a concept.',
            'body' => null,
            'media_id' => null,
            'cta_id' => $primaryCta->id,
            'secondary_cta_id' => $secondaryCta->id,
            'data' => [
                'version' => 1,
            ],
            'settings' => [
                'columns' => 2,
                'align' => 'center',
                'chrome' => true,
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 3,
        ]);

        // Keyed by file name for the same reason `seedWorkShowcase()` is: the
        // tile hue and the screen's own palette are chosen to agree, and
        // positional indexing pairs them at random.
        $screens = DemoMediaSeeder::group('portfolio')->keyBy('file_name');

        $projects = [
            [
                'label' => 'Craft — Portfolio Landing Page',
                'description' => 'A studio portfolio built for clarity: one scroll, a clear offer, and case work that loads instantly on a phone.',
                'shot' => 'craft-portfolio.svg',
                'accent' => 'violet',
                'tags' => 'Web design, Landing page',
            ],
            [
                'label' => 'Neural — AI Product Site',
                'description' => 'A launch site for an AI workflow tool, with a live product panel and a signup flow measured from the first click.',
                'shot' => 'neural-ai-landing.svg',
                'accent' => 'teal',
                'tags' => 'Product marketing, Motion',
            ],
            [
                'label' => 'Orbit — SaaS Marketing Site',
                'description' => 'Pricing, docs and marketing on one CMS, so the team ships copy and plan changes without a release.',
                'shot' => 'orbit-saas-landing.svg',
                'accent' => 'amber',
                'tags' => 'CMS, SaaS',
            ],
            [
                'label' => 'Pulse — App Launch Site',
                'description' => 'A launch page for a mobile product, with store links, screens and an onboarding walkthrough built to convert.',
                'shot' => 'pulse-app-landing.svg',
                'accent' => 'rose',
                'tags' => 'Mobile, Launch',
            ],
        ];

        foreach ($projects as $position => $project) {
            $projectCta = Cta::updateOrCreate(
                [
                    'site_id' => $siteId,
                    'tracking_id' => 'home-portfolio-'.$position,
                ],
                [
                    'label' => 'View Project',
                    'link_type' => CtaLinkType::URL->value,
                    'url' => '/case-studies',
                    'variant' => 'default',
                    'size' => 'default',
                    'icon' => 'ArrowUpRight',
                    'icon_position' => IconPosition::RIGHT->value,
                    'status' => Status::ACTIVE->value,
                ]
            );

            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'project',
                'label' => $project['label'],
                'value' => null,
                'description' => $project['description'],
                'body' => null,
                'icon' => null,
                'media_id' => $screens->get($project['shot'])?->id,
                'cta_id' => $projectCta->id,
                'data' => [
                    'tags' => $project['tags'],
                ],
                'settings' => [
                    'accent' => $project['accent'],
                ],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /**
     * The featured-services band that closes the page — four cards with
     * floating icon marks and one button.
     *
     * NOTE ON OVERLAP
     * ---------------
     * This page now carries BOTH service sections: `service.grid` near the top
     * (the catalogue) and this one at the foot (the pitch). That is one more
     * than a real homepage wants, and it is deliberate for now — an editor can
     * see both compositions side by side and delete whichever the page does
     * not need. Whichever goes, the other is untouched: they are separate
     * types with separate rows.
     *
     * Sits on the `subtle` band because the portfolio wall above it is on the
     * default canvas, so the two do not merge into one long surface.
     */
    protected function seedServiceFeature(Page $page, int $siteId): void
    {
        PageSection::where('page_id', $page->id)
            ->where('section_type', 'service.featured')
            ->forceDelete();

        $cta = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-services-featured-cta',
            ],
            [
                'label' => 'Hire Us Today',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/contact',
                'variant' => 'default',
                'size' => 'lg',
                'icon' => 'ArrowRight',
                'icon_position' => IconPosition::RIGHT->value,
                'status' => Status::ACTIVE->value,
            ]
        );

        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'service.featured',
            'name' => 'Homepage Featured Services',
            'anchor' => 'services-featured',
            'eyebrow' => null,
            'heading' => 'Our Services',
            'subheading' => 'Senior teams across strategy, engineering and support — engaged the way your project actually needs, from a single specialist to a full delivery squad.',
            'body' => null,
            'media_id' => null,
            'cta_id' => $cta->id,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                // Matched against the headline at render time, plain text only.
                'heading_highlight' => 'Services',
            ],
            'settings' => [
                'columns' => 4,
                'align' => 'center',
                'theme' => 'subtle',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 4,
        ]);

        $cards = [
            [
                'label' => 'Product Strategy',
                'description' => 'Discovery, scope and a delivery plan you can hold us to before a line of code is written.',
                'icon' => 'Brain',
                'accent' => 'rose',
            ],
            [
                'label' => 'Cloud & DevOps',
                'description' => 'Pipelines, infrastructure and monitoring so releases are routine rather than an event.',
                'icon' => 'Cloud',
                'accent' => 'teal',
            ],
            [
                'label' => 'Team Augmentation',
                'description' => 'Vetted senior engineers embedded in your team, working your process from week one.',
                'icon' => 'Users',
                'accent' => 'brand',
            ],
            [
                'label' => 'Support & SLAs',
                'description' => 'Monitored uptime, agreed response times and a named team that already knows the codebase.',
                'icon' => 'LifeBuoy',
                'accent' => 'amber',
            ],
        ];

        foreach ($cards as $position => $card) {
            $cardCta = Cta::updateOrCreate(
                [
                    'site_id' => $siteId,
                    'tracking_id' => 'home-services-featured-'.$position,
                ],
                [
                    'label' => 'Read more',
                    'link_type' => CtaLinkType::URL->value,
                    'url' => '/services',
                    'variant' => 'link',
                    'size' => 'default',
                    'icon' => 'ArrowRight',
                    'icon_position' => IconPosition::RIGHT->value,
                    'status' => Status::ACTIVE->value,
                ]
            );

            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'service',
                'label' => $card['label'],
                'value' => null,
                'description' => $card['description'],
                'body' => null,
                'icon' => $card['icon'],
                'media_id' => null,
                'cta_id' => $cardCta->id,
                'data' => [],
                // Presentation only. Set explicitly so the seeded row is
                // deterministic; left empty in the admin the renderer cycles
                // the palette by position instead.
                'settings' => [
                    'accent' => $card['accent'],
                ],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /**
     * The industries band — a staggered stack of six sector cards beside a
     * statement, with "Industries" set vertically between them.
     *
     * Sits on the DEFAULT background: the featured-services band above it is
     * `subtle`, and two tinted bands in a row erase the boundary between them.
     *
     * DEMO CONTENT
     * ------------
     * Sectors the team could plausibly work in, written as capability claims
     * rather than as client references — nothing here names a customer or
     * implies a delivered project, so there is no fabricated reference to
     * unpick when an editor replaces the copy.
     */
    protected function seedIndustryServe(Page $page, int $siteId): void
    {
        PageSection::where('page_id', $page->id)
            ->where('section_type', 'industry.serve')
            ->forceDelete();

        $cta = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-industries-primary',
            ],
            [
                'label' => "Let's Talk",
                'link_type' => CtaLinkType::URL->value,
                'url' => '/contact',
                'variant' => 'default',
                'size' => 'lg',
                'icon' => 'ArrowRight',
                'icon_position' => IconPosition::RIGHT->value,
                'status' => Status::ACTIVE->value,
            ]
        );

        $textLink = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-industries-link',
            ],
            [
                'label' => 'Not listed? Tell us about your project.',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/contact',
                'variant' => 'link',
                'size' => 'default',
                'status' => Status::ACTIVE->value,
            ]
        );

        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'industry.serve',
            'name' => 'Homepage Industries',
            'anchor' => 'industries',
            'eyebrow' => 'Sector Experience',
            'heading' => 'Industries We Serve',
            'subheading' => 'We have delivered software across regulated and high-volume sectors, so the constraints that decide an architecture — compliance, uptime, peak load, audit — are ones the team has designed for before.',
            'body' => null,
            'media_id' => null,
            'cta_id' => $cta->id,
            'secondary_cta_id' => $textLink->id,
            'data' => [
                'version' => 1,
                'heading_highlight' => 'We Serve',
                'watermark' => 'Industries',
            ],
            'settings' => [
                'content_side' => 'right',
                'columns' => 2,
                'offset' => true,
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 5,
        ]);

        $industries = [
            [
                'label' => 'Fintech & Payments',
                'sector' => 'financial-services',
                'description' => 'Ledgers, settlement and compliance-grade audit trails.',
                'icon' => 'Briefcase',
                'accent' => 'teal',
            ],
            [
                'label' => 'Healthcare',
                'sector' => 'healthcare',
                'description' => 'Patient data handled to policy, accessible by design.',
                'icon' => 'HeartPulse',
                'accent' => 'rose',
            ],
            [
                'label' => 'Logistics',
                'sector' => 'logistics',
                'description' => 'Live tracking and exception handling at fleet scale.',
                'icon' => 'Truck',
                'accent' => 'brand',
            ],
            [
                'label' => 'Retail & eCommerce',
                'sector' => 'retail-ecommerce',
                'description' => 'Storefronts that hold up through a peak trading day.',
                'icon' => 'ShoppingCart',
                'accent' => 'amber',
            ],
            [
                /*
                 * Manufacturing and Public Sector replace Real Estate and
                 * Education here.
                 *
                 * The homepage band is a SUMMARY of `/industries`, so listing
                 * two sectors with no page behind them while omitting two that
                 * have one made the summary disagree with the thing it
                 * summarises — and left two cards that could never be linked.
                 */
                'label' => 'Manufacturing',
                'sector' => 'manufacturing',
                'description' => 'Shop-floor systems built for gloves, noise and an unreliable network.',
                'icon' => 'Factory',
                'accent' => 'violet',
            ],
            [
                'label' => 'Public Sector',
                'sector' => 'public-sector',
                'description' => 'Accessible, accountable services audited against WCAG AA.',
                'icon' => 'Landmark',
                'accent' => 'ink',
            ],
        ];

        foreach ($industries as $position => $industry) {
            /*
             * Each card links to its sector page, which makes the whole card
             * clickable — `IndustryServe` stretches this link across the tile
             * with a pseudo-element, so the accessible name stays the link's
             * own text rather than swallowing the card's description.
             *
             * The CTA is only created when the page exists. A card that looks
             * clickable and goes nowhere is worse than one that does not, and
             * the component already renders correctly with no CTA — which is
             * why this band shipped without them while `/industries` was
             * unbuilt.
             */
            $sectorPage = Page::where('site_id', $siteId)
                ->where('path', '/industries/'.$industry['sector'])
                ->first();

            $sectorCta = $sectorPage
                ? Cta::updateOrCreate(
                    [
                        'site_id' => $siteId,
                        'tracking_id' => 'home-industry-'.$industry['sector'],
                    ],
                    [
                        'label' => 'Explore '.$industry['label'],
                        'link_type' => CtaLinkType::PAGE->value,
                        'page_id' => $sectorPage->id,
                        'url' => null,
                        'variant' => 'link',
                        'size' => 'default',
                        'icon' => 'ArrowRight',
                        'icon_position' => IconPosition::RIGHT->value,
                        'status' => Status::ACTIVE->value,
                    ]
                )
                : null;

            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'industry',
                'label' => $industry['label'],
                'value' => null,
                'description' => $industry['description'],
                'body' => null,
                'icon' => $industry['icon'],
                'media_id' => null,
                'cta_id' => $sectorCta?->id,
                'data' => [],
                'settings' => [
                    'accent' => $industry['accent'],
                ],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /**
     * The solutions band — three packaged offers, each with a tick list of
     * what is included.
     *
     * DEMO CONTENT: the offers are illustrative and the timescales in them are
     * placeholders. Nothing here is priced, and nothing claims a delivered
     * project, so an editor rewriting the copy leaves no dangling promise.
     */
    protected function seedSolutionGrid(Page $page, int $siteId): void
    {
        PageSection::where('page_id', $page->id)
            ->where('section_type', 'solution.grid')
            ->forceDelete();

        $cta = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-solutions-cta',
            ],
            [
                'label' => 'Discuss Your Project',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/contact',
                'variant' => 'default',
                'size' => 'lg',
                'icon' => 'ArrowRight',
                'icon_position' => IconPosition::RIGHT->value,
                'status' => Status::ACTIVE->value,
            ]
        );

        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'solution.grid',
            'name' => 'Homepage Solutions',
            'anchor' => 'solutions',
            'eyebrow' => 'How We Engage',
            'heading' => 'Solutions Built Around Your Stage',
            'subheading' => 'Three ways to work with us, depending on whether you are proving an idea, scaling a product, or keeping one running.',
            'body' => null,
            'media_id' => null,
            'cta_id' => $cta->id,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                'heading_highlight' => 'Your Stage',
            ],
            'settings' => [
                'columns' => 3,
                'align' => 'center',
                'theme' => 'subtle',
                'spacing' => 'default',
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 6,
        ]);

        $solutions = [
            [
                'label' => 'MVP Launch',
                'description' => 'Get a first version in front of real users without building everything twice.',
                'points' => 'Discovery and scope, Design system, Working build in weeks, Analytics from day one',
                'icon' => 'Rocket',
                'accent' => 'brand',
            ],
            [
                'label' => 'Scale & Modernise',
                'description' => 'Take a product that works and make it hold up under growth, load and a bigger team.',
                'points' => 'Architecture review, Performance work, Test coverage, Release automation',
                'icon' => 'Zap',
                'accent' => 'violet',
            ],
            [
                'label' => 'Run & Support',
                'description' => 'Keep a live product healthy with a team that already knows the codebase.',
                'points' => 'Monitoring and alerting, Agreed response times, Security patching, Roadmap upkeep',
                'icon' => 'ShieldCheck',
                'accent' => 'amber',
            ],
        ];

        foreach ($solutions as $position => $solution) {
            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'solution',
                'label' => $solution['label'],
                'value' => null,
                'description' => $solution['description'],
                'body' => null,
                'icon' => $solution['icon'],
                'media_id' => null,
                // No per-card link yet: there are no solution pages to point
                // at, and a card that looks clickable and goes nowhere is
                // worse than one that does not.
                'cta_id' => null,
                'data' => [
                    'points' => $solution['points'],
                ],
                'settings' => [
                    'accent' => $solution['accent'],
                ],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /**
     * The tech-stack band — four layers, each with the tools used there.
     *
     * The lists are the repo's own stack plus the obvious neighbours, so the
     * seeded page says something true rather than listing every framework in
     * existence. Editors extend a layer by typing into one field.
     */
    protected function seedTechStack(Page $page, int $siteId): void
    {
        PageSection::where('page_id', $page->id)
            ->where('section_type', 'tech.stack')
            ->forceDelete();

        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'tech.stack',
            'name' => 'Homepage Tech Stack',
            'anchor' => 'stack',
            'eyebrow' => 'Tech Stack',
            'heading' => 'Tools We Trust In Production',
            'subheading' => 'Chosen for maintainability and hiring pool, not novelty — every layer here is one the team supports in live systems today.',
            'body' => null,
            'media_id' => null,
            'cta_id' => null,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                'heading_highlight' => 'In Production',
            ],
            'settings' => [
                'columns' => 2,
                'align' => 'center',
                'theme' => 'default',
                'spacing' => 'default',
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 7,
        ]);

        $layers = [
            [
                'label' => 'Front-End',
                'description' => 'Interfaces and design systems',
                'items' => 'React, TypeScript, Inertia, Tailwind, Vite, Next.js',
                'icon' => 'Code2',
                'accent' => 'violet',
            ],
            [
                'label' => 'Back-End',
                'description' => 'APIs, services and data',
                'items' => 'Laravel, PHP, Node.js, PostgreSQL, MySQL, Redis',
                'icon' => 'Database',
                'accent' => 'brand',
            ],
            [
                'label' => 'Mobile',
                'description' => 'iOS and Android',
                'items' => 'React Native, Swift, Kotlin, Expo',
                'icon' => 'Smartphone',
                'accent' => 'teal',
            ],
            [
                'label' => 'Cloud & Delivery',
                'description' => 'Where it runs and how it ships',
                'items' => 'AWS, Docker, GitHub Actions, Terraform, Horizon',
                'icon' => 'Cloud',
                'accent' => 'amber',
            ],
        ];

        foreach ($layers as $position => $layer) {
            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'layer',
                'label' => $layer['label'],
                'value' => null,
                'description' => $layer['description'],
                'body' => null,
                'icon' => $layer['icon'],
                'media_id' => null,
                'cta_id' => null,
                'data' => [
                    'items' => $layer['items'],
                ],
                'settings' => [
                    'accent' => $layer['accent'],
                ],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /**
     * The reasons band — four tilted cards under one question.
     *
     * DEMO CONTENT: the reasons are written as commitments the team can keep
     * ("senior engineers", "you own the code") rather than as measured claims,
     * so nothing here needs a statistic behind it before the page goes live.
     */
    protected function seedWhyChoose(Page $page, int $siteId): void
    {
        PageSection::where('page_id', $page->id)
            ->where('section_type', 'why.choose')
            ->forceDelete();

        $cta = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-why-choose-cta',
            ],
            [
                'label' => 'Start a Conversation',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/contact',
                'variant' => 'default',
                'size' => 'lg',
                'icon' => 'ArrowRight',
                'icon_position' => IconPosition::RIGHT->value,
                'status' => Status::ACTIVE->value,
            ]
        );

        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'why.choose',
            'name' => 'Homepage Why Choose Us',
            'anchor' => 'why-us',
            'eyebrow' => null,
            'heading' => 'Why Choose QTEHUB?',
            'subheading' => "Here's what teams tell us made the difference when they picked us.",
            'body' => null,
            'media_id' => null,
            'cta_id' => $cta->id,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                'heading_highlight' => 'Choose',
            ],
            'settings' => [
                'tilt' => true,
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 8,
        ]);

        $reasons = [
            [
                'label' => 'Senior By Default',
                'description' => 'The people who scope your project are the people who build it. No handover to a junior bench after the pitch.',
                'icon' => 'Users',
                'accent' => 'amber',
            ],
            [
                'label' => 'You Own Everything',
                'description' => 'Code, infrastructure and accounts are yours from day one, documented well enough for another team to pick up.',
                'icon' => 'Lock',
                'accent' => 'violet',
            ],
            [
                'label' => 'Visible Progress',
                'description' => 'Working software every two weeks, in an environment you can open yourself — not a status report.',
                'icon' => 'Rocket',
                'accent' => 'rose',
            ],
            [
                'label' => 'Built To Hand Over',
                'description' => 'Tests, CI and a design system, so the thing we build stays cheap to change long after we step back.',
                'icon' => 'ShieldCheck',
                'accent' => 'brand',
            ],
            [
                'label' => 'One Bill, No Surprises',
                'description' => 'Fixed rates agreed up front, and a scope change is a conversation before it is an invoice.',
                'icon' => 'Handshake',
                'accent' => 'teal',
            ],
            [
                'label' => 'Ready In Days',
                'description' => 'Vetted people already on the bench, so a signed statement of work turns into a running team the same week.',
                'icon' => 'Zap',
                'accent' => 'ink',
            ],
        ];

        foreach ($reasons as $position => $reason) {
            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'reason',
                'label' => $reason['label'],
                'value' => null,
                'description' => $reason['description'],
                'body' => null,
                'icon' => $reason['icon'],
                'media_id' => null,
                'cta_id' => null,
                'data' => [],
                'settings' => [
                    'accent' => $reason['accent'],
                ],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /**
     * The process band — four steps on a dashed timeline, beside a statement
     * and a still of the team at work.
     *
     * Runs on the SUBTLE band rather than the inverted one. The reference
     * this follows is a dark design, but the site's theme is light and a
     * single near-black band dropped into a light page reads as a different
     * website rather than as emphasis. `subtle` gives the separation from the
     * reasons band above it without the costume change — and an editor who
     * does want the dark treatment has `inverted` one select away.
     */
    protected function seedProcessTimeline(Page $page, int $siteId): void
    {
        PageSection::where('page_id', $page->id)
            ->where('section_type', 'process.timeline')
            ->forceDelete();

        $cta = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-process-cta',
            ],
            [
                'label' => 'Get Started',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/contact',
                'variant' => 'default',
                'size' => 'lg',
                'icon' => 'ArrowRight',
                'icon_position' => IconPosition::RIGHT->value,
                'status' => Status::ACTIVE->value,
            ]
        );

        $still = DemoMediaSeeder::group('process')->keyBy('file_name');

        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'process.timeline',
            'name' => 'Homepage Process',
            'anchor' => 'process',
            'eyebrow' => 'How It Works',
            'heading' => 'Our Simple Process',
            'subheading' => 'Four steps from first call to a running product, with something you can open and use at the end of every one of them.',
            'body' => null,
            'media_id' => $still->get('working-session.svg')?->id,
            'cta_id' => $cta->id,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                'heading_highlight' => 'Simple',
                'step_label' => 'Step',
            ],
            'settings' => [
                'media_side' => 'left',
                'theme' => 'subtle',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 9,
        ]);

        $steps = [
            [
                'label' => 'Discovery & Scope',
                'description' => 'A working session on the problem, the constraints and the deadline, ending in a scope and an estimate you can hold us to.',
                'icon' => 'Brain',
                'accent' => 'brand',
            ],
            [
                'label' => 'Design & Architecture',
                'description' => 'Flows, screens and the technical shape of the thing — agreed before anyone writes the code that has to live with it.',
                'icon' => 'PenTool',
                'accent' => 'teal',
            ],
            [
                'label' => 'Build & Review',
                'description' => 'Two-week cycles, each ending in software you can open yourself, in an environment that mirrors production.',
                'icon' => 'Code2',
                'accent' => 'violet',
            ],
            [
                'label' => 'Launch & Support',
                'description' => 'Release, monitoring and a named team that stays reachable — with the handover written as we go, not after.',
                'icon' => 'Rocket',
                'accent' => 'amber',
            ],
        ];

        foreach ($steps as $position => $step) {
            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'step',
                'label' => $step['label'],
                'value' => null,
                'description' => $step['description'],
                'body' => null,
                'icon' => $step['icon'],
                'media_id' => null,
                'cta_id' => null,
                // The step NUMBER is never stored — it is the row's position,
                // so reordering in the admin renumbers the timeline.
                'data' => [],
                'settings' => [
                    'accent' => $step['accent'],
                ],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /**
     * The AI & Innovation band — five capability cards under one headline.
     *
     * DEMO CONTENT: each card names a capability, an outcome and the tools
     * behind it. The outcome lines are written as ranges the team can defend
     * ("cuts first-response time") rather than as audited figures — anything
     * with a hard number behind it belongs in the results band below, where it
     * is counted and can carry a footnote.
     *
     * The first card is the bento's wide one, so `capabilities[0]` is the
     * broadest claim on purpose: reordering in the admin promotes whichever
     * row lands first, which is exactly the control an editor expects.
     */
    protected function seedAiInnovation(Page $page, int $siteId): void
    {
        PageSection::where('page_id', $page->id)
            ->where('section_type', 'ai.innovation')
            ->forceDelete();

        $cta = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-ai-innovation-cta',
            ],
            [
                'label' => 'Talk To Our AI Team',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/contact',
                'variant' => 'default',
                'size' => 'lg',
                'icon' => 'ArrowRight',
                'icon_position' => IconPosition::RIGHT->value,
                'status' => Status::ACTIVE->value,
            ]
        );

        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'ai.innovation',
            'name' => 'Homepage AI & Innovation',
            'anchor' => 'ai',
            'eyebrow' => 'AI & Innovation',
            'heading' => 'AI That Ships, Not AI That Demos',
            'subheading' => 'Agents, automation and retrieval built on your own data — scoped to a measurable outcome, shipped into production, and owned by you.',
            'body' => null,
            'media_id' => null,
            'cta_id' => $cta->id,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                'heading_highlight' => 'AI That Ships',
                'footnote' => 'Your data stays in your infrastructure. Model choice is a deployment decision, never a lock-in.',
            ],
            'settings' => [
                'layout' => 'bento',
                'columns' => 3,
                'align' => 'center',
                'theme' => 'subtle',
                'spacing' => 'lg',
                'glow' => true,
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 10,
        ]);

        $capabilities = [
            [
                'label' => 'AI Agents',
                'value' => 'Autonomous, with a human in the loop',
                'description' => 'Goal-driven agents that call your real systems — ticketing, billing, CRM — with every step logged, every tool call permissioned, and an approval gate wherever the blast radius justifies one.',
                'items' => 'Tool Calling, Orchestration, Guardrails, Evals, Audit Trails',
                'icon' => 'Bot',
                'accent' => 'violet',
            ],
            [
                'label' => 'AI Automation',
                'value' => 'Hours back, every week',
                'description' => 'The repetitive middle of a workflow — triage, routing, extraction, summarising — handed to a model and wired into the tools your team already uses.',
                'items' => 'Workflow Design, Queues, Webhooks, Human Review',
                'icon' => 'Workflow',
                'accent' => 'teal',
            ],
            [
                'label' => 'RAG & Knowledge Search',
                'value' => 'Answers with citations',
                'description' => 'Retrieval over your documents, tickets and code, with source links on every answer so a reader can check the claim instead of trusting it.',
                'items' => 'Vector Search, Chunking, Re-ranking, Citations',
                'icon' => 'Search',
                'accent' => 'brand',
            ],
            [
                'label' => 'AI Chatbots',
                'value' => 'Cuts first-response time',
                'description' => 'Support and sales assistants that know your product, hand over to a person cleanly, and never invent a policy that does not exist.',
                'items' => 'Multi-Channel, Handover, Analytics, Tone Control',
                'icon' => 'MessageCircle',
                'accent' => 'rose',
            ],
            [
                'label' => 'AI-Powered SaaS',
                'value' => 'From prototype to paying users',
                'description' => 'Whole products with AI at the centre — metering, rate limits, cost controls and multi-tenancy designed in from the first sprint rather than bolted on after launch.',
                'items' => 'Multi-Tenancy, Usage Metering, Cost Controls, Billing',
                'icon' => 'Boxes',
                'accent' => 'amber',
            ],
        ];

        foreach ($capabilities as $position => $capability) {
            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'capability',
                'label' => $capability['label'],
                'value' => $capability['value'],
                'description' => $capability['description'],
                'body' => null,
                'icon' => $capability['icon'],
                'media_id' => null,
                'cta_id' => null,
                'data' => [
                    'items' => $capability['items'],
                ],
                'settings' => [
                    'accent' => $capability['accent'],
                ],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /**
     * The results band — five counted numbers on an inverted strip.
     *
     * Every value is split from its affixes (`5` + `M+`, `99.9` + `%`) because
     * that is the only shape `StatValue` can animate: a single "5M+" string
     * has no numeric target and renders static. See `ResultsMetricsType`.
     *
     * DEMO CONTENT: the figures are placeholders and the footnote says as much
     * in production terms — replace them before launch rather than shipping a
     * number nobody can source.
     */
    protected function seedResultsMetrics(Page $page, int $siteId): void
    {
        PageSection::where('page_id', $page->id)
            ->where('section_type', 'results.metrics')
            ->forceDelete();

        $cta = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-results-metrics-cta',
            ],
            [
                'label' => 'See Our Case Studies',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/case-studies',
                'variant' => 'outline',
                'size' => 'lg',
                'icon' => 'ArrowRight',
                'icon_position' => IconPosition::RIGHT->value,
                'status' => Status::ACTIVE->value,
            ]
        );

        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'results.metrics',
            'name' => 'Homepage Results & Metrics',
            'anchor' => 'results',
            'eyebrow' => 'Results',
            'heading' => 'Numbers That Held Up In Production',
            'subheading' => 'Delivery is measured the same way our clients measure it — what shipped, who it reached, and whether it stayed up.',
            'body' => null,
            'media_id' => null,
            'cta_id' => $cta->id,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                'heading_highlight' => 'Held Up',
                'footnote' => 'Figures cover all client engagements to date and are reviewed each quarter.',
            ],
            'settings' => [
                'columns' => 5,
                'align' => 'center',
                'theme' => 'inverted',
                'spacing' => 'default',
                'animate' => true,
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 11,
        ]);

        $metrics = [
            [
                'value' => '50',
                'suffix' => '+',
                'label' => 'Projects Delivered',
                'description' => 'Shipped to production and handed over.',
                'icon' => 'Rocket',
                'accent' => 'brand',
            ],
            [
                'value' => '30',
                'suffix' => '+',
                'label' => 'Happy Clients',
                'description' => 'Most of them came back for a second build.',
                'icon' => 'Handshake',
                'accent' => 'violet',
            ],
            [
                'value' => '10',
                'suffix' => '+',
                'label' => 'Countries',
                'description' => 'Teams supported across time zones.',
                'icon' => 'Globe',
                'accent' => 'teal',
            ],
            [
                'value' => '5',
                'suffix' => 'M+',
                'label' => 'Users Served',
                'description' => 'People using something we built.',
                'icon' => 'Users',
                'accent' => 'amber',
            ],
            [
                'value' => '99.9',
                'suffix' => '%',
                'label' => 'System Availability',
                'description' => 'Measured on the systems we operate.',
                'icon' => 'Activity',
                'accent' => 'rose',
            ],
        ];

        foreach ($metrics as $position => $metric) {
            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'metric',
                'label' => $metric['label'],
                'value' => $metric['value'],
                'description' => $metric['description'],
                'body' => null,
                'icon' => $metric['icon'],
                'media_id' => null,
                'cta_id' => null,
                // The affixes never animate, which is the whole reason they
                // are not part of `value`.
                'data' => [
                    'prefix' => null,
                    'suffix' => $metric['suffix'],
                ],
                'settings' => [
                    'accent' => $metric['accent'],
                ],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /**
     * The testimonial wall — six review cards, the first one lifted.
     *
     * The company marks come from `DemoMediaSeeder`'s `logos` group: five
     * FICTIONAL brands original to this repo. Seeding a real third-party logo
     * beside a made-up quote would be a trademark problem and a fabricated
     * endorsement at the same time, so the placeholders stay placeholders and
     * an editor swaps in a real client's mark once there is a real client
     * quote to go with it.
     *
     * The sixth card deliberately has NO logo. That is not an oversight: the
     * card has to survive a missing mark — most reviews arrive without one —
     * and seeding one that proves it is cheaper than a test that asserts it.
     *
     * DEMO CONTENT: the quotes are written as things a client could plausibly
     * say about delivery, and every reviewer is fictional. Replace the whole
     * repeater before launch — an invented testimonial attributed to a named
     * person is not filler, it is a false claim.
     */
    protected function seedTestimonialWall(Page $page, int $siteId): void
    {
        PageSection::where('page_id', $page->id)
            ->where('section_type', 'testimonial.wall')
            ->forceDelete();

        $logos = DemoMediaSeeder::group('logos')->keyBy('file_name');

        $cta = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-testimonials-cta',
            ],
            [
                'label' => 'Read All Reviews',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/case-studies',
                'variant' => 'outline',
                'size' => 'lg',
                'icon' => 'ArrowRight',
                'icon_position' => IconPosition::RIGHT->value,
                'status' => Status::ACTIVE->value,
            ]
        );

        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'testimonial.wall',
            'name' => 'Homepage Testimonials',
            'anchor' => 'testimonials',
            'eyebrow' => 'Testimonials',
            'heading' => 'What Teams Say After The Handover',
            'subheading' => 'The part of the engagement that matters most is the month after launch. These are the teams who lived through it.',
            'body' => null,
            'media_id' => null,
            'cta_id' => $cta->id,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                'heading_highlight' => 'After The Handover',
                'footnote' => 'Placeholder reviews from fictional companies. Replace them with real, attributable quotes before launch.',
            ],
            'settings' => [
                'columns' => 3,
                'align' => 'center',
                'theme' => 'subtle',
                'spacing' => 'lg',
                'tilt' => true,
                'show_rating' => true,
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 12,
        ]);

        $testimonials = [
            [
                'body' => 'They scoped the work honestly, including the parts they told us not to build. Six months on we are still shipping on the foundation they left us.',
                'label' => 'Kate Davis',
                'description' => 'VP Product, Northwind',
                'value' => '4.9',
                'logo' => 'northwind.svg',
                'accent' => 'teal',
                'link' => 'Read the case study',
            ],
            [
                'body' => 'The handover was the calmest part of the project. Documentation, runbooks, and two weeks of pairing before our team took the wheel.',
                'label' => 'Martin Kazlauskas',
                'description' => 'CTO, Cobalt',
                'value' => '5.0',
                'logo' => 'cobalt.svg',
                'accent' => 'violet',
                'link' => 'Read the case study',
            ],
            [
                'body' => 'We came in with a deadline nobody wanted to defend. They cut the scope with us instead of quietly missing it, and we launched on the date.',
                'label' => 'Sanjay Sharma',
                'description' => 'Head of Engineering, Vertex',
                'value' => '4.8',
                'logo' => 'vertex.svg',
                'accent' => 'brand',
                'link' => 'Read the case study',
            ],
            [
                'body' => 'Our reporting used to take four minutes to load. They found the query, fixed the data model behind it, and it has not moved above a second since.',
                'label' => 'Tawanna Afumba',
                'description' => 'Director of Data, Lumen',
                'value' => '4.9',
                'logo' => 'lumen.svg',
                'accent' => 'amber',
                'link' => 'Read the case study',
            ],
            [
                'body' => 'The same engineers who pitched the project are the ones who built it. That sounds small until you have been through the alternative.',
                'label' => 'Larry King',
                'description' => 'Founder, Ardent',
                'value' => '5.0',
                'logo' => 'ardent.svg',
                'accent' => 'rose',
                'link' => null,
            ],
            [
                'body' => 'Weekly demos, no status theatre. We always knew what was done, what was next, and what was at risk.',
                'label' => 'Fatima Mohamed',
                'description' => 'Programme Manager',
                'value' => '4.7',
                'logo' => null,
                'accent' => 'ink',
                'link' => null,
            ],
        ];

        foreach ($testimonials as $position => $testimonial) {
            /*
             * The card link. Only the four reviews with a case study behind
             * them get one — the last two are deliberately link-less, so the
             * seeded wall shows both states and proves a card with no
             * destination is simply not clickable rather than a dead hit area.
             */
            $cardCta = $testimonial['link'] === null ? null : Cta::updateOrCreate(
                [
                    'site_id' => $siteId,
                    'tracking_id' => 'home-testimonial-'.($position + 1),
                ],
                [
                    'label' => $testimonial['link'],
                    // Named per card so analytics can tell which review sends
                    // people to the work, which is the only reason to make a
                    // testimonial clickable in the first place.
                    'aria_label' => $testimonial['link'].' — '.$testimonial['label'],
                    'link_type' => CtaLinkType::URL->value,
                    'url' => '/case-studies',
                    'variant' => 'link',
                    'size' => 'sm',
                    'icon' => 'ArrowUpRight',
                    'icon_position' => IconPosition::RIGHT->value,
                    'status' => Status::ACTIVE->value,
                ]
            );

            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'testimonial',
                'label' => $testimonial['label'],
                // Displayed beside a star and never counted — see
                // `TestimonialWallType`.
                'value' => $testimonial['value'],
                'description' => $testimonial['description'],
                // The quote lives in `body` so `description` keeps the same
                // "supporting line" meaning it has on every other block type.
                'body' => $testimonial['body'],
                'icon' => null,
                'media_id' => $testimonial['logo'] === null
                    ? null
                    : $logos->get($testimonial['logo'])?->id,
                'cta_id' => $cardCta?->id,
                'data' => [],
                'settings' => [
                    'accent' => $testimonial['accent'],
                ],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /**
     * The team grid — nine people across four departments.
     *
     * PHOTOS: none, deliberately. A seeder must not invent the face of an
     * employee who does not exist, and the one faces-shaped group in the seed
     * set (`avatars/*`) is four 96x96 monogram marks built for the reviewer
     * cluster — cover-cropped into a 4:5 portrait frame they upscale fourfold
     * and lose their top and bottom edges. Every member therefore renders
     * `TeamGrid`'s own monogram in their accent hue: sharp at any size,
     * identical across the row, and exactly the state a real team page is in
     * until the shoot happens.
     *
     * DEMO CONTENT: every person here is fictional. Replace the repeater
     * before launch — a named employee who does not work here is not filler.
     */
    protected function seedTeamGrid(Page $page, int $siteId): void
    {
        PageSection::where('page_id', $page->id)
            ->where('section_type', 'team.grid')
            ->forceDelete();

        $cta = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-team-cta',
            ],
            [
                'label' => 'See Open Roles',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/about/careers',
                'variant' => 'outline',
                'size' => 'lg',
                'icon' => 'ArrowRight',
                'icon_position' => IconPosition::RIGHT->value,
                'status' => Status::ACTIVE->value,
            ]
        );

        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'team.grid',
            'name' => 'Homepage Team',
            'anchor' => 'team',
            'eyebrow' => 'Our Team',
            'heading' => 'The People Who Actually Build It',
            'subheading' => 'No bench, no handover to a team you have not met. These are the people who scope your project and the people who ship it.',
            'body' => null,
            'media_id' => null,
            'cta_id' => $cta->id,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                'heading_highlight' => 'Actually Build It',
                'footnote' => 'And twenty more across four time zones.',
            ],
            'settings' => [
                // One row of people, not four stacked mini-directories — see
                // the `group_by` field's note in `TeamGridType`. Every member
                // still carries their department, so switching this on in the
                // admin regroups them with no other edit.
                'group_by' => false,
                'media_shape' => 'portrait',
                // Off: eight people at four columns is two full rows, and an
                // alternating offset across two rows reads as a misaligned
                // grid rather than as a scatter. The switch stays in the admin
                // for a single-row team.
                'stagger_cards' => false,
                'columns' => 4,
                'align' => 'center',
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 13,
        ]);

        $members = [
            [
                'label' => 'Amara Rahman',
                'description' => 'Chief Executive Officer',
                'value' => 'Leadership',
                'body' => 'Fifteen years running delivery teams. Sits in the first scoping call of every engagement.',
                'skills' => 'Delivery, Strategy',
                'accent' => 'violet',
            ],
            [
                'label' => 'Jonas Thorne',
                'description' => 'Chief Technology Officer',
                'value' => 'Leadership',
                'body' => 'Owns the architecture review every project passes before a line of code is written.',
                'skills' => 'Architecture, Security',
                'accent' => 'brand',
            ],
            [
                'label' => 'Mei Kobayashi',
                'description' => 'Principal Engineer',
                'value' => 'Engineering',
                'body' => 'Backend and data. The person your slowest query ends up in front of.',
                'skills' => 'Laravel, PostgreSQL, Queues',
                'accent' => 'teal',
            ],
            [
                'label' => 'Daniel Okafor',
                'description' => 'Senior Engineer',
                'value' => 'Engineering',
                'body' => null,
                'skills' => 'React, TypeScript, Design Systems',
                'accent' => 'amber',
            ],
            [
                'label' => 'Priya Nair',
                'description' => 'Platform Engineer',
                'value' => 'Engineering',
                'body' => null,
                'skills' => 'AWS, Terraform, Observability',
                'accent' => 'rose',
            ],
            [
                'label' => 'Sofia Duarte',
                'description' => 'Head of Design',
                'value' => 'Design',
                'body' => 'Builds the design system first, then the screens — so the second release costs less than the first.',
                'skills' => 'Design Systems, Accessibility',
                'accent' => 'violet',
            ],
            [
                'label' => 'Tomas Lindqvist',
                'description' => 'Product Designer',
                'value' => 'Design',
                'body' => null,
                'skills' => 'Prototyping, Research',
                'accent' => 'teal',
            ],
            [
                'label' => 'Hana Yusuf',
                'description' => 'Product Specialist',
                'value' => 'Product',
                'body' => 'Turns a wishlist into a release plan somebody can actually defend to a board.',
                'skills' => 'Discovery, Roadmapping',
                'accent' => 'brand',
            ],
            [
                'label' => 'Lukas Brandt',
                'description' => 'Delivery Manager',
                'value' => 'Product',
                'body' => null,
                'skills' => 'Agile Delivery, QA',
                'accent' => 'ink',
            ],
        ];

        foreach ($members as $position => $member) {
            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'member',
                'label' => $member['label'],
                // The DEPARTMENT — this is the grouping key the component
                // buckets on, in first-appearance order.
                'value' => $member['value'],
                'description' => $member['description'],
                'body' => $member['body'],
                'icon' => null,
                // NO PHOTO IS SEEDED. The only faces-shaped assets in the
                // seed set are `avatars/*` — 96x96 gradient initial marks
                // built for the reviewer cluster — and cover-cropping one of
                // those into a 4:5 portrait frame upscales it fourfold and
                // slices the top and bottom off. `TeamGrid` already renders a
                // monogram in the member's accent hue when this is null, and
                // that is both sharper and consistent across the whole row.
                // An editor uploads the real headshot.
                'media_id' => null,
                'cta_id' => null,
                // No profile URLs seeded: a fictional person has no LinkedIn,
                // and a dead link is worse than an absent one.
                'data' => [
                    'skills' => $member['skills'],
                ],
                'settings' => [
                    'accent' => $member['accent'],
                ],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /**
     * The credentials wall — awards, certifications, partner badges,
     * compliance and industry recognition.
     *
     * NO BADGE IMAGES ARE SEEDED, on purpose. Every real mark here — the AWS
     * partner badge, the Microsoft competency, the ISO certificate — is a
     * licensed asset with programme rules about how it may be shown, and
     * shipping one the company has not earned would be a false claim on top
     * of a trademark problem. Each card falls back to its icon, which is
     * exactly the state the section is designed to survive; an editor uploads
     * the mark their programme actually granted them.
     *
     * DEMO CONTENT: the credentials below are plausible placeholders, not
     * claims. Replace or delete every row before launch.
     *
     * Four of them carry a "Request evidence" link, which makes their card
     * clickable. That wording is deliberate — see the note in the loop.
     */
    protected function seedAwardWall(Page $page, int $siteId): void
    {
        PageSection::where('page_id', $page->id)
            ->where('section_type', 'award.wall')
            ->forceDelete();

        $cta = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-credentials-cta',
            ],
            [
                'label' => 'Request Our Compliance Pack',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/contact',
                'variant' => 'outline',
                'size' => 'lg',
                'icon' => 'ArrowRight',
                'icon_position' => IconPosition::RIGHT->value,
                'status' => Status::ACTIVE->value,
            ]
        );

        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'award.wall',
            'name' => 'Homepage Credentials',
            'anchor' => 'credentials',
            'eyebrow' => 'Credentials',
            'heading' => 'Claims You Can Check',
            'subheading' => 'Certifications, partner status and recognition — each one issued by somebody other than us, and each one verifiable.',
            'body' => null,
            'media_id' => null,
            'cta_id' => $cta->id,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                'heading_highlight' => 'Check',
                'footnote' => 'Placeholder credentials. Replace them with the certificates and partner marks your programmes have actually granted you.',
            ],
            'settings' => [
                'group_by' => true,
                'columns' => 3,
                'align' => 'center',
                'theme' => 'subtle',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 14,
        ]);

        $credentials = [
            [
                'label' => 'ISO/IEC 27001:2022',
                'description' => 'Information Security Management',
                'value' => 'Certified 2023 · Renewed 2025',
                'body' => 'Covers our development, hosting and client-data handling processes end to end.',
                'kind' => 'compliance',
                'icon' => 'ShieldCheck',
                'link' => true,
            ],
            [
                'label' => 'ISO 9001:2015',
                'description' => 'Quality Management',
                'value' => '2024',
                'body' => 'The delivery process behind every engagement, audited annually.',
                'kind' => 'compliance',
                'icon' => 'Lock',
                'link' => true,
            ],
            [
                'label' => 'AWS Advanced Consulting Partner',
                'description' => 'Amazon Web Services',
                'value' => '2025',
                'body' => 'Twelve certified architects and engineers across Solutions Architect and DevOps tracks.',
                'kind' => 'partner',
                'icon' => 'Cloud',
                'link' => true,
            ],
            [
                'label' => 'Microsoft Solutions Partner — Digital & App Innovation',
                'description' => 'Microsoft',
                'value' => '2025',
                'body' => 'Azure app modernisation and .NET delivery, measured on customer success metrics.',
                'kind' => 'partner',
                'icon' => 'Layers',
                'link' => true,
            ],
            [
                'label' => 'AWS Certified Solutions Architect — Professional',
                'description' => 'Amazon Web Services',
                'value' => '6 engineers, current',
                'body' => null,
                'kind' => 'certification',
                'icon' => 'Cloud',
                'link' => false,
            ],
            [
                'label' => 'Microsoft Certified: Azure Solutions Architect Expert',
                'description' => 'Microsoft',
                'value' => '4 engineers, current',
                'body' => null,
                'kind' => 'certification',
                'icon' => 'ShieldCheck',
                'link' => false,
            ],
            [
                'label' => 'Certified Kubernetes Administrator',
                'description' => 'The Linux Foundation',
                'value' => '3 engineers, current',
                'body' => null,
                'kind' => 'certification',
                'icon' => 'Boxes',
                'link' => false,
            ],
            [
                'label' => 'Agency Of The Year — Enterprise Delivery',
                'description' => 'Regional Tech Awards',
                'value' => '2024',
                'body' => 'Judged on delivered outcomes and client references rather than on submitted case studies.',
                'kind' => 'award',
                'icon' => 'Award',
                'link' => false,
            ],
            [
                'label' => 'Top 50 Software Development Companies',
                'description' => 'Independent industry index',
                'value' => '2025',
                'body' => null,
                'kind' => 'recognition',
                'icon' => 'Newspaper',
                'link' => false,
            ],
        ];

        foreach ($credentials as $position => $credential) {
            /*
             * "Request evidence", not "Verify on AWS".
             *
             * A verification button has to lead somewhere that actually proves
             * the claim. Pointing one at a fabricated issuer URL would be
             * inventing the proof itself — worse than the missing badge
             * artwork, because a visitor would follow it. An internal request
             * link is honest, demonstrates the clickable card, and is the
             * right destination anyway for certificates held under NDA.
             *
             * Only the four credentials a company could actually produce a
             * certificate for get one. The rest stay link-less, which is also
             * what proves an unlinked card is not clickable.
             */
            $verifyCta = $credential['link'] === false ? null : Cta::updateOrCreate(
                [
                    'site_id' => $siteId,
                    'tracking_id' => 'home-credential-'.($position + 1),
                ],
                [
                    'label' => 'Request evidence',
                    'aria_label' => 'Request evidence for '.$credential['label'],
                    'link_type' => CtaLinkType::URL->value,
                    'url' => '/contact',
                    'variant' => 'link',
                    'size' => 'sm',
                    'icon' => 'ArrowUpRight',
                    'icon_position' => IconPosition::RIGHT->value,
                    'status' => Status::ACTIVE->value,
                ]
            );

            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'credential',
                'label' => $credential['label'],
                'value' => $credential['value'],
                'description' => $credential['description'],
                'body' => $credential['body'],
                'icon' => $credential['icon'],
                // See the docblock: badge artwork is licensed, so none ships.
                'media_id' => null,
                'cta_id' => $verifyCta?->id,
                'data' => [
                    'kind' => $credential['kind'],
                ],
                // No accent: the card takes its hue from its KIND, which is
                // what makes the wall scannable by colour.
                'settings' => [],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /**
     * The FAQ — the eight questions a software agency actually gets asked.
     *
     * Written as answers the company can stand behind rather than as sales
     * copy: an FAQ that dodges the pricing question is the one visitors stop
     * reading. The `split` layout keeps the "still stuck?" button beside the
     * list, which is where somebody who did not find their question is
     * looking.
     */
    protected function seedFaqAccordion(Page $page, int $siteId): void
    {
        PageSection::where('page_id', $page->id)
            ->where('section_type', 'faq.accordion')
            ->forceDelete();

        $cta = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-faq-cta',
            ],
            [
                'label' => 'Ask Us Anything',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/contact',
                'variant' => 'outline',
                'size' => 'lg',
                'icon' => 'ArrowRight',
                'icon_position' => IconPosition::RIGHT->value,
                'status' => Status::ACTIVE->value,
            ]
        );

        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'faq.accordion',
            'name' => 'Homepage FAQ',
            'anchor' => 'faq',
            'eyebrow' => 'FAQ',
            'heading' => 'Questions We Get Before Every Kickoff',
            'subheading' => 'If yours is not here, ask it — we answer these the same way on a call.',
            'body' => null,
            'media_id' => null,
            'cta_id' => $cta->id,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                'heading_highlight' => 'Before Every Kickoff',
                'footnote' => null,
            ],
            'settings' => [
                'layout' => 'split',
                'align' => 'center',
                'theme' => 'default',
                'spacing' => 'lg',
                'open_first' => true,
                'exclusive' => false,
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 15,
        ]);

        $questions = [
            [
                'label' => 'How do you price a project?',
                'body' => 'Two models. Fixed scope and fixed price when the requirements are genuinely settled, and a monthly team rate when they are not — which is most of the time. We will tell you which one your project is, and we will not quote a fixed price on a scope we know is going to move.',
                'topic' => 'Pricing',
                'accent' => 'brand',
            ],
            [
                'label' => 'What does a typical engagement cost?',
                'body' => 'A discovery phase is two to three weeks. A first production release is usually eight to sixteen weeks with a team of three to five. We give you a range in the first call and a number after discovery, not before.',
                'topic' => 'Pricing',
                'accent' => 'brand',
            ],
            [
                'label' => 'How quickly can you start?',
                'body' => 'Usually two to three weeks from a signed statement of work. If we cannot staff you properly in that window we will say so rather than starting with whoever is free.',
                'topic' => 'Process',
                'accent' => 'teal',
            ],
            [
                'label' => 'Who actually works on my project?',
                'body' => 'The people you meet in scoping. We do not run a pitch team and a delivery team, and we will name the engineers before you sign. If someone has to change mid-project we tell you why and overlap the handover.',
                'topic' => 'Team',
                'accent' => 'violet',
            ],
            [
                'label' => 'Who owns the code and the IP?',
                'body' => 'You do, in full, from the first commit — not on final payment. The repository is yours, hosted in your organisation, and every dependency we add is open source or licensed to you directly.',
                'topic' => 'Legal',
                'accent' => 'amber',
            ],
            [
                'label' => 'How do you handle security and our data?',
                'body' => 'Least-privilege access, secrets in a managed vault, no production data in development environments, and an architecture review before build. We will sign your NDA and DPA, and we can work inside your own cloud accounts if that is the requirement.',
                'topic' => 'Security',
                'accent' => 'rose',
            ],
            [
                'label' => 'What happens after launch?',
                'body' => 'A handover window with documentation, runbooks and pairing while your team takes the wheel. After that, either a support retainer or nothing at all — we build so that walking away is a real option for you.',
                'topic' => 'Support',
                'accent' => 'teal',
            ],
            [
                'label' => 'Do we have to use your tech stack?',
                'body' => 'No. We are strongest in Laravel, React and the AWS ecosystem, and we will recommend them where they fit. If you already run something else and it works, extending it beats a rewrite almost every time — and we will tell you when it does not.',
                'topic' => 'Process',
                'accent' => 'ink',
            ],
        ];

        foreach ($questions as $position => $question) {
            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'question',
                'label' => $question['label'],
                'value' => null,
                'description' => null,
                // The ANSWER. Plain text so the section can stay honest about
                // what it renders — see `FaqAccordionType`.
                'body' => $question['body'],
                'icon' => null,
                'media_id' => null,
                'cta_id' => null,
                'data' => [
                    'topic' => $question['topic'],
                ],
                'settings' => [
                    'accent' => $question['accent'],
                ],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /**
     * The about band — the story beside the working-session still, over four
     * milestones.
     *
     * Seeded LATE in `sort_order` because this seeder appends rather than
     * renumbers: an about section usually belongs in the page's first third,
     * and moving it there is one drag in the page builder. Renumbering every
     * existing section from a seeder would silently rewrite an editor's own
     * ordering on the next deploy, which is a far worse default.
     *
     * DEMO CONTENT: the story and the milestones are placeholders written to
     * be replaceable, not to be true.
     */
    protected function seedAboutStory(Page $page, int $siteId): void
    {
        PageSection::where('page_id', $page->id)
            ->where('section_type', 'about.story')
            ->forceDelete();

        $still = DemoMediaSeeder::group('process')->keyBy('file_name');

        $primary = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-about-primary',
            ],
            [
                'label' => 'Meet The Team',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/about',
                'variant' => 'default',
                'size' => 'lg',
                'icon' => 'ArrowRight',
                'icon_position' => IconPosition::RIGHT->value,
                'status' => Status::ACTIVE->value,
            ]
        );

        $secondary = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-about-secondary',
            ],
            [
                'label' => 'How We Work',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/services/custom-software-development#process',
                'variant' => 'outline',
                'size' => 'lg',
                'status' => Status::ACTIVE->value,
            ]
        );

        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'about.story',
            'name' => 'Homepage About',
            'anchor' => 'about',
            'eyebrow' => 'About Us',
            'heading' => 'A Small Team That Ships Like A Large One',
            'subheading' => 'We are engineers and designers who got tired of watching good products die in handover. So we built an agency where the people who plan the work are the people who finish it.',
            'body' => "We started in 2016 with three people and one rule: no bench, no bait-and-switch. The team you meet in scoping is the team that writes the code, and it has stayed that way through fifty-odd projects.\n\nThat rule shapes everything else. We scope honestly, because we are the ones who have to deliver it. We keep teams small, because a team that fits in one conversation does not need a layer of management to stay aligned. And we hand over properly — documentation, runbooks, pairing — because walking away cleanly is the strongest thing an agency can offer.\n\nToday we are thirty people across four time zones, working with product teams who want senior engineering without building a department for it.",
            'media_id' => $still->get('working-session.svg')?->id,
            'cta_id' => $primary->id,
            'secondary_cta_id' => $secondary->id,
            'data' => [
                'version' => 1,
                'heading_highlight' => 'Ships Like A Large One',
                'footnote' => null,
            ],
            'settings' => [
                'layout' => 'end',
                'media_shape' => 'portrait',
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 16,
        ]);

        $highlights = [
            [
                'value' => '2016',
                'label' => 'Founded',
                'description' => 'Three engineers and one rule about handovers.',
                'icon' => null,
                'accent' => 'brand',
            ],
            [
                'value' => '30',
                'label' => 'People',
                'description' => 'Across four time zones, all permanent.',
                'icon' => null,
                'accent' => 'violet',
            ],
            [
                'value' => null,
                'label' => 'Senior By Default',
                'description' => 'The people who scope your project build it.',
                'icon' => 'Users',
                'accent' => 'teal',
            ],
            [
                'value' => null,
                'label' => 'You Own It',
                'description' => 'Code and IP are yours from the first commit.',
                'icon' => 'ShieldCheck',
                'accent' => 'amber',
            ],
        ];

        foreach ($highlights as $position => $highlight) {
            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'highlight',
                'label' => $highlight['label'],
                // A row WITH a value renders as a statistic; one without
                // renders with its icon. Never both — see the type.
                'value' => $highlight['value'],
                'description' => $highlight['description'],
                'body' => null,
                'icon' => $highlight['icon'],
                'media_id' => null,
                'cta_id' => null,
                'data' => [],
                'settings' => [
                    'accent' => $highlight['accent'],
                ],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /**
     * The newsletter band.
     *
     * The four form strings are seeded rather than left to the component's
     * fallbacks so an editor opening the page builder can SEE that they are
     * editable — a field showing its own default looks hardcoded, which is
     * exactly the impression this CMS exists to avoid.
     *
     * The consent sentence is deliberately explicit about frequency and about
     * unsubscribing. Whoever owns the privacy policy should rewrite it before
     * launch; it is a legal string wearing marketing clothes.
     */
    protected function seedNewsletterSignup(Page $page, int $siteId): void
    {
        PageSection::where('page_id', $page->id)
            ->where('section_type', 'newsletter.signup')
            ->forceDelete();

        $faces = DemoMediaSeeder::group('avatars');

        $section = PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'newsletter.signup',
            'name' => 'Homepage Newsletter',
            'anchor' => 'newsletter',
            'eyebrow' => null,
            'heading' => 'Subscribe To Our Newsletter',
            'subheading' => 'One email a month: what we shipped, what broke, and what we learned fixing it. No pitches.',
            'body' => null,
            'media_id' => null,
            'cta_id' => null,
            'secondary_cta_id' => null,
            'data' => [
                'version' => 1,
                'heading_highlight' => 'Newsletter',
                'placeholder' => 'Enter your email address',
                'button_label' => 'Get started',
                'consent_label' => 'Yes, send me the monthly email. I can unsubscribe from any message, and my address is never shared.',
                'success_message' => 'You are on the list. Look out for the next issue.',
                // Feeds `subscribers.source`, so two placements of this
                // section can be told apart without a deploy.
                'source' => 'home-newsletter',
                'trust_label' => 'Our experts are ready to help!',
                'footnote' => null,
            ],
            'settings' => [
                'layout' => 'centered',
                'theme' => 'default',
                'spacing' => 'lg',
                'show_consent' => true,
                'animation' => 'rise',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 17,
        ]);

        foreach ($faces->values() as $position => $face) {
            SectionBlock::create([
                'page_section_id' => $section->id,
                'parent_id' => null,
                'block_type' => 'face',
                // Not displayed — it is the image's alt text when the media
                // library has none. See the type.
                'label' => null,
                'value' => null,
                'description' => null,
                'body' => null,
                'icon' => null,
                'media_id' => $face->id,
                'cta_id' => null,
                'data' => [],
                'settings' => [],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }

    /**
     * The closing CTA, merged into the footer.
     *
     * MUST BE LAST. `merge_footer` paints the lower half of the section in the
     * footer's colour so the panel appears to rest on it; anywhere but the
     * final position that produces a dark band in the middle of the page. The
     * sort order here is the highest this seeder writes for that reason, and
     * the field's help text says so in the admin.
     */
    protected function seedCtaFinal(Page $page, int $siteId): void
    {
        PageSection::where('page_id', $page->id)
            ->where('section_type', 'cta.final')
            ->forceDelete();

        $primary = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-final-cta-primary',
            ],
            [
                'label' => 'Schedule A Call',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/contact',
                'variant' => 'default',
                'size' => 'lg',
                'icon' => 'ArrowRight',
                'icon_position' => IconPosition::RIGHT->value,
                'status' => Status::ACTIVE->value,
            ]
        );

        $secondary = Cta::updateOrCreate(
            [
                'site_id' => $siteId,
                'tracking_id' => 'home-final-cta-secondary',
            ],
            [
                'label' => 'See Our Work',
                'link_type' => CtaLinkType::URL->value,
                'url' => '/case-studies',
                'variant' => 'outline',
                'size' => 'lg',
                'status' => Status::ACTIVE->value,
            ]
        );

        PageSection::create([
            'site_id' => $siteId,
            'page_id' => $page->id,
            'section_type' => 'cta.final',
            'name' => 'Homepage Final CTA',
            'anchor' => 'start',
            'eyebrow' => 'Ready When You Are',
            'heading' => 'Let Us Build The Next One Together',
            'subheading' => 'Tell us what you are trying to ship. We will tell you honestly whether we are the right team for it.',
            'body' => null,
            // No artwork seeded: the panel's picture is decoration, and the
            // repo's own stills are product shots that would read as a case
            // study rather than as a closing ask.
            'media_id' => null,
            'cta_id' => $primary->id,
            'secondary_cta_id' => $secondary->id,
            'data' => [
                'version' => 1,
                'heading_highlight' => 'Together',
                'footnote' => 'No obligation. We reply within one business day.',
            ],
            'settings' => [
                'tone' => 'ink',
                'align' => 'start',
                'merge_footer' => true,
                'spacing' => 'default',
                'animation' => 'rise',
            ],
            'status' => Status::ACTIVE->value,
            'publish_status' => ContentStatus::PUBLISHED->value,
            'published_at' => now()->subMinute(),
            'expires_at' => null,
            'sort_order' => 18,
        ]);
    }
}

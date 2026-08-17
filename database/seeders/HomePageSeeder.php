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

        $this->seedHeroCentered($page, $siteId);
        $this->seedServiceGrid($page, $siteId);

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
                'tags' => 'React, TypeScript, Next.js',
            ],
            [
                'label' => 'Back-End Engineering',
                'description' => 'Secure, well-tested services that hold up under real production load, from the first API to the tenth integration.',
                'icon' => 'Database',
                'tags' => 'Laravel, Node.js, PostgreSQL',
            ],
            [
                'label' => 'AI & Machine Learning',
                'description' => 'Applied AI that earns its place in the product — grounded in your data, measured against real business outcomes.',
                'icon' => 'Sparkles',
                'tags' => 'LLMs, RAG, Python',
            ],
            [
                'label' => 'Mobile Development',
                'description' => 'Native-feeling iOS and Android apps with smooth performance, stable sessions and secure data handling.',
                'icon' => 'Smartphone',
                'tags' => 'Swift, Kotlin, React Native',
            ],
            [
                'label' => 'UX/UI Design',
                'description' => 'Product design with clear user flows, a reusable component library and layouts built accessible from the start.',
                'icon' => 'PenTool',
                'tags' => 'Figma, Design Systems',
            ],
            [
                'label' => 'QA & Testing',
                'description' => 'Release-ready software validated end to end, with manual and automated coverage across every core flow.',
                'icon' => 'ShieldCheck',
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
                ],
                'settings' => [],
                'status' => Status::ACTIVE->value,
                'sort_order' => $position,
            ]);
        }
    }
}

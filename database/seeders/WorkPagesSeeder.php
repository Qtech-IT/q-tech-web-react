<?php

namespace Database\Seeders;

use App\Enums\Cms\MenuLinkType;
use App\Enums\Cms\PageType;
use App\Enums\Common\Status;
use App\Models\Cta;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\PageSection;
use Database\Seeders\Cms\CmsContentSeeder;

/**
 * `/work` — Our Work — and the projects beneath it.
 *
 * WHY THIS IS NOT `/case-studies`
 * -------------------------------
 * The homepage has always carried two work bands, and they answer different
 * questions:
 *
 *   `work.showcase`   → case studies. A constraint, an approach and a measured
 *                       outcome. Long-form, and what a buyer reads when they
 *                       are comparing vendors.
 *   `portfolio.grid`  → the portfolio. What we built, what it was built with,
 *                       and what it looks like. Visual, scannable, browsable.
 *
 * Both were pointed at `/case-studies` because neither destination existed,
 * which collapsed the two into one and left the portfolio band with nothing of
 * its own. `/work` is the portfolio's home, and it reuses the SAME
 * `portfolio.grid` section the homepage uses — one design for one kind of
 * content, so the band on the homepage and the page it links to are visibly
 * the same thing rather than two takes on it.
 *
 * DEMO CONTENT: the four projects are illustrative builds with composed
 * artwork. No client is named and no metric is claimed. Replace before launch.
 */
class WorkPagesSeeder extends CmsContentSeeder
{
    public function run(): void
    {
        $index = $this->page('/work', [
            'title' => 'Our Work',
            'slug' => 'work',
            'excerpt' => 'Recent builds — what we made, what it runs on, and what it looks like.',
            'icon' => 'Boxes',
            'accent' => 'violet',
            'sort_order' => 4,
        ]);

        // The portfolio screens, keyed by file name so re-ordering the projects
        // cannot silently pair the wrong artwork with a write-up.
        $art = DemoMediaSeeder::group('portfolio')->keyBy('file_name');

        $pages = [];

        foreach ($this->projects() as $position => $project) {
            $page = $this->page('/work/'.$project['slug'], [
                'title' => $project['title'],
                'slug' => $project['slug'],
                'parent_id' => $index->id,
                'excerpt' => $project['excerpt'],
                'icon' => $project['icon'],
                'accent' => $project['accent'],
                'page_type' => PageType::PROJECT->value,
                'published_at' => now()->subDays(20 + ($position * 30)),
                'sort_order' => $position,
            ]);

            $media = $art->get($project['artwork']);

            $this->attachCard($page, $media);
            $this->buildProject($page, $project, $media?->id, $art);

            $pages[$project['slug']] = $page;
        }

        $this->buildIndex($index, $art);
        $this->relinkHomepage($pages, $index);

        /*
         * "Our Work" points HERE, not at the case studies. A separate
         * "Case Studies" entry keeps its own destination — see the class note
         * for why the two are not the same page.
         */
        $this->linkMenuItems([
            'Portfolio' => $index,
            'Projects' => $index,
        ]);

        $this->claimOurWork($index);

        $this->flushPageCache();
    }

    /**
     * Force the "Our Work" nav entry onto the portfolio index.
     *
     * `linkMenuItems()` deliberately refuses to move an entry that already
     * points at a DIFFERENT page — that is an editor's decision and a seeder
     * must not overwrite it. This one is the exception, and only because the
     * value it is overwriting was written by a seeder rather than a person:
     * `CaseStudyPagesSeeder` claimed the label while `/work` did not exist.
     *
     * Narrow on purpose. It moves exactly one label, only from the case-study
     * index, so an editor who has since pointed "Our Work" somewhere of their
     * own choosing keeps it.
     */
    protected function claimOurWork(Page $index): void
    {
        $caseStudies = Page::where('path', '/case-studies')->first();

        MenuItem::where('label', 'Our Work')
            ->where(function ($query) use ($caseStudies) {
                $query
                    ->whereIn('link_type', [MenuLinkType::URL->value, MenuLinkType::NONE->value])
                    ->when(
                        $caseStudies instanceof Page,
                        fn ($sub) => $sub->orWhere(fn ($q) => $q
                            ->where('link_type', MenuLinkType::PAGE->value)
                            ->where('page_id', $caseStudies->id))
                    );
            })
            ->update([
                'link_type' => MenuLinkType::PAGE->value,
                'page_id' => $index->id,
                'url' => null,
                'status' => Status::ACTIVE->value,
            ]);
    }

    /**
     * The index: the same `portfolio.grid` the homepage uses, at full length.
     *
     * @param  \Illuminate\Support\Collection<string, \App\Models\Media>  $art
     */
    protected function buildIndex(Page $index, $art): void
    {
        $this->clearSections($index);

        $this->section($index, 'hero.centered', 0, [
            'name' => 'Work Hero',
            'eyebrow' => 'Our Work',
            'heading' => 'Recent Builds, Shipped And Live',
            'subheading' => 'Interfaces, platforms and product sites we have designed and built. Every one of these is running in production for somebody.',
            'cta_id' => $this->cta('work-index-primary', [
                'label' => 'Start A Project',
                'url' => '/contact',
                'icon' => 'ArrowRight',
            ])->id,
            'data' => ['heading_highlight' => 'Shipped And Live'],
            'settings' => ['theme' => 'default', 'spacing' => 'lg', 'animation' => 'rise'],
        ]);

        $grid = $this->section($index, 'portfolio.grid', 1, [
            'name' => 'Portfolio Grid',
            'anchor' => 'projects',
            'eyebrow' => null,
            'heading' => 'Selected Projects',
            'subheading' => 'Two-up so each screen is shown at a size where the work is actually legible, with the browser chrome drawn around it.',
            'cta_id' => $this->cta('work-index-secondary', [
                'label' => 'Read The Case Studies',
                'url' => '/case-studies',
                'variant' => 'outline',
                'icon' => 'ArrowRight',
            ])->id,
            'settings' => [
                // Identical to the homepage band. Same content type, same
                // composition — an index that restyled its own cards would
                // make the homepage look like a different site.
                'columns' => 2,
                'align' => 'center',
                'chrome' => true,
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ]);

        foreach ($this->projects() as $position => $project) {
            $this->block($grid, 'project', $position, [
                'label' => $project['title'],
                'description' => $project['excerpt'],
                'media_id' => $art->get($project['artwork'])?->id,
                'cta_id' => $this->cta('work-project-'.$project['slug'], [
                    'label' => 'View project',
                    'url' => '/work/'.$project['slug'],
                    'variant' => 'link',
                    'size' => 'default',
                    'icon' => 'ArrowRight',
                ])->id,
                'data' => ['tags' => $project['tags']],
                'settings' => ['accent' => $project['accent']],
            ]);
        }

        $this->closingBand($index, 2, [
            'key' => 'work-index',
            'heading' => 'Something Like This In Mind',
            'subheading' => 'Send us the closest thing to what you want and tell us what is different about yours. That is a faster start than a requirements document.',
            'secondary_label' => 'Read The Case Studies',
            'secondary_url' => '/case-studies',
        ]);
    }

    /**
     * One project page: the shot, the brief, the gallery, what it runs on.
     *
     * @param  \Illuminate\Support\Collection<string, \App\Models\Media>  $gallerySet
     */
    protected function buildProject(Page $page, array $project, ?int $mediaId, $gallerySet): void
    {
        $this->clearSections($page);

        $header = $this->section($page, 'article.header', 0, [
            'name' => $project['title'].' Header',
            'eyebrow' => $project['kind'],
            'heading' => $project['title'],
            'subheading' => $project['standfirst'],
            'media_id' => $mediaId,
            'data' => [
                'published_label' => $project['date_label'],
                'read_time' => null,
            ],
            'settings' => [
                'show_share' => true,
                'align' => 'start',
                // Wider than an article: on a project page the screenshot IS
                // the content, so it gets the most generous ratio available.
                'media_shape' => 'wide',
                'theme' => 'default',
                'spacing' => 'default',
                'animation' => 'rise',
            ],
        ]);

        foreach ($project['tag_list'] as $i => $tag) {
            $this->block($header, 'tag', $i, ['label' => $tag]);
        }

        $this->section($page, 'content.prose', 1, [
            'name' => $project['title'].' Brief',
            'heading' => 'The Brief',
            'body' => $project['brief_html'],
            'settings' => [
                'measure' => 'prose',
                'align' => 'start',
                'theme' => 'default',
                'spacing' => 'default',
                'animation' => 'fade',
            ],
        ]);

        /*
         * The gallery.
         *
         * Every project draws from the whole seeded portfolio set with its own
         * shot first, because there are four assets and four projects — the
         * repo has no second angle of anything. That is honest placeholder
         * behaviour rather than a design decision: a real project carries its
         * own screens, and an editor replaces these. The section renders
         * correctly with one image (no thumbnails, no arrows), so a project
         * with a single shot is not a broken state.
         */
        $gallery = $this->section($page, 'media.gallery', 2, [
            'name' => $project['title'].' Gallery',
            'anchor' => 'gallery',
            'eyebrow' => 'Gallery',
            'heading' => 'Screens From The Build',
            'subheading' => 'Use the arrows or the thumbnails — nothing moves on its own.',
            'settings' => [
                'display' => 'slider',
                'ratio' => 'screen',
                'columns' => 2,
                'theme' => 'subtle',
                'spacing' => 'lg',
                'animation' => 'fade',
            ],
        ]);

        foreach ($project['gallery'] as $i => $shot) {
            $asset = $gallerySet->get($shot['artwork']);

            if ($asset === null) {
                continue;
            }

            $this->block($gallery, 'shot', $i, [
                'media_id' => $asset->id,
                'label' => $shot['caption'],
                'description' => $shot['alt'] ?? null,
            ]);
        }

        $built = $this->section($page, 'content.split', 3, [
            'name' => $project['title'].' Build',
            'anchor' => 'what-we-built',
            'eyebrow' => 'What We Built',
            'heading' => $project['built_heading'],
            'media_id' => $mediaId,
            'settings' => [
                'media_side' => 'end',
                'media_shape' => 'landscape',
                'list_columns' => 1,
                'accent' => $project['accent'],
                'theme' => 'subtle',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ]);

        foreach ($project['built'] as $i => $item) {
            $this->block($built, 'item', $i, ['label' => $item]);
        }

        $this->closingBand($page, 4, [
            'key' => 'work-'.$project['slug'],
            'heading' => 'Want Something Like This',
            'subheading' => 'Tell us what you are building and who it is for. The first call is with the engineer who would lead it.',
            'secondary_label' => 'More Work',
            'secondary_url' => '/work',
        ]);
    }

    /**
     * Point the homepage's portfolio band at these pages.
     *
     * Its four cards used the same artwork as these projects and every one of
     * their "View project" links went to `/case-studies` — the wrong content
     * type — because `/work` did not exist. This is the join that was missing.
     *
     * @param  array<string, Page>  $pages
     */
    protected function relinkHomepage(array $pages, Page $index): void
    {
        $section = PageSection::where('section_type', 'portfolio.grid')
            ->whereHas('page', fn ($q) => $q->where('is_homepage', true))
            ->first();

        if (! $section instanceof PageSection) {
            return;
        }

        $slugs = array_keys($pages);

        foreach ($section->blocks()->orderBy('sort_order')->get() as $position => $block) {
            $slug = $slugs[$position] ?? null;

            if ($slug === null || ! $block->cta_id) {
                continue;
            }

            Cta::whereKey($block->cta_id)->update([
                'label' => 'View project',
                'url' => '/work/'.$slug,
            ]);
        }

        // And the band's own "see all", which pointed at the case studies.
        Cta::where('site_id', $this->siteId())
            ->where('tracking_id', 'home-portfolio-primary')
            ->update(['url' => $index->path]);
    }

    /** @return array<int, array<string, mixed>> */
    protected function projects(): array
    {
        return [
            [
                'slug' => 'craft-portfolio',
                'gallery' => [
                    ['artwork' => 'craft-portfolio.svg', 'caption' => 'Case-study template, rendered from the CMS'],
                    ['artwork' => 'neural-ai-landing.svg', 'caption' => 'Product page with the live demonstration in the hero'],
                    ['artwork' => 'orbit-saas-landing.svg', 'caption' => 'Plan matrix, editable without a deploy'],
                    ['artwork' => 'pulse-app-landing.svg', 'caption' => 'Launch page, statically rendered and edge cached'],
                ],
                'artwork' => 'craft-portfolio.svg',
                'title' => 'Craft — Portfolio Landing Page',
                'kind' => 'Marketing site',
                'icon' => 'PenTool',
                'accent' => 'violet',
                'date_label' => 'June 2026',
                'excerpt' => 'A studio portfolio built to load in under a second on a mid-range phone, with the case-study layout as a reusable template.',
                'standfirst' => 'A design studio needed a portfolio that loaded instantly on the phones their clients actually use, and that they could add work to without calling us.',
                'tags' => 'Laravel, Inertia, Tailwind',
                'tag_list' => ['Laravel', 'Inertia', 'Tailwind', 'CMS'],
                'brief_html' => '<p>The studio\'s previous site was a page builder carrying four megabytes of JavaScript to render what is essentially text and pictures. It scored badly on mobile and, more importantly, took a fortnight of somebody\'s time whenever a new project needed adding.</p><p>The brief was two sentences: make it fast, and make adding a project take ten minutes.</p>',
                'built_heading' => 'A Template, Not A Page',
                'built' => [
                    'A case-study template driven entirely from the CMS',
                    'Image handling with reserved boxes, so nothing shifts on load',
                    'A performance budget enforced in the build pipeline',
                    'Accessible navigation with full keyboard support',
                    'Draft previews so work can be staged before it is public',
                ],
            ],
            [
                'slug' => 'neural-ai-product-site',
                'gallery' => [
                    ['artwork' => 'neural-ai-landing.svg', 'caption' => 'Product page with the live demonstration in the hero'],
                    ['artwork' => 'craft-portfolio.svg', 'caption' => 'Case-study template, rendered from the CMS'],
                    ['artwork' => 'orbit-saas-landing.svg', 'caption' => 'Plan matrix, editable without a deploy'],
                    ['artwork' => 'pulse-app-landing.svg', 'caption' => 'Launch page, statically rendered and edge cached'],
                ],
                'artwork' => 'neural-ai-landing.svg',
                'title' => 'Neural — AI Product Site',
                'kind' => 'Product marketing',
                'icon' => 'Sparkles',
                'accent' => 'amber',
                'date_label' => 'April 2026',
                'excerpt' => 'A product site for an AI platform, with an interactive explainer that shows what the model does instead of describing it.',
                'standfirst' => 'Explaining what an AI product does is most of the sales problem. The site had to demonstrate it in the first screen rather than argue for it in three paragraphs.',
                'tags' => 'React, TypeScript, Motion',
                'tag_list' => ['React', 'TypeScript', 'Motion', 'Design system'],
                'brief_html' => '<p>The company had a genuinely good product and a website that described it in abstractions — "intelligent orchestration", "seamless integration". Visitors could not tell what it actually did.</p><p>We replaced the hero copy with a working demonstration: a small, real example of the model\'s output, rendered live, with the input visible beside it.</p>',
                'built_heading' => 'Show, Then Explain',
                'built' => [
                    'A live inline demonstration in place of hero copy',
                    'A component library covering every documented state',
                    'Reduced-motion alternatives for every animation',
                    'Content model built for a fast-changing product',
                    'Structured data so the product appears correctly in search',
                ],
            ],
            [
                'slug' => 'orbit-saas-site',
                'gallery' => [
                    ['artwork' => 'orbit-saas-landing.svg', 'caption' => 'Plan matrix, editable without a deploy'],
                    ['artwork' => 'craft-portfolio.svg', 'caption' => 'Case-study template, rendered from the CMS'],
                    ['artwork' => 'neural-ai-landing.svg', 'caption' => 'Product page with the live demonstration in the hero'],
                    ['artwork' => 'pulse-app-landing.svg', 'caption' => 'Launch page, statically rendered and edge cached'],
                ],
                'artwork' => 'orbit-saas-landing.svg',
                'title' => 'Orbit — SaaS Marketing Site',
                'kind' => 'Marketing site',
                'icon' => 'Boxes',
                'accent' => 'teal',
                'date_label' => 'February 2026',
                'excerpt' => 'Pricing, comparison and onboarding pages for a B2B SaaS, built so the marketing team ships changes without a release.',
                'standfirst' => 'Every pricing change needed an engineer and a deploy, so pricing changed twice a year instead of whenever the market did.',
                'tags' => 'Laravel, React, CMS',
                'tag_list' => ['Laravel', 'React', 'CMS', 'Pricing'],
                'brief_html' => '<p>The marketing team could not change a price, add a plan, or run a comparison test without filing a ticket. The engineering team resented the tickets. Both were right.</p><p>The fix was not a bigger CMS — it was modelling pricing as content rather than as code, with the plan matrix, feature comparison and FAQ all editable and versioned.</p>',
                'built_heading' => 'Pricing As Content',
                'built' => [
                    'A plan matrix editable without a deploy',
                    'Feature comparison generated from one source',
                    'Scheduled publishing, so a price change can be set in advance',
                    'Draft previews shared with stakeholders before going live',
                    'Analytics events on every plan interaction',
                ],
            ],
            [
                'slug' => 'pulse-app-launch',
                'gallery' => [
                    ['artwork' => 'pulse-app-landing.svg', 'caption' => 'Launch page, statically rendered and edge cached'],
                    ['artwork' => 'craft-portfolio.svg', 'caption' => 'Case-study template, rendered from the CMS'],
                    ['artwork' => 'neural-ai-landing.svg', 'caption' => 'Product page with the live demonstration in the hero'],
                    ['artwork' => 'orbit-saas-landing.svg', 'caption' => 'Plan matrix, editable without a deploy'],
                ],
                'artwork' => 'pulse-app-landing.svg',
                'title' => 'Pulse — App Launch Site',
                'kind' => 'Launch campaign',
                'icon' => 'Smartphone',
                'accent' => 'rose',
                'date_label' => 'December 2025',
                'excerpt' => 'A launch site for a consumer app, built in three weeks and able to survive the traffic spike on launch day.',
                'standfirst' => 'Three weeks to launch, an unknown traffic profile, and one chance to get it right on the day the press embargo lifted.',
                'tags' => 'React, Edge caching, Analytics',
                'tag_list' => ['React', 'Edge caching', 'Analytics'],
                'brief_html' => '<p>A launch site is a strange brief: it has one important day, and on that day the traffic is unpredictable by an order of magnitude. Over-provision and you waste the budget; under-provision and you are offline during the only coverage you will get.</p><p>We built it static, cached at the edge, with the only dynamic element — the waitlist — decoupled behind a queue so a database under load could never take the page down.</p>',
                'built_heading' => 'Built For One Day',
                'built' => [
                    'Statically rendered and served from the edge',
                    'Waitlist capture queued, so the page never waits on a write',
                    'Load tested against ten times the expected peak',
                    'App store deep links with sensible desktop fallbacks',
                    'Analytics wired before launch rather than after',
                ],
            ],
        ];
    }
}

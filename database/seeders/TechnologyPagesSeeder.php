<?php

namespace Database\Seeders;

use App\Enums\Cms\PageType;
use App\Models\Page;
use Database\Seeders\Cms\CmsContentSeeder;

/**
 * `/technologies` and the stacks beneath it.
 *
 * WHY THESE LIVE UNDER `/technologies` AND NOT AT THE ROOT
 * -------------------------------------------------------
 * The header menu shipped pointing at `/java`, `/react`, `/aws` and twenty more
 * root-level URLs, none of which existed. Root-level detail pages put every
 * technology in the same namespace as `/about`, `/blog` and `/contact`, which
 * means the first time somebody adds a page called "Go" the URL `/go` is
 * already an argument. Nesting them keeps the namespace clean and lets the
 * index band list its own children with no configuration.
 *
 * The menu is re-pointed by `page_id` rather than left on those URLs — see
 * `CmsContentSeeder::linkMenuItems()` for why that matters beyond the dead link.
 *
 * DEMO CONTENT: the copy is written for QTECH and is plausible, but the years,
 * team sizes and version claims are placeholder and must be reviewed before
 * launch.
 */
class TechnologyPagesSeeder extends CmsContentSeeder
{
    public function run(): void
    {
        $index = $this->page('/technologies', [
            'title' => 'Technologies',
            'slug' => 'technologies',
            'excerpt' => 'The languages, frameworks and platforms we build on — and what we actually use each one for.',
            'icon' => 'Boxes',
            'accent' => 'teal',
            'sort_order' => 2,
        ]);

        $links = [];

        foreach ($this->technologies() as $position => $tech) {
            $page = $this->page('/technologies/'.$tech['slug'], [
                'title' => $tech['title'],
                'slug' => $tech['slug'],
                'parent_id' => $index->id,
                'excerpt' => $tech['excerpt'],
                'icon' => $tech['icon'],
                'accent' => $tech['accent'],
                'page_type' => PageType::TECHNOLOGY->value,
                'sort_order' => $position,
            ]);

            $this->buildDetail($page, $tech);

            $links[$tech['title']] = $page;
        }

        $this->buildIndex($index);

        /*
         * Only pages that exist. There is no fallback to the index page for a
         * technology we have not written up: a menu entry labelled "Vue.js"
         * that lands on a list of eight other technologies reads as a broken
         * site rather than as a missing page. `NavigationRepairSeeder` hides
         * the unmatched entries instead, reversibly.
         */
        $this->linkMenuItems($links);

        $this->flushPageCache();
    }

    protected function buildIndex(Page $index): void
    {
        $this->clearSections($index);

        $this->section($index, 'hero.centered', 0, [
            'name' => 'Technologies Hero',
            'eyebrow' => 'Our Stack',
            'heading' => 'Chosen For Your Team, Not For Our CV',
            'subheading' => 'We are opinionated about engineering and agnostic about tools. The right stack is the one your team can still maintain after we leave.',
            'cta_id' => $this->cta('technologies-index-primary', [
                'label' => 'Discuss Your Stack',
                'url' => '/contact',
                'icon' => 'ArrowRight',
            ])->id,
            'data' => ['heading_highlight' => 'Not For Our CV'],
            'settings' => ['theme' => 'default', 'spacing' => 'lg', 'animation' => 'rise'],
        ]);

        $this->indexBand($index, 1, [
            'name' => 'All Technologies',
            'anchor' => 'all-technologies',
            'heading' => 'What We Build With',
            'highlight' => 'Build With',
            'subheading' => 'Each page covers what we use it for, where it stops being the right answer, and what we have shipped with it.',
            'page_type' => PageType::TECHNOLOGY->value,
            'layout' => 'icon',
            'columns' => 4,
            'limit' => 24,
            'empty_message' => 'Our technology pages are being written. Get in touch and we will talk you through the stack.',
        ]);

        $this->closingBand($index, 2, [
            'key' => 'technologies-index',
            'heading' => 'Not Sure Which Stack Fits',
            'highlight' => 'Which Stack',
            'subheading' => 'Describe the product and the team who will own it. We will tell you what we would choose and why — including when the answer is the thing you already run.',
            'secondary_label' => 'See All Services',
            'secondary_url' => '/services',
        ]);
    }

    protected function buildDetail(Page $page, array $tech): void
    {
        $this->clearSections($page);

        $this->section($page, 'hero.split', 0, [
            'name' => $tech['title'].' Hero',
            'eyebrow' => 'Technology',
            'heading' => $tech['heading'],
            'subheading' => $tech['intro'],
            'cta_id' => $this->cta($tech['slug'].'-hero-primary', [
                'label' => 'Talk To An Engineer',
                'url' => '/contact',
                'icon' => 'ArrowRight',
            ])->id,
            'secondary_cta_id' => $this->cta($tech['slug'].'-hero-secondary', [
                'label' => 'See Our Work',
                'url' => '/case-studies',
                'variant' => 'outline',
            ])->id,
            'data' => ['heading_highlight' => $tech['highlight'] ?? null],
            'settings' => [
                'layout' => 'split',
                'media_side' => 'right',
                'media_frame' => 'panel',
                'overlay_opacity' => 0,
                'animation' => 'rise',
                'theme' => 'default',
                'spacing' => 'lg',
            ],
        ]);

        $this->overviewSection($page, 1, [
            'name' => $tech['title'].' Argument',
            'eyebrow' => $tech['title'],
            'heading' => $tech['argument_heading'],
            'html' => $tech['argument_html'],
            'settings' => ['spacing' => 'default'],
        ]);

        $uses = $this->section($page, 'case.narrative', 2, [
            'name' => $tech['title'].' Uses',
            'anchor' => 'what-we-use-it-for',
            'eyebrow' => 'What We Use It For',
            'heading' => $tech['uses_heading'],
            'body' => $this->htmlToNarrative($tech['uses_html'] ?? ''),
            'data' => ['list_heading' => 'Where it fits'],
            'settings' => [
                'media_side' => 'end',
                'list_columns' => '2',
                'accent' => $tech['accent'],
                'theme' => 'subtle',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ]);

        foreach ($tech['uses'] as $i => $use) {
            $this->block($uses, 'point', $i, ['label' => $use]);
        }

        $faq = $this->section($page, 'faq.accordion', 3, [
            'name' => $tech['title'].' FAQ',
            'eyebrow' => 'Questions',
            'heading' => 'Before You Ask Us',
            'settings' => [
                'layout' => 'split',
                'align' => 'center',
                'theme' => 'subtle',
                'spacing' => 'lg',
                'open_first' => true,
                'exclusive' => false,
                'animation' => 'stagger',
            ],
        ]);

        foreach ($tech['faqs'] as $i => $q) {
            $this->block($faq, 'question', $i, [
                'label' => $q['q'],
                'body' => $q['a'],
                'data' => ['topic' => $q['topic'] ?? null],
            ]);
        }

        $this->closingBand($page, 4, [
            'key' => $tech['slug'],
            'heading' => $tech['close_heading'],
            'subheading' => $tech['close_body'],
            'secondary_label' => 'All Technologies',
            'secondary_url' => '/technologies',
        ]);
    }

    /**
     * The stacks we claim.
     *
     * A deliberately SHORT list. An agency page listing forty technologies is
     * read as a list of things nobody there is expert in; twelve with a real
     * opinion attached to each is read as a bench.
     *
     * @return array<int, array<string, mixed>>
     */
    protected function technologies(): array
    {
        return [
            [
                'slug' => 'laravel',
                'title' => 'Laravel',
                'icon' => 'Server',
                'accent' => 'rose',
                'excerpt' => 'Our default for business systems that need to be correct, auditable and still cheap to change in year three.',
                'heading' => 'Laravel For Systems That Have To Be Right',
                'highlight' => 'Have To Be Right',
                'intro' => 'Most of what we build on the server runs on Laravel. It is boring in the way infrastructure should be boring — well-documented, heavily tested, and staffed by a labour market that actually exists.',
                'argument_heading' => 'Why It Is Our Default',
                'argument_html' => '<p>A framework choice is a hiring decision five years out. Laravel wins that argument for most business systems for three reasons that have nothing to do with syntax.</p><ul><li><strong>The batteries are the boring ones.</strong> Queues, scheduling, migrations, authorisation, mail, storage — the parts every business system needs and nobody wants to write twice.</li><li><strong>Upgrades are survivable.</strong> A yearly major with a written upgrade path is worth more than a faster benchmark on a framework that rewrites itself.</li><li><strong>You can hire for it.</strong> The most elegant stack in the world is a liability if your next developer needs six months to be useful in it.</li></ul><p>Where it is the wrong answer, we say so: hard real-time workloads, heavy numerical computation, and anything that genuinely needs to hold a million concurrent sockets are not PHP problems.</p>',
                'uses_heading' => 'What We Build With It',
                'uses' => [
                    'Business platforms and internal systems of record',
                    'Multi-tenant SaaS with billing and role management',
                    'REST and GraphQL APIs behind web and mobile clients',
                    'Queue-driven integration between systems that must agree',
                    'Admin panels and back-office tooling',
                    'Scheduled reporting and data pipelines',
                    'Customer portals with document and payment flows',
                    'Headless CMS backends',
                ],
                'faqs' => [
                    ['q' => 'Is PHP still a serious choice in 2026?', 'a' => 'Modern PHP is a typed, JIT-compiled language with a mature ecosystem, and the version running your site is nothing like the one that earned the reputation. The honest caveat is unchanged: it is a request-response language, so genuinely real-time or compute-heavy workloads belong elsewhere and we will tell you when yours is one.', 'topic' => 'Technology'],
                    ['q' => 'Can you work on our existing Laravel app?', 'a' => 'Frequently. We start with a paid audit — version, test coverage, dependency health, the riskiest files — and give you a straight read on whether to continue, refactor or replace. Sometimes the answer is that it is fine and needs nothing.', 'topic' => 'Existing code'],
                    ['q' => 'How do you handle upgrades?', 'a' => 'Automated test coverage first, then the upgrade. Upgrading a codebase with no tests is a rewrite with extra steps, so we build the safety net before touching the framework version.', 'topic' => 'Maintenance'],
                ],
                'close_heading' => 'Bring Us The Laravel Project',
                'close_body' => 'New build, inherited codebase, or an upgrade nobody wants to start. The first conversation is the same either way.',
            ],
            [
                'slug' => 'react',
                'title' => 'React',
                'icon' => 'Code2',
                'accent' => 'teal',
                'excerpt' => 'Interfaces built as a component system your team can keep extending, not a pile of screens.',
                'heading' => 'React, Built As A System',
                'highlight' => 'As A System',
                'intro' => 'Anyone can build a React screen. The difference between a codebase that stays fast and one that calcifies is whether it was built as a component system with a real design contract behind it.',
                'argument_heading' => 'The Part Most React Projects Get Wrong',
                'argument_html' => '<p>React is a rendering library, not an architecture. Projects rarely fail because of React; they fail because nobody decided where state lives, what a component is allowed to know, or how the design system and the code stay in step.</p><p>What we insist on:</p><ul><li><strong>A component library with states.</strong> Empty, loading, partial, error and success designed for every component — the four that get improvised during a build are where a product stops feeling considered.</li><li><strong>A performance budget in CI.</strong> Speed is not added at the end; it is something you stop losing. A change that breaks the budget fails the build.</li><li><strong>Typed to the edges.</strong> Database through to props, so a renamed column is a compile error rather than a blank panel in production.</li></ul>',
                'uses_heading' => 'What We Build With It',
                'uses' => [
                    'Customer portals and self-service accounts',
                    'Operational dashboards over large datasets',
                    'Multi-step forms and application flows',
                    'Design systems and shared component libraries',
                    'Inertia and Next.js applications',
                    'Progressive web apps with offline tolerance',
                    'Embedded widgets for third-party sites',
                    'Admin interfaces on top of existing APIs',
                ],
                'faqs' => [
                    ['q' => 'React or Vue?', 'a' => 'Both are fine. The deciding factor is almost always your team: the one your developers already know beats the one we would pick on a blank sheet, because you maintain it for years after we hand over.', 'topic' => 'Technology'],
                    ['q' => 'Do you use Next.js?', 'a' => 'When server-side rendering earns its complexity — public, SEO-critical pages. For an authenticated dashboard behind a login, SSR adds infrastructure and buys nothing, and we will say so.', 'topic' => 'Technology'],
                    ['q' => 'Can you fix a React app that has got slow?', 'a' => 'Usually, and usually faster than expected. Most React performance problems are a handful of unmemoised renders and an unpaginated list, not an architectural dead end. We measure before proposing anything.', 'topic' => 'Existing code'],
                ],
                'close_heading' => 'Show Us The Interface',
                'close_body' => 'A rebuild, a rescue, or a design system your team keeps arguing about. Send it over and we will tell you what we see.',
            ],
            [
                'slug' => 'typescript',
                'title' => 'TypeScript',
                'icon' => 'FileCode',
                'accent' => 'brand',
                'excerpt' => 'Types as the contract between your API and your interface, so a rename is a build error instead of a support ticket.',
                'heading' => 'TypeScript As A Contract, Not A Linter',
                'highlight' => 'A Contract',
                'intro' => 'Half-typed codebases are worse than untyped ones: they carry the cost of annotations and none of the guarantees. We type end to end, or we do not claim the benefit.',
                'argument_heading' => 'Where Types Actually Pay',
                'argument_html' => '<p>The return on typing is not in catching typos. It is in the seam between systems — the moment an API changes shape and every consumer of it has to find out.</p><p>Typed from the database schema through the API resource to the component props, a renamed column fails the build. Untyped, it renders an empty panel in production and arrives as a support ticket three weeks later.</p><p>The settings that make this real rather than decorative are <code>strict</code>, <code>noUncheckedIndexedAccess</code> and <code>exactOptionalPropertyTypes</code>. Without them, <code>any</code> leaks through the codebase and the compiler agrees with everything.</p>',
                'uses_heading' => 'How We Apply It',
                'uses' => [
                    'Strict mode on, with no implicit any',
                    'Shared types generated from API resources',
                    'Discriminated unions for state machines',
                    'Zod or equivalent validation at every boundary',
                    'Typed forms with inferred payloads',
                    'No type assertions without a written reason',
                    'CI failing on a type error, not warning',
                    'Editor tooling configured for the whole team',
                ],
                'faqs' => [
                    ['q' => 'Can you add TypeScript to an existing JavaScript project?', 'a' => 'Yes, incrementally — file by file, strictest settings last. A big-bang conversion produces thousands of errors nobody triages and gets abandoned about a third of the way through.', 'topic' => 'Existing code'],
                    ['q' => 'Does it slow the team down?', 'a' => 'For the first fortnight, slightly. After that it is faster, because the compiler answers the questions people were asking each other in review.', 'topic' => 'Delivery'],
                ],
                'close_heading' => 'Bring Us The Codebase',
                'close_body' => 'Whether it is untyped, half-typed, or typed in name only, the first step is the same: a read of where the real boundaries are.',
            ],
            [
                'slug' => 'node-js',
                'title' => 'Node.js',
                'icon' => 'Network',
                'accent' => 'amber',
                'excerpt' => 'For real-time services, streaming and the places where one language across the stack genuinely helps.',
                'heading' => 'Node Where It Is Actually The Right Tool',
                'highlight' => 'The Right Tool',
                'intro' => 'Node earns its place for I/O-bound, connection-heavy work — sockets, streams, gateways. We reach for it deliberately rather than by default.',
                'argument_heading' => 'When We Choose It',
                'argument_html' => '<p>"One language across the stack" is a weaker argument than it sounds; the hard parts of backend work are not syntax. Node earns a place on specific shapes of problem.</p><ul><li><strong>Real-time.</strong> Live collaboration, presence, notifications — thousands of open connections doing very little each.</li><li><strong>Streaming and proxying.</strong> Gateways, file pipelines, server-sent events.</li><li><strong>Server-side rendering.</strong> Next.js and Nuxt run here because that is where the framework lives.</li></ul><p>What we do not do is put CPU-bound work on it. A single-threaded event loop doing image processing blocks every other request on the box, and the fix is a queue in something else.</p>',
                'uses_heading' => 'What We Build With It',
                'uses' => [
                    'WebSocket services for live features',
                    'API gateways and backend-for-frontend layers',
                    'Server-side rendering for public applications',
                    'Streaming file and media pipelines',
                    'Webhook receivers and event fan-out',
                    'CLI tooling for internal teams',
                    'Serverless functions for spiky workloads',
                    'Integration middleware between systems',
                ],
                'faqs' => [
                    ['q' => 'Node or Laravel for our API?', 'a' => 'Laravel unless the workload is genuinely connection-heavy or real-time. The business logic, the admin, the queue and the reporting are all cheaper to build and maintain there; Node goes in front where the sockets are.', 'topic' => 'Technology'],
                    ['q' => 'Can you run both?', 'a' => 'Often the right answer — a Laravel core with a small Node service for the real-time surface. Two runtimes is a real operational cost, so we only propose it when one of them is doing something the other genuinely cannot.', 'topic' => 'Architecture'],
                ],
                'close_heading' => 'Tell Us What Has To Be Live',
                'close_body' => 'Real-time is the requirement that most changes an architecture. Describe it and we will tell you what it actually costs.',
            ],
            [
                'slug' => 'python',
                'title' => 'Python',
                'icon' => 'Bot',
                'accent' => 'violet',
                'excerpt' => 'Data work, applied AI and automation — the places where the ecosystem is the reason to be there.',
                'heading' => 'Python For Data And Applied AI',
                'highlight' => 'Applied AI',
                'intro' => 'We use Python where its libraries are the point: retrieval pipelines, document processing, data engineering and the parts of an AI feature that are not a web request.',
                'argument_heading' => 'Where It Earns Its Place',
                'argument_html' => '<p>Python is not our default web framework and we would not pitch it as one. It is where we go when the ecosystem is the reason.</p><p>Retrieval pipelines, embeddings, document parsing, evaluation harnesses and data transformation all have mature, well-maintained Python libraries with no real equivalent elsewhere. Rewriting those in another language to keep the stack uniform is a cost with no return.</p><p>The integration pattern we prefer is a queue: the application stays where it is, and the Python service does one job behind a well-defined boundary. That keeps the operational surface small and the failure modes obvious.</p>',
                'uses_heading' => 'What We Build With It',
                'uses' => [
                    'Retrieval-augmented generation pipelines',
                    'Document parsing and structured extraction',
                    'Evaluation harnesses for AI features',
                    'ETL and data transformation jobs',
                    'Scheduled scoring and enrichment',
                    'Internal analytics tooling',
                    'Integration scripts against third-party APIs',
                    'Model serving behind an internal endpoint',
                ],
                'faqs' => [
                    ['q' => 'Do we need a data science team to use this?', 'a' => 'For applied work — retrieval, extraction, evaluation — no. It is largely software engineering. Training a model from scratch is a different discipline and a different budget, and it is rarely what a business actually needs.', 'topic' => 'Team'],
                    ['q' => 'How does it fit alongside our main application?', 'a' => 'Usually as a separate service behind a queue, so the web application stays simple and the Python side can fail, retry and scale on its own terms.', 'topic' => 'Architecture'],
                ],
                'close_heading' => 'Name The Data Problem',
                'close_body' => 'Extraction, retrieval, enrichment or reporting. Tell us the shape of it and we will tell you whether it needs Python or something simpler.',
            ],
            [
                'slug' => 'aws',
                'title' => 'AWS',
                'icon' => 'Server',
                'accent' => 'amber',
                'excerpt' => 'Infrastructure described in code, deployed automatically, and sized to what you actually use.',
                'heading' => 'AWS You Can Reason About',
                'highlight' => 'Reason About',
                'intro' => 'Most AWS bills are paying for fear — spare capacity bought as insurance against a deploy nobody trusts. We replace the fear with a pipeline.',
                'argument_heading' => 'Infrastructure As Code, Or It Did Not Happen',
                'argument_html' => '<p>An environment built by clicking through a console is an environment nobody can rebuild. It drifts from staging, it cannot be reviewed, and the person who built it becomes a dependency.</p><p>Everything we run is described in Terraform and lives in version control, which makes an infrastructure change a pull request like any other — reviewable, revertible, and identical from staging to production.</p><p>Cost follows from confidence. Teams that trust their deploy stop paying for headroom they never use, and right-sizing a service is a change you can actually make when you can see what is running.</p>',
                'uses_heading' => 'What We Set Up',
                'uses' => [
                    'Terraform-managed environments end to end',
                    'ECS or EKS for containerised workloads',
                    'RDS with automated, rehearsed backups',
                    'S3 and CloudFront for assets and delivery',
                    'CI/CD with a tested rollback path',
                    'CloudWatch alerting on symptoms, not CPU',
                    'Secrets in Secrets Manager, out of the repository',
                    'Cost breakdowns by service and environment',
                ],
                'faqs' => [
                    ['q' => 'Do we have to move to AWS?', 'a' => 'No. The practices — infrastructure as code, automated deploys, real observability — matter far more than the provider, and we work in Azure and Google Cloud too. We do not pitch migrations that have no case behind them.', 'topic' => 'Platforms'],
                    ['q' => 'Can you reduce our bill?', 'a' => 'Usually, and the first deliverable is the picture: what is running, what it costs, and where the single points of failure are. Most savings come from right-sizing and deleting the unused, not from a cheaper region.', 'topic' => 'Cost'],
                    ['q' => 'Whose account does it run in?', 'a' => 'Yours, always. We work inside your account with scoped access so there is nothing to hand back and no hostage taken.', 'topic' => 'Ownership'],
                ],
                'close_heading' => 'Send Us Your Cloud Bill',
                'close_body' => 'It is the fastest way for us to say something useful. We will read it against what you are actually running.',
            ],
            [
                'slug' => 'dotnet',
                'title' => '.NET',
                'icon' => 'Boxes',
                'accent' => 'violet',
                'excerpt' => 'For enterprise environments already invested in Microsoft, where fitting in beats starting over.',
                'heading' => '.NET Where The Enterprise Already Lives',
                'highlight' => 'Already Lives',
                'intro' => 'If your identity, your reporting and your operations team all run on Microsoft, the cheapest architecture is usually the one that fits what is already there.',
                'argument_heading' => 'Fit Beats Preference',
                'argument_html' => '<p>Introducing a second ecosystem into an organisation standardised on Microsoft has a cost that never appears in the estimate: a second set of build agents, a second identity integration, a second on-call rota, and a hiring pool your existing team is not in.</p><p>Modern .NET is fast, cross-platform and genuinely pleasant, and where an organisation already has the operational muscle for it, that is usually the right answer regardless of what we would pick on a blank sheet.</p>',
                'uses_heading' => 'What We Build With It',
                'uses' => [
                    'ASP.NET Core APIs and web applications',
                    'Integration with Active Directory and Entra ID',
                    'Line-of-business systems and internal tooling',
                    'SQL Server data access and reporting',
                    'Azure-hosted services and functions',
                    'Modernisation of legacy .NET Framework apps',
                    'Background workers and scheduled jobs',
                    'Interop with existing Microsoft estates',
                ],
                'faqs' => [
                    ['q' => 'Can you modernise an old .NET Framework application?', 'a' => 'Yes, and incrementally rather than as a rewrite. The usual route is to strangle it service by service behind a stable interface, so the business keeps running throughout.', 'topic' => 'Existing code'],
                    ['q' => 'Would you recommend .NET for a greenfield product?', 'a' => 'If your organisation already runs on Microsoft, often yes. If it does not, we would usually propose something with a cheaper operational footprint — and explain the trade rather than assert it.', 'topic' => 'Technology'],
                ],
                'close_heading' => 'Tell Us What You Already Run',
                'close_body' => 'The existing estate is usually the strongest argument in an architecture decision. Start there and we will work outwards.',
            ],
            [
                'slug' => 'react-native',
                'title' => 'React Native',
                'icon' => 'Smartphone',
                'accent' => 'ink',
                'excerpt' => 'One codebase for iOS and Android, with native modules where a platform genuinely needs them.',
                'heading' => 'Two Platforms, One Team',
                'highlight' => 'One Team',
                'intro' => 'Cross-platform is an economic decision, not a technical one. It is right when the app is mostly screens and data, and wrong when it lives or dies on graphics performance.',
                'argument_heading' => 'Where Cross-Platform Stops Being Right',
                'argument_html' => '<p>React Native covers the large majority of business apps: lists, forms, auth, notifications, camera, offline sync. One codebase, one team, both stores.</p><p>It stops being the right answer in three places, and we say so before the estimate rather than after:</p><ul><li><strong>Sustained graphics work.</strong> Games, heavy animation, real-time video processing.</li><li><strong>Deep OS integration.</strong> Widgets, watch apps, complex background behaviour.</li><li><strong>Day-one platform features.</strong> If you need whatever Apple announced last week on launch day, native gets it first.</li></ul><p>Where a single screen needs native performance, we write that screen natively and keep the rest shared. It is not all or nothing.</p>',
                'uses_heading' => 'What We Build With It',
                'uses' => [
                    'Customer apps for both stores from one codebase',
                    'Offline-first field and operations tools',
                    'Companion apps for an existing platform',
                    'Biometric authentication and secure storage',
                    'Push notification infrastructure',
                    'Deep links and share targets',
                    'Over-the-air updates for non-native changes',
                    'Native modules where a platform needs them',
                ],
                'faqs' => [
                    ['q' => 'Will it feel native?', 'a' => 'On the things users notice — scrolling, transitions, keyboard behaviour — yes, when it is built with care. We test on mid-range hardware rather than flagships, because that is what most people are actually holding.', 'topic' => 'Quality'],
                    ['q' => 'Do you handle store submission?', 'a' => 'Yes, including review rejections. Listings, screenshots, privacy declarations and the back-and-forth with review are part of the engagement.', 'topic' => 'Release'],
                ],
                'close_heading' => 'Tell Us Who Opens The App',
                'close_body' => 'And how often. That answer decides cross-platform versus native — and occasionally decides that you want a web app instead.',
            ],
        ];
    }
}

<?php

namespace Database\Seeders;

use App\Enums\Cms\PageType;
use App\Models\Page;
use Database\Seeders\Cms\CmsContentSeeder;

/**
 * `/case-studies` and the studies beneath it.
 *
 * DEMO CONTENT, AND THE RULE IS STRICTER HERE THAN ANYWHERE ELSE
 * -------------------------------------------------------------
 * A case study is a claim about a named client and a measured outcome. Every
 * one below is illustrative: the clients are described by sector rather than
 * named, no logo is attached, and every figure is invented. A fabricated
 * testimonial or an invented metric attributed to a real company is not
 * placeholder copy — it is a false statement about a third party, and it is the
 * one kind of seed content that can do legal harm if it ships.
 *
 * Replace or delete every study here before launch.
 *
 * WHY THESE ARE DATED
 * -------------------
 * `published_at` is set explicitly and descending, so the index — which sorts
 * `recent` and shows dates — has something meaningful to order by. Left to
 * default they would all share one timestamp and the ordering would be decided
 * by insertion id, which is not a decision anybody made.
 */
class CaseStudyPagesSeeder extends CmsContentSeeder
{
    public function run(): void
    {
        $index = $this->page('/case-studies', [
            'title' => 'Case Studies',
            'slug' => 'case-studies',
            'excerpt' => 'What we built, what constrained it, and what changed afterwards — with the numbers.',
            'icon' => 'Target',
            'accent' => 'brand',
            'sort_order' => 4,
        ]);

        /*
         * The seed artwork was composed for exactly these four studies — the
         * file names match the slugs. Keyed on `file_name` rather than
         * position so re-ordering the studies cannot silently pair a retail
         * screenshot with the healthcare write-up.
         */
        $art = DemoMediaSeeder::group('work')->keyBy('file_name');

        foreach ($this->studies() as $position => $study) {
            $page = $this->page('/case-studies/'.$study['slug'], [
                'title' => $study['title'],
                'slug' => $study['slug'],
                'parent_id' => $index->id,
                'excerpt' => $study['excerpt'],
                'icon' => $study['icon'],
                'accent' => $study['accent'],
                'page_type' => PageType::CASE_STUDY->value,
                'published_at' => now()->subDays(14 + ($position * 45)),
                'sort_order' => $position,
            ]);

            $media = $art->get($study['artwork']);

            // The card image on `/case-studies`, and the lead image on the
            // study itself — the same asset, so the index and the page it
            // links to cannot show two different pictures of one project.
            $this->attachCard($page, $media);
            $this->buildDetail($page, $study, $media?->id);
        }

        $this->buildIndex($index);

        /*
         * NOT 'Our Work' — that label belongs to `/work`, the portfolio.
         *
         * The two were pointed at the same page while `/work` did not exist,
         * which merged a visual portfolio and a set of long-form arguments
         * into one destination and left the homepage's portfolio band linking
         * to case studies about different projects entirely.
         */
        $this->linkMenuItems(['Case Studies' => $index, 'Our Case Studies' => $index]);
        $this->flushPageCache();
    }

    protected function buildIndex(Page $index): void
    {
        $this->clearSections($index);

        $this->section($index, 'hero.centered', 0, [
            'name' => 'Case Studies Hero',
            'eyebrow' => 'Our Work',
            'heading' => 'Projects, With The Numbers Attached',
            'subheading' => 'Each study says what the constraint was, what we built, and what measurably changed. Where a number is not ours to publish, we say that instead of rounding it up.',
            'cta_id' => $this->cta('case-studies-index-primary', [
                'label' => 'Start A Conversation',
                'url' => '/contact',
                'icon' => 'ArrowRight',
            ])->id,
            'data' => ['heading_highlight' => 'The Numbers'],
            'settings' => ['theme' => 'default', 'spacing' => 'lg', 'animation' => 'rise'],
        ]);

        $this->indexBand($index, 1, [
            'name' => 'All Case Studies',
            'anchor' => 'all-case-studies',
            'heading' => 'Selected Work',
            'highlight' => 'Selected',
            'subheading' => 'Clients are described by sector rather than named where the engagement is under NDA — which is most of them.',
            'page_type' => PageType::CASE_STUDY->value,
            'layout' => 'card',
            'columns' => 3,
            'order' => 'recent',
            'show_date' => true,
            'searchable' => true,
            'paginate' => true,
            'per_page' => 6,
            'empty_message' => 'Our case studies are being written up. Ask us for references and we will put you in touch directly.',
        ]);

        $this->closingBand($index, 2, [
            'key' => 'case-studies-index',
            'heading' => 'Want To Talk To One Of Them',
            'subheading' => 'References beat case studies. Tell us what you are weighing up and we will introduce you to a client who has been through something similar.',
            'secondary_label' => 'See All Services',
            'secondary_url' => '/services',
        ]);
    }

    protected function buildDetail(Page $page, array $study, ?int $mediaId): void
    {
        $this->clearSections($page);

        $header = $this->section($page, 'article.header', 0, [
            'name' => $study['title'].' Header',
            'eyebrow' => $study['sector'],
            'heading' => $study['heading'],
            'subheading' => $study['standfirst'],
            'media_id' => $mediaId,
            'data' => [
                'author_name' => $study['lead'],
                'author_role' => $study['lead_role'],
                'published_label' => $study['date_label'],
                'read_time' => $study['read_time'],
            ],
            'settings' => [
                'align' => 'start',
                'media_shape' => 'landscape',
                'theme' => 'default',
                'spacing' => 'default',
                'animation' => 'rise',
            ],
        ]);

        foreach ($study['tags'] as $i => $tag) {
            $this->block($header, 'tag', $i, ['label' => $tag]);
        }

        $metrics = $this->section($page, 'results.metrics', 1, [
            'name' => $study['title'].' Results',
            'anchor' => 'results',
            'eyebrow' => 'Outcome',
            'heading' => 'What Changed',
            'settings' => [
                'columns' => count($study['metrics']),
                'theme' => 'inverted',
                'spacing' => 'lg',
                'animate' => true,
                'animation' => 'stagger',
            ],
        ]);

        foreach ($study['metrics'] as $i => $metric) {
            $this->block($metrics, 'metric', $i, [
                'value' => $metric['value'],
                'label' => $metric['label'],
                'description' => $metric['note'] ?? null,
                'data' => [
                    'prefix' => $metric['prefix'] ?? null,
                    'suffix' => $metric['suffix'] ?? null,
                ],
                'settings' => ['accent' => $metric['accent']],
            ]);
        }

        // The three chapters are prose an editor writes in the rich-text
        // editor — one `content.prose` band each — rather than the structured
        // narrative type. The "what we delivered" list folds into the approach
        // body as a real `<ul>`.
        $this->proseBody($page, 2, $study['problem_html'], [
            'name' => $study['title'].' Problem',
            'anchor' => 'problem',
            'eyebrow' => 'The Problem',
            'heading' => 'Where They Started',
            'settings' => [
                'theme' => 'default',
                'spacing' => 'default',
                'animation' => 'fade',
            ],
        ]);

        $delivered = $study['delivered'] ?? [];
        $deliveredList = $delivered === []
            ? ''
            : '<h3>What we delivered</h3><ul>'
                .implode('', array_map(
                    static fn (string $item): string => '<li>'.e($item).'</li>',
                    $delivered,
                ))
                .'</ul>';

        $this->proseBody($page, 3, $study['approach_html'].$deliveredList, [
            'name' => $study['title'].' Approach',
            'anchor' => 'approach',
            'eyebrow' => 'Approach',
            'heading' => 'What We Built',
            'media_id' => $mediaId,
            'settings' => [
                'theme' => 'subtle',
                'spacing' => 'lg',
                'animation' => 'fade',
            ],
        ]);

        $this->proseBody($page, 4, $study['outcome_html'], [
            'name' => $study['title'].' Outcome',
            'anchor' => 'outcome',
            'eyebrow' => 'Outcome',
            'heading' => 'What Happened Next',
            'settings' => [
                'theme' => 'default',
                'spacing' => 'default',
                'animation' => 'fade',
            ],
        ]);

        $this->closingBand($page, 5, [
            'key' => $study['slug'],
            'heading' => 'Facing Something Similar',
            'subheading' => 'Every engagement starts the same way — a call with the engineer who would lead the work, and an honest read on whether we are the right people for it.',
            'secondary_label' => 'More Case Studies',
            'secondary_url' => '/case-studies',
        ]);
    }

    /** @return array<int, array<string, mixed>> */
    protected function studies(): array
    {
        return [
            [
                'slug' => 'settlement-platform-rebuild',
                'artwork' => 'settlement-platform.svg',
                'title' => 'Rebuilding A Settlement Platform Without A Cutover',
                'sector' => 'Financial Services',
                'icon' => 'Landmark',
                'accent' => 'brand',
                'excerpt' => 'A nightly settlement run that took six hours and could not be re-run, replaced service by service with no big-bang migration.',
                'heading' => 'Rebuilding A Settlement Platform Without A Cutover',
                'standfirst' => 'The overnight run took six hours, could not be restarted, and a failure meant a manual reconciliation the next morning. We replaced it in place, one service at a time, with the old system as the check.',
                'lead' => 'Mei Kobayashi',
                'lead_role' => 'Principal Engineer',
                'date_label' => 'February 2026',
                'read_time' => '7 min read',
                'tags' => ['Laravel', 'PostgreSQL', 'Queues', 'Financial Services'],
                'metrics' => [
                    ['value' => '6', 'suffix' => 'h → 40m', 'label' => 'Settlement run time', 'accent' => 'brand'],
                    ['value' => '0', 'label' => 'Failed cutovers', 'note' => 'The old system stayed live throughout.', 'accent' => 'teal'],
                    ['value' => '100', 'suffix' => '%', 'label' => 'Runs reconciled automatically', 'accent' => 'amber'],
                ],
                'problem_html' => '<p>The client processed settlement overnight in a single long-running job written eleven years earlier. It worked, until it did not: a failure at hour five meant restarting from the beginning, which no longer fit inside the window.</p><p>Two things made a straight rewrite unacceptable. The run was business-critical every single night, and nobody still employed could fully explain the rules encoded in it — the specification was the code.</p><h3>Why not a big-bang replacement</h3><p>The usual proposal here is a parallel build with a cutover weekend. We advised against it. A cutover assumes you can prove equivalence in advance, and with undocumented rules the only real proof is running both systems against the same input and comparing every row.</p>',
                'approach_html' => '<p>We strangled the monolith instead: each stage of the run was extracted into its own queued service, and for the first month every extracted stage ran alongside the original with the outputs compared automatically. Any disagreement stopped the migration of that stage and was investigated before continuing.</p><p>That comparison harness turned out to be the most valuable artefact of the project — it recovered the undocumented rules as executable tests.</p>',
                'delivered' => [
                    'A comparison harness running old and new in parallel',
                    'Nine settlement stages extracted into queued services',
                    'An append-only audit trail on every state change',
                    'Idempotent stages, so any single stage can be re-run',
                    'Automated reconciliation with a per-row difference report',
                    'Runbooks for each stage, written as it was extracted',
                    'Infrastructure as code, in the client\'s own AWS account',
                ],
                'outcome_html' => '<p>The run now completes in about forty minutes and any individual stage can be re-run without repeating the rest. The comparison harness stayed in place as a regression test.</p><p>The result the client valued most was not the runtime. It was that the rules are now written down as tests, so the system is no longer dependent on the memory of people who had already left.</p>',
            ],
            [
                'slug' => 'patient-portal-accessibility',
                'artwork' => 'patient-portal.svg',
                'title' => 'A Patient Portal That Passed Its Accessibility Audit',
                'sector' => 'Healthcare',
                'icon' => 'Activity',
                'accent' => 'teal',
                'excerpt' => 'An existing portal failing WCAG AA on most screens, remediated by fixing the component library rather than the pages.',
                'heading' => 'A Patient Portal That Passed Its Accessibility Audit',
                'standfirst' => 'An external audit found accessibility failures on nearly every screen. Fixing them page by page would have taken months and regressed within one release. We fixed the components instead.',
                'lead' => 'Priya Nair',
                'lead_role' => 'Platform Engineer',
                'date_label' => 'November 2025',
                'read_time' => '6 min read',
                'tags' => ['React', 'TypeScript', 'WCAG AA', 'Healthcare'],
                'metrics' => [
                    ['value' => '94', 'label' => 'Audit issues closed', 'accent' => 'teal'],
                    ['value' => '11', 'label' => 'Components changed', 'note' => 'Rather than 60+ screens.', 'accent' => 'brand'],
                    ['value' => '100', 'suffix' => '%', 'label' => 'WCAG AA on re-audit', 'accent' => 'violet'],
                ],
                'problem_html' => '<p>An independent audit returned ninety-four issues across a patient portal: contrast failures, unlabelled controls, focus traps in dialogs, and a date picker unusable by keyboard.</p><p>The client\'s first instinct was to assign the issues to screens and work through the list. We pushed back, because the audit was describing symptoms rather than causes — the same button, input and dialog were failing on every page they appeared on.</p>',
                'approach_html' => '<p>We mapped every finding back to the component that produced it. Ninety-four issues resolved to eleven components. Fixing those, and adding the states the design system had never specified, closed the majority of the audit in the first fortnight.</p><p>The remaining issues were genuinely page-specific — heading order, mostly — and were handled individually.</p>',
                'delivered' => [
                    'An audit-to-component mapping, so fixes were made once',
                    'Eleven components rebuilt with full keyboard support',
                    'Focus management for every dialog and overlay',
                    'A contrast-checked palette replacing ad-hoc colours',
                    'Automated accessibility checks in CI',
                    'Screen-reader test scripts for the core journeys',
                    'A written accessibility statement the client can stand behind',
                ],
                'outcome_html' => '<p>The portal passed re-audit at WCAG AA. More usefully, the automated checks now fail the build on a regression, so the standard is held by the pipeline rather than by whoever remembers.</p><p>The honest caveat we gave the client: automated tooling catches roughly a third of real accessibility problems. The screen-reader scripts are what covers the rest, and they need running by a person before each release.</p>',
            ],
            [
                'slug' => 'logistics-control-tower',
                'artwork' => 'logistics-control-tower.svg',
                'title' => 'One Operational Picture Across Nine Carriers',
                'sector' => 'Logistics',
                'icon' => 'Network',
                'accent' => 'amber',
                'excerpt' => 'Nine carrier feeds, three status vocabularies and a spreadsheet, replaced with a control tower built around the exception queue.',
                'heading' => 'One Operational Picture Across Nine Carriers',
                'standfirst' => 'The operations team tracked consignments across nine carrier portals and a shared spreadsheet. The spreadsheet was the only place the full picture existed, and it was maintained by hand.',
                'lead' => 'Daniel Okafor',
                'lead_role' => 'Senior Engineer',
                'date_label' => 'August 2025',
                'read_time' => '5 min read',
                'tags' => ['Laravel', 'React', 'Integrations', 'Logistics'],
                'metrics' => [
                    ['value' => '9', 'label' => 'Carrier feeds normalised', 'accent' => 'amber'],
                    ['value' => '70', 'suffix' => '%', 'label' => 'Fewer status enquiries', 'accent' => 'teal'],
                    ['value' => '1', 'label' => 'Operational picture', 'note' => 'Replacing nine portals and a spreadsheet.', 'accent' => 'brand'],
                ],
                'problem_html' => '<p>Nine carriers, nine portals, nine status vocabularies. "In transit" meant something different at three of them and nothing at all at a fourth.</p><p>The operations team reconciled this by hand into a spreadsheet each morning. It worked while volumes were low and became the constraint on growth — and it was a single point of failure attached to one person\'s working day.</p>',
                'approach_html' => '<p>The engineering was mostly translation: a normalising layer mapping every carrier\'s vocabulary onto one internal state machine, with the raw payload retained so a disputed status could always be traced to what the carrier actually said.</p><p>The interface was designed around the exception queue rather than the consignment list. Ninety percent of shipments need no attention; the tool exists for the other ten.</p>',
                'delivered' => [
                    'A normalising integration layer across nine carriers',
                    'One internal consignment state machine',
                    'Raw carrier payloads retained for dispute resolution',
                    'An exception queue with ownership and escalation',
                    'Customer-facing tracking without over-promising a time',
                    'Alerting on feeds that go quiet, not only on errors',
                ],
                'outcome_html' => '<p>The spreadsheet is gone and status enquiries to the operations desk fell by about seventy percent, mostly because customers could self-serve.</p><p>The change the team mentions first is quieter: when a carrier feed stops, they now find out from an alert rather than from a customer.</p>',
            ],
            [
                'slug' => 'retail-peak-readiness',
                'artwork' => 'retail-storefront.svg',
                'title' => 'Getting A Storefront Through Peak Without Adding Servers',
                'sector' => 'Retail & eCommerce',
                'icon' => 'Boxes',
                'accent' => 'rose',
                'excerpt' => 'A storefront that fell over at four times normal load, fixed with caching and query work rather than a bigger bill.',
                'heading' => 'Getting A Storefront Through Peak Without Adding Servers',
                'standfirst' => 'The previous peak trading day had degraded badly at roughly four times normal traffic. The proposal on the table was to triple the infrastructure. We load-tested first.',
                'lead' => 'Jonas Thorne',
                'lead_role' => 'Chief Technology Officer',
                'date_label' => 'May 2025',
                'read_time' => '6 min read',
                'tags' => ['Performance', 'Caching', 'Load Testing', 'Retail'],
                'metrics' => [
                    ['value' => '12', 'suffix' => 'x', 'label' => 'Peak load sustained', 'note' => 'Up from 4x before the work.', 'accent' => 'rose'],
                    ['value' => '31', 'suffix' => '%', 'label' => 'Lower infrastructure cost', 'accent' => 'teal'],
                    ['value' => '0', 'label' => 'Servers added', 'accent' => 'ink'],
                ],
                'problem_html' => '<p>The client had degraded badly at around four times normal traffic during the previous peak and had been quoted for three times the infrastructure to fix it.</p><p>Scaling hardware to fix a software problem works, briefly and expensively. We asked for two weeks to load-test against a realistic peak profile before anyone bought anything.</p>',
                'approach_html' => '<p>The test found three causes, none of which more servers would have solved well: an uncached category query running per request, a stock check that took a row lock on the whole product, and a synchronous call to a downstream system inside the checkout path.</p><p>Caching with correct invalidation, a narrower lock, and moving the downstream call onto a queue addressed all three.</p>',
                'delivered' => [
                    'A load-test harness modelling realistic peak traffic',
                    'Cache strategy with explicit invalidation rules',
                    'Stock reservation reworked to avoid whole-row locks',
                    'Checkout decoupled from downstream systems via a queue',
                    'A performance budget enforced in CI',
                    'A rehearsed peak-day runbook',
                ],
                'outcome_html' => '<p>The storefront now sustains roughly twelve times normal load in testing, no additional servers were bought, and right-sizing what was already running cut the monthly bill by about a third.</p><p>The general lesson, which we would give any retailer: measure before you buy. Over-provisioning is usually what a team purchases when it has no confidence in its own deploy.</p>',
            ],
        ];
    }
}

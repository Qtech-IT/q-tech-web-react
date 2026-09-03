<?php

namespace Database\Seeders;

use App\Enums\Cms\PageType;
use App\Models\Page;
use Database\Seeders\Cms\CmsContentSeeder;

/**
 * `/industries` and the sectors beneath it.
 *
 * Same shape as the technologies tree and for the same reason: the header menu
 * shipped pointing at `/healthcare`, `/logistics` and six more root-level URLs
 * that did not exist. Nesting them keeps the root namespace for pages that
 * belong there and lets the index band list its own children.
 *
 * WHY EACH PAGE LEADS WITH CONSTRAINTS, NOT CAPABILITIES
 * ------------------------------------------------------
 * Every agency's industry page says the same thing — "we understand your
 * sector" — and proves it with a logo wall. What a buyer in a regulated sector
 * is actually checking is whether you know the constraints they work under:
 * the audit trail, the retention rule, the integration nobody can turn off. So
 * each page names those first and the capabilities second.
 *
 * DEMO CONTENT: plausible and unverified. No client is named, no certification
 * is claimed, and every metric is illustrative — review before launch.
 */
class IndustryPagesSeeder extends CmsContentSeeder
{
    public function run(): void
    {
        $index = $this->page('/industries', [
            'title' => 'Industries',
            'slug' => 'industries',
            'excerpt' => 'The sectors we know well enough to argue with you about — and the constraints that shape what we build in each.',
            'icon' => 'Building2',
            'accent' => 'violet',
            'sort_order' => 3,
        ]);

        $links = [];

        foreach ($this->industries() as $position => $industry) {
            $page = $this->page('/industries/'.$industry['slug'], [
                'title' => $industry['title'],
                'slug' => $industry['slug'],
                'parent_id' => $index->id,
                'excerpt' => $industry['excerpt'],
                'icon' => $industry['icon'],
                'accent' => $industry['accent'],
                'page_type' => PageType::INDUSTRY->value,
                'sort_order' => $position,
            ]);

            $this->buildDetail($page, $industry);

            $links[$industry['title']] = $page;
        }

        $this->buildIndex($index);

        /*
         * Plus the aliases where the menu's label and the page title differ —
         * the nav says "Logistics", the page is "Logistics & Supply Chain".
         * Mapped explicitly rather than fuzzy-matched: a substring rule would
         * eventually link the wrong page with no way to see that it had.
         */
        $this->linkMenuItems($links + [
            'Logistics' => $links['Logistics & Supply Chain'],
            'Retail' => $links['Retail & eCommerce'],
            'Financial' => $links['Financial Services'],
        ]);
        $this->flushPageCache();
    }

    protected function buildIndex(Page $index): void
    {
        $this->clearSections($index);

        $this->section($index, 'hero.centered', 0, [
            'name' => 'Industries Hero',
            'eyebrow' => 'Sectors',
            'heading' => 'We Learn Your Constraints Before Your Roadmap',
            'subheading' => 'Every sector has rules that decide what can be built and how. We would rather know them on day one than discover them in a compliance review.',
            'cta_id' => $this->cta('industries-index-primary', [
                'label' => 'Talk About Your Sector',
                'url' => '/contact',
                'icon' => 'ArrowRight',
            ])->id,
            'data' => ['heading_highlight' => 'Your Constraints'],
            'settings' => ['theme' => 'default', 'spacing' => 'lg', 'animation' => 'rise'],
        ]);

        $this->indexBand($index, 1, [
            'name' => 'All Industries',
            'anchor' => 'all-industries',
            'heading' => 'Sectors We Work In',
            'highlight' => 'Sectors',
            'subheading' => 'Each page covers the constraints that shape delivery, what we typically build, and the questions worth asking before you start.',
            'page_type' => PageType::INDUSTRY->value,
            'layout' => 'icon',
            'columns' => 4,
            'empty_message' => 'Our sector pages are being written. Get in touch and we will talk you through the work we have done in yours.',
        ]);

        $this->closingBand($index, 2, [
            'key' => 'industries-index',
            'heading' => 'Your Sector Is Not On The List',
            'subheading' => 'It rarely matters as much as people expect. The constraints repeat across sectors; tell us yours and we will tell you honestly whether we have met them before.',
            'secondary_label' => 'See All Services',
            'secondary_url' => '/services',
        ]);
    }

    protected function buildDetail(Page $page, array $industry): void
    {
        $this->clearSections($page);

        $this->section($page, 'hero.split', 0, [
            'name' => $industry['title'].' Hero',
            'eyebrow' => 'Industries',
            'heading' => $industry['heading'],
            'subheading' => $industry['intro'],
            'cta_id' => $this->cta($industry['slug'].'-hero-primary', [
                'label' => 'Book A Scoping Call',
                'url' => '/contact',
                'icon' => 'ArrowRight',
            ])->id,
            'secondary_cta_id' => $this->cta($industry['slug'].'-hero-secondary', [
                'label' => 'See Our Work',
                'url' => '/case-studies',
                'variant' => 'outline',
            ])->id,
            'data' => ['heading_highlight' => $industry['highlight'] ?? null],
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

        $this->section($page, 'content.prose', 1, [
            'name' => $industry['title'].' Constraints',
            'heading' => 'What Shapes Delivery Here',
            'body' => $industry['constraints_html'],
            'settings' => [
                'measure' => 'prose',
                'align' => 'start',
                'theme' => 'default',
                'spacing' => 'default',
                'animation' => 'fade',
            ],
        ]);

        $builds = $this->section($page, 'service.grid', 2, [
            'name' => $industry['title'].' Builds',
            'anchor' => 'what-we-build',
            'eyebrow' => 'What We Build',
            'heading' => $industry['builds_heading'],
            'settings' => [
                'columns' => 3,
                'theme' => 'subtle',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ]);

        foreach ($industry['builds'] as $i => $card) {
            $this->block($builds, 'service', $i, [
                'label' => $card['label'],
                'description' => $card['description'],
                'icon' => $card['icon'],
                // `service.grid` keeps its accent in `data`, unlike most block
                // types — see `ServiceGridType`.
                'data' => ['accent' => $card['accent']],
            ]);
        }

        $faq = $this->section($page, 'faq.accordion', 3, [
            'name' => $industry['title'].' FAQ',
            'eyebrow' => 'Questions',
            'heading' => 'What Buyers In This Sector Ask',
            'settings' => [
                'layout' => 'split',
                'align' => 'center',
                'theme' => 'default',
                'spacing' => 'lg',
                'open_first' => true,
                'exclusive' => false,
                'animation' => 'stagger',
            ],
        ]);

        foreach ($industry['faqs'] as $i => $q) {
            $this->block($faq, 'question', $i, [
                'label' => $q['q'],
                'body' => $q['a'],
                'data' => ['topic' => $q['topic'] ?? null],
            ]);
        }

        $this->closingBand($page, 4, [
            'key' => $industry['slug'],
            'heading' => $industry['close_heading'],
            'subheading' => $industry['close_body'],
            'secondary_label' => 'All Industries',
            'secondary_url' => '/industries',
        ]);
    }

    /** @return array<int, array<string, mixed>> */
    protected function industries(): array
    {
        return [
            [
                'slug' => 'financial-services',
                'title' => 'Financial Services',
                'icon' => 'Landmark',
                'accent' => 'brand',
                'excerpt' => 'Systems where the audit trail is a feature, reconciliation is non-negotiable, and downtime is a regulatory event.',
                'heading' => 'Software Where Being Wrong Is Expensive',
                'highlight' => 'Being Wrong',
                'intro' => 'Financial systems are judged on correctness before speed. We build for reconciliation, auditability and the awkward day when two systems disagree about a number.',
                'constraints_html' => '<p>Three constraints shape almost every financial build, and they are decided in architecture rather than added later.</p><ul><li><strong>Every state change is evidence.</strong> An append-only audit trail with actor, timestamp and before/after state is not a nice-to-have — it is what makes a dispute resolvable.</li><li><strong>Money is not a float.</strong> Minor units in integers, explicit currency, and rounding rules written down. This is the single most common defect we find in inherited systems.</li><li><strong>Reconciliation is a first-class feature.</strong> Two systems will disagree. The question is whether you find out in a nightly job or from a customer.</li></ul><p>On top of that sit the obvious ones — encryption in transit and at rest, least-privilege access, retention rules that differ by record type, and change control that a regulator can read.</p>',
                'builds_heading' => 'What We Typically Build',
                'builds' => [
                    ['label' => 'Payment & Settlement', 'description' => 'Ledgers, settlement runs and reconciliation with a trail you can hand to an auditor without preparation.', 'icon' => 'Landmark', 'accent' => 'brand'],
                    ['label' => 'Onboarding & KYC Flows', 'description' => 'Identity, document capture and risk checks staged so a customer is never asked twice for the same thing.', 'icon' => 'ShieldCheck', 'accent' => 'ink'],
                    ['label' => 'Customer Portals', 'description' => 'Statements, documents and self-service that take load off a contact centre without weakening controls.', 'icon' => 'Users', 'accent' => 'teal'],
                    ['label' => 'Reporting & Returns', 'description' => 'Scheduled regulatory and management reporting that produces the same number twice.', 'icon' => 'Gauge', 'accent' => 'violet'],
                    ['label' => 'Core System Integration', 'description' => 'Connecting a modern front end to a core that cannot be replaced this decade, safely.', 'icon' => 'Workflow', 'accent' => 'amber'],
                    ['label' => 'Fraud & Risk Tooling', 'description' => 'Rules, scoring and review queues with a human in the loop on anything consequential.', 'icon' => 'Activity', 'accent' => 'rose'],
                ],
                'faqs' => [
                    ['q' => 'Have you worked under financial regulation before?', 'a' => 'Yes, though the honest framing is that we build to the controls your compliance team specifies rather than claiming to be your compliance function. We are good at turning a control requirement into an architecture; we are not your regulator-facing advisor.', 'topic' => 'Compliance'],
                    ['q' => 'Can you work with our existing core banking system?', 'a' => 'Usually via its API or an integration layer we build in front of it. Replacing a core is a decade-long programme and almost never the right first move — most value comes from the surfaces around it.', 'topic' => 'Integration'],
                    ['q' => 'How do you handle production access?', 'a' => 'We do not have standing production access. Access is scoped, time-boxed, logged and approved by you, and the deploy pipeline is what puts code into production — not a person with a terminal.', 'topic' => 'Security'],
                ],
                'close_heading' => 'Bring Us The Reconciliation Problem',
                'close_body' => 'The place where two systems disagree is usually where the real architecture conversation starts. Describe yours.',
            ],
            [
                'slug' => 'healthcare',
                'title' => 'Healthcare',
                'icon' => 'Activity',
                'accent' => 'teal',
                'excerpt' => 'Clinical and patient-facing systems built around privacy, access control and the reality of how care is actually delivered.',
                'heading' => 'Systems That Fit How Care Actually Works',
                'highlight' => 'Actually Works',
                'intro' => 'Healthcare software fails when it is designed for the process on paper rather than the one clinicians use at 3am. We build for the second.',
                'constraints_html' => '<p>Patient data carries the strictest handling rules of any sector we work in, and the constraints are not only technical.</p><ul><li><strong>Access is contextual.</strong> Who may see a record depends on role, care relationship and moment. A flat permission model does not survive contact with a real clinical workflow.</li><li><strong>Auditability is legally required.</strong> Every read, not only every write, may need to be logged and retained.</li><li><strong>Availability is a safety property.</strong> A system clinicians cannot reach is worse than no system, because the workaround becomes the process.</li></ul><p>The design consequence is that we spend disproportionate time on offline behaviour, failure modes and the states a screen shows when the data is incomplete — which is most of the time.</p>',
                'builds_heading' => 'What We Typically Build',
                'builds' => [
                    ['label' => 'Patient Portals', 'description' => 'Appointments, results and documents with access rules that match the care relationship, not a role name.', 'icon' => 'Users', 'accent' => 'teal'],
                    ['label' => 'Clinical Workflow Tools', 'description' => 'Triage, referral and handover built around what a clinician needs in the moment they need it.', 'icon' => 'Workflow', 'accent' => 'brand'],
                    ['label' => 'Scheduling & Capacity', 'description' => 'Booking that accounts for the constraints a real rota has, including the ones nobody wrote down.', 'icon' => 'Timer', 'accent' => 'violet'],
                    ['label' => 'Integration Layers', 'description' => 'Connecting record systems and devices that were never designed to talk to each other.', 'icon' => 'Network', 'accent' => 'ink'],
                    ['label' => 'Consent & Records Access', 'description' => 'Consent capture and subject access handled as a designed flow rather than an inbox.', 'icon' => 'ShieldCheck', 'accent' => 'amber'],
                    ['label' => 'Reporting & Audit', 'description' => 'Operational and compliance reporting that stands up to being questioned.', 'icon' => 'Gauge', 'accent' => 'rose'],
                ],
                'faqs' => [
                    ['q' => 'Can you handle patient-identifiable data?', 'a' => 'We build systems that process it under your governance, with data protection impact assessments, encryption, access control and audit designed in. We work to your information governance team, not in place of them.', 'topic' => 'Compliance'],
                    ['q' => 'Do you integrate with existing record systems?', 'a' => 'Where an interface exists, yes — including the older messaging standards. Where one does not, we are honest that an integration built on screen-scraping is a liability rather than a solution.', 'topic' => 'Integration'],
                    ['q' => 'How do you handle offline use?', 'a' => 'As a design requirement rather than a fallback. If clinicians work somewhere with unreliable connectivity, the offline path is specified in the first week, because retrofitting it means rewriting the data layer.', 'topic' => 'Design'],
                ],
                'close_heading' => 'Describe The Workflow, Not The Feature',
                'close_body' => 'Tell us what a clinician or a patient is actually trying to do and where it currently breaks. That is where useful software starts.',
            ],
            [
                'slug' => 'logistics',
                'title' => 'Logistics & Supply Chain',
                'icon' => 'Network',
                'accent' => 'amber',
                'excerpt' => 'Visibility, routing and exception handling for operations where the plan changes hourly.',
                'heading' => 'Operations Software For When The Plan Changes',
                'highlight' => 'The Plan Changes',
                'intro' => 'Logistics systems are judged on how they behave when something goes wrong, because something always does. We build for the exception, not the happy path.',
                'constraints_html' => '<p>Three things make logistics software different from most business systems.</p><ul><li><strong>The exception is the workload.</strong> Ninety percent of consignments move without intervention; the system exists for the other ten. Designing for the happy path produces a tool that nobody uses on a bad day.</li><li><strong>Connectivity is not a given.</strong> Drivers, warehouses and yards all have dead spots. Offline-first is a requirement, not a refinement.</li><li><strong>Time is contested.</strong> Multiple systems disagree about when something happened, and reconciling those timestamps is most of what a control tower does.</li></ul><p>The practical result is that we spend most of the design effort on the exception queue, the audit of who changed what, and the states a shipment can legitimately be in.</p>',
                'builds_heading' => 'What We Typically Build',
                'builds' => [
                    ['label' => 'Control Towers', 'description' => 'One operational picture across carriers and sites, with the exceptions surfaced rather than buried.', 'icon' => 'Gauge', 'accent' => 'amber'],
                    ['label' => 'Driver & Field Apps', 'description' => 'Offline-first capture for people working in vans, yards and warehouses.', 'icon' => 'Smartphone', 'accent' => 'teal'],
                    ['label' => 'Carrier Integration', 'description' => 'Booking, tracking and proof-of-delivery across carriers with different ideas about every field.', 'icon' => 'Network', 'accent' => 'ink'],
                    ['label' => 'Warehouse Tooling', 'description' => 'Picking, putaway and stock movement designed for a scanner and a glove, not a mouse.', 'icon' => 'Boxes', 'accent' => 'brand'],
                    ['label' => 'Customer Tracking', 'description' => 'Self-service visibility that reduces "where is it" calls without over-promising a time.', 'icon' => 'Search', 'accent' => 'violet'],
                    ['label' => 'Exception Workflows', 'description' => 'Queues, escalation and resolution for the consignments that did not go to plan.', 'icon' => 'Workflow', 'accent' => 'rose'],
                ],
                'faqs' => [
                    ['q' => 'Can you integrate with our carriers?', 'a' => 'Yes, and the honest expectation is that each one is its own small project — carriers differ on fields, status vocabularies and reliability. We build a normalising layer so the rest of your system sees one shape.', 'topic' => 'Integration'],
                    ['q' => 'What about ERP and WMS?', 'a' => 'We integrate rather than replace. Those systems are usually the record of truth and the right move is to build the operational surfaces around them.', 'topic' => 'Integration'],
                    ['q' => 'How do you handle poor connectivity?', 'a' => 'Offline-first with an explicit conflict policy. The hard part is not caching data — it is deciding what happens when two people changed the same consignment while both were offline, and that is a business decision we will ask you to make.', 'topic' => 'Design'],
                ],
                'close_heading' => 'Tell Us What A Bad Day Looks Like',
                'close_body' => 'The exception process is where logistics software earns or loses its keep. Describe yours and we will design from there.',
            ],
            [
                'slug' => 'retail-ecommerce',
                'title' => 'Retail & eCommerce',
                'icon' => 'Boxes',
                'accent' => 'rose',
                'excerpt' => 'Storefronts and the systems behind them, built to hold their performance through a peak trading day.',
                'heading' => 'Commerce That Survives Peak',
                'highlight' => 'Survives Peak',
                'intro' => 'A storefront is judged on two days a year. We build and load-test for those, then make sure the other 363 are cheap to run.',
                'constraints_html' => '<p>Retail systems have a load profile almost no other sector shares: long flat periods punctuated by days that are ten or twenty times normal, announced in advance.</p><p>That changes the engineering in specific ways — aggressive caching with correct invalidation, stock reservation that behaves under contention, queue-based order processing so a checkout never waits on a downstream system, and a load test against realistic peak rather than average traffic.</p><p>The second constraint is conversion. Every hundred milliseconds of latency is measurable revenue, which is why performance budgets on these builds are enforced in CI rather than reviewed at the end.</p>',
                'builds_heading' => 'What We Typically Build',
                'builds' => [
                    ['label' => 'Headless Storefronts', 'description' => 'Fast, accessible front ends over a commerce backend, with the performance budget enforced in CI.', 'icon' => 'Globe', 'accent' => 'rose'],
                    ['label' => 'Order Management', 'description' => 'Order, fulfilment and returns flows that stay consistent when a downstream system is having a bad day.', 'icon' => 'Workflow', 'accent' => 'brand'],
                    ['label' => 'Stock & Availability', 'description' => 'Reservation and availability that behave correctly under contention rather than overselling.', 'icon' => 'Boxes', 'accent' => 'amber'],
                    ['label' => 'Customer Accounts', 'description' => 'Self-service order history, returns and subscriptions that cut contact volume.', 'icon' => 'Users', 'accent' => 'teal'],
                    ['label' => 'Marketplace Integration', 'description' => 'Listings, pricing and stock kept in step across channels that all disagree slightly.', 'icon' => 'Network', 'accent' => 'violet'],
                    ['label' => 'Peak Readiness', 'description' => 'Load testing, caching strategy and a rehearsed plan for the two days that matter.', 'icon' => 'Activity', 'accent' => 'ink'],
                ],
                'faqs' => [
                    ['q' => 'Do you build on an existing commerce platform?', 'a' => 'Usually, yes. Replacing a commerce platform is rarely where the value is — most of it sits in the storefront, the operational tooling and the integrations around it.', 'topic' => 'Technology'],
                    ['q' => 'Can you get us through peak?', 'a' => 'If we are engaged with enough runway to load test and fix what it finds. Being brought in three weeks before peak trading limits us to mitigation, and we will say so rather than promise a number.', 'topic' => 'Delivery'],
                    ['q' => 'How do you approach site speed?', 'a' => 'As a budget agreed up front and enforced on every pull request. Speed is not added at the end; it is something a codebase stops losing.', 'topic' => 'Performance'],
                ],
                'close_heading' => 'Show Us The Checkout',
                'close_body' => 'It is where most commerce problems become visible. Send us the flow and the numbers and we will tell you what we see.',
            ],
            [
                'slug' => 'manufacturing',
                'title' => 'Manufacturing',
                'icon' => 'Boxes',
                'accent' => 'ink',
                'excerpt' => 'Shop-floor and planning systems built for environments where the network is unreliable and the process is physical.',
                'heading' => 'Software For The Shop Floor, Not The Office',
                'highlight' => 'The Shop Floor',
                'intro' => 'Manufacturing software gets rejected when it is designed by people who have not stood on the line. We design for gloves, noise and a network that drops.',
                'constraints_html' => '<p>The environment does most of the design work here, and ignoring it is why so much manufacturing software goes unused.</p><ul><li><strong>The interface is physical.</strong> Gloves, scanners, poor light, and a person who cannot stop what they are doing to read a paragraph. Touch targets and states matter more than density.</li><li><strong>Equipment outlives software.</strong> Machines with a twenty-year life expose interfaces that were current two decades ago. Integration is an exercise in translation.</li><li><strong>Downtime is measured in money per minute.</strong> Which makes any system in the critical path an availability problem before it is a features problem.</li></ul>',
                'builds_heading' => 'What We Typically Build',
                'builds' => [
                    ['label' => 'Production Tracking', 'description' => 'Job, batch and station tracking that a line operator can use without stopping.', 'icon' => 'Activity', 'accent' => 'ink'],
                    ['label' => 'Quality & Compliance', 'description' => 'Inspection capture and non-conformance handling with a trail that satisfies an audit.', 'icon' => 'ShieldCheck', 'accent' => 'brand'],
                    ['label' => 'Maintenance Systems', 'description' => 'Planned and reactive maintenance scheduling tied to actual equipment usage.', 'icon' => 'Timer', 'accent' => 'amber'],
                    ['label' => 'Machine Integration', 'description' => 'Reading from equipment and control systems that predate the modern web.', 'icon' => 'Network', 'accent' => 'teal'],
                    ['label' => 'Planning & Scheduling', 'description' => 'Capacity and sequencing tools that reflect the constraints a planner actually works with.', 'icon' => 'Gauge', 'accent' => 'violet'],
                    ['label' => 'Inventory & Materials', 'description' => 'Stock, consumption and replenishment tracked at the point it happens.', 'icon' => 'Boxes', 'accent' => 'rose'],
                ],
                'faqs' => [
                    ['q' => 'Can you connect to our machines?', 'a' => 'Often, through whatever interface they expose — and the first task is always a survey of what that actually is. We are cautious about promising integration with equipment before somebody has read its manual.', 'topic' => 'Integration'],
                    ['q' => 'Will it work without a reliable network?', 'a' => 'It has to, so offline behaviour is specified up front. Retrofitting it means rewriting the data layer, which is why it is never a phase two.', 'topic' => 'Design'],
                    ['q' => 'Do you integrate with our ERP?', 'a' => 'Yes, as the record of truth. We build the operational layer around it rather than duplicating what it already owns.', 'topic' => 'Integration'],
                ],
                'close_heading' => 'Walk Us Round The Floor',
                'close_body' => 'Literally, if you can. An hour watching the actual process tells us more than a week of requirements documents.',
            ],
            [
                'slug' => 'public-sector',
                'title' => 'Public Sector',
                'icon' => 'Landmark',
                'accent' => 'violet',
                'excerpt' => 'Accessible, accountable services built to standards that are checked rather than claimed.',
                'heading' => 'Services That Work For Everyone Who Needs Them',
                'highlight' => 'Everyone',
                'intro' => 'Public services cannot choose their users. Accessibility, plain language and offline routes are requirements, not enhancements — and they are audited.',
                'constraints_html' => '<p>Public sector delivery differs from commercial work in three ways that shape everything.</p><ul><li><strong>Accessibility is a legal duty, and it is tested.</strong> WCAG AA is the floor, it applies to every screen, and a published accessibility statement has to be true.</li><li><strong>The audience includes everyone.</strong> Old devices, assistive technology, low bandwidth, low digital confidence, and people using the service at the worst moment of their year.</li><li><strong>Decisions must be explainable.</strong> Anything automated that affects an outcome needs a route to a human and a record of why.</li></ul><p>We build to those from the start because retrofitting accessibility onto a finished service costs several times what building to it does and produces a worse result.</p>',
                'builds_heading' => 'What We Typically Build',
                'builds' => [
                    ['label' => 'Citizen-Facing Services', 'description' => 'Application and eligibility flows designed for people with no context and no patience for jargon.', 'icon' => 'Users', 'accent' => 'violet'],
                    ['label' => 'Case Management', 'description' => 'Caseworker tooling with a full audit trail and a clear route to human review.', 'icon' => 'Workflow', 'accent' => 'brand'],
                    ['label' => 'Accessibility Remediation', 'description' => 'Auditing an existing service against WCAG AA and fixing what the audit finds.', 'icon' => 'ShieldCheck', 'accent' => 'teal'],
                    ['label' => 'Data & Reporting', 'description' => 'Statutory and operational reporting that produces the same number twice.', 'icon' => 'Gauge', 'accent' => 'amber'],
                    ['label' => 'Legacy Modernisation', 'description' => 'Replacing a system service by service rather than as a single high-risk cutover.', 'icon' => 'Server', 'accent' => 'ink'],
                    ['label' => 'Integration', 'description' => 'Connecting departmental systems that were procured separately and never designed to meet.', 'icon' => 'Network', 'accent' => 'rose'],
                ],
                'faqs' => [
                    ['q' => 'Do you meet accessibility standards?', 'a' => 'WCAG AA on every screen, built in rather than audited on — semantic markup, keyboard paths and contrast live in the component library so every screen inherits them. We test with screen readers rather than only with automated tools, which catch about a third of real issues.', 'topic' => 'Accessibility'],
                    ['q' => 'Can you work within our procurement framework?', 'a' => 'We are used to structured procurement and to the documentation it requires. What we cannot do is promise a fixed scope for a discovery that has not happened yet, and we will say so during the process rather than after.', 'topic' => 'Commercial'],
                    ['q' => 'Who owns the code?', 'a' => 'You do, from the first commit, in your repository. Open sourcing it afterwards is your decision and we build as though you will.', 'topic' => 'Ownership'],
                ],
                'close_heading' => 'Send Us The Accessibility Audit',
                'close_body' => 'If you have one, it is the most useful document you can share. If you do not, that is usually the first thing worth doing.',
            ],
        ];
    }
}

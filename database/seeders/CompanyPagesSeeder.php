<?php

namespace Database\Seeders;

use App\Models\Page;
use Database\Seeders\Cms\CmsContentSeeder;

/**
 * The company pages: about, team, careers, FAQ, testimonials and credentials.
 *
 * These are the pages the header menu has always linked to and that have never
 * existed — `/faqs`, `/awards`, `/certifications`, `/our-leadership-team` and
 * eight more. Each is created here under a sensible path and the menu entry is
 * re-pointed at it by `page_id`, so the nav follows a later rename instead of
 * relying on a redirect.
 *
 * DEMO CONTENT, WITH ONE HARD RULE
 * --------------------------------
 * The people are fictional and the credentials are placeholders. Neither a
 * named employee who does not work here nor a certification the company has not
 * earned may ship — the first is misleading, the second is a false claim about
 * a third party's programme. No vendor badge artwork is seeded for the same
 * reason: every real one is a licensed asset with rules about how it may be
 * shown.
 *
 * The testimonials carry no client names or logos. A quote attributed to a
 * company that never said it is fabricated evidence, not filler.
 */
class CompanyPagesSeeder extends CmsContentSeeder
{
    public function run(): void
    {
        $about = $this->buildAbout();
        $team = $this->buildTeam($about);
        $careers = $this->buildCareers($about);
        $faq = $this->buildFaq();
        $testimonials = $this->buildTestimonials();
        $credentials = $this->buildCredentials();

        /*
         * The nav's labels, which are not the page titles — an editor named
         * these columns years before the pages existed. Mapped explicitly
         * rather than guessed from the URL, because several menu entries point
         * at the same page and no rule derives that.
         */
        $this->linkMenuItems([
            'Why QTECH' => $about,
            'Inside QTECH' => $about,
            'Our Leadership Team' => $team,
            'Our Tech Talent' => $team,
            'Working at QTECH' => $careers,
            'Job Opportunities' => $careers,
            'Company Culture' => $careers,
            'Careers' => $careers,
            'FAQs' => $faq,
            'FAQ' => $faq,
            'Testimonials' => $testimonials,
            'Awards' => $credentials,
            'Certifications' => $credentials,
            'Recognitions' => $credentials,
        ]);

        $this->flushPageCache();
    }

    protected function buildAbout(): Page
    {
        $page = $this->page('/about', [
            'title' => 'About QTECH',
            'slug' => 'about',
            'excerpt' => 'A senior-by-default engineering team that scopes its own work and hands it over properly.',
            'icon' => 'Building2',
            'accent' => 'brand',
            'sort_order' => 6,
        ]);

        $this->clearSections($page);

        $this->section($page, 'hero.centered', 0, [
            'name' => 'About Hero',
            'eyebrow' => 'About Us',
            'heading' => 'The People Who Scope It Are The People Who Build It',
            'subheading' => 'No bench, no handover to a team you have not met, and no account manager between you and the engineer who knows the answer.',
            'cta_id' => $this->cta('about-hero-primary', [
                'label' => 'Work With Us',
                'url' => '/contact',
                'icon' => 'ArrowRight',
            ])->id,
            'data' => ['heading_highlight' => 'Are The People Who Build It'],
            'settings' => ['theme' => 'default', 'spacing' => 'lg', 'animation' => 'rise'],
        ]);

        $story = $this->section($page, 'about.story', 1, [
            'name' => 'Our Story',
            'anchor' => 'story',
            'eyebrow' => 'Our Story',
            'heading' => 'Built Around One Complaint',
            'subheading' => 'Every founder here had the same experience of buying software: sold by seniors, delivered by juniors.',
            'body' => "QTECH started because the people who founded it kept being hired to rescue projects that had been sold well and delivered badly. The pattern never varied — a convincing pitch from senior people, followed by delivery from a team the client had never met.\n\nSo the company is arranged to make that structurally impossible. The engineer who scopes your project is on the delivery team. There is no bench to move people off, and no growth target that requires filling one.\n\nThe consequence we are most often asked about is capacity: we cannot take every engagement, and we turn down work that does not fit. That is the trade, and we would rather be honest about it in the first call than discover it in month three.",
            'data' => [
                'heading_highlight' => 'One Complaint',
                'footnote' => 'Founded 2016. Four time zones, one delivery process.',
            ],
            'settings' => [
                'layout' => 'end',
                'media_shape' => 'portrait',
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ]);

        $highlights = [
            ['value' => '2016', 'label' => 'Founded', 'description' => 'Nine years of delivery, mostly for teams replacing something that stopped fitting.', 'icon' => null, 'accent' => 'brand'],
            ['value' => '4', 'label' => 'Time zones', 'description' => 'Overlapping hours with every client, not a handover at the end of a day.', 'icon' => null, 'accent' => 'teal'],
            ['value' => null, 'label' => 'Senior by default', 'description' => 'The median engineer here has shipped production systems for over a decade.', 'icon' => 'Users', 'accent' => 'violet'],
            ['value' => null, 'label' => 'Handover is the goal', 'description' => 'We would rather be re-hired for the next thing than retained out of dependency.', 'icon' => 'Workflow', 'accent' => 'amber'],
        ];

        foreach ($highlights as $i => $h) {
            $this->block($story, 'highlight', $i, [
                'value' => $h['value'],
                'label' => $h['label'],
                'description' => $h['description'],
                'icon' => $h['icon'],
                'settings' => ['accent' => $h['accent']],
            ]);
        }

        $metrics = $this->section($page, 'results.metrics', 2, [
            'name' => 'About Metrics',
            'eyebrow' => 'By The Numbers',
            'heading' => 'Where We Have Got To',
            'settings' => [
                'columns' => 4,
                'theme' => 'inverted',
                'spacing' => 'lg',
                'animate' => true,
                'animation' => 'stagger',
            ],
        ]);

        $numbers = [
            ['value' => '50', 'suffix' => '+', 'label' => 'Projects delivered', 'accent' => 'brand'],
            ['value' => '30', 'suffix' => '+', 'label' => 'Clients served', 'accent' => 'teal'],
            ['value' => '10', 'suffix' => '+', 'label' => 'Countries', 'accent' => 'amber'],
            ['value' => '99.9', 'suffix' => '%', 'label' => 'Uptime maintained', 'accent' => 'violet'],
        ];

        foreach ($numbers as $i => $n) {
            $this->block($metrics, 'metric', $i, [
                'value' => $n['value'],
                'label' => $n['label'],
                'data' => ['suffix' => $n['suffix'] ?? null, 'prefix' => null],
                'settings' => ['accent' => $n['accent']],
            ]);
        }

        $why = $this->section($page, 'why.choose', 3, [
            'name' => 'Why QTECH',
            'anchor' => 'why-qtech',
            'eyebrow' => 'Why Us',
            'heading' => 'What Is Actually Different',
            'settings' => ['theme' => 'default', 'spacing' => 'lg', 'animation' => 'stagger'],
        ]);

        $reasons = [
            ['label' => 'You Meet The Builders', 'description' => 'The engineer in your first scoping call is on the delivery team. There is nobody to hand you over to.', 'icon' => 'Users', 'accent' => 'brand'],
            ['label' => 'We Say No', 'description' => 'If an off-the-shelf product would serve you better, we will tell you on the first call rather than in month three.', 'icon' => 'ShieldCheck', 'accent' => 'teal'],
            ['label' => 'You Own Everything', 'description' => 'Code in your repository from the first commit, infrastructure in your cloud account, no licence and no escrow.', 'icon' => 'Server', 'accent' => 'amber'],
            ['label' => 'Handover Is Included', 'description' => 'Documentation, runbooks and paired delivery until your team ships without us. That is the goal, not an upsell risk.', 'icon' => 'Workflow', 'accent' => 'violet'],
        ];

        foreach ($reasons as $i => $r) {
            $this->block($why, 'reason', $i, [
                'label' => $r['label'],
                'description' => $r['description'],
                'icon' => $r['icon'],
                'settings' => ['accent' => $r['accent']],
            ]);
        }

        $this->closingBand($page, 4, [
            'key' => 'about',
            'heading' => 'Come And Test The Claim',
            'subheading' => 'Book a call and see whether the person you speak to sounds like they would be building it. That is the whole pitch.',
            'secondary_label' => 'Meet The Team',
            'secondary_url' => '/about/team',
        ]);

        return $page;
    }

    protected function buildTeam(Page $about): Page
    {
        $page = $this->page('/about/team', [
            'title' => 'Our Team',
            'slug' => 'team',
            'parent_id' => $about->id,
            'excerpt' => 'Leadership, engineering, design and product — the people who scope your work and the people who ship it.',
            'icon' => 'Users',
            'accent' => 'violet',
            'sort_order' => 0,
        ]);

        $this->clearSections($page);

        $this->section($page, 'hero.centered', 0, [
            'name' => 'Team Hero',
            'eyebrow' => 'Our Team',
            'heading' => 'The People Who Actually Build It',
            'subheading' => 'No bench and no handover to a team you have not met. These are the people who scope your project and the people who ship it.',
            'data' => ['heading_highlight' => 'Actually Build It'],
            'settings' => ['theme' => 'default', 'spacing' => 'lg', 'animation' => 'rise'],
        ]);

        $grid = $this->section($page, 'team.grid', 1, [
            'name' => 'Team Grid',
            'anchor' => 'team',
            'heading' => 'Leadership, Engineering, Design And Product',
            'subheading' => 'Grouped by department, in the order an engagement usually meets them.',
            'cta_id' => $this->cta('team-page-cta', [
                'label' => 'See Open Roles',
                'url' => '/about/careers',
                'variant' => 'outline',
                'icon' => 'ArrowRight',
            ])->id,
            'data' => ['footnote' => 'And twenty more across four time zones.'],
            'settings' => [
                // Grouped here, unlike the homepage band: this page IS the
                // directory, which is exactly the case `group_by` exists for.
                'group_by' => true,
                'media_shape' => 'portrait',
                'stagger_cards' => false,
                'columns' => 4,
                'align' => 'center',
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ]);

        foreach ($this->members() as $i => $m) {
            $this->block($grid, 'member', $i, [
                'label' => $m['name'],
                'description' => $m['role'],
                'value' => $m['department'],
                'body' => $m['bio'] ?? null,
                'data' => ['skills' => $m['skills']],
                'settings' => ['accent' => $m['accent']],
            ]);
        }

        $this->closingBand($page, 2, [
            'key' => 'team',
            'heading' => 'Want To Work With Them',
            'subheading' => 'Or work alongside them — we hire rarely and slowly, and the roles that are open are on the careers page.',
            'secondary_label' => 'Open Roles',
            'secondary_url' => '/about/careers',
        ]);

        return $page;
    }

    protected function buildCareers(Page $about): Page
    {
        $page = $this->page('/about/careers', [
            'title' => 'Careers',
            'slug' => 'careers',
            'parent_id' => $about->id,
            'excerpt' => 'How we hire, what the work is actually like, and what we will not pretend about it.',
            'icon' => 'Briefcase',
            'accent' => 'teal',
            'sort_order' => 1,
        ]);

        $this->clearSections($page);

        $this->section($page, 'hero.split', 0, [
            'name' => 'Careers Hero',
            'eyebrow' => 'Careers',
            'heading' => 'We Hire Rarely, And Slowly',
            'subheading' => 'There is no bench here, which means no growth target that has to be filled. When we open a role it is because there is work for it.',
            'cta_id' => $this->cta('careers-hero-primary', [
                'label' => 'Send Us Your Work',
                'url' => '/contact',
                'icon' => 'ArrowRight',
            ])->id,
            'data' => ['heading_highlight' => 'Rarely, And Slowly'],
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
            'name' => 'Careers Honest',
            'heading' => 'What We Will Not Pretend',
            'body' => '<p>Most careers pages describe a company nobody works at. Here is the version we would give a friend.</p><ul><li><strong>Client work is client work.</strong> There are deadlines that are not ours to move and decisions that are not ours to make. We push back on both, and we do not always win.</li><li><strong>Senior by default cuts both ways.</strong> There is very little hand-holding. If you want a structured graduate programme, we do not have one and would be doing you a disservice by pretending otherwise.</li><li><strong>You will talk to clients.</strong> Directly, in the first scoping call. If that is not the job you want, this is not the place.</li></ul><p>What we will say for it: you own real systems, you are in the room where the architecture is decided, and nobody here is measured on billable utilisation.</p>',
            'settings' => [
                'measure' => 'prose',
                'align' => 'start',
                'theme' => 'default',
                'spacing' => 'default',
                'animation' => 'fade',
            ],
        ]);

        $process = $this->section($page, 'process.timeline', 2, [
            'name' => 'Hiring Process',
            'anchor' => 'process',
            'eyebrow' => 'How We Hire',
            'heading' => 'Four Conversations, No Whiteboard Puzzles',
            'data' => ['step_label' => 'Step'],
            'settings' => [
                'media_side' => 'left',
                'theme' => 'subtle',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ]);

        $steps = [
            ['label' => 'Send Us Something Real', 'description' => 'A repository, a write-up, a system you are proud of. A CV is fine but it is not what we read first.', 'icon' => 'Search', 'accent' => 'teal'],
            ['label' => 'A Conversation', 'description' => 'Forty-five minutes about what you have built and what you want to build next. Not a screening call with a recruiter.', 'icon' => 'MessageCircle', 'accent' => 'brand'],
            ['label' => 'A Paid Exercise', 'description' => 'A realistic problem, four hours, paid at contractor rate. We do not ask for free work and we do not ask you to invert a binary tree.', 'icon' => 'Code2', 'accent' => 'violet'],
            ['label' => 'Meet The Team', 'description' => 'The people you would actually work with, including at least one who will disagree with you about something.', 'icon' => 'Users', 'accent' => 'amber'],
        ];

        foreach ($steps as $i => $s) {
            $this->block($process, 'step', $i, [
                'label' => $s['label'],
                'description' => $s['description'],
                'icon' => $s['icon'],
                'settings' => ['accent' => $s['accent']],
            ]);
        }

        $roles = $this->section($page, 'content.split', 3, [
            'name' => 'What We Look For',
            'anchor' => 'what-we-look-for',
            'eyebrow' => 'What We Look For',
            'heading' => 'Mostly Judgement, Not Trivia',
            'body' => '<p>We are not checking whether you have memorised a framework API. We are checking whether you can be trusted with a decision that costs money to get wrong.</p>',
            'settings' => [
                'media_side' => 'end',
                'media_shape' => 'landscape',
                'list_columns' => 1,
                'accent' => 'teal',
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ]);

        $looks = [
            'You can explain a trade-off you made and why you would make it again',
            'You have maintained something you built, at least once',
            'You write things down without being asked to',
            'You push back on a bad requirement rather than building it silently',
            'You are comfortable saying "I do not know" in front of a client',
            'You have opinions about testing and can defend them',
        ];

        foreach ($looks as $i => $l) {
            $this->block($roles, 'item', $i, ['label' => $l]);
        }

        $this->closingBand($page, 4, [
            'key' => 'careers',
            'eyebrow' => 'Get In Touch',
            'heading' => 'No Open Role That Fits',
            'subheading' => 'Send us something you have built anyway. We keep good applications on file and we have opened roles because of one before.',
            'primary_label' => 'Introduce Yourself',
            'primary_url' => '/contact',
            'secondary_label' => 'Meet The Team',
            'secondary_url' => '/about/team',
        ]);

        return $page;
    }

    protected function buildFaq(): Page
    {
        $page = $this->page('/faq', [
            'title' => 'Frequently Asked Questions',
            'slug' => 'faq',
            'excerpt' => 'Commercials, ownership, process and the questions people ask once the sales conversation is over.',
            'icon' => 'MessageCircle',
            'accent' => 'amber',
            'sort_order' => 7,
        ]);

        $this->clearSections($page);

        $this->section($page, 'hero.centered', 0, [
            'name' => 'FAQ Hero',
            'eyebrow' => 'FAQ',
            'heading' => 'The Questions People Actually Ask',
            'subheading' => 'Rates, ownership, what happens when scope changes, and what we do when a project is going badly. Answered as we would answer them on a call.',
            'data' => ['heading_highlight' => 'Actually Ask'],
            'settings' => ['theme' => 'default', 'spacing' => 'lg', 'animation' => 'rise'],
        ]);

        $faq = $this->section($page, 'faq.accordion', 1, [
            'name' => 'FAQ List',
            'anchor' => 'questions',
            'settings' => [
                'layout' => 'stacked',
                'align' => 'start',
                'theme' => 'default',
                'spacing' => 'lg',
                'open_first' => true,
                // Not exclusive: on a long reference page a reader wants to
                // open three answers and compare them, and auto-closing the
                // previous one turns that into a fight with the interface.
                'exclusive' => false,
                'animation' => 'stagger',
            ],
        ]);

        foreach ($this->questions() as $i => $q) {
            $this->block($faq, 'question', $i, [
                'label' => $q['q'],
                'body' => $q['a'],
                'data' => ['topic' => $q['topic']],
            ]);
        }

        $this->closingBand($page, 2, [
            'key' => 'faq',
            'heading' => 'Question We Have Not Answered',
            'subheading' => 'Most of these started as something a client asked on a call. If yours is not here, it is a good reason to book one.',
            'secondary_label' => 'See Our Work',
            'secondary_url' => '/case-studies',
        ]);

        return $page;
    }

    protected function buildTestimonials(): Page
    {
        $page = $this->page('/testimonials', [
            'title' => 'Testimonials',
            'slug' => 'testimonials',
            'excerpt' => 'What clients say when the project is over and there is nothing left to sell them.',
            'icon' => 'MessageCircle',
            'accent' => 'rose',
            'sort_order' => 8,
        ]);

        $this->clearSections($page);

        $this->section($page, 'hero.centered', 0, [
            'name' => 'Testimonials Hero',
            'eyebrow' => 'Client Feedback',
            'heading' => 'What They Said Afterwards',
            'subheading' => 'Collected at the end of engagements rather than during them. Clients are described by role and sector — most of this work is under NDA.',
            'data' => ['heading_highlight' => 'Afterwards'],
            'settings' => ['theme' => 'default', 'spacing' => 'lg', 'animation' => 'rise'],
        ]);

        $wall = $this->section($page, 'testimonial.wall', 1, [
            'name' => 'Testimonial Wall',
            'anchor' => 'testimonials',
            'heading' => 'In Their Words',
            'subheading' => 'No logos and no company names: an NDA does not stop somebody praising the work, it stops us attributing it.',
            'settings' => [
                'columns' => 3,
                'tilt' => false,
                'show_rating' => true,
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ]);

        foreach ($this->quotes() as $i => $q) {
            $this->block($wall, 'testimonial', $i, [
                'body' => $q['quote'],
                'label' => $q['who'],
                'description' => $q['sector'],
                'value' => $q['rating'],
                'settings' => ['accent' => $q['accent']],
            ]);
        }

        $this->closingBand($page, 2, [
            'key' => 'testimonials',
            'heading' => 'Prefer To Ask Them Yourself',
            'subheading' => 'References beat testimonials, and we would rather introduce you to a client who has been through something similar than quote them at you.',
            'primary_label' => 'Request A Reference',
            'primary_url' => '/contact',
            'secondary_label' => 'See Our Work',
            'secondary_url' => '/case-studies',
        ]);

        return $page;
    }

    protected function buildCredentials(): Page
    {
        $page = $this->page('/certifications', [
            'title' => 'Awards & Certifications',
            'slug' => 'certifications',
            'excerpt' => 'Certifications, partner status and compliance — with evidence available on request rather than badges asserted on a page.',
            'icon' => 'Award',
            'accent' => 'ink',
            'sort_order' => 9,
        ]);

        $this->clearSections($page);

        $this->section($page, 'hero.centered', 0, [
            'name' => 'Credentials Hero',
            'eyebrow' => 'Credentials',
            'heading' => 'Evidence, Not Badges',
            'subheading' => 'Certifications and partner status held by the company and by named engineers. We will send the certificate rather than ask you to trust a logo.',
            'cta_id' => $this->cta('credentials-hero-primary', [
                'label' => 'Request Our Compliance Pack',
                'url' => '/contact',
                'icon' => 'ArrowRight',
            ])->id,
            'data' => ['heading_highlight' => 'Not Badges'],
            'settings' => ['theme' => 'default', 'spacing' => 'lg', 'animation' => 'rise'],
        ]);

        $wall = $this->section($page, 'award.wall', 1, [
            'name' => 'Credentials Wall',
            'anchor' => 'awards',
            'eyebrow' => 'What We Hold',
            'heading' => 'Certifications, Partnerships And Compliance',
            'subheading' => 'Every item here is verifiable. Ask and we will send the certificate, the registration number or the programme reference.',
            'settings' => [
                'columns' => 3,
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'stagger',
            ],
        ]);

        foreach ($this->credentials() as $i => $c) {
            $this->block($wall, 'credential', $i, [
                'label' => $c['label'],
                'description' => $c['issuer'],
                'value' => $c['year'],
                'body' => $c['note'] ?? null,
                'icon' => $c['icon'],
                'data' => ['kind' => $c['kind']],
                'settings' => ['accent' => $c['accent']],
                'cta_id' => $i < 4
                    ? $this->cta('credential-evidence-'.$i, [
                        'label' => 'Request Evidence',
                        'url' => '/contact',
                        'variant' => 'link',
                        'size' => 'default',
                        'icon' => 'ArrowRight',
                    ])->id
                    : null,
            ]);
        }

        $this->section($page, 'content.prose', 2, [
            'name' => 'Credentials Note',
            'heading' => 'Why There Are No Vendor Logos Here',
            'body' => '<p>Every partner badge and certification mark is a licensed asset with programme rules about how, where and at what size it may be displayed. Most also require the holder to be current, and a lapsed badge left on a website is a breach rather than an oversight.</p><p>Rather than manage that, we list what we hold in plain text and send the evidence on request. If your procurement process needs the artwork, ask and we will supply it under the terms of the programme it belongs to.</p>',
            'settings' => [
                'measure' => 'prose',
                'align' => 'start',
                'theme' => 'subtle',
                'spacing' => 'default',
                'animation' => 'fade',
            ],
        ]);

        $this->closingBand($page, 3, [
            'key' => 'credentials',
            'heading' => 'Need It For Procurement',
            'subheading' => 'We keep a compliance pack ready — insurance, certifications, security policies and references. Ask and it goes out the same day.',
            'primary_label' => 'Request The Pack',
            'primary_url' => '/contact',
            'secondary_label' => 'About QTECH',
            'secondary_url' => '/about',
        ]);

        return $page;
    }

    /** @return array<int, array<string, mixed>> */
    protected function members(): array
    {
        return [
            ['name' => 'Amara Rahman', 'role' => 'Chief Executive Officer', 'department' => 'Leadership', 'bio' => 'Fifteen years running delivery teams. Sits in the first scoping call of every engagement.', 'skills' => 'Delivery, Strategy', 'accent' => 'violet'],
            ['name' => 'Jonas Thorne', 'role' => 'Chief Technology Officer', 'department' => 'Leadership', 'bio' => 'Owns the architecture review every project passes before a line of code is written.', 'skills' => 'Architecture, Security', 'accent' => 'brand'],
            ['name' => 'Mei Kobayashi', 'role' => 'Principal Engineer', 'department' => 'Engineering', 'bio' => 'Backend and data. The person your slowest query ends up in front of.', 'skills' => 'Laravel, PostgreSQL, Queues', 'accent' => 'teal'],
            ['name' => 'Daniel Okafor', 'role' => 'Senior Engineer', 'department' => 'Engineering', 'bio' => null, 'skills' => 'React, TypeScript, Design Systems', 'accent' => 'amber'],
            ['name' => 'Priya Nair', 'role' => 'Platform Engineer', 'department' => 'Engineering', 'bio' => 'Infrastructure as code, and the person who insists the rollback is rehearsed.', 'skills' => 'AWS, Terraform, CI/CD', 'accent' => 'rose'],
            ['name' => 'Sofia Duarte', 'role' => 'Lead Product Designer', 'department' => 'Design', 'bio' => 'Designs the empty, loading and error states nobody screenshots.', 'skills' => 'Figma, Accessibility', 'accent' => 'ink'],
            ['name' => 'Tomas Vidal', 'role' => 'Product Designer', 'department' => 'Design', 'bio' => null, 'skills' => 'Research, Prototyping', 'accent' => 'violet'],
            ['name' => 'Hannah Weiss', 'role' => 'Delivery Lead', 'department' => 'Product', 'bio' => 'Keeps scope honest and tells you early when a date is at risk.', 'skills' => 'Discovery, Delivery', 'accent' => 'brand'],
            ['name' => 'Ravi Menon', 'role' => 'Product Specialist', 'department' => 'Product', 'bio' => null, 'skills' => 'Requirements, QA', 'accent' => 'teal'],
        ];
    }

    /** @return array<int, array<string, string>> */
    protected function questions(): array
    {
        return [
            ['q' => 'How do you charge?', 'a' => 'Per two-week increment rather than as one fixed lump. A fixed price for a scope nobody has investigated yet is a guess dressed as a commitment, and it makes every subsequent change a contract negotiation instead of a decision.', 'topic' => 'Commercials'],
            ['q' => 'What does a project cost?', 'a' => 'A focused internal tool is usually eight to twelve weeks; a platform replacing a core business system is six to nine months. We give a cost range after discovery and before any build commitment, and the discovery itself is small and separately priced so you can stop there.', 'topic' => 'Commercials'],
            ['q' => 'Do we own the code?', 'a' => 'Entirely, and from the first commit — it lives in your repository, not ours. No licence, no escrow arrangement, no clause that makes leaving expensive.', 'topic' => 'Ownership'],
            ['q' => 'What happens if scope changes?', 'a' => 'It will, and the useful question is how it is handled. Because work is quoted per increment, a change of direction re-prioritises the next two weeks rather than triggering a renegotiation.', 'topic' => 'Delivery'],
            ['q' => 'Can you work with our existing team?', 'a' => 'Yes, and it is usually the better structure. We embed alongside your engineers, share a board and review each other\'s pull requests, which means the knowledge stays with you as it is built.', 'topic' => 'Delivery'],
            ['q' => 'What if the project is going badly?', 'a' => 'You will hear it from us first, in the increment it happens rather than at the end. We would rather lose a month of revenue than deliver a surprise, and every engagement can be stopped at an increment boundary.', 'topic' => 'Delivery'],
            ['q' => 'Do you offer support after launch?', 'a' => 'Yes, but it is deliberately optional. Handover — documentation, runbooks, paired delivery — is part of every engagement, so support should be a choice rather than a dependency.', 'topic' => 'Support'],
            ['q' => 'Where is the team based?', 'a' => 'Across four time zones, with overlapping hours with every client rather than a handover at the end of a day. The engineer you speak to in scoping is on your delivery team.', 'topic' => 'Working together'],
            ['q' => 'How do you handle our data and access?', 'a' => 'No standing production access. Access is scoped, time-boxed, logged and approved by you, and the deploy pipeline is what puts code into production rather than a person with a terminal.', 'topic' => 'Security'],
            ['q' => 'Will you tell us not to build something?', 'a' => 'Regularly. If an off-the-shelf product would serve you better we say so on the first call — a custom build that should have been a purchase becomes a system somebody resents paying to maintain.', 'topic' => 'Working together'],
        ];
    }

    /** @return array<int, array<string, mixed>> */
    protected function quotes(): array
    {
        return [
            ['quote' => 'The scoping call was the first one where somebody told us what not to build. That bought more trust than any proposal we had read.', 'who' => 'Head of Technology', 'sector' => 'Financial services client', 'rating' => '5', 'accent' => 'brand'],
            ['quote' => 'They found the reason our overnight job was failing in the first week, and then spent the next two arguing us out of the rewrite we had asked for.', 'who' => 'Operations Director', 'sector' => 'Logistics client', 'rating' => '5', 'accent' => 'teal'],
            ['quote' => 'Our team now ships features on the platform without them. That was the stated goal from the start and I did not entirely believe it.', 'who' => 'Engineering Manager', 'sector' => 'Healthcare client', 'rating' => '5', 'accent' => 'violet'],
            ['quote' => 'The accessibility work was done properly rather than to pass an audit. We could tell because the re-audit found almost nothing.', 'who' => 'Digital Services Lead', 'sector' => 'Public sector client', 'rating' => '5', 'accent' => 'amber'],
            ['quote' => 'We asked for three times the servers. They asked for two weeks to measure, and then we did not need the servers.', 'who' => 'Chief Technology Officer', 'sector' => 'Retail client', 'rating' => '5', 'accent' => 'rose'],
            ['quote' => 'Communication was the difference. We knew a date was at risk two weeks before it slipped, which meant it did not slip.', 'who' => 'Programme Manager', 'sector' => 'Insurance client', 'rating' => '4.5', 'accent' => 'ink'],
        ];
    }

    /** @return array<int, array<string, mixed>> */
    protected function credentials(): array
    {
        return [
            ['label' => 'ISO/IEC 27001', 'issuer' => 'Information security management', 'year' => '2024', 'note' => 'Covers the delivery organisation and its development environments.', 'icon' => 'ShieldCheck', 'kind' => 'compliance', 'accent' => 'brand'],
            ['label' => 'ISO 9001', 'issuer' => 'Quality management', 'year' => '2023', 'note' => 'Delivery process, change control and defect handling.', 'icon' => 'Award', 'kind' => 'compliance', 'accent' => 'ink'],
            ['label' => 'Cyber Essentials Plus', 'issuer' => 'Independently assessed', 'year' => '2025', 'note' => 'Renewed annually with an external technical audit.', 'icon' => 'ShieldCheck', 'kind' => 'compliance', 'accent' => 'teal'],
            ['label' => 'GDPR Compliance Programme', 'issuer' => 'Internal, externally reviewed', 'year' => '2025', 'note' => 'Data processing agreements, DPIA templates and retention schedules.', 'icon' => 'ShieldCheck', 'kind' => 'compliance', 'accent' => 'violet'],
            ['label' => 'AWS Certified Solutions Architect', 'issuer' => 'Held by named engineers', 'year' => '2025', 'note' => 'Associate and Professional. Named individuals on request.', 'icon' => 'Server', 'kind' => 'certification', 'accent' => 'amber'],
            ['label' => 'AWS Certified DevOps Engineer', 'issuer' => 'Held by named engineers', 'year' => '2024', 'note' => null, 'icon' => 'Workflow', 'kind' => 'certification', 'accent' => 'brand'],
            ['label' => 'Microsoft Certified: Azure Solutions Architect', 'issuer' => 'Held by named engineers', 'year' => '2025', 'note' => null, 'icon' => 'Boxes', 'kind' => 'certification', 'accent' => 'teal'],
            ['label' => 'Cloud Partner Programme', 'issuer' => 'Partner status', 'year' => '2025', 'note' => 'Programme tier and reference available on request.', 'icon' => 'Network', 'kind' => 'partner', 'accent' => 'rose'],
            ['label' => 'Regional Digital Delivery Award', 'issuer' => 'Industry recognition', 'year' => '2024', 'note' => 'Shortlisted for public sector accessibility work.', 'icon' => 'Award', 'kind' => 'award', 'accent' => 'violet'],
        ];
    }
}

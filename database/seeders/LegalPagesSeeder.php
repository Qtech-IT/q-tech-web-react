<?php

namespace Database\Seeders;

use App\Enums\Cms\PageType;
use App\Models\Page;
use Database\Seeders\Cms\CmsContentSeeder;

/**
 * The policy pages: privacy, terms, cookies and accessibility.
 *
 * THESE ARE TEMPLATES, NOT LEGAL ADVICE — AND THAT IS NOT BOILERPLATE
 * ------------------------------------------------------------------
 * Every page here is a structurally complete, honestly-worded draft with the
 * company-specific facts left as bracketed placeholders. It is deliberately NOT
 * a finished policy, because a privacy notice that describes processing the
 * company does not do is worse than none: it is an inaccurate statement to data
 * subjects and a regulator reads it as the company's own account of itself.
 *
 * Each page therefore carries a visible editor's note at the top listing what
 * must be filled in. Removing that note is the last step before publishing, and
 * it is a step somebody has to take deliberately.
 *
 * ROOT-LEVEL PATHS, unlike services and technologies. Policy URLs are
 * referenced from cookie banners, email footers, app stores and contracts, and
 * they are expected in a conventional place. `/privacy-policy` is what people
 * link to; `/legal/privacy-policy` is a redirect waiting to happen.
 *
 * `PublicLayout` finds the cookie policy by matching 'cookie' then 'privacy' in
 * the footer's legal links, so those two slugs are load-bearing.
 */
class LegalPagesSeeder extends CmsContentSeeder
{
    /**
     * The banner every page opens with.
     *
     * Rendered as real content rather than a code comment so it is impossible
     * to publish these without seeing it.
     */
    private const EDITOR_NOTE = '<blockquote><p><strong>Editor’s note — remove before publishing.</strong> This is a structural template, not legal advice. Replace every bracketed placeholder, have the result reviewed by a qualified adviser in your jurisdiction, and delete this note. A policy that describes processing the company does not actually do is inaccurate rather than merely incomplete.</p></blockquote>';

    public function run(): void
    {
        $pages = [];

        foreach ($this->policies() as $position => $policy) {
            $page = $this->page('/'.$policy['slug'], [
                'title' => $policy['title'],
                'slug' => $policy['slug'],
                'excerpt' => $policy['excerpt'],
                'icon' => $policy['icon'],
                'accent' => 'ink',
                'page_type' => PageType::LEGAL->value,
                // Policies are reference documents, not marketing pages. They
                // stay indexable — people search for them — but they are not
                // something the site should be promoting.
                'sort_order' => 90 + $position,
            ]);

            $this->buildPolicy($page, $policy);

            $pages[$policy['title']] = $page;
        }

        $this->linkMenuItems($pages + [
            'Privacy' => $pages['Privacy Policy'],
            'Privacy Policy' => $pages['Privacy Policy'],
            'Terms' => $pages['Terms of Service'],
            'Terms of Service' => $pages['Terms of Service'],
            'Cookies' => $pages['Cookie Policy'],
            'Cookie Policy' => $pages['Cookie Policy'],
            'Accessibility' => $pages['Accessibility Statement'],
        ]);

        $this->flushPageCache();
    }

    protected function buildPolicy(Page $page, array $policy): void
    {
        $this->clearSections($page);

        $this->section($page, 'article.header', 0, [
            'name' => $policy['title'].' Header',
            'eyebrow' => 'Legal',
            'heading' => $policy['title'],
            'subheading' => $policy['standfirst'],
            'data' => [
                'published_label' => 'Last updated [DATE]',
                'read_time' => $policy['read_time'],
            ],
            'settings' => [
                'align' => 'start',
                'media_shape' => 'landscape',
                'theme' => 'subtle',
                'spacing' => 'default',
                'animation' => 'fade',
            ],
        ]);

        // No entrance animation on a reference document — somebody arriving
        // here has come to read one clause, and content that fades in as they
        // scroll is friction rather than polish.
        $this->articleBody($page, 1, self::EDITOR_NOTE.$policy['body_html'], [
            'measure' => 'prose',
            'theme' => 'default',
            'spacing' => 'default',
            'animation' => 'none',
        ]);

        $this->closingBand($page, 2, [
            'key' => 'legal-'.$policy['slug'],
            'eyebrow' => 'Questions',
            'heading' => 'Something Here Unclear',
            'subheading' => 'Legal pages are written to be precise rather than readable. If any of it affects a decision you are making, ask and we will explain it in plain terms.',
            'primary_label' => 'Contact Us',
            'primary_url' => '/contact',
            'secondary_label' => 'About QTECH',
            'secondary_url' => '/about',
        ]);
    }

    /** @return array<int, array<string, mixed>> */
    protected function policies(): array
    {
        return [
            [
                'slug' => 'privacy-policy',
                'title' => 'Privacy Policy',
                'icon' => 'ShieldCheck',
                'read_time' => '8 min read',
                'excerpt' => 'What personal data we collect, why we hold it, how long for, and the rights you have over it.',
                'standfirst' => 'How [COMPANY LEGAL NAME] collects, uses and protects personal data, and what you can ask us to do with it.',
                'body_html' => '<h2>Who we are</h2><p>[COMPANY LEGAL NAME], registered at [REGISTERED ADDRESS], company number [NUMBER], is the data controller for the personal data described here. Our data protection contact is [EMAIL].</p><h2>What we collect</h2><p>We collect only what we need for a stated purpose.</p><ul><li><strong>Contact details you give us</strong> — name, email, telephone and company, when you submit an enquiry or subscribe to our newsletter.</li><li><strong>Correspondence</strong> — the content of emails and messages you send us, kept as a record of the conversation.</li><li><strong>Technical data</strong> — IP address, browser type and pages visited, collected through analytics where you have consented.</li><li><strong>Recruitment data</strong> — anything you send us when applying for a role.</li></ul><p>We do not collect special category data through this website and ask that you do not send any.</p><h2>Why we hold it, and on what basis</h2><table><thead><tr><th>Purpose</th><th>Lawful basis</th></tr></thead><tbody><tr><td>Responding to an enquiry</td><td>Legitimate interests / steps prior to a contract</td></tr><tr><td>Delivering a contracted engagement</td><td>Performance of a contract</td></tr><tr><td>Sending our newsletter</td><td>Consent</td></tr><tr><td>Analytics and site improvement</td><td>Consent</td></tr><tr><td>Meeting legal and accounting obligations</td><td>Legal obligation</td></tr></tbody></table><h2>How long we keep it</h2><ul><li>Enquiries that do not become engagements: [PERIOD, e.g. 24 months].</li><li>Client records: for the engagement plus [PERIOD] to meet accounting and limitation requirements.</li><li>Newsletter subscriptions: until you unsubscribe.</li><li>Recruitment applications: [PERIOD], or longer with your consent.</li></ul><h2>Who we share it with</h2><p>We use third-party processors for hosting, email delivery and analytics. Each is bound by a data processing agreement and may use your data only on our instructions. A current list is available on request from [EMAIL].</p><p>[STATE ANY TRANSFERS OUTSIDE YOUR JURISDICTION AND THE SAFEGUARDS RELIED ON.]</p><h2>Your rights</h2><p>You can ask us to give you a copy of your data, correct it, delete it, restrict how we use it, or provide it in a portable format. You can object to processing based on legitimate interests and withdraw consent at any time — withdrawing consent does not affect processing already carried out.</p><p>To exercise any of these, email [EMAIL]. We respond within one month. If you are not satisfied, you can complain to [SUPERVISORY AUTHORITY].</p><h2>Security</h2><p>We hold ISO/IEC 27001 certification for our delivery organisation. Data is encrypted in transit and at rest, access is granted on a least-privilege basis and reviewed regularly, and we maintain an incident response process with defined notification timelines.</p><h2>Changes</h2><p>We update this notice when our processing changes. Material changes are notified to newsletter subscribers and clients directly; the date at the top always reflects the current version.</p>',
            ],
            [
                'slug' => 'terms-of-service',
                'title' => 'Terms of Service',
                'icon' => 'Landmark',
                'read_time' => '7 min read',
                'excerpt' => 'The terms covering use of this website, and how they relate to a signed engagement contract.',
                'standfirst' => 'The terms on which [COMPANY LEGAL NAME] provides this website. Engagements are governed by a separate signed agreement.',
                'body_html' => '<h2>These terms cover the website only</h2><p>Client work is governed by a separate written agreement — a master services agreement and a statement of work. Where those documents and this page disagree, the signed agreement takes precedence for everything relating to an engagement.</p><h2>Using this site</h2><p>You may read, print and share this site\'s content for your own information. You may not republish it commercially, present it as your own, or use automated tools to extract it at a scale that affects the service for others.</p><h2>What we publish here</h2><p>The content on this site is general information about what we do. It is not professional advice and it is not an offer capable of acceptance. Case studies and metrics describe specific engagements under specific conditions and are not a prediction of what your project will achieve.</p><h2>Intellectual property</h2><p>The content, design and code of this website belong to [COMPANY LEGAL NAME] or its licensors. Third-party names and marks referred to on this site belong to their respective owners and are used descriptively.</p><p>Intellectual property in client work is dealt with in the engagement contract. Our standard position is that the client owns the deliverables outright from creation.</p><h2>Availability</h2><p>We try to keep this site available but do not guarantee uninterrupted access. We may change or withdraw any part of it without notice. Nothing here creates an obligation to maintain any particular page or URL.</p><h2>Links out</h2><p>Where we link to another site we do so because we found it useful. We do not control it and are not responsible for its content or its privacy practices.</p><h2>Liability</h2><p>Nothing in these terms excludes liability that cannot lawfully be excluded, including for death or personal injury caused by negligence, or for fraud.</p><p>Subject to that, we are not liable for indirect or consequential loss, loss of profit, or loss of data arising from use of this website. [INSERT ANY LIABILITY CAP AND CONFIRM IT AGAINST YOUR INSURANCE AND LOCAL LAW.]</p><h2>Governing law</h2><p>These terms are governed by the laws of [JURISDICTION], and the courts of [JURISDICTION] have exclusive jurisdiction.</p><h2>Contact</h2><p>[COMPANY LEGAL NAME], [REGISTERED ADDRESS]. Company number [NUMBER]. Questions about these terms: [EMAIL].</p>',
            ],
            [
                'slug' => 'cookie-policy',
                'title' => 'Cookie Policy',
                'icon' => 'Boxes',
                'read_time' => '5 min read',
                'excerpt' => 'The cookies this site sets, what each is for, and how to change your choices at any time.',
                'standfirst' => 'What we store on your device, why, and how to change your mind — which you can do at any point without losing access to anything.',
                'body_html' => '<h2>How consent works here</h2><p>Only strictly necessary cookies are set before you choose. Analytics and marketing cookies are set only if you accept them, and rejecting is exactly as easy as accepting — one click, same size, same prominence.</p><p>Your choice is stored in a cookie so we do not have to ask again. It is versioned: if we add a category, we ask again rather than assuming your previous answer covers it.</p><p>You can change your choice at any time using the <strong>Cookie settings</strong> link in the site footer.</p><h2>What we set</h2><h3>Strictly necessary</h3><p>These make the site work and cannot be switched off. They set no marketing identifier and are not shared.</p><table><thead><tr><th>Cookie</th><th>Purpose</th><th>Retention</th></tr></thead><tbody><tr><td>Session</td><td>Keeps your session and secures form submissions against cross-site request forgery.</td><td>Session</td></tr><tr><td>Consent preference</td><td>Remembers your cookie choices so you are not asked repeatedly.</td><td>12 months</td></tr><tr><td>Theme preference</td><td>Remembers light or dark mode so the page does not flash on load.</td><td>12 months</td></tr><tr><td>Language preference</td><td>Remembers your chosen language.</td><td>Session</td></tr></tbody></table><h3>Analytics — only with consent</h3><p>Aggregated measurement of which pages are read and where visitors arrive from. We use it to decide what to write and what to fix. [LIST YOUR ANALYTICS PROVIDER, ITS COOKIE NAMES AND RETENTION.]</p><h3>Marketing — only with consent</h3><p>[IF YOU RUN ADVERTISING OR REMARKETING, LIST THE PROVIDERS AND COOKIES HERE. IF YOU DO NOT, SAY SO EXPLICITLY AND DELETE THIS CATEGORY FROM THE BANNER — AN EMPTY CATEGORY ASKS FOR CONSENT YOU DO NOT NEED.]</p><h2>Managing cookies in your browser</h2><p>Every major browser lets you block or delete cookies in its settings. Blocking strictly necessary cookies will stop parts of this site working — forms in particular.</p><h2>Related</h2><p>How we handle personal data more generally is described in our <a href="/privacy-policy">Privacy Policy</a>.</p>',
            ],
            [
                'slug' => 'accessibility-statement',
                'title' => 'Accessibility Statement',
                'icon' => 'Users',
                'read_time' => '5 min read',
                'excerpt' => 'How accessible this website is, what we know is imperfect, and how to tell us when something blocks you.',
                'standfirst' => 'We build to WCAG 2.2 Level AA. This is what that means here, what we know is not yet right, and how to report a problem.',
                'body_html' => '<h2>Our commitment</h2><p>This site is built to meet WCAG 2.2 Level AA. Accessibility is part of our component library rather than a pass at the end, so every screen inherits semantic markup, keyboard support and tested contrast rather than each one being fixed individually.</p><h2>What that means in practice</h2><ul><li>Every function is reachable with a keyboard, and focus is always visible.</li><li>Text meets AA contrast in both light and dark themes.</li><li>Text can be resized to 200% without loss of content or function.</li><li>Content reflows to a 320px viewport with no horizontal scrolling.</li><li>Images carry alternative text; decorative images are hidden from assistive technology.</li><li>Motion is removed for anyone who has set a reduced-motion preference.</li><li>Forms have real labels, and errors are announced rather than only coloured.</li></ul><h2>How we test</h2><p>Automated checks run in our build pipeline, which catch roughly a third of real accessibility issues. The rest are covered by manual keyboard testing and screen reader testing on each core journey before release. [NAME YOUR SCREEN READERS AND BROWSERS.]</p><h2>Known issues</h2><p>[LIST ANYTHING CURRENTLY FAILING, WITH A TARGET DATE. AN EMPTY LIST ON A REAL SITE IS ALMOST ALWAYS INACCURATE — IF NOTHING IS LISTED, SAY WHEN THE LAST AUDIT WAS AND WHO PERFORMED IT.]</p><h2>Third-party content</h2><p>Some embedded content is provided by third parties and is not fully under our control. Where we are aware of a barrier we say so above and look for an alternative.</p><h2>Tell us about a problem</h2><p>If something on this site blocks you, we want to know — it is the most useful feedback we receive. Email [EMAIL] with the page and what happened, and we will respond within [PERIOD] with either a fix or a date for one.</p><p>If you are not satisfied with our response, you can escalate to [RELEVANT ENFORCEMENT BODY].</p><h2>Preparation of this statement</h2><p>This statement was prepared on [DATE] and last reviewed on [DATE]. It is based on [SELF-ASSESSMENT / AN EXTERNAL AUDIT BY [AUDITOR]].</p>',
            ],
        ];
    }
}

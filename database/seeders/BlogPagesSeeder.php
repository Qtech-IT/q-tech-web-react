<?php

namespace Database\Seeders;

use App\Enums\Cms\PageType;
use App\Models\Page;
use Database\Seeders\Cms\CmsContentSeeder;

/**
 * `/blog` and the posts beneath it.
 *
 * WHY A POST IS A PAGE
 * --------------------
 * A blog post is a URL with an author, a date and a body — which is a page with
 * three extra fields, not a new content system. Making it a `Page` means it
 * inherits scheduled publishing, the SEO panel, slug-change redirects,
 * translation groups and the page tree for free, and `/blog` is one
 * `collection.index` band rather than a bespoke listing controller.
 *
 * What a dedicated `posts` table would buy is categories and tags as first-class
 * relations. That is a real gap and worth building the day the site has enough
 * posts to need filtering — see the note on tags below. It is not worth it for
 * five.
 *
 * DATES ARE EXPLICIT AND DESCENDING so `/blog`, which sorts by `recent` and
 * shows dates, has something meaningful to order by. Left to default they would
 * share one timestamp and the order would be decided by insertion id.
 *
 * DEMO CONTENT: the posts are real technical arguments we would stand behind,
 * but the authors are the fictional team from `HomePageSeeder` and the dates are
 * invented. Replace the bylines before launch.
 */
class BlogPagesSeeder extends CmsContentSeeder
{
    public function run(): void
    {
        $index = $this->page('/blog', [
            'title' => 'Blog',
            'slug' => 'blog',
            'excerpt' => 'Notes from the engineers doing the work — architecture decisions, trade-offs, and things that went wrong.',
            'icon' => 'Newspaper',
            'accent' => 'violet',
            'sort_order' => 5,
        ]);

        /*
         * Post artwork, reusing the composed portfolio screens plus the
         * workspace collage. There are five assets and five posts; if a sixth
         * post is added without a sixth image it simply has none, and both the
         * card and the article header fall back cleanly rather than breaking.
         */
        $art = DemoMediaSeeder::group('portfolio')
            ->concat(DemoMediaSeeder::group('process'))
            ->values();

        foreach ($this->posts() as $position => $post) {
            $page = $this->page('/blog/'.$post['slug'], [
                'title' => $post['title'],
                'slug' => $post['slug'],
                'parent_id' => $index->id,
                'excerpt' => $post['excerpt'],
                'icon' => $post['icon'],
                'accent' => $post['accent'],
                'page_type' => PageType::BLOG->value,
                'published_at' => now()->subDays(9 + ($position * 21)),
                'sort_order' => $position,
            ]);

            $media = $art->get($position);

            $this->attachCard($page, $media);
            $this->buildPost($page, $post, $media?->id);
        }

        $this->buildIndex($index);

        $this->linkMenuItems(['Blog' => $index, 'Insights' => $index]);
        $this->flushPageCache();
    }

    protected function buildIndex(Page $index): void
    {
        $this->clearSections($index);

        $this->section($index, 'hero.centered', 0, [
            'name' => 'Blog Hero',
            'eyebrow' => 'Writing',
            'heading' => 'Notes From The People Doing The Work',
            'subheading' => 'Architecture decisions, trade-offs we argued about, and the occasional post-mortem. No thought leadership, no listicles.',
            'data' => ['heading_highlight' => 'Doing The Work'],
            'settings' => ['theme' => 'default', 'spacing' => 'lg', 'animation' => 'rise'],
        ]);

        $this->indexBand($index, 1, [
            'name' => 'All Posts',
            'anchor' => 'all-posts',
            'heading' => 'Latest Writing',
            'highlight' => 'Latest',
            'page_type' => PageType::BLOG->value,
            'layout' => 'card',
            'columns' => 3,
            'order' => 'recent',
            'show_date' => true,
            'searchable' => true,
            'paginate' => true,
            'per_page' => 6,
            'empty_message' => 'We are between posts. Follow along on the newsletter and we will tell you when the next one lands.',
        ]);

        $this->section($index, 'newsletter.signup', 2, [
            'name' => 'Blog Newsletter',
            'eyebrow' => 'Stay In Touch',
            'heading' => 'One Email When We Publish',
            'subheading' => 'No campaign sequence, no webinar invitations. One message when there is something new worth reading.',
            'data' => [
                'placeholder' => 'you@company.com',
                'button_label' => 'Subscribe',
                'consent_label' => 'I agree to receive occasional emails and can unsubscribe at any time.',
                'success_message' => 'Thanks — check your inbox to confirm.',
                'source' => 'blog-index',
                'trust_label' => 'No spam. Unsubscribe in one click.',
            ],
            'settings' => ['theme' => 'subtle', 'spacing' => 'lg', 'animation' => 'fade'],
        ]);

        $this->closingBand($index, 3, [
            'key' => 'blog-index',
            'heading' => 'Got A Problem Worth Writing About',
            'subheading' => 'Most of these posts started as a question a client asked. If you have one we have not answered, it is a good reason to talk.',
            'secondary_label' => 'See Our Work',
            'secondary_url' => '/case-studies',
        ]);
    }

    protected function buildPost(Page $page, array $post, ?int $mediaId): void
    {
        $this->clearSections($page);

        $header = $this->section($page, 'article.header', 0, [
            'name' => $post['title'].' Header',
            'eyebrow' => $post['category'],
            'heading' => $post['title'],
            'subheading' => $post['standfirst'],
            // The same asset the card on `/blog` shows, so the listing and the
            // post cannot present two different pictures of one article.
            'media_id' => $mediaId,
            'data' => [
                'author_name' => $post['author'],
                'author_role' => $post['author_role'],
                'published_label' => $post['date_label'],
                'read_time' => $post['read_time'],
            ],
            'settings' => [
                'align' => 'start',
                'media_shape' => 'landscape',
                'theme' => 'default',
                'spacing' => 'default',
                'animation' => 'rise',
            ],
        ]);

        /*
         * Tags are repeater rows on the header, not a relation.
         *
         * That means they display but do not filter — clicking one goes
         * nowhere, so none of them is rendered as a link. A filterable tag
         * needs a real taxonomy table; promising the interaction before the
         * data model exists is how a blog ends up with dead links on every
         * post.
         */
        foreach ($post['tags'] as $i => $tag) {
            $this->block($header, 'tag', $i, ['label' => $tag]);
        }

        $this->articleBody($page, 1, $post['body_html'], [
            'measure' => 'prose',
            'theme' => 'default',
            'spacing' => 'default',
            'animation' => 'fade',
        ]);

        $this->closingBand($page, 2, [
            'key' => 'post-'.$post['slug'],
            'eyebrow' => 'Talk To Us',
            'heading' => $post['close_heading'],
            'subheading' => $post['close_body'],
            'secondary_label' => 'More Writing',
            'secondary_url' => '/blog',
        ]);
    }

    /** @return array<int, array<string, mixed>> */
    protected function posts(): array
    {
        return [
            [
                'slug' => 'stop-buying-servers-to-fix-slow-code',
                'title' => 'Stop Buying Servers To Fix Slow Code',
                'category' => 'Performance',
                'icon' => 'Gauge',
                'accent' => 'rose',
                'excerpt' => 'Over-provisioning is what a team buys when it has no confidence in its own deploy. Measure first — the fix is usually three queries.',
                'standfirst' => 'Every quarter someone asks us to triple their infrastructure. Roughly once a year they turn out to be right.',
                'author' => 'Jonas Thorne',
                'author_role' => 'Chief Technology Officer',
                'date_label' => 'March 2026',
                'read_time' => '6 min read',
                'tags' => ['Performance', 'Cloud', 'Cost'],
                'body_html' => '<p>The request arrives in a predictable shape. Traffic grew, the site got slow, someone has priced up more servers, and they would like a second opinion before signing.</p><p>The second opinion is almost always the same: measure first, for two weeks, before buying anything.</p><h2>Why hardware feels like the answer</h2><p>Because it works, briefly. Doubling capacity does make a slow site faster, in the same way that a bigger bucket helps with a leak. The problem is that the underlying cost scales with traffic while the cause does not, so you buy the same fix again next year at twice the price.</p><p>It is also the option that requires no diagnosis, which matters more than people admit. When nobody is confident about what is slow, buying capacity is the decision that can be made without understanding the system.</p><h2>What we actually find</h2><p>Across the performance work we have done, the causes cluster into a short list.</p><ul><li><strong>A query in a loop.</strong> The classic N+1, usually inside a serialiser where nobody thinks to look.</li><li><strong>An unpaginated list.</strong> Fine at a thousand rows, fatal at a million, and the transition happens quietly.</li><li><strong>A synchronous call in a hot path.</strong> A downstream system called inline during checkout, so their bad day becomes yours.</li><li><strong>A missing index.</strong> Still, in 2026, more often than anyone expects.</li><li><strong>Cache that never invalidates, or never hits.</strong> Both look like "we have caching" on an architecture diagram.</li></ul><p>None of these are fixed by more servers. Two of them are made <em>worse</em>, because more application instances means more concurrent connections to the database that is already the bottleneck.</p><h2>The two-week test</h2><p>What we ask for is a load test against a realistic profile — not average traffic, and not a synthetic benchmark, but the shape of the worst day you actually expect.</p><p>That test produces a ranked list of causes. Then the conversation changes from "how much capacity should we buy" to "these three things account for most of it, and two are a day\'s work".</p><blockquote>Over-provisioning is not a capacity decision. It is what a team buys when it does not trust its own deploy.</blockquote><h2>When more servers is the right call</h2><p>Sometimes it is, and we say so. If the application is genuinely CPU-bound on work that cannot be cached or queued, if you are one instance away from a redundancy requirement, or if peak is next week and there is no time to fix properly — buy the capacity. Just do it knowing that is what you are doing.</p>',
                'close_heading' => 'Send Us The Slow Endpoint',
                'close_body' => 'One endpoint and its timings is usually enough for us to say something useful about where the time is going.',
            ],
            [
                'slug' => 'the-states-nobody-designs',
                'title' => 'The States Nobody Designs Are The Ones Users Hit',
                'category' => 'Design',
                'icon' => 'PenTool',
                'accent' => 'violet',
                'excerpt' => 'Empty, loading, partial, error. Four states that get improvised during the build, and where a product stops feeling considered.',
                'standfirst' => 'Every product looks good with three perfect rows of demo data. Real software is mostly edge cases.',
                'author' => 'Amara Rahman',
                'author_role' => 'Chief Executive Officer',
                'date_label' => 'February 2026',
                'read_time' => '5 min read',
                'tags' => ['Design', 'Product', 'Design Systems'],
                'body_html' => '<p>Hand a designer a component and you will get back the success state: the table with data in it, the form filled correctly, the dashboard with a healthy trend line.</p><p>Then it gets built, and someone has to decide what happens before any data exists, while it is loading, when half of it arrives, and when the request fails. Those decisions get made under time pressure by whoever is holding the ticket, and the answers are usually a spinner, a blank box, and a red sentence containing the word "error".</p><h2>The five states</h2><p>Every component that displays data has five, and a design that specifies one has specified a fifth of the work.</p><ul><li><strong>Empty.</strong> Nothing exists yet. This is a first-run experience, not a failure — it should say what will appear here and how to make that happen.</li><li><strong>Loading.</strong> Something is coming. A skeleton that reserves the right shape beats a spinner, because it does not move the layout when the data lands.</li><li><strong>Partial.</strong> Some of it arrived. Frequently forgotten and frequently what users actually see on a poor connection.</li><li><strong>Error.</strong> It failed. Say what failed, whether it is worth retrying, and what to do if it is not.</li><li><strong>Success.</strong> The one everybody designs.</li></ul><h2>Why it is cheaper to design them</h2><p>The argument against is that specifying five states per component is five times the design work. In practice it is nothing like that, because most of the states are decided once at the system level rather than per screen — one skeleton treatment, one error pattern, one empty-state layout, applied everywhere.</p><p>What it does remove is the improvisation. An engineer who has the states does not have to invent them at 5pm, and the review does not turn into a conversation about a spinner.</p><h2>The empty state is a product decision</h2><p>Of the five, the empty state is the one worth most attention, because it is the first thing a new user sees and it is the only state that can teach.</p><p>"No results" is a dead end. "No invoices yet — they will appear here once you send your first one" is onboarding. The difference costs one sentence and is the difference between a product that feels finished and one that feels unattended.</p>',
                'close_heading' => 'Show Us A Screen That Feels Unfinished',
                'close_body' => 'Usually one screen is enough to see what is missing from the system behind it.',
            ],
            [
                'slug' => 'ai-projects-fail-at-the-first-question',
                'title' => 'Most AI Projects Fail At The First Question',
                'category' => 'Engineering',
                'icon' => 'Sparkles',
                'accent' => 'amber',
                'excerpt' => '"We should do something with AI" produces a demo that impresses a board and never reaches production. Start with the number instead.',
                'standfirst' => 'The failed AI projects we get called in to rescue almost all started with the technology rather than with the problem.',
                'author' => 'Mei Kobayashi',
                'author_role' => 'Principal Engineer',
                'date_label' => 'January 2026',
                'read_time' => '7 min read',
                'tags' => ['AI', 'RAG', 'Delivery'],
                'body_html' => '<p>There is a specific failure mode we have now seen enough times to predict. It starts with a mandate — "we should be doing something with AI" — and ends with a demo that impresses a board, sits in a branch for two quarters, and is quietly abandoned.</p><p>The demo was never the problem. The problem is that nobody agreed in advance what it was supposed to change.</p><h2>Start with the number</h2><p>The projects that reach production start somewhere much more boring: a specific metric, and a threshold at which the thing is worth keeping.</p><ul><li>Support tickets deflected, and by how much before it pays for itself.</li><li>Hours spent re-keying invoices.</li><li>Time from enquiry to quote.</li></ul><p>Having that number changes every subsequent decision. It tells you what to measure, when to stop, and — most usefully — when the answer is not AI at all. A well-written FAQ page deflects a surprising number of support tickets for considerably less money.</p><h2>Three things that separate a demo from a system</h2><h3>Retrieval, not recall</h3><p>A model asked to answer from memory will invent an answer that reads correctly and is wrong. Grounding answers in your own documents — retrieval-augmented generation — means the system quotes rather than invents, and can cite what it quoted.</p><h3>An evaluation set</h3><p>A demo is judged by whether it impressed the room. A system needs a set of real questions with known-good answers, run on every change. Without it, "it seems better" is the only available measurement, and it is not one.</p><h3>A refusal path</h3><p>The most important behaviour is saying "I do not know". A confident wrong answer to a customer is more expensive than no answer, and the refusal threshold is a business decision — not a default.</p><h2>The part nobody budgets for</h2><p>Evaluation and guardrails are usually more work than the feature. That is not a sign the project is going badly; it is the difference between something you can leave running and something that needs a person watching it.</p><p>If a proposal does not have a line for it, the proposal is for a demo.</p>',
                'close_heading' => 'Name The Number You Want To Move',
                'close_body' => 'Tickets, hours, days-to-quote. If AI is not the cheapest way to move it, we will tell you what is.',
            ],
            [
                'slug' => 'your-catch-all-route-is-shadowing-your-admin',
                'title' => 'Your Catch-All Route Is Probably Shadowing Something',
                'category' => 'Engineering',
                'icon' => 'Workflow',
                'accent' => 'teal',
                'excerpt' => 'A CMS catch-all is matched in registration order, which is rarely the order you think. Use a fallback instead.',
                'standfirst' => 'We shipped this bug ourselves, caught it in review, and it is common enough to be worth writing down.',
                'author' => 'Daniel Okafor',
                'author_role' => 'Senior Engineer',
                'date_label' => 'December 2025',
                'read_time' => '4 min read',
                'tags' => ['Laravel', 'Routing', 'CMS'],
                'body_html' => '<p>Any CMS eventually needs a route that says "if nothing else matched, look this URL up as a page". The obvious way to write it in Laravel is a catch-all.</p><pre><code>Route::get(\'/{path}\', PageController::class)->where(\'path\', \'.*\');</code></pre><p>This works, and then one day the admin panel returns 404 on every URL.</p><h2>Registration order is not file order</h2><p>Laravel matches routes in the order they were registered. If your admin routes are loaded from a second file — a <code>then</code> callback in <code>bootstrap/app.php</code>, a service provider, a package — they may be registered <em>after</em> the catch-all, and the catch-all wins.</p><p>The symptom is confusing because the admin routes exist. <code>route:list</code> shows them. They are simply never reached.</p><h2>Why the obvious patch is wrong twice</h2><p>The instinct is a negative lookahead:</p><pre><code>->where(\'path\', \'^(?!backend).*\')</code></pre><p>Two problems. First, <code>where()</code> is keyed by parameter name, so chaining several calls for several prefixes silently keeps only the last one — a bug that looks like it works.</p><p>Second, even done correctly, the list has to be updated by hand every time the application grows a route prefix. That is a shadowed admin panel discovered in production some months later.</p><h2>Use a fallback</h2><pre><code>Route::fallback(PageController::class);</code></pre><p>A fallback is matched only after every real route has been given its chance, regardless of registration order. It carries exactly the semantics you wanted — "render a page when nothing else claimed this URL" — and it is GET-only by definition.</p><p>One refinement worth adding: if the path starts with a prefix the application owns, <code>abort(404)</code> rather than rendering the public 404. A missing admin URL is a missing route, not a missing page, and rendering the marketing header and footer over it is misleading.</p>',
                'close_heading' => 'Building A CMS Of Your Own',
                'close_body' => 'Routing, previews, and cache invalidation are where most of them get complicated. Happy to compare notes.',
            ],
            [
                'slug' => 'custom-software-is-usually-the-wrong-answer',
                'title' => 'Custom Software Is Usually The Wrong Answer',
                'category' => 'Delivery',
                'icon' => 'Search',
                'accent' => 'ink',
                'excerpt' => 'An agency arguing against its own largest service line. Most companies should buy — and there are three cases where they should not.',
                'standfirst' => 'We turn down more custom builds than we take. Here is the test we apply.',
                'author' => 'Amara Rahman',
                'author_role' => 'Chief Executive Officer',
                'date_label' => 'November 2025',
                'read_time' => '5 min read',
                'tags' => ['Strategy', 'Custom Software'],
                'body_html' => '<p>This is an odd thing for an agency to publish, so let us be direct about the incentive: we are paid to build custom software, and we are telling you that most of the time you should not commission any.</p><p>The reason is self-interested enough to be credible. A custom build that should have been an off-the-shelf purchase becomes an unhappy client, a reference we cannot use, and a system somebody resents paying to maintain.</p><h2>The default is buy</h2><p>If a process is genuinely standard — payroll, accounting, CRM, helpdesk, most of HR — an existing product will beat anything bespoke on cost, on time-to-value and on the sheer number of edge cases it has already met. You are buying twenty years of other people\'s bug reports.</p><h2>Three cases where building wins</h2><h3>The process is the moat</h3><p>If the way you route work, price a job or manage inventory is what makes you better than your competitors, encoding it in someone else\'s product caps it at their roadmap. This is the strongest case and the rarest.</p><h3>The integrations are the product</h3><p>Six systems that must agree with each other in real time is not a licensing problem, it is an engineering one. No vendor will build your specific integration graph.</p><h3>The licence cost has overtaken the build cost</h3><p>Per-seat pricing that made sense at thirty people frequently does not at three hundred. This one is arithmetic, and it is worth doing the arithmetic rather than assuming either way.</p><h2>The test</h2><p>Ask what happens if you change your process to match the software instead. If the answer is "we would be slightly less efficient", buy the product. If the answer is "we would lose the thing customers choose us for", that is when to build.</p><p>Most of the time it is the first answer. The companies that ask the question at all tend to end up with better software, whichever way they go.</p>',
                'close_heading' => 'Bring Us The Process Nothing Fits',
                'close_body' => 'Describe how the work actually flows, including the spreadsheet nobody admits to. We will tell you plainly whether it needs building.',
            ],
        ];
    }
}

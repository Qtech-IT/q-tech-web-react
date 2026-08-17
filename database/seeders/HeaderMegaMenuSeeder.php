<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * The header mega menu, in the shape the public panel renders.
 *
 * NO SCHEMA CHANGE. `menu_items` already nests three deep (`max_depth = 3`),
 * already carries `media_id` for the featured card's client mark, and already
 * has a `settings` JSON that `NavigationService::present()` passes through
 * verbatim. What was missing was a CONVENTION for what goes in that JSON, which
 * this seeder establishes and the renderer reads:
 *
 *   Top-level node  settings.display = 'mega' | 'dropdown' | 'link'
 *                   settings.panel   = { title, intro, intro_link, footer }
 *                   settings.featured= { client, result, link }
 *                   settings.is_cta  = true  (renders as the bar's CTA button)
 *
 *   Child           settings.slot    = 'rail'   -> left rail link
 *                   link_type = heading         -> a column group in the grid
 *                   settings.columns = 2        -> how many columns it spans
 *
 *   Grandchild      a plain link inside a group
 *
 * The three-level nesting is what lets a group heading own its own links, which
 * is the difference between "a list with a title above it" and a real grouped
 * grid that can reflow per column count.
 *
 * On content: the service and technology names are ordinary industry taxonomy.
 * The featured cards deliberately use neutral placeholder clients rather than
 * the reference site's real ones — asserting another agency's client
 * relationships as QTECH's would be a false claim about real companies, and an
 * editor replaces these in the menu builder anyway.
 */
class HeaderMegaMenuSeeder extends Seeder
{
    public function run(): void
    {
        $menu = Menu::where('location', 'header')->first();

        if (! $menu) {
            $this->command?->warn('No header menu found — run the CMS seeder first.');

            return;
        }

        DB::transaction(function () use ($menu): void {
            MenuItem::withTrashed()->where('menu_id', $menu->id)->forceDelete();

            $order = 0;

            foreach ($this->panels() as $panel) {
                $node = $this->item($menu->id, null, 0, $order++, $panel['label'], [
                    'link_type' => $panel['children'] ?? false ? 'heading' : 'url',
                    'url' => $panel['href'] ?? null,
                    'settings' => $panel['settings'] ?? null,
                ]);

                foreach ($panel['rail'] ?? [] as $i => $rail) {
                    $this->item($menu->id, $node->id, 1, $i, $rail['label'], [
                        'url' => $rail['href'],
                        'settings' => ['slot' => 'rail'],
                    ]);
                }

                // Groups continue the same sibling sequence as the rail links so
                // sort_order stays globally meaningful within the level.
                $groupOrder = count($panel['rail'] ?? []);

                foreach ($panel['groups'] ?? [] as $group) {
                    $groupNode = $this->item($menu->id, $node->id, 1, $groupOrder++, $group['label'], [
                        'link_type' => 'heading',
                        'settings' => ['slot' => 'grid', 'columns' => $group['columns'] ?? 1],
                    ]);

                    foreach ($group['links'] as $i => $link) {
                        $this->item($menu->id, $groupNode->id, 2, $i, $link, [
                            'url' => '/'.Str::slug($link),
                        ]);
                    }
                }
            }
        });

        $this->command?->info('Header mega menu seeded: '.MenuItem::where('menu_id', $menu->id)->count().' items.');
    }

    /**
     * @param  array<string, mixed>  $attrs
     */
    private function item(int $menuId, ?int $parentId, int $depth, int $order, string $label, array $attrs = []): MenuItem
    {
        return MenuItem::create(array_merge([
            'uuid' => (string) Str::uuid(),
            'menu_id' => $menuId,
            'parent_id' => $parentId,
            'path' => Str::slug($label),
            'depth' => $depth,
            'label' => $label,
            'link_type' => 'url',
            'visibility' => 'always',
            'status' => 'active',
            'sort_order' => $order,
        ], $attrs));
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function panels(): array
    {
        return [
            [
                'label' => 'Services',
                'settings' => [
                    'display' => 'mega',
                    'panel' => [
                        'title' => 'Services',
                        'intro' => 'Get software development services, built around your needs:',
                        'intro_link' => ['label' => 'software development services', 'href' => '/services'],
                        'footer' => ['label' => 'All Services', 'href' => '/services'],
                    ],
                    'featured' => [
                        'client' => 'Northwind Energy',
                        'result' => 'We built an app for real-time plant monitoring.',
                        'link' => ['label' => 'Read case study.', 'href' => '/case-studies/northwind-energy'],
                    ],
                ],
                'rail' => [
                    ['label' => 'Staff Augmentation', 'href' => '/services/staff-augmentation'],
                    ['label' => 'Dedicated Teams', 'href' => '/services/dedicated-teams'],
                    ['label' => 'Software Outsourcing', 'href' => '/services/software-outsourcing'],
                    ['label' => 'AI Transformation', 'href' => '/services/ai-transformation'],
                ],
                'groups' => [
                    [
                        'label' => 'Top Services',
                        'columns' => 2,
                        'links' => [
                            'AI Development', 'Android App Development',
                            'Back-end Development', 'Business Intelligence',
                            'CMS Development', 'Data Engineering',
                            'Cryptocurrency & Blockchain', 'eCommerce Development',
                            'Front-end Development', 'iOS App Development',
                            'Machine Learning', 'Mobile App Development',
                            'QA Testing & Automation', 'SaaS Development',
                            'UX/UI Design', 'Web Development',
                        ],
                    ],
                    [
                        'label' => 'Enterprise Focused',
                        'columns' => 1,
                        'links' => [
                            'Backup Solutions', 'Big Data', 'Cloud Applications',
                            'CRM Systems', 'Cybersecurity', 'DevOps',
                            'Digital Transformation', 'ERP Development',
                        ],
                    ],
                ],
            ],

            [
                'label' => 'Technologies',
                'settings' => [
                    'display' => 'mega',
                    'panel' => [
                        'title' => 'Technologies',
                        'intro' => 'Get experts in 100+ technologies. Cover any tech stack.',
                        'footer' => ['label' => 'All Technologies', 'href' => '/technologies'],
                    ],
                    'featured' => [
                        'client' => 'Lumen Retail',
                        'result' => 'We optimised website performance, leading to a 38% increase in net profits.',
                        'link' => ['label' => 'Read case study.', 'href' => '/case-studies/lumen-retail'],
                    ],
                ],
                'rail' => [
                    ['label' => 'Hire Software Developers', 'href' => '/hire-developers'],
                    ['label' => 'Top 1% Talent', 'href' => '/top-talent'],
                ],
                'groups' => [
                    [
                        // No visible heading in this panel — the renderer hides a
                        // group label that is an empty string, which is how the
                        // reference gets a plain three-column list.
                        'label' => '',
                        'columns' => 3,
                        'links' => [
                            '.NET', 'AI', 'Angular',
                            'AWS', 'C#', 'C++',
                            'Django', 'Golang', 'Google Cloud',
                            'Java', 'JavaScript', 'Kotlin',
                            'Machine Learning', 'Microsoft Azure', 'Node.js',
                            'PHP', 'Power BI', 'Python',
                            'React', 'Ruby', 'Salesforce',
                            'TypeScript', 'Vue.js', 'Xamarin',
                        ],
                    ],
                ],
            ],

            [
                'label' => 'Industries',
                'settings' => [
                    'display' => 'mega',
                    'panel' => [
                        'title' => 'Industries',
                        'intro' => 'Deep domain teams for regulated, high-stakes sectors.',
                        'footer' => ['label' => 'All Industries', 'href' => '/industries'],
                    ],
                    'featured' => [
                        'client' => 'Arcadia Health',
                        'result' => 'We shipped a HIPAA-compliant patient portal in one quarter.',
                        'link' => ['label' => 'Read case study.', 'href' => '/case-studies/arcadia-health'],
                    ],
                ],
                'rail' => [
                    ['label' => 'Why QTECH', 'href' => '/why-qtech'],
                    ['label' => 'Engagement Models', 'href' => '/engagement-models'],
                ],
                'groups' => [
                    [
                        'label' => '',
                        'columns' => 2,
                        'links' => [
                            'Financial Services', 'Logistics',
                            'Healthcare', 'Manufacturing',
                            'Retail & eCommerce', 'Media',
                            'Insurance', 'Public Sector',
                        ],
                    ],
                ],
            ],

            [
                'label' => 'About',
                'settings' => [
                    'display' => 'mega',
                    'panel' => [
                        'title' => 'About',
                        'intro' => 'Since 2009 we have built software for companies of every size, from startups to Fortune 500 groups.',
                        'footer' => ['label' => 'Our Story', 'href' => '/about'],
                    ],
                    'featured' => [
                        'client' => 'QTECH',
                        'result' => 'Our CEO speaking at the World Economic Forum, Davos 2025.',
                        'link' => ['label' => 'Read more', 'href' => '/insights/davos-2025'],
                    ],
                ],
                'groups' => [
                    [
                        'label' => 'Inside QTECH',
                        'columns' => 1,
                        'links' => [
                            'Our Leadership Team', 'Our Tech Talent',
                            'Press Releases', 'Contact Us', 'FAQs',
                        ],
                    ],
                    [
                        'label' => 'Recognitions',
                        'columns' => 1,
                        'links' => ['Awards', 'Certifications'],
                    ],
                    [
                        'label' => 'Careers',
                        'columns' => 1,
                        'links' => [
                            'Working at QTECH', 'Job Opportunities',
                            'Talent Referrals', 'Our Circles Program', 'Company Culture',
                        ],
                    ],
                ],
            ],

            ['label' => 'Our Work', 'href' => '/case-studies', 'settings' => ['display' => 'link']],
            ['label' => 'Blog', 'href' => '/blog', 'settings' => ['display' => 'link']],

            [
                'label' => 'Schedule a Call',
                'href' => '/contact',
                'settings' => ['display' => 'link', 'is_cta' => true, 'variant' => 'solid'],
            ],
        ];
    }
}

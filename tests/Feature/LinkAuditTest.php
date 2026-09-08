<?php

namespace Tests\Feature;

use App\Http\Services\Cms\LinkAuditService;
use App\Models\AppSetting;
use App\Models\Cta;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Page;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * `cms:audit-links` / `LinkAuditService`: every internal CMS link must resolve
 * to a live page, a real route or a redirect.
 */
class LinkAuditTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        AppSetting::updateOrCreate(
            ['slug' => 'system_language_code'],
            ['title' => 'System Language Code', 'setting_value' => 'en'],
        );
        Cache::flush();
    }

    private function page(string $path, bool $home = false): Page
    {
        return Page::create([
            'uuid' => (string) Str::uuid(),
            'site_id' => 1,
            'translation_group_id' => (string) Str::uuid(),
            'locale' => 'en',
            'slug' => $home ? 'home' : trim($path, '/'),
            'path' => $path,
            'depth' => 0,
            'title' => ucfirst(trim($path, '/') ?: 'Home'),
            'is_homepage' => $home,
            'publish_status' => 'published',
            'published_at' => now(),
        ]);
    }

    public function test_a_clean_site_reports_nothing(): void
    {
        $home = $this->page('/', home: true);
        $about = $this->page('/about');

        $menu = Menu::create(['uuid' => (string) Str::uuid(), 'site_id' => 1, 'key' => 'header', 'name' => 'Header']);
        MenuItem::create([
            'uuid' => (string) Str::uuid(),
            'menu_id' => $menu->id,
            'path' => '/',
            'depth' => 0,
            'label' => 'About',
            'link_type' => 'page',
            'page_id' => $about->id,
            'status' => 'active',
        ]);

        $this->assertSame([], app(LinkAuditService::class)->run());
    }

    public function test_it_flags_a_menu_item_whose_page_was_deleted(): void
    {
        $this->page('/', home: true);
        $gone = $this->page('/gone');

        $menu = Menu::create(['uuid' => (string) Str::uuid(), 'site_id' => 1, 'key' => 'header', 'name' => 'Header']);
        MenuItem::create([
            'uuid' => (string) Str::uuid(),
            'menu_id' => $menu->id,
            'path' => '/',
            'depth' => 0,
            'label' => 'Ghost',
            'link_type' => 'page',
            'page_id' => $gone->id,
            'status' => 'active',
        ]);

        $gone->delete(); // soft delete — FK stays, ->exists() is now false

        $findings = app(LinkAuditService::class)->run();

        $this->assertContains('menu-item', array_column($findings, 'type'));
    }

    public function test_it_flags_a_cta_with_an_internal_url_to_nowhere(): void
    {
        $this->page('/', home: true);
        Cta::create([
            'uuid' => (string) Str::uuid(),
            'site_id' => 1,
            'label' => 'Go',
            'link_type' => 'url',
            'url' => '/nowhere-at-all',
        ]);

        $findings = app(LinkAuditService::class)->run();

        $this->assertContains('cta', array_column($findings, 'type'));
    }

    public function test_it_flags_an_orphan_page_but_not_a_child_of_a_published_parent(): void
    {
        $this->page('/', home: true);
        $parent = $this->page('/blog');
        $child = Page::create([
            'uuid' => (string) Str::uuid(),
            'site_id' => 1,
            'translation_group_id' => (string) Str::uuid(),
            'locale' => 'en',
            'parent_id' => $parent->id,
            'slug' => 'a-post',
            'path' => '/blog/a-post',
            'depth' => 1,
            'title' => 'A Post',
            'publish_status' => 'published',
            'published_at' => now(),
        ]);

        $orphans = array_filter(
            app(LinkAuditService::class)->run(),
            fn (array $f): bool => $f['type'] === 'orphan-page',
        );
        $paths = array_column($orphans, 'target');

        $this->assertContains('/blog', $paths);
        $this->assertNotContains('/blog/a-post', $paths);
    }
}

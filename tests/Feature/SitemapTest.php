<?php

namespace Tests\Feature;

use App\Models\AppSetting;
use App\Models\Language;
use App\Models\Page;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * `/sitemap.xml` — a single flat, multilingual, hreflang-annotated sitemap
 * built from published, indexable pages.
 */
class SitemapTest extends TestCase
{
    use RefreshDatabase;

    private string $group;

    protected function setUp(): void
    {
        parent::setUp();

        $this->setting('system_language_code', 'en');
        $this->setting('company_name', 'QTECH');
        Cache::flush();

        Language::query()->update(['status' => 'inactive']);
        Language::updateOrCreate(['code' => 'en'], ['name' => 'English', 'direction' => 'ltr', 'status' => 'active']);
        Language::updateOrCreate(['code' => 'nl'], ['name' => 'Dutch', 'direction' => 'ltr', 'status' => 'active']);
        Cache::flush();

        $this->group = (string) Str::uuid();
    }

    private function setting(string $slug, string $value): void
    {
        AppSetting::updateOrCreate(
            ['slug' => $slug],
            ['title' => Str::headline($slug), 'setting_value' => $value],
        );
    }

    private function page(array $attributes): Page
    {
        return Page::create(array_merge([
            'uuid' => (string) Str::uuid(),
            'site_id' => 1,
            'translation_group_id' => (string) Str::uuid(),
            'locale' => 'en',
            'slug' => Str::slug($attributes['path'] ?? 'p'),
            'depth' => 0,
            'title' => 'Page',
            'publish_status' => 'published',
            'published_at' => now(),
        ], $attributes));
    }

    public function test_it_lists_published_indexable_pages(): void
    {
        $this->page(['path' => '/', 'is_homepage' => true, 'slug' => 'home']);
        $this->page(['path' => '/services', 'depth' => 1]);

        $response = $this->get('/sitemap.xml')->assertOk();
        $response->assertHeader('content-type', 'application/xml; charset=UTF-8');

        $body = $response->getContent();
        $this->assertStringContainsString('<loc>'.url('/').'</loc>', $body);
        $this->assertStringContainsString('<loc>'.url('/services').'</loc>', $body);
        $this->assertStringContainsString('<priority>1.0</priority>', $body);
    }

    public function test_it_excludes_drafts_non_indexable_and_system_pages(): void
    {
        $this->page(['path' => '/live', 'depth' => 1]);
        $this->page(['path' => '/draft', 'depth' => 1, 'publish_status' => 'draft', 'published_at' => null]);
        $this->page(['path' => '/hidden', 'depth' => 1, 'is_indexable' => false]);
        $this->page(['path' => '/404', 'page_type' => 'system']);

        $body = $this->get('/sitemap.xml')->assertOk()->getContent();

        $this->assertStringContainsString('/live</loc>', $body);
        $this->assertStringNotContainsString('/draft</loc>', $body);
        $this->assertStringNotContainsString('/hidden</loc>', $body);
        $this->assertStringNotContainsString('/404</loc>', $body);
    }

    public function test_translated_pages_emit_hreflang_alternates(): void
    {
        $this->page(['path' => '/about', 'depth' => 1, 'translation_group_id' => $this->group]);
        $this->page(['path' => '/about', 'depth' => 1, 'locale' => 'nl', 'translation_group_id' => $this->group, 'slug' => 'about-nl']);

        $body = $this->get('/sitemap.xml')->assertOk()->getContent();

        $this->assertStringContainsString('hreflang="en"', $body);
        $this->assertStringContainsString('hreflang="nl"', $body);
        $this->assertStringContainsString('hreflang="x-default"', $body);
        $this->assertStringContainsString('href="'.url('/nl/about').'"', $body);
    }

    public function test_it_is_well_formed_xml(): void
    {
        $this->page(['path' => '/services', 'depth' => 1]);

        $body = $this->get('/sitemap.xml')->assertOk()->getContent();

        $this->assertNotFalse(simplexml_load_string($body));
    }

    public function test_it_404s_when_disabled(): void
    {
        $this->setting('sitemap_enabled', 'inactive');
        Cache::flush();

        $this->get('/sitemap.xml')->assertNotFound();
    }

    public function test_a_page_write_busts_the_cache(): void
    {
        $page = $this->page(['path' => '/services', 'depth' => 1]);
        $this->get('/sitemap.xml')->assertOk();

        app(\App\Http\Services\Backend\Cms\PageService::class)->forgetPage($page->refresh());
        $page->update(['path' => '/renamed-services', 'slug' => 'renamed-services']);
        app(\App\Http\Services\Backend\Cms\PageService::class)->forgetPage($page->refresh());

        $body = $this->get('/sitemap.xml')->assertOk()->getContent();
        $this->assertStringContainsString('/renamed-services</loc>', $body);
        $this->assertStringNotContainsString('/services</loc>', $body);
    }
}

<?php

namespace Tests\Feature;

use App\Models\AppSetting;
use App\Models\Language;
use App\Models\Page;
use App\Models\PageSection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * Phase B: locale-prefixed public URLs, first-visit country redirect, hreflang.
 *
 * Default locale (en) is unprefixed; `nl` is served under `/nl/…`. The `en`
 * page owns the sections; the `nl` page is its own row reusing them.
 */
class LocaleRoutingTest extends TestCase
{
    use RefreshDatabase;

    private string $group;

    protected function setUp(): void
    {
        parent::setUp();

        AppSetting::updateOrCreate(
            ['slug' => 'system_language_code'],
            ['title' => 'System Language Code', 'setting_value' => 'en'],
        );
        AppSetting::updateOrCreate(
            ['slug' => 'site_name'],
            ['title' => 'Site Name', 'setting_value' => 'QTECH'],
        );
        Cache::flush();

        Language::query()->update(['status' => 'inactive']);
        Language::updateOrCreate(['code' => 'en'], ['name' => 'English', 'direction' => 'ltr', 'status' => 'active']);
        Language::updateOrCreate(['code' => 'nl'], ['name' => 'Dutch', 'direction' => 'ltr', 'status' => 'active']);
        Cache::flush();

        $this->group = (string) Str::uuid();
        $this->seedPage('en', '/about', 'About', isHome: false);
        $this->seedPage('en', '/', 'Home', isHome: true);
    }

    private function seedPage(string $locale, string $path, string $title, bool $isHome): Page
    {
        $page = Page::create([
            'uuid' => (string) Str::uuid(),
            'site_id' => 1,
            'translation_group_id' => $path === '/' ? (string) Str::uuid() : $this->group,
            'locale' => $locale,
            'slug' => $path === '/' ? 'home' : trim($path, '/'),
            'path' => $path,
            'depth' => 0,
            'title' => $title,
            'is_homepage' => $isHome,
            'publish_status' => 'published',
            'published_at' => now(),
        ]);

        if ($locale === 'en') {
            PageSection::create([
                'uuid' => (string) Str::uuid(),
                'site_id' => 1,
                'page_id' => $page->id,
                'section_type' => 'hero.centered',
                'heading' => $title.' heading',
                'publish_status' => 'published',
                'published_at' => now(),
            ]);
        }

        return $page;
    }

    public function test_default_locale_is_unprefixed_and_not_redirected(): void
    {
        $this->get('/about')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->where('page.locale', 'en'));
    }

    public function test_a_nl_url_renders_the_shared_structure_in_dutch_locale(): void
    {
        $nl = Page::create([
            'uuid' => (string) Str::uuid(),
            'site_id' => 1,
            'translation_group_id' => $this->group,
            'locale' => 'nl',
            'slug' => 'about',
            'path' => '/about',
            'depth' => 0,
            'title' => 'Over ons',
            'publish_status' => 'published',
            'published_at' => now(),
        ]);

        $response = $this->get('/nl/about')->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('page.locale', 'nl')
            ->where('page.path', '/nl/about')
            ->has('sections', 1)
            ->has('alternates')
        );

        $this->assertNotNull($nl->fresh());
    }

    public function test_an_unknown_nl_url_is_a_404(): void
    {
        $this->get('/nl/does-not-exist')->assertNotFound();
    }

    public function test_a_nl_url_with_no_translation_falls_back_to_english_page(): void
    {
        // No nl row for /about -> the en page renders (fully English).
        $this->get('/nl/about')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->where('page.locale', 'en'));
    }

    public function test_first_visit_from_a_mapped_country_is_redirected_once(): void
    {
        $this->get('/about', ['CF-IPCountry' => 'NL'])
            ->assertRedirect('/nl/about');
    }

    public function test_a_locale_cookie_beats_country_detection(): void
    {
        $this->withUnencryptedCookie('locale', 'en')
            ->get('/about', ['CF-IPCountry' => 'NL'])
            ->assertOk();
    }

    public function test_the_bare_locale_root_renders_that_locale_homepage(): void
    {
        $this->get('/nl')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Public/Home'));
    }
}

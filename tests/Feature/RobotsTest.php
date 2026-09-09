<?php

namespace Tests\Feature;

use App\Models\AppSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * `/robots.txt` — generated from `reserved_path_prefixes` and the SEO settings
 * (`robots_allow_indexing`, `robots_ai_crawlers`, `sitemap_enabled`,
 * `robots_txt_extra`).
 */
class RobotsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    private function setting(string $slug, string $value): void
    {
        AppSetting::updateOrCreate(
            ['slug' => $slug],
            ['title' => Str::headline($slug), 'setting_value' => $value],
        );
        Cache::flush();
    }

    public function test_it_serves_the_full_rule_set_by_default(): void
    {
        $response = $this->get('/robots.txt')->assertOk();
        $response->assertHeader('content-type', 'text/plain; charset=UTF-8');

        $body = $response->getContent();
        $this->assertStringContainsString('Allow: /', $body);
        $this->assertStringContainsString('Disallow: /backend/', $body);
        $this->assertStringContainsString('Disallow: /preview/', $body);
        $this->assertStringContainsString('Sitemap: '.url('/sitemap.xml'), $body);
        $this->assertStringNotContainsString('Disallow: /robots.txt', $body);
    }

    public function test_the_master_switch_turns_every_crawler_away(): void
    {
        $this->setting('robots_allow_indexing', 'inactive');

        $body = $this->get('/robots.txt')->assertOk()->getContent();

        $this->assertSame("User-agent: *\nDisallow: /\n", $body);
        // sitemap.xml is withdrawn too.
        $this->get('/sitemap.xml')->assertNotFound();
    }

    public function test_it_blocks_tracking_parameter_urls(): void
    {
        $body = $this->get('/robots.txt')->assertOk()->getContent();

        $this->assertStringContainsString('Disallow: /*?*utm_source=', $body);
        $this->assertStringContainsString('Disallow: /*?*fbclid=', $body);
        $this->assertStringContainsString('Disallow: /*?*gclid=', $body);
    }

    public function test_ai_crawlers_are_welcomed_by_default(): void
    {
        $body = $this->get('/robots.txt')->assertOk()->getContent();

        $this->assertStringContainsString("User-agent: GPTBot\n", $body);
        $this->assertStringContainsString('User-agent: ClaudeBot', $body);
        $this->assertStringContainsString('User-agent: PerplexityBot', $body);
        $this->assertMatchesRegularExpression('/User-agent: Google-Extended\n(User-agent: .+\n)*Allow: \//', $body);
    }

    public function test_ai_crawlers_can_be_blocked(): void
    {
        $this->setting('robots_ai_crawlers', 'inactive');

        $body = $this->get('/robots.txt')->assertOk()->getContent();

        $this->assertMatchesRegularExpression('/User-agent: GPTBot\n(User-agent: .+\n)*Disallow: \//', $body);
        $this->assertStringContainsString("User-agent: *\nAllow: /", $body);
    }

    public function test_it_appends_extra_rules_and_respects_disabled_sitemap(): void
    {
        $this->setting('sitemap_enabled', 'inactive');
        $this->setting('robots_txt_extra', 'Disallow: /tmp/');

        $body = $this->get('/robots.txt')->assertOk()->getContent();

        $this->assertStringContainsString('Disallow: /tmp/', $body);
        $this->assertStringNotContainsString('Sitemap:', $body);
    }

    public function test_clearing_extra_rules_takes_effect_immediately(): void
    {
        $this->setting('robots_txt_extra', 'Disallow: /secret/');
        $this->assertStringContainsString('Disallow: /secret/', $this->get('/robots.txt')->getContent());

        // Saving through the real service must bust the cached body.
        app(\App\Http\Services\Backend\Settings\SettingsService::class)->save(['robots_txt_extra' => '']);

        $this->assertStringNotContainsString('Disallow: /secret/', $this->get('/robots.txt')->getContent());
    }
}

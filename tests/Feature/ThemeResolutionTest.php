<?php

namespace Tests\Feature;

use App\Constants\GlobalConfig;
use App\Enums\Common\Theme;
use Illuminate\Http\Request;
use Tests\TestCase;

class ThemeResolutionTest extends TestCase
{
    /**
     * Bind a request carrying (or missing) the theme cookie.
     */
    private function requestWithCookie(?string $value): void
    {
        $request = Request::create('/', 'GET', [], $value === null
            ? []
            : [GlobalConfig::THEME_COOKIE_NAME => $value]);

        $this->app->instance('request', $request);
    }

    public function test_it_reads_an_explicit_dark_preference_from_the_cookie(): void
    {
        $this->requestWithCookie(Theme::DARK->value);

        $this->assertSame(Theme::DARK->value, theme_preference());
        $this->assertSame(Theme::DARK->value, resolved_theme());
    }

    public function test_it_reads_an_explicit_light_preference_from_the_cookie(): void
    {
        $this->requestWithCookie(Theme::LIGHT->value);

        $this->assertSame(Theme::LIGHT->value, theme_preference());
        $this->assertSame(Theme::LIGHT->value, resolved_theme());
    }

    public function test_system_preference_falls_back_to_light_server_side(): void
    {
        $this->requestWithCookie(Theme::SYSTEM->value);

        $this->assertSame(Theme::SYSTEM->value, theme_preference());
        $this->assertSame(Theme::LIGHT->value, resolved_theme());
    }

    public function test_it_ignores_a_tampered_cookie_value(): void
    {
        $this->requestWithCookie('<script>alert(1)</script>');

        $this->assertContains(theme_preference(), Theme::getValues());
    }

    public function test_it_falls_back_to_the_app_setting_when_no_cookie_is_present(): void
    {
        $this->requestWithCookie(null);

        $this->assertContains(theme_preference(), Theme::getValues());
    }

    public function test_the_theme_cookie_is_excluded_from_encryption(): void
    {
        $encryptCookies = $this->app->make(\Illuminate\Cookie\Middleware\EncryptCookies::class);

        $this->assertTrue($encryptCookies->isDisabled(GlobalConfig::THEME_COOKIE_NAME));
    }
}

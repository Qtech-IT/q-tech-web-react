<?php

namespace Database\Seeders;

use App\Enums\Common\Status;
use App\Enums\Settings\SettingKey;
use App\Enums\System\CacheKey;
use App\Models\AppSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

/**
 * CMS settings as SEEDED ROWS. No schema change to `app_settings` — the table
 * already carries title/slug/parent_id/order_index/description/input_type/
 * default_value/input_options/setting_value/status, with input_type typed by
 * InputEnum.
 *
 * Two gotchas, both real, both handled below:
 *
 * 1. `app_settings.title` AND `app_settings.slug` are BOTH unique. Titles are
 *    therefore namespaced ("SEO — Default Meta Description") so a
 *    partially-seeded database cannot collide with an existing setting title.
 *
 * 2. LanguageService::makeDefault() does AppSetting::firstOrNew(['slug' => ...])
 *    and then derives `title` from key_to_value(). Any seeded setting whose
 *    title is NOT key_to_value()-derivable would produce a duplicate-title
 *    error if that pattern ever touched it — so titles are seeded explicitly
 *    and firstOrNew is keyed on slug here too.
 */
class CmsSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $order = 1000;

        foreach ($this->settings() as $slug => $definition) {
            $setting = AppSetting::firstOrNew(['slug' => $slug]);

            // Never overwrite a value an admin has already set.
            if ($setting->exists) {
                continue;
            }

            $setting->title = $definition['title'];
            $setting->description = $definition['description'] ?? null;
            $setting->input_type = SettingKey::from($slug)->inputType();
            $setting->input_options = $definition['options'] ?? null;
            $setting->default_value = $definition['default'] ?? null;
            $setting->setting_value = $definition['default'] ?? null;
            $setting->order_index = $order++;
            $setting->status = Status::ACTIVE;

            $setting->save();
        }

        Cache::forget(CacheKey::DEFAULT_SETTINGS->value);
        Cache::forget(CacheKey::CMS_SETTINGS->value);

        $this->command?->info('✅ CMS settings seeded.');
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    protected function settings(): array
    {
        return [
            SettingKey::SITE_TAGLINE->value => [
                'title' => 'Site — Tagline',
                'description' => 'Short line shown beside the company name.',
                'default' => null,
            ],

            SettingKey::DEFAULT_META_TITLE_SUFFIX->value => [
                'title' => 'SEO — Default Meta Title Suffix',
                'description' => 'Appended to every page title that does not override it.',
                'default' => null,
            ],

            SettingKey::DEFAULT_META_DESCRIPTION->value => [
                'title' => 'SEO — Default Meta Description',
                'description' => 'Used when a page has no SEO record and no excerpt.',
                'default' => null,
            ],

            SettingKey::DEFAULT_OG_MEDIA->value => [
                'title' => 'SEO — Default Social Share Image',
                'description' => 'One image, site-wide. A single scalar, so a setting rather than a table.',
                'default' => null,
            ],

            SettingKey::ORGANIZATION_SCHEMA_TYPE->value => [
                'title' => 'SEO — Organization Schema Type',
                'description' => 'JSON-LD @type for the organisation graph.',
                'default' => 'Organization',
                'options' => ['Organization', 'Corporation', 'LocalBusiness', 'ProfessionalService'],
            ],

            SettingKey::ORGANIZATION_LEGAL_NAME->value => [
                'title' => 'SEO — Organization Legal Name',
                'description' => 'Registered legal name, for structured data.',
                'default' => null,
            ],

            SettingKey::ORGANIZATION_FOUNDING_YEAR->value => [
                'title' => 'SEO — Organization Founding Year',
                'description' => 'Year the company was founded, for structured data.',
                'default' => null,
            ],

            SettingKey::GOOGLE_ANALYTICS_ID->value => [
                'title' => 'Analytics — Google Analytics ID',
                'description' => 'Measurement ID, e.g. G-XXXXXXX.',
                'default' => null,
            ],

            SettingKey::GOOGLE_TAG_MANAGER_ID->value => [
                'title' => 'Analytics — Google Tag Manager ID',
                'description' => 'Container ID, e.g. GTM-XXXXXX.',
                'default' => null,
            ],

            SettingKey::GOOGLE_SITE_VERIFICATION->value => [
                'title' => 'Analytics — Google Site Verification',
                'description' => 'Search Console verification token.',
                'default' => null,
            ],

            SettingKey::ROBOTS_TXT_EXTRA->value => [
                'title' => 'SEO — Extra robots.txt Rules',
                'description' => 'Appended verbatim to the generated robots.txt.',
                'default' => null,
            ],

            SettingKey::SITEMAP_ENABLED->value => [
                'title' => 'SEO — Sitemap Enabled',
                'description' => 'Serve /sitemap.xml.',
                'default' => Status::ACTIVE->value,
            ],

            SettingKey::SITEMAP_CHANGEFREQ->value => [
                'title' => 'SEO — Sitemap Change Frequency',
                'description' => 'Default changefreq hint for sitemap entries.',
                'default' => 'weekly',
                'options' => ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'],
            ],

            SettingKey::COOKIE_BANNER_ENABLED->value => [
                'title' => 'Privacy — Cookie Banner Enabled',
                'description' => 'Show the cookie consent banner.',
                'default' => Status::INACTIVE->value,
            ],

            SettingKey::COOKIE_POLICY_PAGE_ID->value => [
                'title' => 'Privacy — Cookie Policy Page',
                'description' => 'Page the cookie banner links to.',
                'default' => null,
            ],

            SettingKey::PREVIEW_TOKEN_TTL_MINUTES->value => [
                'title' => 'Content — Preview Link Lifetime (minutes)',
                'description' => 'How long a shared preview link stays valid. Preview tokens are never immortal.',
                'default' => 1440,
            ],

            SettingKey::MEDIA_MAX_IMAGE_DIMENSION->value => [
                'title' => 'Media — Maximum Image Dimension (px)',
                'description' => 'Uploaded images larger than this on their longest edge are downscaled.',
                'default' => 2560,
            ],

            SettingKey::MEDIA_AUTO_WEBP->value => [
                'title' => 'Media — Generate WebP Automatically',
                'description' => 'Create a WebP derivative alongside every uploaded raster image.',
                'default' => Status::ACTIVE->value,
            ],
        ];
    }
}

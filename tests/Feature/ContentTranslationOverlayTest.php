<?php

namespace Tests\Feature;

use App\Http\Services\Cms\ContentTranslationService;
use App\Http\Services\Cms\ContentTranslator;
use App\Models\AppSetting;
use App\Models\ContentTranslation;
use App\Models\Language;
use App\Models\Page;
use App\Models\PageSection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * The non-routable translation overlay (schema doc §8.2): a section carries the
 * default-locale text; any other locale's text is overlaid from
 * `content_translations` and falls back to the default when a row is missing.
 */
class ContentTranslationOverlayTest extends TestCase
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

        Language::firstOrCreate(
            ['code' => 'nl'],
            ['name' => 'Dutch', 'direction' => 'ltr', 'status' => 'active'],
        );
    }

    private function makeSection(array $attributes = []): PageSection
    {
        $group = (string) Str::uuid();

        $page = Page::create([
            'uuid' => (string) Str::uuid(),
            'site_id' => 1,
            'translation_group_id' => $group,
            'locale' => 'en',
            'slug' => 'overlay-'.Str::random(6),
            'path' => '/overlay-'.Str::random(6),
            'depth' => 0,
            'title' => 'Overlay page',
            'publish_status' => 'published',
            'published_at' => now(),
        ]);

        return PageSection::create(array_merge([
            'uuid' => (string) Str::uuid(),
            'site_id' => 1,
            'page_id' => $page->id,
            'section_type' => 'hero.centered',
            'heading' => 'English heading',
            'subheading' => 'English subheading',
            'data' => ['trust_label' => 'english trust'],
        ], $attributes));
    }

    public function test_default_locale_reads_base_columns_and_writes_nothing(): void
    {
        $section = $this->makeSection();

        app(ContentTranslator::class)->hydrate(collect([$section]), 'en');

        $this->assertSame('English heading', $section->heading);
        $this->assertSame(0, ContentTranslation::count());
    }

    public function test_a_translated_field_is_overlaid_and_the_rest_falls_back(): void
    {
        $section = $this->makeSection();

        app(ContentTranslationService::class)->saveSection($section, 'nl', [
            'heading' => 'Nederlandse kop',
            'data.trust_label' => 'nederlandse trust',
        ]);

        $fresh = PageSection::find($section->id);
        app(ContentTranslator::class)->hydrate(collect([$fresh]), 'nl');

        $this->assertSame('Nederlandse kop', $fresh->heading);
        $this->assertSame('nederlandse trust', data_get($fresh->data, 'trust_label'));
        // Untranslated field falls back to the English column.
        $this->assertSame('English subheading', $fresh->subheading);
    }

    public function test_emptying_a_value_deletes_the_overlay_row(): void
    {
        $section = $this->makeSection();
        $service = app(ContentTranslationService::class);

        $service->saveSection($section, 'nl', ['heading' => 'Kop']);
        $this->assertSame(1, $section->translations()->where('locale', 'nl')->count());

        $service->saveSection($section, 'nl', ['heading' => '']);
        $this->assertSame(0, $section->translations()->where('locale', 'nl')->count());
    }

    public function test_a_non_translatable_field_is_rejected(): void
    {
        $section = $this->makeSection();

        $this->expectException(\Illuminate\Validation\ValidationException::class);

        // `layout` on hero.centered is a `settings` (presentation) field.
        app(ContentTranslationService::class)->saveSection($section, 'nl', [
            'layout' => 'split',
        ]);
    }

    public function test_the_default_locale_cannot_be_written_as_a_translation(): void
    {
        $section = $this->makeSection();

        $this->expectException(\Illuminate\Validation\ValidationException::class);

        app(ContentTranslationService::class)->saveSection($section, 'en', [
            'heading' => 'nope',
        ]);
    }

    public function test_force_deleting_the_owner_cascades_the_overlay(): void
    {
        $section = $this->makeSection();
        app(ContentTranslationService::class)->saveSection($section, 'nl', ['heading' => 'Kop']);

        $this->assertSame(1, ContentTranslation::where('translatable_id', $section->id)->count());

        $section->forceDelete();

        $this->assertSame(0, ContentTranslation::where('translatable_id', $section->id)->count());
    }
}

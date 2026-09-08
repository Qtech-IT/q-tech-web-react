<?php

namespace Database\Seeders;

use App\Enums\Cms\ContentStatus;
use App\Enums\Common\Status;
use App\Enums\System\CacheKey;
use App\Http\Services\Backend\Cms\PageService;
use App\Http\Services\Cms\ContentTranslationService;
use App\Models\Language;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Page;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

/**
 * Seeds the Dutch (`nl`) locale — the site ships bilingual, en + nl only.
 *
 * Per schema doc §8.2, `nl` pages do NOT own sections: each is a `pages` row
 * sharing its English page's `translation_group_id`, reusing that page's
 * section tree, with translated text coming from the `content_translations`
 * overlay. This seeder therefore:
 *
 *   1. ensures the `nl` language row + lang file exist,
 *   2. creates + publishes an `nl` variant of every published English page
 *      (idempotent — an existing variant is left alone),
 *   3. overlays Dutch labels onto the navigation chrome and Dutch titles onto
 *      the pages themselves.
 *
 * Section body copy is deliberately NOT translated here — that is editorial
 * work done in the admin's language tabs. An untranslated field falls back to
 * English, which is the designed behaviour, not a gap.
 *
 * Runs last in DatabaseSeeder, after every English page + menu exists.
 */
class NlContentSeeder extends Seeder
{
    /** English page title => Dutch. Pages not listed keep the English title. */
    private const PAGE_TITLES = [
        'Home' => 'Home',
        'About QTECH' => 'Over QTECH',
        'Careers' => 'Vacatures',
        'Our Team' => 'Ons Team',
        'Services' => 'Diensten',
        'Technologies' => 'Technologieën',
        'Industries' => 'Sectoren',
        'Our Work' => 'Ons Werk',
        'Case Studies' => 'Praktijkvoorbeelden',
        'Blog' => 'Blog',
        'Contact QTECH' => 'Contact QTECH',
        'Frequently Asked Questions' => 'Veelgestelde Vragen',
        'Testimonials' => 'Referenties',
        'Awards & Certifications' => 'Prijzen & Certificeringen',
        'Privacy Policy' => 'Privacybeleid',
        'Terms of Service' => 'Servicevoorwaarden',
        'Cookie Policy' => 'Cookiebeleid',
        'Accessibility Statement' => 'Toegankelijkheidsverklaring',
        'AI & Automation' => 'AI & Automatisering',
        'Cloud & DevOps' => 'Cloud & DevOps',
        'Custom Software Development' => 'Maatwerksoftware',
        'Mobile App Development' => 'Mobiele App-ontwikkeling',
        'UX & UI Design' => 'UX & UI-ontwerp',
        'Web Application Development' => 'Webapplicatie-ontwikkeling',
        'Financial Services' => 'Financiële Dienstverlening',
        'Healthcare' => 'Zorg',
        'Logistics & Supply Chain' => 'Logistiek & Supply Chain',
        'Manufacturing' => 'Productie',
        'Public Sector' => 'Publieke Sector',
        'Retail & eCommerce' => 'Retail & eCommerce',
    ];

    /** English menu label => Dutch. Applied to the visible nav chrome only. */
    private const MENU_LABELS = [
        'Services' => 'Diensten',
        'Technologies' => 'Technologieën',
        'Industries' => 'Sectoren',
        'About' => 'Over ons',
        'Our Work' => 'Ons Werk',
        'Case Studies' => 'Praktijkvoorbeelden',
        'Blog' => 'Blog',
        'Schedule a Call' => 'Plan een gesprek',
        'Company' => 'Bedrijf',
        'Resources' => 'Bronnen',
        'Privacy Policy' => 'Privacybeleid',
        'Terms of Service' => 'Servicevoorwaarden',
        'Cookie Policy' => 'Cookiebeleid',
    ];

    public function run(): void
    {
        $locale = 'nl';

        if (! $this->ensureLanguage($locale)) {
            $this->command?->warn('NlContentSeeder skipped: could not create the nl language.');

            return;
        }

        Cache::forget(CacheKey::SITE_LANGUAGES->value);

        $pages = $this->translatePages($locale);
        $labels = $this->translateMenuLabels($locale);

        Cache::flush();

        $this->command?->info("NlContentSeeder: {$pages} nl page(s) ensured, {$labels} menu label(s) overlaid.");
    }

    private function ensureLanguage(string $locale): bool
    {
        $language = Language::firstOrCreate(
            ['code' => $locale],
            ['name' => 'Dutch', 'direction' => 'ltr', 'status' => Status::ACTIVE->value],
        );

        if ($language->status !== Status::ACTIVE && $language->status?->value !== Status::ACTIVE->value) {
            $language->forceFill(['status' => Status::ACTIVE->value])->save();
        }

        $dir = resource_path("lang/{$locale}");

        if (! File::exists($dir)) {
            File::makeDirectory($dir, 0755, true);
        }

        if (! File::exists("{$dir}/messages.php")) {
            $source = resource_path('lang/en/messages.php');
            File::put(
                "{$dir}/messages.php",
                File::exists($source) ? File::get($source) : "<?php\n\nreturn [];\n",
            );
        }

        return true;
    }

    private function translatePages(string $locale): int
    {
        $service = app(PageService::class);
        $count = 0;

        // Shallowest first, so a child's parent already has its nl sibling and
        // the path nests correctly.
        $englishPages = Page::query()
            ->where('site_id', (int) config('cms.site_id'))
            ->where('locale', default_locale())
            ->orderBy('depth')
            ->orderBy('path')
            ->get();

        foreach ($englishPages as $english) {
            $exists = Page::withTrashed()
                ->where('translation_group_id', $english->translation_group_id)
                ->where('locale', $locale)
                ->exists();

            if ($exists) {
                continue;
            }

            $nl = $service->createTranslation($english, $locale, [
                'title' => self::PAGE_TITLES[$english->title] ?? $english->title,
            ]);

            $nl->forceFill([
                'publish_status' => ContentStatus::PUBLISHED->value,
                'published_at' => $english->published_at ?? now(),
            ])->save();

            $count++;
        }

        return $count;
    }

    private function translateMenuLabels(string $locale): int
    {
        $service = app(ContentTranslationService::class);
        $menuIds = Menu::query()->pluck('id');
        $count = 0;

        MenuItem::query()
            ->whereIn('menu_id', $menuIds)
            ->whereIn('label', array_keys(self::MENU_LABELS))
            ->get()
            ->each(function (MenuItem $item) use ($service, $locale, &$count): void {
                $dutch = self::MENU_LABELS[$item->label] ?? null;

                if ($dutch === null) {
                    return;
                }

                $service->saveMenuItem($item, $locale, ['label' => $dutch]);
                $count++;
            });

        return $count;
    }
}

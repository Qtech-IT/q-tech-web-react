<?php

namespace Database\Seeders;

use App\Data\Seeder\Languages;
use App\Enums\System\CacheKey;
use App\Http\Services\Backend\LanguageService;
use App\Models\Language;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $langService = new LanguageService;

        foreach (Languages::ALL as $lang) {

            $code = $lang['code'];

            Language::updateOrCreate(
                ['code' => $code],
                [
                    'name' => $lang['name'],
                    'direction' => $lang['direction'],
                    'is_default' => false,
                ]
            );

            $langService->createLangFile($code);

        }

        Cache::forget(CacheKey::SITE_LANGUAGES->value);

    }
}

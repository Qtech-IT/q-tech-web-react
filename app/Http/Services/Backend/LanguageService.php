<?php

namespace App\Http\Services\Backend;

use App\Enums\Common\Status;
use App\Enums\Settings\SessionKey;
use App\Enums\Settings\SettingKey;
use App\Enums\System\CacheKey;
use App\Models\AppSetting;
use App\Models\Language;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

class LanguageService
{
    /**
     * Summary of getLanguages
     * @return Collection<int, Language>
     */
    public function getLanguages(): Collection
    {
        return Language::search(['name', 'code'])
                            ->latest()
                            ->get();
    }

    /**
     * Summary of save
     * @param Request $request
     * @return Language
     */
    public  function save(Request $request): Language
    {
        $code     = $request->input('code');
        $language = Language::where('code', $code)
                              ->orWhere('name', $request->input('name'))
                              ->first();
        if(!$language){
            $language             = new Language();
            $language->is_default = false;
        }

        $language->name      = $request->input('name');
        $language->code      = $code;
        $language->status    = $request->input('status', Status::ACTIVE);
        $language->direction = $request->input('direction');
        $language->save();

        $this->createLangFile($code);

        return $language;
    }

    /**
     * Summary of destroy
     * @param int|string $id
     * @return bool
     */
    public  function destroy(int | string $id): bool
    {
        $locale          = session()->get(SessionKey::LOCALE->value, App::getLocale());
        $defaultLangCode = site_settings(SettingKey::SYSYEM_LANGUAGE_CODE->value);

        $excludeCodes = [
                                $defaultLangCode,
                                'en',
                                $locale
                           ];

        $excludeCodes = array_unique(
            array_filter([
                                            $defaultLangCode,
                                            'en',
                                            $locale
                                    ])
        );

        $language = Language::where('id', $id)
                                ->whereNotIn('code', $excludeCodes)
                                ->firstOrFail();

        $langDir = base_path('resources/lang/' . $language->code);

        if (File::exists($langDir)) {
            File::cleanDirectory(directory: $langDir);
            File::deleteDirectory($langDir);
        }

        $language->delete();

        return true;
    }

    /**
     * Summary of translate
     * @param \Illuminate\Http\Request $request
     * @return bool
     */
    public function translate(Request $request): bool
    {
        $language = Language::where('code', $request->input('code'))
                                ->firstOrFail();
        $langArray = include(base_path(path: 'resources/lang/' . $language->code . '/messages.php'));

        collect($request->input('key_values'))
                          ->map(function(string $value, string $key) use(&$langArray): void{
                               if(isset($langArray[$key])) $langArray[$key] = $value;
                          });

        $str = '<?php return ' . var_export(value: $langArray, return: true) . ';';
        file_put_contents(filename: base_path('resources/lang/' . $language->code . '/messages.php'), data: $str);

        return true;
    }

    /**
     * Summary of makeDefault
     * @param Request $request
     * @return bool
     */
    public function makeDefault(Request $request): bool
    {
        $language = Language::where('id', $request->input('id'))
                             ->firstOrFail();

        $setting = AppSetting::firstOrNew([
                                            'slug' => SettingKey::SYSYEM_LANGUAGE_CODE->value,
                                        ]);

        $setting->title         = key_to_value(SettingKey::SYSYEM_LANGUAGE_CODE->value);
        $setting->setting_value = $language->code;
        $setting->save();

        Cache::forget(CacheKey::DEFAULT_SETTINGS->value);

        return true;
    }

    /**
     * Create a language file for the given language code.
     *
     * @param string $langCode
     * @return void
     */
    public function createLangFile(string $langCode): void
    {
        $langDir = resource_path("lang/{$langCode}");

        // Create language directory if it doesn't exist
        if (!File::exists($langDir)) {
            File::makeDirectory($langDir, 0777, true);
        }

        $langFilePath = "{$langDir}/messages.php";

        if (!File::exists($langFilePath)) {
            $defaultFile = resource_path('lang/en/messages.php');

            File::put(
                $langFilePath,
                File::exists($defaultFile)
                    ? File::get($defaultFile)  // copy content from default
                    : "<?php\n\nreturn [\n    // Add translations here\n];\n"
            );
        }
    }
}

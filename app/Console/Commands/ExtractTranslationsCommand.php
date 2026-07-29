<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

class ExtractTranslationsCommand extends Command
{
    protected $signature = 'translations:extract
                            {--locale= : Locale to write to (defaults to the application locale)}';

    protected $description = 'Scan the JS/TS sources for t(\'...\') calls and merge them into the locale messages file';

    private const SCANNABLE_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx'];

    private const TRANSLATION_PATTERN = "/\bt\s*\(\s*['\"`]([^'\"`]+)['\"`]\s*\)/";

    public function handle(): int
    {
        $locale = $this->option('locale') ?: App::getLocale();
        $langPath = resource_path("lang/{$locale}/messages.php");

        if (! File::exists(resource_path('js'))) {
            $this->error(translate('The resources/js directory does not exist.'));

            return self::FAILURE;
        }

        $strings = $this->extractStrings(resource_path('js'));
        $langArray = File::exists($langPath) ? include $langPath : [];

        if (! is_array($langArray)) {
            $this->error(translate('The existing translation file is malformed.'));

            return self::FAILURE;
        }

        foreach ($strings as $value) {
            $value = trim($value);
            $key = Str::slug($value, '_');

            // Two different strings can slug to the same key, keep both.
            if (isset($langArray[$key]) && $langArray[$key] !== $value) {
                $key .= '_'.substr(md5($value), 0, 5);
            }

            if (! isset($langArray[$key])) {
                $langArray[$key] = $value;
            }
        }

        File::ensureDirectoryExists(dirname($langPath));
        File::put($langPath, '<?php return '.var_export($langArray, true).';');

        $this->info(sprintf(
            'Extracted %d string(s); %s now holds %d translation(s).',
            count($strings),
            "resources/lang/{$locale}/messages.php",
            count($langArray)
        ));

        return self::SUCCESS;
    }

    /**
     * Collect every unique translatable string found under the given path.
     *
     * @return array<string, string>
     */
    private function extractStrings(string $path): array
    {
        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path));
        $strings = [];

        foreach ($files as $file) {
            if (! $file->isFile() || ! in_array($file->getExtension(), self::SCANNABLE_EXTENSIONS, true)) {
                continue;
            }

            preg_match_all(self::TRANSLATION_PATTERN, File::get($file->getPathname()), $matches);

            foreach ($matches[1] ?? [] as $match) {
                $strings[$match] = $match;
            }
        }

        return $strings;
    }
}

<?php

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;

use Illuminate\Support\Str;
use SebastianBergmann\CodeCoverage\Report\Xml\Report;

Route::get('/extract-translations', function () {
    $path  = resource_path('js');
    $files = new \RecursiveIteratorIterator(
        new \RecursiveDirectoryIterator($path)
    );

    $strings = [];

    // ✅ Step 1: Extract all t('...') strings
    foreach ($files as $file) {
        if ($file->isFile() && in_array($file->getExtension(), ['js', 'jsx', 'ts', 'tsx'])) {
            $content = file_get_contents($file->getPathname());

            preg_match_all("/\bt\s*\(\s*['\"`]([^'\"`]+)['\"`]\s*\)/", $content, $matches);

            foreach ($matches[1] ?? [] as $match) {
                $strings[$match] = $match; // unique values
            }
        }
    }

    $local    = App::getLocale();
    $langPath = base_path("resources/lang/{$local}/messages.php");

    // ✅ Step 2: Load file ONCE
    $lang_array = file_exists($langPath) ? include $langPath : [];

    // ✅ Step 3: Process strings
    foreach ($strings as $value) {
        $value = trim($value);

        // Generate key (slug style)
        $key = Str::slug($value, '_');

        // ✅ Fix duplicate key issue
        if (isset($lang_array[$key]) && $lang_array[$key] !== $value) {
            $key .= '_' . substr(md5($value), 0, 5);
        }

        // ✅ Insert if not exists
        if (!isset($lang_array[$key])) {
            $lang_array[$key] = $value;
        }
    }

    // ✅ Step 4: Write file ONCE
    $content = '<?php return ' . var_export($lang_array, true) . ';';
    file_put_contents($langPath, $content);

    return response()->json([
        'status'  => 'success',
        'total'   => count($strings),
        'updated' => count($lang_array),
    ]);
});

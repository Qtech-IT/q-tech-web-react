<?php

namespace App\Http\Services\Backend\Settings;

use App\Constants\DefaultSettings ;
use App\Constants\FilePathConstants;
use App\Constants\GlobalConfig;
use App\Enums\Settings\SettingKey;
use App\Enums\System\CacheKey;
use App\Http\Resources\Backend\SettingsResource;
use App\Models\AppSetting;
use App\Traits\Common\Fileable;
use App\Traits\Common\ModelAction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Env;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Service class for managing application settings.
 *
 * Handles retrieval, saving, validation, and system-level checks.
 */
class SettingsService
{
    use Fileable, ModelAction;

    /**
     * Set or update an environment variable in the .env file.
     *
     * @param string $key
     * @param string $value
     */
    private function setEnvironmentValue(string $key, string $value): void
    {
        $path       = base_path('.env');
        $envContent = file_get_contents($path);

        if (preg_match('/^' . preg_quote($key, '/') . '=/m', $envContent)) {
            $envContent = preg_replace('/^' . preg_quote($key, '/') . '.*/m', $key . '=' . $value, $envContent);
        } else {
            $envContent .= PHP_EOL . $key . '=' . $value . PHP_EOL;
        }

        file_put_contents($path, $envContent);
    }

    /**
     * Get application settings along with additional metadata.
     *
     * @return array{
     *     countries: array,
     *     date_formats: array,
     *     time_formats: array,
     *     default_template_code: array,
     *     supported_file_types: array,
     *     time_zones: array,
     *     settings: array
     * }
     */
    public function getSettings(array $settingKeys = []): array
    {
        $settings = AppSetting::with('file')
                                    ->when(count($settingKeys) > 0, fn(Builder $q): Builder => $q->whereIn('slug', $settingKeys))
                                    ->get();

        return [
            'dateFormats'           => GlobalConfig::DATE_FORMAT,
            'timeFormats'           => GlobalConfig::TIME_FORMAT,
            'timeZones'             => \DateTimeZone::listIdentifiers(),
            'default_template_code' => GlobalConfig::DEFAULT_TEMPLATE_CODE,
            'settings'              => formatResourceResponse($settings, SettingsResource::class)
        ];
    }

    /**
     * Save or update application settings.
     *
     * Handles JSON serialization, file uploads for logos, and database transactions.
     *
     * @param Request $request
     * @return array
     */
    public function save(array $data): array
    {
        $jsonKeys = GlobalConfig::SETTINGS_JSON_KEYS;

        collect($data)->each(function (mixed $value, string $slug) use ($jsonKeys) {
            $isLogo = in_array($slug, DefaultSettings::getLogoKeys());

            $value = in_array($slug, $jsonKeys) || is_array($value) ? json_encode($value) : $value;

            DB::transaction(function () use ($slug, $value, $isLogo) {
                $setting = AppSetting::with('file')
                            ->firstOrNew([
                                'slug' => $slug
                            ]);

                $setting->title         = key_to_value($slug);
                $setting->setting_value = !$isLogo ? $value : null;

                $setting->save();

                if ($isLogo) $this->saveLogo($setting, $value, $slug);
            });
        });

        Cache::forget(CacheKey::COMPANY_LOGOS->value);
        Cache::forget(CacheKey::DEFAULT_SETTINGS->value);

        // The generated robots.txt and the sitemap (its changefreq hint) are
        // cached as rendered strings; forgetting DEFAULT_SETTINGS alone does
        // not reach them.
        Cache::forget(CacheKey::CMS_SETTINGS->for('robots'));
        $sitemapRegistry = CacheKey::CMS_KEY_REGISTRY->for(CacheKey::CMS_SITEMAP->value);
        foreach (Cache::get($sitemapRegistry, []) as $sitemapKey) {
            Cache::forget($sitemapKey);
        }
        Cache::forget($sitemapRegistry);

        return [
            'status'  => true,
            'message' => translate('Settings saved successfully')
        ];
}

    /**
     * Toggle application debug mode and debugbar status in .env.
     *
     * @return array
     */
    public function toggleAppDebug(): array
    {
        foreach (['APP_DEBUG', 'DEBUGBAR_ENABLED'] as $key) {
           $this->setEnvironmentValue($key, !Env::get($key));
        }

        optimize_clear();

        return [
            'status'  => true,
            'message' => translate('Debug mode toggled successfully')
        ];
    }

    /**
     * Save uploaded logo file for a setting.
     *
     * @param AppSetting $setting
     * @param mixed $file
     * @param string $key
     */
    private function saveLogo(AppSetting $setting, mixed $file, string $key): void
    {
        if (is_file($file?->getPathname())) {
            $this->saveFile(
                model: $setting,
                response: $this->storeFile(
                    file: $file,
                    location: FilePathConstants::getPath($key)['path'],
                    removeFile: $setting?->file
                ),
                type: $key
            );
        }
    }

    /**
     * Get system information including environment, versions, and health checks.
     *
     * @return array{
     *     environment: mixed,
     *     debug_mode: mixed,
     *     timezone: mixed,
     *     php_version: string,
     *     laravel_version: string,
     *     server_software: string,
     *     database_version: string,
     *     memory_limit: bool|string,
     *     max_execution_time: bool|string,
     *     upload_max_filesize: bool|string,
     *     cache_driver: mixed,
     *     session_driver: mixed,
     *     additional_info: array,
     *     health_checks: array
     * }
     */
    public function getSystemInformation(): array
    {
        return [
            'environment'         => config('app.env'),
            'debug_mode'          => config('app.debug'),
            'timezone'            => site_settings(SettingKey::TIMEZONE->value),
            'php_version'         => PHP_VERSION,
            'laravel_version'     => app()->version(),
            'server_software'     => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'database_version'    => $this->getDatabaseVersion(),
            'memory_limit'        => ini_get('memory_limit'),
            'max_execution_time'  => ini_get('max_execution_time'),
            'upload_max_filesize' => ini_get('upload_max_filesize'),
            'cache_driver'        => config('cache.default'),
            'session_driver'      => config('session.driver'),
            'additional_info'     => [
                ['label' => 'Post Max Size', '  value' => ini_get('post_max_size')],
                ['label' => 'Max Input Vars',  'value' => ini_get('max_input_vars')],
                ['label' => 'Queue Driver',    'value' => config('queue.default')],
                ['label' => 'Mail Driver', '    value' => config('mail.default')],
                ['label' => 'Broadcast Driver', 'value' => config('broadcasting.default')],
                ['label' => 'Filesystem Driver', 'value' => site_settings(SettingKey::STORAGE->value)],
            ],
            'health_checks' => [
                ['name' => 'Database Connection', 'status' => $this->checkDatabaseConnection()],
                ['name' => 'Cache System', 'status' => $this->checkCacheSystem()],
                ['name' => 'Storage Writable', 'status' => $this->checkStorageWritable()],
                ['name' => 'Mail Configuration', 'status' => $this->checkMailConfig()],
            ],
        ];
    }

    /**
     * Get database version depending on the connection driver.
     *
     * @return string
     */
    private function getDatabaseVersion(): string
    {
        try {
            $connection = config('database.default');
            $driver     = config("database.connections.{$connection}.driver");

            return match($driver) {
                'mysql'  => DB::select('SELECT VERSION() as version')[0]->version,
                'pgsql'  => DB::select('SELECT version() as version')[0]->version,
                'sqlite' => DB::select('SELECT sqlite_version() as version')[0]->version,
                default  => 'Unknown',
            };
        } catch (\Exception) {
            return 'Unable to determine';
        }
    }

    /**
     * Check database connection availability.
     *
     * @return bool
     */
    private function checkDatabaseConnection(): bool
    {
        try {
            DB::connection()->getPdo();
            return true;
        } catch (\Exception) {
            return false;
        }
    }

    /**
     * Check cache system functionality.
     *
     * @return bool
     */
    private function checkCacheSystem(): bool
    {
        $cacheKey = CacheKey::HELTH_CHECK->value;

        try {
            Cache::put($cacheKey, 'test', 1);
            $result = Cache::get($cacheKey) === 'test';
            Cache::forget($cacheKey);
            return $result;
        } catch (\Exception) {
            return false;
        }
    }

    /**
     * Check if storage directory is writable.
     *
     * @return bool
     */
    private function checkStorageWritable(): bool
    {
        try {
            $testFile = storage_path('app/health_check.txt');
            file_put_contents($testFile, 'test');
            $result = file_exists($testFile);
            if ($result) unlink($testFile);
            return $result;
        } catch (\Exception) {
            return false;
        }
    }

    /**
     * Check if mail configuration exists and is functional.
     *
     * @return bool
     */
    private function checkMailConfig(): bool
    {
        try {
        $mailer = config('mail.mailer') ?? config('mail.default');
        $host   = config("mail.mailers.$mailer.host");
        $port   = config("mail.mailers.$mailer.port");
        $from   = config('mail.from.address');

        if (!$mailer || !$host || !$port || !$from) {
            return false;
        }

        return true;
    } catch (\Throwable) {
        return false;
    }
    }
}

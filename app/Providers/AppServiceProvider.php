<?php

namespace App\Providers;

use App\Enums\Settings\SettingKey;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // You can bind additional services here if needed
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Builder::macro('findOrFailByUuid', function (string $uuid){
            /** @var Builder $this */
            return $this->where('uuid', $uuid)->firstOrfail();
        });

        Builder::macro('findByUuid', function (string $uuid): ?Model {
            /** @var Builder $this */
            return $this->where('uuid', $uuid)->first();
        });

        // Set session timeout from site settings
        try {
            $timeout = (int) site_settings(SettingKey::SESSION_TIMEOUT->value);

            // Fallback to 120 minutes if invalid
            if ($timeout < 1) {
                $timeout = 120;
            }

            Config::set('session.lifetime', $timeout);
        } catch (\Throwable $e) {
            // Default session timeout
            Config::set('session.lifetime', 120);
        }

        // Prefetch Vite assets for faster loading
        Vite::prefetch(concurrency: 3);
    }
}

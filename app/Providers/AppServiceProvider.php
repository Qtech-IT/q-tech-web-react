<?php

namespace App\Providers;

use App\Enums\Settings\SettingKey;
use App\Http\Services\Backend\Cms\SectionTypeRegistry;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
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
        // The section type registry is a singleton: discovery and the §4.2
        // self-check must happen once per process, not once per resolve.
        //
        // The self-check is a DEVELOPMENT assertion. It runs everywhere except
        // production, so an illegal field descriptor fails on the developer's
        // first local request rather than silently shipping; in production the
        // same check is a CI step (`php artisan cms:validate-registry`).
        $this->app->singleton(SectionTypeRegistry::class, function ($app): SectionTypeRegistry {
            return new SectionTypeRegistry(
                typeClasses: (array) config('cms.section_types', []),
                selfCheck: ! $app->environment('production'),
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        /*
         * Morph map — NON-ENFORCING, deliberately.
         *
         * Relation::enforceMorphMap() is global and all-or-nothing: once
         * called, any morph write whose class is absent from the map throws.
         * Turning it on in the same release as the files backfill would mean a
         * rollback leaves enforcement active against un-backfilled data, so
         * the flip is deferred to a following release and gated on
         *   SELECT DISTINCT fileable_type FROM files WHERE fileable_type LIKE 'App\\%'
         * returning zero rows.
         *
         * Until then, reads resolve both aliases and raw FQCNs, which is what
         * lets the legacy `files` rows keep working during the transition.
         */
        Relation::morphMap((array) config('morph-map.aliases', []));

        Builder::macro('findOrFailByUuid', function (string $uuid) {
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

<?php

namespace App\Providers;

use App\Builders\AppResponseBuilder;
use Illuminate\Support\ServiceProvider;

class AppResponseServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Bind the AppResponseBuilder to the service container
        $this->app->singleton(abstract: 'AppResponseBuilder', concrete: function (): AppResponseBuilder {
            return new AppResponseBuilder();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
  
    }
}
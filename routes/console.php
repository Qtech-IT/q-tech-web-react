<?php

use App\Enums\System\CacheKey;
use App\Jobs\Cms\PublishScheduledContentJob;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
	$this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('cache:clear')
	->daily()
	->at('02:00')
	->onSuccess(fn () => Cache::put(CacheKey::LAST_CRON_EXECUTION->value, now()->toISOString(), 60 * 24))
	->onFailure(fn () => Log::error('Scheduled cache:clear command failed'));

Schedule::command('queue:work --stop-when-empty --max-time=240')
	->everyFiveMinutes()
	->withoutOverlapping()
	->onSuccess(fn () => Cache::put(CacheKey::LAST_CRON_EXECUTION->value, now()->toISOString(), 60 * 24));

Schedule::command('backup:run --only-db')
	->dailyAt('02:00')
	->onSuccess(fn () => Log::info('Database backup completed successfully'))
	->onFailure(fn () => Log::error('Database backup failed'));

Schedule::command('log:clear')
	->weeklyOn(0, '03:00')
	->onSuccess(fn () => Log::info('Log cleanup completed'));

Schedule::command('optimize:clear')
	->weekly()
	->sundays()
	->at('04:00');

Schedule::call(function () {
	Cache::put(CacheKey::LAST_CRON_EXECUTION->value, now()->toISOString(), 60 * 24);
})->everyMinute();

Schedule::command('horizon:snapshot:custom')
	->everyFiveMinutes();

/*
 * The CMS janitor. Not on the critical path: the ->published() scope already
 * admits a scheduled row the moment its published_at passes, so content goes
 * live whether or not this ever runs. This keeps publish_status honest for
 * admin filters and the sitemap, and fires the cache invalidation a pure
 * query-time check cannot.
 */
Schedule::job(new PublishScheduledContentJob())
	->everyFiveMinutes()
	->withoutOverlapping()
	->onFailure(fn () => Log::error('CMS scheduled-content janitor failed'));

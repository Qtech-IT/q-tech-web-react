<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class HorizonSnapshotCommand extends Command
{
    protected $signature = 'horizon:snapshot:custom';
    protected $description = 'Run Laravel Horizon snapshot and log output';

    public function handle()
    {
        $this->info('Running Horizon snapshot...');

        Artisan::call('horizon:snapshot');

        $this->info('Horizon snapshot completed at ' . now());
        return 0;
    }
}

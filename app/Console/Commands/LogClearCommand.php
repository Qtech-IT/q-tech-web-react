<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class LogClearCommand extends Command
{
    protected $signature = 'log:clear {--days=30 : Number of days to keep logs}';
    protected $description = 'Clear old log files';

    public function handle()
    {
        $days = $this->option('days');
        $logPath = storage_path('logs');

        if (!File::exists($logPath)) {
            $this->error('Logs directory does not exist.');
            return 1;
        }

        $files = File::glob($logPath . '/*.log');
        $cutoffDate = now()->subDays($days);
        $deletedCount = 0;

        foreach ($files as $file) {
            $fileTime = File::lastModified($file);

            if ($fileTime < $cutoffDate->timestamp) {
                File::delete($file);
                $deletedCount++;
                $this->info('Deleted: ' . basename($file));
            }
        }

        $this->info("Deleted {$deletedCount} log files older than {$days} days.");
        return 0;
    }
}

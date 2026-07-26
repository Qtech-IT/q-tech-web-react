<?php

namespace App\Http\Services\Backend\Settings;

use App\Enums\Common\Status;
use App\Enums\System\CacheKey;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AutomationService
{
    /**
     * Get comprehensive automation data
     * @return array
     */
    public function getAutomationData(): array
    {
        return [
            'cron_status'  => $this->getCronStatus(),
            'active_jobs'  => $this->getActiveJobsCount(),
            'last_run'     => $this->getLastRunTime(),
            'success_rate' => $this->getSuccessRate(),
            'cron_command' => $this->getCronCommand(),
            'commands'     => $this->getScheduledCommands(),
            'history'      => $this->getExecutionHistory()
        ];
    }

    /**
     * Run command by ID
     * @param string $commandId
     * @return bool
     */
    public function runCommandById(string $commandId): bool
    {
        $commands = $this->getAvailableCommands();
        $command  = collect($commands)->firstWhere('id', $commandId);

        if (!$command) {
            throw new \Exception("Command not found: {$commandId}");
        }

        try {
            $startTime = microtime(true);
            $exitCode  = Artisan::call($command['command']);
            $duration  = microtime(true) - $startTime;

            // Log execution
            $this->logCommandExecution($command['command'], $exitCode === 0 ? 'success' : 'failed', $duration);

            return $exitCode === 0;
        } catch (\Exception $e) {
            $this->logCommandExecution($command['command'], 'failed', 0, $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get cron status
     * @return string
     */
    private function getCronStatus(): string
    {
        // Check if Laravel scheduler is configured
        $cronCommand = $this->getCronCommand();

        // Check if there's a recent execution log
        $lastRun    = Cache::get(CacheKey::LAST_CRON_EXECUTION->value);

        if ($lastRun && Carbon::parse($lastRun)->diffInMinutes(now()) < 2) return key_to_value (Status::ACTIVE->value);

        return  key_to_value (Status::INACTIVE->value);

    }

    /**
     * Get active jobs count
     * @return int
     */
    private function getActiveJobsCount(): int
    {
        $commands = $this->getScheduledCommands();
        return collect($commands)->where('status', Status::ACTIVE->value)->count();
    }

    /**
     * Get last run time
     * @return string|null
     */
    private function getLastRunTime(): ?string
    {
        $lastRun = Cache::get(CacheKey::LAST_CRON_EXECUTION->value);

        if ($lastRun) {
            return Carbon::parse($lastRun)->diffForHumans();
        }

        return null;
    }

    /**
     * Get success rate
     * @return float
     */
    private function getSuccessRate(): float
    {
        $history = $this->getExecutionHistory();

        if (empty($history)) {
            return 0;
        }

        $successful = collect($history)->where('status', 'success')->count();
        $total      = count($history);

        return round(($successful / $total) * 100, 1);
    }

    /**
     * Get cron command
     * @return string
     */
    private function getCronCommand(): string
    {
        $projectPath = base_path();
        return "* * * * * cd {$projectPath} && php artisan schedule:run >> /dev/null 2>&1";
    }

    /**
     * Get scheduled commands
     * @return array
     */
    private function getScheduledCommands(): array
    {
        $commands = $this->getAvailableCommands();
        $result = [];

        foreach ($commands as $command) {
            $result[] = [
                'id'          => $command['id'],
                'name'        => $command['name'],
                'description' => $command['description'],
                'command'     => $command['command'],
                'schedule'    => $command['schedule'],
                'status'      => $this->getCommandStatus($command['command']),
                'last_run'    => $this->getCommandLastRun($command['command']),
                'duration'    => $this->getCommandLastDuration($command['command']),
                'next_run'    => $this->getCommandNextRun($command['schedule'])
            ];
        }

        return $result;
    }

    /**
     * Get available commands
     * @return array
     */
    private function getAvailableCommands(): array
    {
        return [
            [
                'id'          => 'cache_clear',
                'name'        => 'Clear Cache',
                'description' => 'Clear application cache to free up memory',
                'command'     => 'cache:clear',
                'schedule'    => 'daily'
            ],
            [
                'id'          => 'queue_work',
                'name'        => 'Process Queue Jobs',
                'description' => 'Process pending queue jobs',
                'command'     => 'queue:work --stop-when-empty',
                'schedule'    => '*/5 * * * *'
            ],
            [
                'id'          => 'backup_db',
                'name'        => 'Database Backup',
                'description' => 'Create database backup',
                'command'     => 'backup:run --only-db',
                'schedule'    => '0 2 * * *'
            ],
            [
                'id'          => 'log_clear',
                'name'        => 'Clear Old Logs',
                'description' => 'Remove logs older than 30 days',
                'command'     => 'log:clear',
                'schedule'    => '0 3 * * 0'
            ],
            [
                'id'          => 'optimize',
                'name'        => 'Optimize Application',
                'description' => 'Run optimization commands',
                'command'     => 'optimize',
                'schedule'    => 'weekly'
            ],
            [
                'id'          => 'horizon_snapshot',
                'name'        => 'Horizon Snapshot',
                'description' => 'Take Horizon metrics snapshot',
                'command'     => 'horizon:snapshot',
                'schedule'    => '*/15 * * * *'
            ]
        ];
    }

    /**
     * Get command status
     * @param string $command
     * @return string
     */
    private function getCommandStatus(string $command): string
    {
        $history = $this->getCommandHistory($command);

        if (empty($history)) {
            return 'pending';
        }

        $lastExecution = collect($history)->first();
        return $lastExecution['status'] ?? 'unknown';
    }

    /**
     * Get command last run
     * @param string $command
     * @return string|null
     */
    private function getCommandLastRun(string $command): ?string
    {
        $history = $this->getCommandHistory($command);

        if (empty($history)) {
            return null;
        }

        $lastExecution = collect($history)->first();
        return Carbon::parse($lastExecution['timestamp'])->diffForHumans();
    }

    /**
     * Get command last duration
     * @param string $command
     * @return int
     */
    private function getCommandLastDuration(string $command): int
    {
        $history = $this->getCommandHistory($command);

        if (empty($history)) {
            return 0;
        }

        $lastExecution = collect($history)->first();
        return (int) ($lastExecution['duration'] ?? 0);
    }

    /**
     * Get command next run time
     * @param string $schedule
     * @return string|null
     */
    private function getCommandNextRun(string $schedule): ?string
    {
        try {
            // Parse common cron expressions
            switch ($schedule) {
                case 'daily':
                    return Carbon::tomorrow()->format('Y-m-d H:i:s');
                case 'weekly':
                    return Carbon::now()->next(Carbon::SUNDAY)->format('Y-m-d H:i:s');
                case 'monthly':
                    return Carbon::now()->addMonth()->startOfMonth()->format('Y-m-d H:i:s');
                case '*/5 * * * *':
                    return Carbon::now()->addMinutes(5)->format('Y-m-d H:i:s');
                case '*/15 * * * *':
                    return Carbon::now()->addMinutes(15)->format('Y-m-d H:i:s');
                case '0 2 * * *':
                    $next = Carbon::tomorrow()->setTime(2, 0);
                    return $next->format('Y-m-d H:i:s');
                case '0 3 * * 0':
                    return Carbon::now()->next(Carbon::SUNDAY)->setTime(3, 0)->format('Y-m-d H:i:s');
                default:
                    return 'Unknown schedule';
            }
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get execution history
     * @return array
     */
    private function getExecutionHistory(): array
    {
        $cacheKey = CacheKey::AUTOMATION_EXECUTION_HISTORY->value;
        $history  = Cache::get($cacheKey, []);

        return collect($history)
           ->map(function ($item) {

            $item['timestamp'] = diff_for_humans($item['timestamp']);
            return $item;
        })->toArray();

    }

    /**
     * Get command history
     * @param string $command
     * @return array
     */
    private function getCommandHistory(string $command): array
    {
        $history = $this->getExecutionHistory();
        return collect($history)->where('command', $command)->toArray();
    }

    /**
     * Log command execution
     * @param string $command
     * @param string $status
     * @param float $duration
     * @param string|null $error
     * @return void
     */
    private function logCommandExecution(string $command, string $status, float $duration, ?string $error = null): void
    {
        $cacheKey = CacheKey::AUTOMATION_EXECUTION_HISTORY->value;

        $history = Cache::get($cacheKey, []);

        // Add new execution to history
        array_unshift($history, [
            'command'   => $command,
            'status'    => $status,
            'duration'  => round($duration, 2),
            'timestamp' => now()->toISOString(),
            'error'     => $error
        ]);

        // Keep only last 100 executions
        $history = array_slice($history, 0, 100);

        // Store in cache for 24 hours
        Cache::put($cacheKey, $history, 60 * 24);

        // Update last execution time
        Cache::put(CacheKey::LAST_CRON_EXECUTION->value, now()->toISOString(), 60 * 24);

        // Log to Laravel log
        if ($status === 'success') {
            Log::info("Automation command executed successfully", [
                'command'  => $command,
                'duration' => $duration
            ]);
        } else {
            Log::error("Automation command failed", [
                'command'  => $command,
                'error'    => $error,
                'duration' => $duration
            ]);
        }
    }

    /**
     * Get system cron jobs (if accessible)
     * @return array
     */
    public function getSystemCronJobs(): array
    {
        try {
            // This might not work on all systems due to permissions
            $output = shell_exec('crontab -l 2>/dev/null');

            if (!$output) {
                return [];
            }

            $lines = explode("\n", trim($output));
            $jobs = [];

            foreach ($lines as $line) {
                $line = trim($line);
                if (!empty($line) && !str_starts_with($line, '#')) {
                    $jobs[] = [
                        'schedule' => $line,
                        'command'  => $line
                    ];
                }
            }

            return $jobs;
        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Check if cron is properly configured
     * @return bool
     */
    public function isCronConfigured(): bool
    {
        $systemJobs = $this->getSystemCronJobs();
        $expectedCommand = $this->getCronCommand();

        foreach ($systemJobs as $job) {
            if (str_contains($job['command'], 'schedule:run')) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get cron configuration recommendations
     * @return array
     */
    public function getCronRecommendations(): array
    {
        $recommendations = [];

        if (!$this->isCronConfigured()) {
            $recommendations[] = [
                'type'    => 'warning',
                'title'   => 'Cron Job Not Configured',
                'message' => 'The Laravel scheduler cron job is not configured on this server.',
                'action'  => 'Add the cron command to your server\'s crontab'
            ];
        }

        $lastRun = Cache::get(CacheKey::LAST_CRON_EXECUTION->value);
        if (!$lastRun || Carbon::parse($lastRun)->diffInHours(now()) > 2) {
            $recommendations[] = [
                'type'    => 'error',
                'title'   => 'Scheduler Not Running',
                'message' => 'The Laravel scheduler hasn\'t run recently.',
                'action'  => 'Check your cron configuration and server status'
            ];
        }

        return $recommendations;
    }
}
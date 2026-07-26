<?php

namespace App\Console\Commands;

use App\Http\Services\Backend\Settings\BackupService as SettingsBackupService;
use Illuminate\Console\Command;

class BackupCommand extends Command
{
    protected $signature = 'backup:run {--only-db : Only backup database}';
    protected $description = 'Create application backup';



    public function __construct(protected SettingsBackupService $backupService){
         parent::__construct();
    }



    public function handle(): int
    {
        $this->info('Starting backup process...');

        if ($this->option('only-db')) {
            $this->backupDatabase();
        } else {
            $this->backupApplication();
        }

        $this->info('Backup completed successfully.');
        return 0;
    }


    /**
     * Summary of backupDatabase
     * @return void
     */
    private function backupDatabase(): void
    {
        $this->backupService->createDatabaseBackup();
    }

    private function backupApplication(): void
    {
        $this->backupService->createApplicationBackup();
    }
}
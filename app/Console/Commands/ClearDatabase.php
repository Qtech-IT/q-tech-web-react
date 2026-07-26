<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ClearDatabase extends Command
{
    protected $signature = 'db:clear';

    protected $description = 'Clear all database tables without foreign key checks and run optimization';

    public function handle()
    {
        if (!$this->confirm('This will delete all data in your database. Are you sure?')) {
            $this->info('Command cancelled.');
            return Command::SUCCESS;
        }

        try {
            // Disable foreign key checks
            DB::statement('SET FOREIGN_KEY_CHECKS=0');
            
            $this->info('Foreign key checks disabled.');

            // Get all tables
            $tables = DB::select('SHOW TABLES');
            $tableNames = array_column($tables, 'Tables_in_' . env('DB_DATABASE'));

            if (empty($tableNames)) {
                $this->info('No tables found to clear.');
            } else {
                // Truncate each table
                foreach ($tableNames as $table) {
                    DB::table($table)->truncate();
                    $this->line("Cleared table: <fg=green>$table</>");
                }
                $this->info('All tables cleared successfully.');
            }

            // Re-enable foreign key checks
            DB::statement('SET FOREIGN_KEY_CHECKS=1');
            $this->info('Foreign key checks re-enabled.');

            // Run optimize clear
            $this->call('optimize:clear');
            $this->info('Cache and routes cleared.');

            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error('An error occurred: ' . $e->getMessage());
            DB::statement('SET FOREIGN_KEY_CHECKS=1');
            return Command::FAILURE;
        }
    }
}
<?php

namespace App\Http\Services\Backend\Settings;

use App\Traits\Common\Fileable;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class BackupService
{

    use Fileable;
    private string $backupPath;

    public function __construct()
    {
        $this->backupPath = storage_path('backups');
        $this->ensureBackupDirectoryExists();
    }

    
    /**
     * Summary of getAllBackups
     * @return array{data: array}
     */
    public function getAllBackups(): array
    {
        $backups = [];

        if (!is_dir($this->backupPath))  return ['data' => []];
        $files = glob($this->backupPath . '/*.sql');

        foreach ($files as $file) {
            $filename = basename($file);
            $backups[] = [
                'id'                => md5($filename),
                'filename'          => $filename,
                'size'              => $this->formatSize(filesize($file)),
                'size_bytes'        => filesize($file),
                'created_at'        => Carbon::createFromTimestamp(filemtime($file))->format('d M, Y H:i:s'),
                'created_timestamp' => filemtime($file),
                'path'              => $file
            ];
        }

        // Sort by creation time (newest first)
        usort($backups, function($a, $b) {
            return $b['created_timestamp'] <=> $a['created_timestamp'];
        });

        return ['data' => $backups];
    }

    /**
     * Create a new database backup
     */
    public function createDatabaseBackup(): array
    {
        try {
            $dbName   = config('database.connections.mysql.database');
            $username = config('database.connections.mysql.username');
            $password = config('database.connections.mysql.password');
            $host     = config('database.connections.mysql.host');
            $port     = config('database.connections.mysql.port', 3306);

            $backupFile = $this->backupPath . '/db_' . date('Y-m-d_H-i-s') . '.sql';

            // Build mysqldump command
            $command = sprintf(
                'mysqldump --user=%s --password=%s --host=%s --port=%s --single-transaction --routines --triggers %s > %s 2>&1',
                escapeshellarg($username),
                escapeshellarg($password),
                escapeshellarg($host),
                escapeshellarg($port),
                escapeshellarg($dbName),
                escapeshellarg($backupFile)
            );

            exec($command, $output, $returnVar);

            if ($returnVar === 0 && file_exists($backupFile) && filesize($backupFile) > 0) {
             
                return [
                    'status'  => true,
                    'message' => translate('Database backup created successfully'),
                    'file'    => $backupFile
                ];
            } else {
                // Clean up failed backup file
                if (file_exists($backupFile)) {
                    unlink($backupFile);
                }

                Log::error('Database backup failed', [
                    'command'     => $command,
                    'output'      => $output,
                    'return_code' => $returnVar
                ]);

                return [
                    'status'  => false,
                    'message' => translate('Database backup failed. Please check your database configuration.')
                ];
            }
        } catch (\Exception $e) {
            Log::error('Database backup exception: ' . $e->getMessage());
            return [
                'status'  => false,
                'message' => 'Database backup failed: ' . $e->getMessage()
            ];
        }
    }




    /**
     * Create a new application backup
     */
    public function createApplicationBackup(): bool
    {

        // Implement full application backup logic
        Log::info('Full application backup not implemented yet.');

        $backupDir = storage_path('backups');
        if (!is_dir($backupDir)) {
            mkdir($backupDir, 0755, true);
        }

        $fileName = 'app_' . date('Y-m-d_H-i-s') . '.zip';
        $backupFile = $backupDir . '/' . $fileName;

        // Exclude vendor and node_modules for smaller backup
        $exclude = [
            'vendor',
            'node_modules',
            'storage/framework/cache',
            'storage/framework/views',
            'storage/logs',
        ];

        $excludeArgs = implode(' ', array_map(fn($dir) => "--exclude=$dir", $exclude));

        $command = sprintf(
            'cd %s && zip -r %s . %s',
            base_path(),
            escapeshellarg($backupFile),
            $excludeArgs
        );

        exec($command, $output, $returnVar);

        if ($returnVar === 0) {
            Log::info('Full application backup saved to: ' . $backupFile);
            return true;
        }

         Log::error('Application backup failed');
         return  false;

    }

    /**
     * Delete a specific backup
     */
    public function deleteBackup(string $backupId): array
    {
        $backups = $this->getAllBackups();

        foreach ($backups['data'] as $backup) {
            if ($backup['id'] === $backupId) {
                if (file_exists($backup['path'])) {
                    if (unlink($backup['path'])) {
                        return [
                            'status'  => true,
                            'message' => translate('Backup deleted successfully')
                        ];
                    }
                }
                break;
            }
        }

        return [
            'status'  => false,
            'message' => translate('Backup not found or could not be deleted')
        ];
    }

    /**
     * Delete all backups
     */
    public function deleteAllBackups(): array
    {
        try {
            $files = glob($this->backupPath . '/*.sql');
            $deletedCount = 0;

            foreach ($files as $file) {
                if (unlink($file)) {
                    $deletedCount++;
                }
            }

            return [
                'status'  => true,
                'message' => translate("Successfully deleted {$deletedCount} backup(s)")
            ];
        } catch (\Exception $e) {
            return [
                'status'  => false,
                'message' => 'Error deleting backups: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get backup file path by ID
     */
    public function getBackupPath(string $backupId): array
    {
        $backups = $this->getAllBackups();

        foreach ($backups['data'] as $backup) {
            if ($backup['id'] === $backupId) {
                return [
                    'status'  => true,
                    'path'    => $backup['path'],
                    'message' => translate('Backup downloaded')
                ];
            }
        }

        return [
            'status'  => false,
            'message' => translate('Backup not found')
        ];
    }

    /**
     * Get storage information
     */
    public function getStorageInfo(): array
    {
        $backups = $this->getAllBackups();
        $totalSize = 0;

        foreach ($backups['data'] as $backup) {
            $totalSize += $backup['size_bytes'];
        }

        return [
            'total_backups'    => count($backups['data']),
            'total_size'       => $this->formatSize($totalSize),
            'total_size_bytes' => $totalSize,
            'backup_path'      => $this->backupPath
        ];
    }

    /**
     * Ensure backup directory exists
     */
    private function ensureBackupDirectoryExists(): void
    {
        if (!is_dir($this->backupPath)) {
            mkdir($this->backupPath, 0755, true);
        }
    }


}

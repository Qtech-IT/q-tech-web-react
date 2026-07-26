<?php

namespace App\Http\Services\Backend\Settings;

use App\Enums\Common\Status;
use App\Enums\System\CacheKey as SystemCacheKey;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;

class CacheService
{
    /**
     * Get comprehensive cache information
     * @return array
     */
    public function getCacheInformation(): array
    {
        $driver      = config('cache.default');
        $cacheConfig = config("cache.stores.{$driver}");

        return [
            'driver'      => $driver,
            'status'      => $this->getCacheStatus(),
            'total_size'  => $this->getCacheSize(),
            'hit_rate'    => $this->getCacheHitRate(),
            'default_ttl' => config('cache.ttl', 3600),
            'prefix'      => $cacheConfig['prefix'] ?? config('cache.prefix'),
            'serializer'  => $this->getCacheSerializer(),
            'statistics'  => $this->getCacheStatistics(),
            'stores'      => $this->getCacheStores(),
        ];
    }

    /**
     * Clear cache by type
     * @param string $type
     * @return int
     * @throws \Exception
     */
    public function clearCacheByType(string $type): int
    {
        switch ($type) {
            case 'application':
                return Artisan::call('cache:clear');
            case 'route':
                return Artisan::call('route:clear');
            case 'config':
                return Artisan::call('config:clear');
            case 'view':
                return Artisan::call('view:clear');
            case 'compiled':
                return Artisan::call('clear-compiled');
            default:
                throw new \Exception("Unknown cache type: {$type}");
        }
    }

    /**
     * Clear all caches
     * @return bool
     */
    public function clearAllCache(): bool
    {
        try {
            Artisan::call('cache:clear');
            Artisan::call('route:clear');
            Artisan::call('config:clear');
            Artisan::call('view:clear');

            // If using OPcache
            if (function_exists('opcache_reset')) {
                opcache_reset();
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to clear all caches: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get cache status
     * @return string
     */
    private function getCacheStatus(): string
    {
        $cacheKey = SystemCacheKey::CACHE_TEST->value;

        try {
            Cache::put($cacheKey, 'test_value', 60);
            $testResult = Cache::get($cacheKey);
            Cache::forget($cacheKey);

            return  key_to_value ($testResult === 'test_value' 
                                          ? Status::ACTIVE->value 
                                          : Status::INACTIVE->value);
        } catch (\Exception $e) {
            return 'Inactive';
        }
    }

    /**
     * Get total cache size
     * @return int
     */
    private function getCacheSize(): int
    {
        $driver = config('cache.default');

        try {
            switch ($driver) {
                case 'redis':
                    return $this->getRedisCacheSize();
                case 'file':
                    return $this->getFileCacheSize();
                case 'database':
                    return $this->getDatabaseCacheSize();
                default:
                    return 0;
            }
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Get cache hit rate
     * @return float|int|null
     */
    private function getCacheHitRate(): float|int|null
    {
        $driver = config('cache.default');

        try {
            switch ($driver) {
                case 'redis':
                    return $this->getRedisCacheHitRate();
                default:
                    return null;
            }
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get cache serializer
     * @return string
     */
    private function getCacheSerializer(): string
    {
        $driver = config('cache.default');
        $config = config("cache.stores.{$driver}");

        return $config['serializer'] ?? 'PHP';
    }

    /**
     * Get cache statistics
     * @return array
     */
    private function getCacheStatistics(): array
    {
        $driver = config('cache.default');

        try {
            switch ($driver) {
                case 'redis':
                    return $this->getRedisStatistics();
                case 'file':
                    return $this->getFileStatistics();
                case 'database':
                    return $this->getDatabaseStatistics();
                default:
                    return $this->getBasicStatistics();
            }
        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Get all cache stores information
     * @return array
     */
    private function getCacheStores(): array
    {
        $stores = config('cache.stores');
        $result = [];

        foreach ($stores as $name => $config) {
            $result[] = [
                'name'   => $name,
                'driver' => $config['driver'],
                'status' => $this->getStoreStatus($name),
                'size'   => $this->getStoreSize($name),
                'keys'   => $this->getStoreKeyCount($name),
            ];
        }

        return $result;
    }

    /**
     * Check if driver is supported
     * @param string $driver
     * @return bool
     */
    private function isDriverSupported(string $driver): bool
    {
        switch ($driver) {
            case 'dynamodb':
                return class_exists('Aws\DynamoDb\DynamoDbClient');
            case 'redis':
                return extension_loaded('redis') || class_exists('Predis\Client');
            case 'memcached':
                return extension_loaded('memcached');
            case 'file':
            case 'database':
            case 'array':
            case 'null':
                return true;
            default:
                return false;
        }
    }

    /**
     * Get store status with driver support checking
     * @param string $storeName
     * @return string
     */
    private function getStoreStatus(string $storeName): string
    {
        try {
            $config = config("cache.stores.{$storeName}");

            // Check if driver is supported/available
            if (!$this->isDriverSupported($config['driver'])) {
                return 'unsupported';
            }

            $key = "test_{$storeName}_" . time();
            Cache::store($storeName)->put($key, 'test', 1);
            $result = Cache::store($storeName)->get($key);
            Cache::store($storeName)->forget($key);

            return $result === 'test' ? Status::ACTIVE->value : Status::INACTIVE->value;
        } catch (\Exception $e) {
            Log::warning("Cache store '{$storeName}' test failed: " . $e->getMessage());
            return 'error';
        }
    }

    /**
     * Get store size by driver type
     * @param string $storeName
     * @return int
     */
    private function getStoreSize(string $storeName): int
    {
        try {
            $config = config("cache.stores.{$storeName}");

            switch ($config['driver']) {
                case 'redis':
                    return $this->getRedisStoreSize($storeName);
                case 'file':
                    return $this->getFileStoreSize($storeName);
                case 'database':
                    return $this->getDatabaseStoreSize($storeName);
                case 'array':
                    return 0;
                case 'null':
                    return 0;
                default:
                    return 0;
            }
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Get store key count
     * @param string $storeName
     * @return mixed
     */
    private function getStoreKeyCount(string $storeName): mixed
    {
        try {
            $config = config("cache.stores.{$storeName}");

            switch ($config['driver']) {
                case 'redis':
                    $redis = Redis::connection($storeName);
                    return $redis->dbSize();
                case 'database':
                    $table = $config['table'] ?? 'cache';
                    return DB::table($table)->count();
                default:
                    return null;
            }
        } catch (\Exception $e) {
            return null;
        }
    }

    // Redis specific methods
    private function getRedisCacheSize(): int
    {
        try {
            $redis = Redis::connection();
            $info = $redis->info('memory');
            return $info['used_memory'] ?? 0;
        } catch (\Exception $e) {
            return 0;
        }
    }

    private function getRedisCacheHitRate(): float|int
    {
        try {
            $redis = Redis::connection();
            $info  = $redis->info('stats');

            $hits   = $info['keyspace_hits'] ?? 0;
            $misses = $info['keyspace_misses'] ?? 0;
            $total  = $hits + $misses;

            return $total > 0 ? round(($hits / $total) * 100, 2) : 0;
        } catch (\Exception $e) {
            return 0;
        }
    }


    /**
     * Summary of getRedisStatistics
     * @return array<array{label: string, value: mixed|array{label: string, value: string}>}
     */
    private function getRedisStatistics(): array
    {
        try {
            $redis = Redis::connection();
            $info = $redis->info();

            return [
                ['label' => 'Connected Clients', 'value' => $info['connected_clients'] ?? 0],
                ['label' => 'Total Commands Processed', 'value' => number_format($info['total_commands_processed'] ?? 0)],
                ['label' => 'Keyspace Hits', 'value' => number_format($info['keyspace_hits'] ?? 0)],
                ['label' => 'Keyspace Misses', 'value' => number_format($info['keyspace_misses'] ?? 0)],
                ['label' => 'Expired Keys', 'value' => number_format($info['expired_keys'] ?? 0)],
                ['label' => 'Evicted Keys', 'value' => number_format($info['evicted_keys'] ?? 0)],
            ];
        } catch (\Exception $e) {
            return [];
        }
    }


    /**
     * Summary of getRedisStoreSize
     * @param string $storeName
     * @return int
     */
    private function getRedisStoreSize(string $storeName): int
    {
        try {
            $redis = Redis::connection($storeName);
            $info  = $redis->info('memory');
            return $info['used_memory'] ?? 0;
        } catch (\Exception $e) {
            return 0;
        }
    }


    /**
     * Summary of getFileCacheSize
     * @return int
     */
    private function getFileCacheSize(): int
    {
        $cachePath = storage_path('framework/cache');

        if (!is_dir($cachePath)) return 0;

        $size = 0;
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($cachePath, \RecursiveDirectoryIterator::SKIP_DOTS)
        );

        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $size += $file->getSize();
            }
        }

        return $size;
    }


    /**
     * Summary of getFileStatistics
     * @return array{label: string, value: string[]}
     */
    private function getFileStatistics(): array
    {
        $cachePath = storage_path('framework/cache');
        $fileCount = 0;
        $totalSize = 0;

        if (is_dir($cachePath)) {
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($cachePath, \RecursiveDirectoryIterator::SKIP_DOTS)
            );

            foreach ($iterator as $file) {
                if ($file->isFile()) {
                    $fileCount++;
                    $totalSize += $file->getSize();
                }
            }
        }

        return [
            ['label' => 'Cache Files',       'value' => number_format($fileCount)],
            ['label' => 'Average File Size', 'value' => $fileCount > 0 ? $this->formatBytes($totalSize / $fileCount) : '0 B'],
            ['label' => 'Cache Directory', '  value' => $cachePath],
        ];
    }


    /**
     * Summary of getFileStoreSize
     * @param string $storeName
     * @return int
     */
    private function getFileStoreSize(string $storeName): int
    {
        try {
            $config    = config("cache.stores.{$storeName}");
            $cachePath = $config['path'] ?? storage_path('framework/cache/data');

            if (!is_dir($cachePath)) {
                return 0;
            }

            $size = 0;
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($cachePath, \RecursiveDirectoryIterator::SKIP_DOTS)
            );

            foreach ($iterator as $file) {
                if ($file->isFile()) {
                    $size += $file->getSize();
                }
            }

            return $size;
        } catch (\Exception $e) {
            return 0;
        }
    }


    /**
     * Summary of getDatabaseCacheSize
     * @return int
     */
    private function getDatabaseCacheSize(): int
    {
        try {
            $table = config('cache.stores.database.table', 'cache');
            $count = DB::table($table)->count();

            // Rough estimate: assume average of 1KB per cache entry
            return $count * 1024;
        } catch (\Exception $e) {
            return 0;
        }
    }


    /**
     * Summary of getDatabaseStatistics
     * @return array<array{label: string, value: mixed|array{label: string, value: string}>}
     */
    private function getDatabaseStatistics(): array
    {
        try {
            $table   = config('cache.stores.database.table', 'cache');
            $count   = DB::table($table)->count();
            $expired = DB::table($table)->where('expiration', '<', now()->timestamp)->count();

            return [
                ['label' => 'Total Entries', 'value'   => number_format($count)],
                ['label' => 'Expired Entries', 'value' => number_format($expired)],
                ['label' => 'Valid Entries', 'value'   => number_format($count - $expired)],
                ['label' => 'Cache Table', 'value'     => $table],
            ];
        } catch (\Exception $e) {
            return [];
        }
    }


    /**
     * Summary of getDatabaseStoreSize
     * @param string $storeName
     * @return int
     */
    private function getDatabaseStoreSize(string $storeName): int
    {
        try {
            $config     = config("cache.stores.{$storeName}");
            $table      = $config['table'] ?? 'cache';
            $connection = $config['connection'] ?? config('database.default');

            // Get total size of cache entries (rough estimate)
            $result = DB::connection($connection)
                                ->table($table)
                                ->selectRaw('SUM(LENGTH(value)) as total_size')
                                ->first();

            return $result->total_size ?? 0;
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Summary of getBasicStatistics
     * @return array<array{label: string, value: mixed|array{label: string, value: string}>}
     */
    private function getBasicStatistics(): array
    {
        return [
            ['label' => 'Default Driver', 'value' => config('cache.default')],
            ['label' => 'Cache Prefix', 'value' => config('cache.prefix') ?: 'None'],
            ['label' => 'Default TTL', 'value' => config('cache.ttl', 3600) . ' seconds'],
        ];
    }

    /**
     * Format bytes to human readable format
     * @param int|float $bytes
     * @return string
     */
    private function formatBytes(int|float $bytes): string
    {
        if ($bytes == 0) return '0 B';

        $k     = 1024;
        $sizes = ['B', 'KB', 'MB', 'GB'];
        $i     = floor(log($bytes) / log($k));

        return round($bytes / pow($k, $i), 2) . ' ' . $sizes[$i];
    }
}
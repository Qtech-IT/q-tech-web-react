<?php

namespace App\Models;

use App\Enums\Cms\RedirectSource;
use App\Enums\Common\Status;
use App\Traits\Cms\HasAuditUsers;
use App\Traits\Common\Filterable;
use App\Traits\Common\HasUuid;
use App\Traits\Common\UsesUuidRouting;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Redirect extends Model
{
    use Filterable;
    use HasAuditUsers;
    use HasUuid;
    use SoftDeletes;
    use UsesUuidRouting;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'site_id',
        'from_path',
        'from_hash',
        'to_path',
        'status_code',
        'is_regex',
        'preserve_query',
        'source',
        'hits',
        'last_hit_at',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'source' => RedirectSource::class,
            'status' => Status::class,
            'is_regex' => 'boolean',
            'preserve_query' => 'boolean',
            'status_code' => 'integer',
            'hits' => 'integer',
            'last_hit_at' => 'datetime',
        ];
    }

    /**
     * The only permitted HTTP status codes for a redirect.
     */
    public const STATUS_CODES = [301, 302, 307, 308];

    /**
     * Normalize a path to the canonical stored form: leading slash, no
     * trailing slash, no host, no query string.
     *
     * Both the writer and the resolver must agree on this, or the hash lookup
     * silently misses.
     */
    public static function normalizePath(string $path): string
    {
        $path = trim($path);
        $path = parse_url($path, PHP_URL_PATH) ?: '/';
        $path = '/'.ltrim($path, '/');
        $path = rtrim($path, '/');

        return $path === '' ? '/' : $path;
    }

    /**
     * The indexed lookup key. A fixed 64-byte hash beats a 2000-byte
     * VARCHAR(500) index key and lets from_path stay full fidelity.
     */
    public static function hashFor(string $path, int $siteId = 1): string
    {
        return hash('sha256', $siteId.'|'.self::normalizePath($path));
    }
}

<?php

namespace App\Models;

use App\Traits\Cms\HasAuditUsers;
use App\Traits\Common\Filterable;
use App\Traits\Common\HasUuid;
use App\Traits\Common\UsesUuidRouting;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Never extends BaseModel: BaseModel::getRouteKeyName() returns 'uid', which
 * matches no column in any migration. HasUuid + UsesUuidRouting is the correct
 * pair — the first fills `uuid` on creating, the second binds routes to it.
 */
class MediaFolder extends Model
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
        'parent_id',
        'name',
        'slug',
        'path',
        'depth',
        'sort_order',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'depth' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Parent folder. RESTRICT at the DB level — never orphan media silently.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /**
     * Direct child folders.
     */
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('sort_order');
    }

    /**
     * Media filed directly in this folder.
     */
    public function media(): HasMany
    {
        return $this->hasMany(Media::class, 'folder_id');
    }
}

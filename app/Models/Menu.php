<?php

namespace App\Models;

use App\Enums\Common\Status;
use App\Traits\Cms\HasAuditUsers;
use App\Traits\Common\Filterable;
use App\Traits\Common\HasUuid;
use App\Traits\Common\UsesUuidRouting;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Menu extends Model
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
        'key',
        'name',
        'location',
        'max_depth',
        'settings',
        'is_locked',
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
            'status' => Status::class,
            'settings' => 'array',
            'is_locked' => 'boolean',
            'max_depth' => 'integer',
        ];
    }

    /**
     * Every item in the menu, flat, ordered — the shape MenuTreeService nests.
     *
     * One query for the whole tree, which is what makes the adjacency list
     * cheaper than nested sets here: the assembled tree is cached wholesale
     * and rebuilt only on write.
     */
    public function items(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'menu_id')
            ->orderBy('depth')
            ->orderBy('sort_order');
    }

    /**
     * Top-level items only.
     */
    public function rootItems(): HasMany
    {
        return $this->items()->whereNull('parent_id');
    }
}

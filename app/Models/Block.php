<?php

namespace App\Models;

use App\Enums\Cms\ContentStatus;
use App\Enums\Common\Status;
use App\Traits\Cms\HasAuditUsers;
use App\Traits\Cms\HasContentTranslations;
use App\Traits\Cms\Publishable;
use App\Traits\Common\Filterable;
use App\Traits\Common\HasUuid;
use App\Traits\Common\UsesUuidRouting;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Reusable global content — the identity layer only. A block's CONTENT is a
 * `page_sections` row with page_id NULL and block_id pointing back here.
 */
class Block extends Model
{
    use Filterable;
    use HasAuditUsers;
    use HasContentTranslations;
    use HasUuid;
    use Publishable;
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
        'description',
        'section_type',
        'is_locked',
        'status',
        'publish_status',
        'published_at',
        'expires_at',
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
            'status' => Status::class,
            'publish_status' => ContentStatus::class,
            'is_locked' => 'boolean',
            'published_at' => 'datetime',
            'expires_at' => 'datetime',
            'sort_order' => 'integer',
        ];
    }

    /**
     * This block's own content row: the page_sections row with page_id NULL.
     */
    public function body(): HasOne
    {
        return $this->hasOne(PageSection::class, 'block_id')->whereNull('page_id');
    }

    /**
     * Every page section that REFERENCES this block. Backed by
     * IDX page_sections_block, and read on invalidation to find every page
     * whose cached payload embeds this block.
     */
    public function usages(): HasMany
    {
        return $this->hasMany(PageSection::class, 'block_id')->whereNotNull('page_id');
    }
}

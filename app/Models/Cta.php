<?php

namespace App\Models;

use App\Enums\Cms\CtaLinkType;
use App\Enums\Cms\IconPosition;
use App\Enums\Common\Status;
use App\Traits\Cms\HasAuditUsers;
use App\Traits\Common\Filterable;
use App\Traits\Common\HasUuid;
use App\Traits\Common\UsesUuidRouting;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Every button, everywhere.
 *
 * One table rather than ~17 inlined columns on page_sections (twice, for
 * primary and secondary), section_blocks, and menu_items — that would be 68
 * duplicated columns and four places to fix the same link-resolution bug.
 */
class Cta extends Model
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
        'label',
        'aria_label',
        'link_type',
        'url',
        'route_name',
        'route_params',
        'page_id',
        'target_type',
        'target_id',
        'variant',
        'size',
        'icon',
        'icon_position',
        'opens_in_new_tab',
        'is_download',
        'rel',
        'tracking_id',
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
            'link_type' => CtaLinkType::class,
            'icon_position' => IconPosition::class,
            'status' => Status::class,
            'route_params' => 'array',
            'opens_in_new_tab' => 'boolean',
            'is_download' => 'boolean',
        ];
    }

    /**
     * Destination page when link_type = 'page'. A real FK, so deleting a page
     * surfaces the broken button instead of hiding it.
     */
    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'page_id');
    }

    /**
     * Destination entity when link_type = 'entity'.
     */
    public function target(): MorphTo
    {
        return $this->morphTo('target', 'target_type', 'target_id');
    }
}

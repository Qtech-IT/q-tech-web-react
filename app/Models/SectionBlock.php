<?php

namespace App\Models;

use App\Enums\Cms\SectionLinkType;
use App\Enums\Common\Status;
use App\Traits\Cms\HasContentTranslations;
use App\Traits\Cms\HasMedia;
use App\Traits\Common\Filterable;
use App\Traits\Common\HasUuid;
use App\Traits\Common\UsesUuidRouting;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A repeated item inside a section.
 *
 * No HasAuditUsers: the section is the meaningful audit unit and its revision
 * snapshots its blocks, so per-block authorship stays recoverable without two
 * columns on every one of N rows.
 */
class SectionBlock extends Model
{
    use Filterable;
    use HasContentTranslations;
    use HasMedia;
    use HasUuid;
    use SoftDeletes;
    use UsesUuidRouting;

    /**
     * Maximum nesting depth. One level of children only (tab -> tab items,
     * accordion -> rows); enforced in SectionBlockService.
     */
    public const MAX_DEPTH = 2;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'page_section_id',
        'parent_id',
        'block_type',
        'label',
        'value',
        'description',
        'body',
        'icon',
        'media_id',
        'cta_id',
        'link_type',
        'link_target_type',
        'link_target_id',
        'link_url',
        'data',
        'settings',
        'status',
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
            'link_type' => SectionLinkType::class,
            'status' => Status::class,
            'data' => 'array',
            'settings' => 'array',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Owning section.
     */
    public function section(): BelongsTo
    {
        return $this->belongsTo(PageSection::class, 'page_section_id');
    }

    /**
     * Parent item, for one level of nesting.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /**
     * Nested child items, in order.
     */
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('sort_order');
    }

    /**
     * Per-item image.
     */
    public function primaryMedia(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'media_id');
    }

    /**
     * Per-item call to action (pricing tier button, card link).
     */
    public function cta(): BelongsTo
    {
        return $this->belongsTo(Cta::class, 'cta_id');
    }

    /**
     * Entity this item links to when link_type = 'entity'. Resolved through
     * the morph map; unmapped aliases return null rather than throwing.
     */
    public function linkTarget(): MorphTo
    {
        return $this->morphTo('link_target', 'link_target_type', 'link_target_id');
    }
}

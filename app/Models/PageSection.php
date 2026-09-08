<?php

namespace App\Models;

use App\Enums\Cms\ContentStatus;
use App\Enums\Common\Status;
use App\Traits\Cms\HasAuditUsers;
use App\Traits\Cms\HasContentTranslations;
use App\Traits\Cms\HasMedia;
use App\Traits\Cms\Publishable;
use App\Traits\Common\Filterable;
use App\Traits\Common\HasUuid;
use App\Traits\Common\UsesUuidRouting;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PageSection extends Model
{
    use Filterable;
    use HasAuditUsers;
    use HasContentTranslations;
    use HasMedia;
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
        'page_id',
        'block_id',
        'section_type',
        'name',
        'anchor',
        'eyebrow',
        'heading',
        'subheading',
        'body',
        'media_id',
        'cta_id',
        'secondary_cta_id',
        'data',
        'settings',
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
            'data' => 'array',
            'settings' => 'array',
            'published_at' => 'datetime',
            'expires_at' => 'datetime',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Owning page. NULL when this row is the body of a reusable block.
     */
    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'page_id');
    }

    /**
     * Owning or referenced global block.
     *
     * Two distinct meanings share this column, disambiguated by page_id:
     *  - page_id NULL  -> this row IS the block's body
     *  - page_id set   -> this row REFERENCES the block
     *
     * Exactly one of page_id / block_id is the owner. The invariant is
     * enforced in PageSectionService rather than by a CHECK constraint,
     * because MySQL 8 CHECK failures produce opaque errors the AppResponse
     * error path cannot translate.
     */
    public function block(): BelongsTo
    {
        return $this->belongsTo(Block::class, 'block_id');
    }

    /**
     * The single primary image or video. Additional media go through
     * `mediables` via the HasMedia trait.
     */
    public function primaryMedia(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'media_id');
    }

    /**
     * Primary call to action.
     */
    public function cta(): BelongsTo
    {
        return $this->belongsTo(Cta::class, 'cta_id');
    }

    /**
     * Secondary call to action. Two is the ceiling — a third means it is a
     * repeater and belongs in section_blocks.
     */
    public function secondaryCta(): BelongsTo
    {
        return $this->belongsTo(Cta::class, 'secondary_cta_id');
    }

    /**
     * Repeater items, in editor order.
     */
    public function blocks(): HasMany
    {
        return $this->hasMany(SectionBlock::class, 'page_section_id')
            ->whereNull('parent_id')
            ->orderBy('sort_order');
    }

    /**
     * Every repeater item including nested children, for the admin editor.
     */
    public function allBlocks(): HasMany
    {
        return $this->hasMany(SectionBlock::class, 'page_section_id')->orderBy('sort_order');
    }

    /**
     * True when this row is a global block's body rather than a page section.
     */
    public function isBlockBody(): bool
    {
        return $this->page_id === null && $this->block_id !== null;
    }
}

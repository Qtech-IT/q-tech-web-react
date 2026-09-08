<?php

namespace App\Models;

use App\Traits\Cms\HasAuditUsers;
use App\Traits\Common\Filterable;
use App\Traits\Common\HasUuid;
use App\Traits\Common\UsesUuidRouting;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * No SoftDeletes: SEO meta dies with its owner, and a trashed SEO row with no
 * owner is not something an editor can meaningfully restore.
 */
class SeoMeta extends Model
{
    use Filterable;
    use HasAuditUsers;
    use HasUuid;
    use UsesUuidRouting;

    /**
     * @var string
     */
    protected $table = 'seo_meta';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'site_id',
        'seoable_type',
        'seoable_id',
        'locale',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'canonical_url',
        'robots_index',
        'robots_follow',
        'robots_advanced',
        'og_title',
        'og_description',
        'og_type',
        'og_media_id',
        'twitter_card',
        'twitter_title',
        'twitter_description',
        'twitter_media_id',
        'schema_type',
        'schema_data',
        'focus_keyword',
        'seo_score',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'robots_index' => 'boolean',
            'robots_follow' => 'boolean',
            'schema_data' => 'array',
            'seo_score' => 'integer',
        ];
    }

    /**
     * The entity this SEO record describes.
     */
    public function seoable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Open Graph image.
     */
    public function ogMedia(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'og_media_id');
    }

    /**
     * Twitter card image.
     */
    public function twitterMedia(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'twitter_media_id');
    }
}

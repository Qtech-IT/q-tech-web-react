<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * One overlaid editor string: (owner, locale, dotted field) -> value.
 *
 * Never route-bound, so no HasUuid / UsesUuidRouting. Written only through
 * ContentTranslationService, read only through ContentTranslator — nothing
 * else should touch this table directly.
 */
class ContentTranslation extends Model
{
    protected $fillable = [
        'translatable_type',
        'translatable_id',
        'locale',
        'field',
        'value',
        'is_reviewed',
    ];

    protected function casts(): array
    {
        return [
            'is_reviewed' => 'boolean',
        ];
    }

    /**
     * The section / block / menu item / cta / media this string belongs to.
     * Resolves through the non-enforcing morph map.
     */
    public function translatable(): MorphTo
    {
        return $this->morphTo();
    }
}

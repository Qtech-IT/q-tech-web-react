<?php

namespace App\Traits\Cms;

use App\Models\Media;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

/**
 * Attaches an owner to the `media` library through the `mediables` pivot.
 *
 * Distinct from the `Fileable` trait and the `files` table, which handle fixed
 * single-owner system assets (avatars, logo, favicon) and stay untouched.
 */
trait HasMedia
{
    /**
     * All library media attached to this owner, in any collection.
     *
     * Always eager-load this — a lazy access inside a render loop is the
     * classic N+1 on a public page.
     */
    public function media(): MorphToMany
    {
        return $this->morphToMany(Media::class, 'mediable')
            ->using(\Illuminate\Database\Eloquent\Relations\MorphPivot::class)
            ->withPivot(['collection', 'sort_order'])
            ->withTimestamps()
            ->orderBy('mediables.sort_order');
    }

    /**
     * Media in one named slot (gallery, logo, og_image, attachments).
     */
    public function mediaCollection(string $collection): MorphToMany
    {
        return $this->media()->wherePivot('collection', $collection);
    }
}

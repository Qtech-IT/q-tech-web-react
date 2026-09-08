<?php

namespace App\Traits\Cms;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * created_by / updated_by wiring for editor-writable CMS tables.
 *
 * The relation names are `createdBy` and `updatedBy` because that is exactly
 * what BaseResource::getBaseAttributes() checks with relationLoaded() before
 * emitting audit metadata. Renaming them silently drops that metadata from
 * every resource.
 */
trait HasAuditUsers
{
    /**
     * Stamp the acting user on write.
     *
     * Guarded on auth()->check() so seeders, the janitor job, and console
     * commands write NULL rather than failing.
     */
    protected static function bootHasAuditUsers(): void
    {
        static::creating(function (Model $model): void {
            $userId = auth()->id();

            if ($userId === null) {
                return;
            }

            $model->created_by ??= $userId;
            $model->updated_by ??= $userId;
        });

        static::updating(function (Model $model): void {
            $userId = auth()->id();

            if ($userId !== null) {
                $model->updated_by = $userId;
            }
        });
    }

    /**
     * The user who created the row. SET NULL on delete — an admin leaving must
     * never delete content.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * The last editor.
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}

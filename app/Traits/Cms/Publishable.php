<?php

namespace App\Traits\Cms;

use App\Enums\Cms\ContentStatus;
use App\Enums\Common\Status;
use Illuminate\Database\Eloquent\Builder;

/**
 * Query-time publishing gate for any model carrying the «publishing» bundle
 * (status, publish_status, published_at, expires_at).
 *
 * These are LOCAL scopes and must never become global scopes. A global scope
 * would hide drafts from the admin, and — worse — would apply silently inside
 * ModelAction::handleBulkAction()'s lazyById() traversal, making bulk
 * operations skip drafts with no visible cause.
 */
trait Publishable
{
    /**
     * The public visibility gate. The source of truth for "is this live?".
     *
     * `scheduled` is admitted once its time has passed on purpose: if Horizon
     * is down or the janitor is stuck, content still goes live. The DB clock
     * decides, the job is a convenience.
     *
     * `status = active` is ANDed in so the trait-owned kill switch still works
     * and a bulk deactivate hides content instantly, whatever its editorial
     * state.
     *
     * Column order matches IDX (site_id, locale, publish_status, published_at):
     * equality predicates first, range predicate last. expires_at is
     * deliberately absent from that index — after a range column it adds
     * nothing to the B-tree and is a cheap row filter.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where($query->qualifyColumn('status'), Status::ACTIVE->value)
            ->whereIn($query->qualifyColumn('publish_status'), ContentStatus::publiclyVisible())
            ->whereNotNull($query->qualifyColumn('published_at'))
            ->where($query->qualifyColumn('published_at'), '<=', now())
            ->where(function (Builder $q) use ($query): Builder {
                return $q->whereNull($query->qualifyColumn('expires_at'))
                    ->orWhere($query->qualifyColumn('expires_at'), '>', now());
            });
    }

    /**
     * Rows the janitor should flip from `scheduled` to `published`.
     */
    public function scopeScheduledDue(Builder $query): Builder
    {
        return $query->where($query->qualifyColumn('publish_status'), ContentStatus::SCHEDULED->value)
            ->whereNotNull($query->qualifyColumn('published_at'))
            ->where($query->qualifyColumn('published_at'), '<=', now());
    }

    /**
     * Rows the janitor should flip from `published` to `archived`.
     */
    public function scopeExpired(Builder $query): Builder
    {
        return $query->where($query->qualifyColumn('publish_status'), ContentStatus::PUBLISHED->value)
            ->whereNotNull($query->qualifyColumn('expires_at'))
            ->where($query->qualifyColumn('expires_at'), '<=', now());
    }

    /**
     * Editorial state, in-memory. Mirrors scopePublished() exactly so a model
     * already loaded does not need a second query to answer the question.
     */
    public function isPubliclyVisible(): bool
    {
        if ($this->status !== Status::ACTIVE && $this->status !== Status::ACTIVE->value) {
            return false;
        }

        $publishStatus = $this->publish_status instanceof ContentStatus
            ? $this->publish_status->value
            : $this->publish_status;

        if (! in_array($publishStatus, ContentStatus::publiclyVisible(), true)) {
            return false;
        }

        if ($this->published_at === null || $this->published_at->isFuture()) {
            return false;
        }

        return $this->expires_at === null || $this->expires_at->isFuture();
    }
}

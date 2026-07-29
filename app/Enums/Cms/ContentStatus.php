<?php

namespace App\Enums\Cms;

use App\Enums\EnumTrait;

/**
 * Editorial publishing state.
 *
 * Deliberately separate from App\Enums\Common\Status. The column named
 * `status` is owned by Filterable/ModelAction and must only ever hold
 * Status::ACTIVE / Status::INACTIVE. Editorial state lives in
 * `publish_status` and is never written by the shared bulk-action path.
 */
enum ContentStatus: string
{
    use EnumTrait;

    case DRAFT = 'draft';
    case SCHEDULED = 'scheduled';
    case PUBLISHED = 'published';
    case ARCHIVED = 'archived';

    /**
     * States that are eligible for public rendering once the clock passes
     * `published_at`. `scheduled` is admitted so content still goes live if
     * the janitor job is down.
     */
    public static function publiclyVisible(): array
    {
        return [
            self::PUBLISHED->value,
            self::SCHEDULED->value,
        ];
    }

    /**
     * List all values.
     */
    public static function getValues(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}

<?php

namespace App\Enums\Cms;

use App\Enums\EnumTrait;

/**
 * Named attachment slot on the `mediables` pivot.
 *
 * Stored as VARCHAR rather than a DB enum because a section type may declare
 * its own collection name through the registry; this enum is the validated
 * core set, not an exhaustive DB constraint.
 */
enum MediaCollection: string
{
    use EnumTrait;

    case DEFAULT = 'default';
    case GALLERY = 'gallery';
    case LOGO = 'logo';
    case OG_IMAGE = 'og_image';
    case ATTACHMENTS = 'attachments';

    /**
     * List all values.
     */
    public static function getValues(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}

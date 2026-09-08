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
     * The image a page shows when another page LISTS it.
     *
     * Separate from `og_image`, which is what a social scraper unfurls: those
     * two want different crops and different amounts of text baked in, and
     * collapsing them means every service card on the index is a 1200x630
     * social banner with a headline already burnt into it.
     */
    case CARD = 'card';

    /**
     * List all values.
     */
    public static function getValues(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}

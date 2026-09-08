<?php

namespace App\Enums\Cms;

use App\Enums\EnumTrait;

/**
 * Bare link resolution on a `section_blocks` row, used when the item needs a
 * destination but not a full `ctas` record.
 */
enum SectionLinkType: string
{
    use EnumTrait;

    case NONE = 'none';
    case URL = 'url';
    case ROUTE = 'route';
    case PAGE = 'page';
    case ENTITY = 'entity';
    case ANCHOR = 'anchor';

    /**
     * List all values.
     */
    public static function getValues(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}

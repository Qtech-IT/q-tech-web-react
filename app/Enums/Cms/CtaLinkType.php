<?php

namespace App\Enums\Cms;

use App\Enums\EnumTrait;

/**
 * Link resolution strategy for a `ctas` row.
 */
enum CtaLinkType: string
{
    use EnumTrait;

    case URL = 'url';
    case ROUTE = 'route';
    case PAGE = 'page';
    case ENTITY = 'entity';
    case ANCHOR = 'anchor';
    case MODAL = 'modal';
    case NONE = 'none';

    /**
     * List all values.
     */
    public static function getValues(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}

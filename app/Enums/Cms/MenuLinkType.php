<?php

namespace App\Enums\Cms;

use App\Enums\EnumTrait;

/**
 * Link resolution for a `menu_items` row.
 *
 * `heading` and `separator` exist so mega-menu column titles are structurally
 * honest — a heading renders as a real heading element rather than a focusable
 * dead link, which is a WCAG AA requirement rather than a cosmetic detail.
 */
enum MenuLinkType: string
{
    use EnumTrait;

    case URL = 'url';
    case ROUTE = 'route';
    case PAGE = 'page';
    case ENTITY = 'entity';
    case ANCHOR = 'anchor';
    case HEADING = 'heading';
    case SEPARATOR = 'separator';
    case NONE = 'none';

    /**
     * Types that render as non-interactive structure, never as a link.
     */
    public static function nonInteractive(): array
    {
        return [
            self::HEADING->value,
            self::SEPARATOR->value,
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

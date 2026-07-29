<?php

namespace App\Enums\Cms;

use App\Enums\EnumTrait;

/**
 * Provenance of a redirect row, so auto-created slug-change redirects stay
 * distinguishable from curated ones and can be retired separately.
 */
enum RedirectSource: string
{
    use EnumTrait;

    case MANUAL = 'manual';
    case SLUG_CHANGE = 'slug_change';
    case IMPORT = 'import';

    /**
     * List all values.
     */
    public static function getValues(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}

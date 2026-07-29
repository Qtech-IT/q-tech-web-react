<?php

namespace App\Enums\Cms;

use App\Enums\EnumTrait;

/**
 * Where a section-type field is persisted.
 *
 * The mechanical rule, applied in order, stop at the first yes:
 *   1. More than one of it, with editor-controlled order?  -> BLOCK
 *   2. One of the six universal scalars?                   -> COLUMN
 *   3. Would a translator ever see this field on its own?
 *        yes -> DATA        no -> SETTINGS
 *
 * Cardinality decides table-vs-JSON. Translatability decides data-vs-settings.
 */
enum FieldStore: string
{
    use EnumTrait;

    case COLUMN = 'column';
    case DATA = 'data';
    case SETTINGS = 'settings';
    case BLOCK = 'block';

    /**
     * The only six field names legal for FieldStore::COLUMN — the universal
     * scalars carried as real columns on `page_sections`.
     */
    public const UNIVERSAL_SCALARS = [
        'eyebrow',
        'heading',
        'subheading',
        'body',
        'media_id',
        'cta_id',
    ];

    /**
     * List all values.
     */
    public static function getValues(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}

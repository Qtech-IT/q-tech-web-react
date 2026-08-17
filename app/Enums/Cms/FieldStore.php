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
     * The only field names legal for FieldStore::COLUMN — the universal scalars
     * carried as real columns on `page_sections`.
     *
     * This list must mirror the `page_sections` migration. `secondary_cta_id`
     * was missing while the column existed, so any section type declaring a
     * second CTA failed the registry self-check even though the schema
     * supported it. If a column is added to `page_sections`, add it here in the
     * same change.
     *
     * Applies to SECTION fields only. Repeater (`block`) fields are checked
     * against `section_blocks`' own columns, which is why a block field named
     * `value` or `label` may legally use `column` without appearing here.
     */
    public const UNIVERSAL_SCALARS = [
        'eyebrow',
        'heading',
        'subheading',
        'body',
        'media_id',
        'cta_id',
        'secondary_cta_id',
    ];

    /**
     * List all values.
     */
    public static function getValues(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}

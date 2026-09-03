<?php

namespace App\Enums\Cms;

use App\Enums\EnumTrait;
use App\Enums\Settings\InputEnum;

/**
 * CMS-specific field types that InputEnum does not cover.
 *
 * A section-type field descriptor's `type` accepts either an InputEnum value
 * or one of these. Reusing InputEnum is deliberate: the existing config-driven
 * CRUD field renderer already handles those cases, so only the additions below
 * need bespoke admin components.
 */
enum FieldType: string
{
    use EnumTrait;

    case MEDIA = 'media';
    case CTA = 'cta';
    case RELATION = 'relation';
    case ICON = 'icon';
    case COLOR = 'color';
    case REPEATER = 'repeater';

    /**
     * A raw code editor — a monospace textarea, and deliberately nothing more.
     *
     * Distinct from `InputEnum::HTML_TEXT`, which renders the Lexical editor.
     * A rich text editor cannot hold markup it has no node for, so pasting a
     * design into one and reading it back gives the editor's interpretation of
     * that design rather than the design. This type is what an editor uses
     * when the answer has to be the bytes they typed.
     */
    case CODE = 'code';

    /**
     * Types that reference a media row and therefore may never be stored
     * inside JSON (invariant I2 — media needs an FK and a reverse index).
     */
    public static function mediaTypes(): array
    {
        return [self::MEDIA->value];
    }

    /**
     * Types that reference another content entity and therefore may never be
     * stored inside JSON (invariant I3).
     */
    public static function relationTypes(): array
    {
        return [self::RELATION->value];
    }

    /**
     * Every value a field descriptor's `type` key may hold: the reused
     * InputEnum set plus the CMS additions.
     */
    public static function allowedFieldTypes(): array
    {
        return [
            ...InputEnum::getValues(),
            ...self::getValues(),
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

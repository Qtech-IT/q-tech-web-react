<?php

namespace App\Enums\Settings;

use App\Enums\EnumTrait;

enum InputEnum: string
{
    use EnumTrait;

    case TEXT = 'text';
    case NUMBER = 'number';

    case HTML_TEXT = 'html_text';
    case TEXTAREA = 'textarea';
    // case TEXT_EDITOR = 'text-editor';
    case FILE = 'file';
    case SELECT = 'select';
    case SWITCH = 'switch';
    case EMAIL = 'email';
    case PASSWORD = 'password';
    case HIDDEN = 'hidden';
    case DISABLE = 'disable';
    // case ICON_PICKER = 'icon';
    case URL = 'url';
    case BOOLEAN = 'boolean';
    case DATERANGE = 'daterange';
    case DATE = 'date';
    case MULTI_SELECT = 'multi-select';

    /**
     * List all values
     */
    public static function getValues(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }

    /**
     * Summary of getValuesWithoutHtmlText
     * @return array
     */
    public static function getValuesWithoutHtmlText(): array
    {
        return array_values(
            array_filter(
                self::cases(),
                fn ($case) => $case !== self::HTML_TEXT
            )
        );
    }

    /**
     * Summary of optionsWithoutHtmlText
     * @return array
     */
    public static function optionsWithoutHtmlText(): array
    {
        return collect(self::cases())
            ->reject(fn ($case): bool => $case === self::HTML_TEXT)
            ->map(fn (InputEnum $case): array => [
                'label' => str($case->name)
                                ->replace('_', ' ')
                                ->title(),
                'value' => $case->value,
            ])
            ->values()
            ->toArray();
    }
}

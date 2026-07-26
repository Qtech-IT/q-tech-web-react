<?php

namespace App\Enums\Common;

use App\Enums\EnumTrait;

/**
 * Generic Active/Inactive status enum
 */
enum Status: string
{
    use EnumTrait;

    case ACTIVE   = 'active';
    case INACTIVE = 'inactive';

    /**
     * Human-readable text
     */
    public function values(): string
    {
        return match ($this) {
            self::ACTIVE   => 'Active',
            self::INACTIVE => 'Inactive',
        };
    }

    /**
     * List all values
     */
    public static function getValues(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }

    /**
     * Summary of optionsWithoutHtmlText
     * @return array
     */
    public static function options(): array
    {
        return collect(self::cases())
            ->map(fn (Status $case): array => [
                'label' => str($case->name)
                                ->replace('_', ' ')
                                ->title(),
                'value' => $case->value,
            ])
            ->values()
            ->toArray();
    }
}

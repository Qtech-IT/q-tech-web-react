<?php

namespace App\Enums\Settings;
use App\Enums\EnumTrait;
enum LanguageDirection: string
{
    use EnumTrait;

    case LTR              = "ltr";
    case RTL              = "rtl";

    /**
     * List all values
     */
    public static function getValues(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
    
    
    
}
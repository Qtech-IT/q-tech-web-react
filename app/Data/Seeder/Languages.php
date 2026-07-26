<?php

namespace App\Data\Seeder;

use App\Enums\Settings\LanguageDirection;

class Languages
{
    public const ALL = [
                    [
                        'code'       => 'en',
                        'name'       => 'English',
                        'direction'  => LanguageDirection::LTR,
                        'is_default' => true,
                    ],
                    [
                        'code'       => 'bn',
                        'name'       => 'Bangla',
                        'direction'  => LanguageDirection::LTR,
                        'is_default' => false,
                    ],
                    [
                        'code'       => 'ar',
                        'name'       => 'Arabic',
                        'direction'  => LanguageDirection::RTL,
                        'is_default' => false,
                    ]
            ];
}

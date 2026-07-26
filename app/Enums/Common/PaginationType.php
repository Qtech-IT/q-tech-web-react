<?php

namespace App\Enums\Common;

use App\Enums\EnumTrait;

/**
 * Query output formatting options
 */
enum PaginationType: string
{
    use EnumTrait;

    case CURSOR        = 'cursor';
    case LENGTH_AWARE  = 'length_aware';
}

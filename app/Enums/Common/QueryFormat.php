<?php

namespace App\Enums\Common;

use App\Enums\EnumTrait;

/**
 * Query output formatting options
 */
enum QueryFormat: string
{
    use EnumTrait;

    case PAGINATED  = 'paginated';
    case COLLECTION = 'collection';
}

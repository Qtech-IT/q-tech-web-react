<?php



namespace App\Enums\Settings;

use App\Enums\EnumTrait;


enum BulkActionType: string
{
    use EnumTrait;

    case RESTORE            = "restore";
    case PERMANENT_DELETE   = "permanent_delete";
    case DELETE             = "delete";
    case STATUS             = "status";
    case ACTIVE             = 'active';
    case INACTIVE           = 'inactive';
    case LOCK               = 'lock';

    


}

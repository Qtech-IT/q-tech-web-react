<?php

namespace App\Enums\Settings;

use App\Enums\EnumTrait;

enum FileKey: string
{
	use EnumTrait;

	case AVATAR        = 'avatar';
	case LEAVE_REQUEST = 'leave_request';
}

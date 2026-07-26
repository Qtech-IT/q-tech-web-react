<?php

namespace App\Enums;

use App\Enums\EnumTrait;

enum TransactionType: string
{
    use EnumTrait;
    case DEPOSIT    = 'deposit';
    case WITHDRAW   = 'withdraw';
    case TRADE_WIN  = 'trade_win';
    case TRADE_LOSS = 'trade_loss';
}

<?php

namespace App\Http\Controllers\Backend;

use App\Enums\Settings\SettingKey;
use App\Http\Controllers\Controller;
use App\Models\Crypto;
use App\Models\Deposit;
use App\Models\Trade;
use App\Models\User;
use App\Models\Withdraw;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
     public function index()
    {
        $this->authorize('view', 'dashboard');

        return Inertia::render('Backend/Dashboard/Index', [
            'currency_symbol' => site_settings(SettingKey::CURRENCY_SYMBOL->value, '$'),
        ]);
    }
}

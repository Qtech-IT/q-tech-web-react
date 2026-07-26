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

        $now        = Carbon::now();
        $startMonth = $now->copy()->startOfMonth();
        $startWeek  = $now->copy()->startOfWeek();
        $today      = $now->copy()->startOfDay();

        // ── KPI Cards ──────────────────────────────────────────────────────────

        $totalUsers  = User::where('is_admin', false)->count();
        $activeUsers = User::where('is_admin', false)
            ->where('status', 'active')->count();
        $newUsersToday = User::where('is_admin', false)
            ->whereDate('created_at', $today)->count();
        $newUsersThisMonth = User::where('is_admin', false)
            ->where('created_at', '>=', $startMonth)->count();

        $totalDepositsUSD  = Deposit::where('status', 'approved')->sum('usd_amount');
        $depositsThisMonth = Deposit::where('status', 'approved')
            ->where('created_at', '>=', $startMonth)->sum('usd_amount');
        $pendingDepositsCount  = Deposit::where('status', 'pending')->count();
        $pendingDepositsAmount = Deposit::where('status', 'pending')->sum('usd_amount');

        $totalWithdrawsUSD = Withdraw::where('status', 'approved')->sum(
            DB::raw('final_amount')   // crypto units; use usd if you store it
        );
        $pendingWithdrawsCount  = Withdraw::where('status', 'pending')->count();
        $pendingWithdrawsAmount = Withdraw::where('status', 'pending')->sum('amount');

        $totalTrades = Trade::count();
        $openTrades  = Trade::where('status', 'open')->count();
        $tradesWon   = Trade::where('result', 'win')->count();
        $tradesLost  = Trade::where('result', 'lose')->count();
        $winRate     = $totalTrades > 0
            ? round(($tradesWon / max($totalTrades - Trade::where('result', 'pending')->count(), 1)) * 100, 2)
            : 0;
        $totalProfitLoss = Trade::where('status', 'closed')->sum('usd_profit_loss');

        // ── Revenue chart — last 30 days grouped by day ────────────────────────

        $revenueChart = Deposit::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(usd_amount) as total')
        )
            ->where('status', 'approved')
            ->where('created_at', '>=', $now->copy()->subDays(29)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $revenueDays = collect();
        for ($i = 29; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i)->format('Y-m-d');
            $revenueDays->push([
                'date'  => $date,
                'label' => Carbon::parse($date)->format('M d'),
                'total' => (float) ($revenueChart[$date]->total ?? 0),
            ]);
        }

        // ── Trade volume chart — last 14 days ─────────────────────────────────

        $tradeChart = Trade::select(
            DB::raw('DATE(opened_at) as date'),
            DB::raw('COUNT(*) as total'),
            DB::raw('SUM(CASE WHEN result = "win"  THEN 1 ELSE 0 END) as wins'),
            DB::raw('SUM(CASE WHEN result = "lose" THEN 1 ELSE 0 END) as losses')
        )
            ->where('opened_at', '>=', $now->copy()->subDays(13)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $tradeDays = collect();
        for ($i = 13; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i)->format('Y-m-d');
            $tradeDays->push([
                'date'   => $date,
                'label'  => Carbon::parse($date)->format('M d'),
                'total'  => (int) ($tradeChart[$date]->total ?? 0),
                'wins'   => (int) ($tradeChart[$date]->wins ?? 0),
                'losses' => (int) ($tradeChart[$date]->losses ?? 0),
            ]);
        }

        // ── Deposit breakdown by crypto ────────────────────────────────────────

        $depositsByCrypto = Deposit::select('crypto_id', DB::raw('SUM(usd_amount) as total'))
            ->where('status', 'approved')
            ->with('crypto:id,symbol,name')
            ->groupBy('crypto_id')
            ->orderByDesc('total')
            ->limit(6)
            ->get()
            ->map(fn($d) => [
                'symbol' => $d->crypto?->symbol ?? '?',
                'name'   => $d->crypto?->name   ?? 'Unknown',
                'total'  => (float) $d->total,
            ]);

        // ── Recent activity feeds ──────────────────────────────────────────────

        $recentDeposits = Deposit::with('user:id,name,email', 'crypto:id,symbol')
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn($d) => [
                'id'     => $d->id,
                'user'   => $d->user?->name,
                'email'  => $d->user?->email,
                'crypto' => $d->crypto?->symbol,
                'amount' => $d->amount,
                'usd'    => $d->usd_amount,
                'status' => $d->status,
                'date'   => $d->created_at->diffForHumans(),
            ]);

        $recentWithdraws = Withdraw::with('user:id,name,email')
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn($w) => [
                'id'     => $w->id,
                'user'   => $w->user?->name,
                'email'  => $w->user?->email,
                'amount' => $w->amount,
                'status' => $w->status,
                'date'   => $w->created_at->diffForHumans(),
            ]);

        $recentTrades = Trade::with('user:id,name', 'crypto:id,symbol,name')
            ->latest('opened_at')
            ->limit(8)
            ->get()
            ->map(fn($t) => [
                'id'        => $t->id,
                'user'      => $t->user?->name,
                'crypto'    => $t->crypto?->symbol,
                'direction' => $t->direction,
                'amount'    => $t->amount,
                'usd_stake' => $t->usd_stake,
                'result'    => $t->result,
                'status'    => $t->status,
                'pnl'       => $t->usd_profit_loss,
                'date'      => Carbon::parse($t->opened_at)->diffForHumans(),
            ]);

        $recentUsers = User::where('is_admin', false)
            ->latest()
            ->limit(6)
            ->get(['id', 'name', 'email', 'status', 'is_kyc_verified', 'created_at'])
            ->map(fn($u) => [
                'id'     => $u->id,
                'name'   => $u->name,
                'email'  => $u->email,
                'status' => $u->status,
                'kyc'    => $u->is_kyc_verified,
                'date'   => $u->created_at->diffForHumans(),
            ]);

        // ── Top cryptos by trade volume ────────────────────────────────────────

        $topCryptos = Crypto::withCount(['trades as trade_count'])
            ->withSum(['trades as total_volume' => fn($q) => $q->where('status', 'closed')], 'usd_stake')
            ->orderByDesc('trade_count')
            ->limit(5)
            ->get(['id', 'name', 'symbol', 'usd_price', 'price_change_24h'])
            ->map(fn($c) => [
                'symbol'       => $c->symbol,
                'name'         => $c->name,
                'price'        => $c->usd_price,
                'change_24h'   => $c->price_change_24h,
                'trade_count'  => $c->trade_count,
                'total_volume' => $c->total_volume ?? 0,
            ]);

        return Inertia::render('Backend/Dashboard/Index', [
            'stats' => [
                // Users
                'total_users'     => $totalUsers,
                'active_users'    => $activeUsers,
                'new_users_today' => $newUsersToday,
                'new_users_month' => $newUsersThisMonth,

                // Deposits
                'total_deposits_usd'      => round($totalDepositsUSD, 2),
                'deposits_this_month'     => round($depositsThisMonth, 2),
                'pending_deposits_count'  => $pendingDepositsCount,
                'pending_deposits_amount' => round($pendingDepositsAmount, 2),

                // Withdrawals
                'total_withdraws'          => round($totalWithdrawsUSD, 8),
                'pending_withdraws_count'  => $pendingWithdrawsCount,
                'pending_withdraws_amount' => round($pendingWithdrawsAmount, 8),

                // Trades
                'total_trades' => $totalTrades,
                'open_trades'  => $openTrades,
                'trades_won'   => $tradesWon,
                'trades_lost'  => $tradesLost,
                'win_rate'     => $winRate,
                'total_pnl'    => format_number_short((float) ($totalProfitLoss)),
            ],

            'charts' => [
                'revenue'   => $revenueDays,
                'trades'    => $tradeDays,
                'by_crypto' => $depositsByCrypto,
            ],

            'recent' => [
                'deposits'  => $recentDeposits,
                'withdraws' => $recentWithdraws,
                'trades'    => $recentTrades,
                'users'     => $recentUsers,
            ],

            'top_cryptos' => $topCryptos,

            'currency_symbol' => site_settings(SettingKey::CURRENCY_SYMBOL->value, '$'),
        ]);
    }
}

<?php

namespace App\Http\Services\Backend;

use App\Models\Transaction;
use App\Models\User;
use App\Models\UserBalance;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class WalletService
{
    /**
     * Handle wallet operation (deposit, withdraw, trade, etc.)
     */
    public function handle(
        User $user,
        float $amount,
        string $type,
        ?string $note = null,
        ?string $reference = null
    ): void {
        DB::transaction(function () use ($user, $amount, $type, $note, $reference) {
            // 🔒 Lock wallet row (prevents race condition)
            $wallet = UserBalance::where('user_id', $user->id)
                            ->lockForUpdate()
                            ->first();

            if (!$wallet) {
                throw new Exception('Wallet not found');
            }

            $before = (float) $wallet->available_balance;

            // 🔁 Determine operation type
            if ($this->isCredit($type)) {
                $after = $before + $amount;
            } else {
                if ($before < $amount) {
                    throw new Exception('Insufficient balance');
                }
                $after = $before - $amount;
            }

            // 💾 Update balance
            $wallet->update([
                'available_balance' => $after,
            ]);

            // 🧾 Store transaction (ledger)
            Transaction::create([
                'transaction_no' => $this->generateTransactionNo(),

                'user_id'        => $user->id,
                'amount'         => $this->isCredit($type) ? $amount : -$amount,
                'balance_before' => $before,
                'balance_after'  => $after,
                'type'           => $type,
                'note'           => $note,
                'reference'      => $reference,
            ]);
        });
    }

    /**
     * Determine if transaction is credit (adds balance)
     */
    private function isCredit(string $type): bool
    {
        return in_array($type, [
            'deposit',
            'trade_win',
        ]);
    }

    private function generateTransactionNo(): string
    {
        do {
            $number = 'TXN-' . now()->format('Ymd') . '-' . strtoupper(Str::random(8));
        } while (\App\Models\Transaction::where('transaction_no', $number)->exists());

        return $number;
    }
}

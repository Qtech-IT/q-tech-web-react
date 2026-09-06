<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * `mailed_at` records the last time a bulk send reached this subscriber, so a
 * campaign can skip addresses already contacted in this round and an
 * off-platform send can be marked by hand. `contact_submissions` already
 * carries the same column.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subscribers', function (Blueprint $table) {
            $table->timestamp('mailed_at')->nullable()->after('unsubscribed_at');
        });
    }

    public function down(): void
    {
        Schema::table('subscribers', function (Blueprint $table) {
            $table->dropColumn('mailed_at');
        });
    }
};

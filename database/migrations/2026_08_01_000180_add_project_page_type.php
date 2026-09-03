<?php

use App\Enums\Cms\PageType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Widen `pages.page_type` for `project` — the portfolio pages under `/work`,
 * which are a different thing from the long-form case studies.
 *
 * `page_type` is a DB ENUM, so a new PHP case does not exist as far as MySQL is
 * concerned until the column is widened; without this every insert using it
 * fails at runtime with a truncation error.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table): void {
            $table->enum('page_type', PageType::getValues())
                ->default(PageType::STANDARD->value)
                ->change();
        });
    }

    /**
     * No-op. Narrowing an enum is not the inverse of widening one — MySQL
     * resolves an out-of-range value to the empty string rather than refusing,
     * so a rollback on a database holding project pages would blank their type
     * and leave them unfindable.
     */
    public function down(): void {}
};

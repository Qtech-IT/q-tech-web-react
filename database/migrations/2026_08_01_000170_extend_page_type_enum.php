<?php

use App\Enums\Cms\PageType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Widen `pages.page_type` for the content families the site actually has:
 * industries, case studies and blog posts.
 *
 * `page_type` is a DB ENUM built from `PageType::getValues()`, so a new case in
 * PHP does not exist as far as MySQL is concerned until the column itself is
 * widened. Without this the enum compiles fine and every insert using a new
 * value fails at runtime with a truncation error — the mismatch a DB enum
 * trades for its storage efficiency.
 *
 * Read from the enum rather than a literal list so this cannot drift from the
 * cases in code.
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
     * Deliberately a no-op.
     *
     * Narrowing an enum is not the inverse of widening one: MySQL resolves a
     * value outside a narrowed enum to the empty string rather than refusing,
     * so rolling back on a database that has blog posts on it would silently
     * blank their type and leave them unfindable. Widening is safe; narrowing
     * is data loss wearing a migration's clothes.
     */
    public function down(): void {}
};

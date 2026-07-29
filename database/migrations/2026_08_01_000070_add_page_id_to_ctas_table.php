<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Closes the ctas <-> pages circular dependency (§16.1 item 2).
 *
 * `page_sections.cta_id` needs `ctas` to exist; `ctas.page_id` needs `pages` to
 * exist. One of the two FKs has to be added after the fact — this is it.
 *
 * A real FK rather than a bare integer, so deleting a page surfaces every
 * button that pointed at it (SET NULL, then the broken-link report).
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ctas', function (Blueprint $table) {
            $table->unsignedBigInteger('page_id')->nullable()->after('route_params');

            $table->index('page_id', 'ctas_page');

            $table->foreign('page_id', 'ctas_page_id_foreign')
                ->references('id')->on('pages')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ctas', function (Blueprint $table) {
            $table->dropForeign('ctas_page_id_foreign');
            $table->dropIndex('ctas_page');
            $table->dropColumn('page_id');
        });
    }
};

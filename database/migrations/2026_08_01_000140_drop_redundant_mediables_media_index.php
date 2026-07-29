<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Drop `mediables_media` — a redundant single-column index on `media_id`.
 *
 * `mediables_unique` is (media_id, mediable_type, mediable_id, collection).
 * `media_id` is its leftmost prefix, so every lookup and every FK check that
 * `mediables_media` could serve is already served by `mediables_unique`.
 * The duplicate only costs write amplification on a pivot that is written on
 * every attach/detach.
 *
 * The FK `mediables_media_id_foreign` stays; InnoDB keeps it satisfied via
 * `mediables_unique`.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! $this->indexExists('mediables_media')) {
            return;
        }

        Schema::table('mediables', function (Blueprint $table): void {
            $table->dropIndex('mediables_media');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if ($this->indexExists('mediables_media')) {
            return;
        }

        Schema::table('mediables', function (Blueprint $table): void {
            $table->index('media_id', 'mediables_media');
        });
    }

    /**
     * Guard both directions so the migration is safe to re-run.
     */
    private function indexExists(string $name): bool
    {
        return collect(Schema::getIndexes('mediables'))
            ->contains(fn (array $index): bool => $index['name'] === $name);
    }
};

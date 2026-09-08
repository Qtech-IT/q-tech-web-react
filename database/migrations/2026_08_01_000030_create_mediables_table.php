<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Many-to-many attachment pivot between `media` and any content owner.
 *
 * This is the cardinality `files` gets wrong: File::fileable() is a morphTo,
 * so one file belongs to exactly one owner. A library is the inverse — one
 * file, many owners, reused across pages.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mediables', function (Blueprint $table) {
            // Real PK, because sort_order updates target a single attachment row.
            $table->id();

            $table->unsignedBigInteger('media_id');

            // 60 chars, not 255: this column holds a morph-map ALIAS, which is
            // short by construction. On mediables_owner that is the difference
            // between a ~1000-byte and a ~250-byte index key.
            $table->string('mediable_type', 60);
            $table->unsignedBigInteger('mediable_id');

            // Named slot: gallery, logo, og_image, attachments.
            $table->string('collection', 60)->default('default');
            $table->integer('sort_order')->default(0);

            // No soft delete: detaching media from a slot is a real delete.
            $table->timestamps();

            $table->unique(
                ['media_id', 'mediable_type', 'mediable_id', 'collection'],
                'mediables_unique'
            );

            // The eager-load: every attachment for these owners, in order.
            $table->index(
                ['mediable_type', 'mediable_id', 'collection', 'sort_order'],
                'mediables_owner'
            );

            // Usage report — "delete this image?" must show where it is used.
            $table->index('media_id', 'mediables_media');

            $table->foreign('media_id', 'mediables_media_id_foreign')
                ->references('id')->on('media')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mediables');
    }
};

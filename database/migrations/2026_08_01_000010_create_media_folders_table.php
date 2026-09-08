<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * First of the media chain: media_folders -> media -> mediables.
 * Everything with a `media_id` FK depends on it (§16.1 item 1).
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('media_folders', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');

            // Tenancy discriminator. NOT NULL because NULL is distinct in MySQL
            // unique indexes and would silently void the unique keys below.
            $table->unsignedBigInteger('site_id')->default(1);

            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('name', 191);
            $table->string('slug', 191);

            // Materialized folder path, leading slash, no trailing slash.
            $table->string('path', 500);
            $table->unsignedTinyInteger('depth')->default(0);
            $table->integer('sort_order')->default(0);

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();

            $table->timestamps();
            $table->softDeletes();

            $table->unique('uuid', 'media_folders_uuid_unique');
            $table->unique(['site_id', 'parent_id', 'slug'], 'media_folders_slug_unique');
            $table->index(['site_id', 'path'], 'media_folders_path');

            // RESTRICT: deleting a parent folder must never silently orphan the
            // media inside its subtree. Force the editor to empty or move it.
            $table->foreign('parent_id', 'media_folders_parent_id_foreign')
                ->references('id')->on('media_folders')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_folders');
    }
};

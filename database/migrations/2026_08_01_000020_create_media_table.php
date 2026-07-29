<?php

use App\Enums\Cms\MediaType;
use App\Enums\Common\Status;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The editorial media library. Supersedes — does not replace — `files`, which
 * stays untouched for fixed single-owner system assets (avatars, logo,
 * favicon) through Fileable/ModelAction::saveFile(). See schema doc §3.3.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->unsignedBigInteger('site_id')->default(1);
            $table->unsignedBigInteger('folder_id')->nullable();

            // Matches files.disk width so the two systems agree on disk names.
            $table->string('disk', 55)->default('public');

            // Full path on the disk. `files` has no such column, which is the
            // single biggest reason it cannot serve a folder-organised library.
            $table->string('path', 500);

            $table->string('file_name', 191);
            $table->string('original_name', 191);

            // Real MIME detected server-side, never the client's claim.
            $table->string('mime_type', 100);
            $table->string('extension', 20);

            $table->enum('media_type', MediaType::getValues())
                ->default(MediaType::OTHER->value);

            // Integer bytes. files.size is VARCHAR(100), which cannot be
            // summed, sorted, or quota-checked.
            $table->unsignedBigInteger('size')->default(0);

            // Required to emit width/height attributes and prevent CLS.
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->unsignedInteger('duration')->nullable();

            // Accessibility (WCAG AA). Translatable via the Phase 5 overlay.
            $table->string('alt_text', 500)->nullable();
            $table->string('caption', 500)->nullable();
            $table->string('title', 191)->nullable();
            $table->text('description')->nullable();
            $table->string('credit', 191)->nullable();

            // Focal point (0..1) for art-directed cropping.
            $table->decimal('focal_x', 5, 4)->nullable();
            $table->decimal('focal_y', 5, 4)->nullable();

            // LQIP placeholder: kills layout shift without a second request.
            $table->string('blurhash', 100)->nullable();

            // Machine-generated derivative map. JSON is correct here: read as a
            // whole with its parent row, never queried by, never translated.
            $table->json('conversions')->nullable();

            $table->char('checksum', 64)->nullable();

            $table->enum('status', Status::getValues())
                ->default(Status::ACTIVE->value);

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();

            $table->timestamps();
            $table->softDeletes();

            $table->unique('uuid', 'media_uuid_unique');

            // The library grid: filtered by folder and type, newest first.
            $table->index(['site_id', 'folder_id', 'media_type', 'created_at'], 'media_library');
            $table->index(['site_id', 'checksum'], 'media_checksum');
            $table->index(['site_id', 'original_name'], 'media_search');
            $table->index('deleted_at', 'media_deleted');

            $table->foreign('folder_id', 'media_folder_id_foreign')
                ->references('id')->on('media_folders')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};

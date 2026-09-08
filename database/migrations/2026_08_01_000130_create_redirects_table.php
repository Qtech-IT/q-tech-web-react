<?php

use App\Enums\Cms\RedirectSource;
use App\Enums\Common\Status;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Ships in Phase 1 on purpose. Slug changes are the single most common
 * CMS-driven SEO regression: if this table does not exist the day `pages`
 * ships, every slug edit is a silent 404 and the automatic
 * source='slug_change' behaviour has to be retrofitted onto content that has
 * already moved.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('redirects', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->unsignedBigInteger('site_id')->default(1);

            // Normalized: leading slash, no trailing slash, no host, no query.
            $table->string('from_path', 500);

            // SHA-256(site_id . from_path) — THE indexed lookup key.
            // VARCHAR(500) in utf8mb4 is 2000 bytes; it fits under InnoDB's
            // 3072-byte limit but makes an enormous, slow index, and the repo
            // standardises on 191 for indexed strings precisely to avoid that.
            // A fixed 64-byte hash is the better key and lets from_path stay
            // full fidelity. This is the one place the 191 habit is broken, and
            // the hash column is why it is safe.
            $table->char('from_hash', 64);

            $table->string('to_path', 500);
            $table->unsignedSmallInteger('status_code')->default(301);

            // Evaluated only after the exact-hash miss.
            $table->boolean('is_regex')->default(false);

            $table->boolean('preserve_query')->default(true);

            $table->enum('source', RedirectSource::getValues())
                ->default(RedirectSource::MANUAL->value);

            // Usage counters let dead redirects be retired.
            $table->unsignedBigInteger('hits')->default(0);
            $table->timestamp('last_hit_at')->nullable();

            $table->enum('status', Status::getValues())
                ->default(Status::ACTIVE->value);

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();

            $table->timestamps();
            $table->softDeletes();

            $table->unique('uuid', 'redirects_uuid_unique');
            $table->unique('from_hash', 'redirects_from_hash_unique');

            // The regex candidate set, fetched once and cached.
            $table->index(['site_id', 'is_regex', 'status'], 'redirects_regex');
            $table->index('source', 'redirects_source');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('redirects');
    }
};

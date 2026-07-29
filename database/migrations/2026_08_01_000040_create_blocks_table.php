<?php

use App\Enums\Cms\ContentStatus;
use App\Enums\Common\Status;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Reusable global content: the CTA band, the logo wall, the awards strip —
 * authored once, referenced from many pages.
 *
 * A block's CONTENT lives in a `page_sections` row with page_id = NULL and
 * block_id set. This table is only the identity layer: a stable developer
 * handle, a name, and a lock flag.
 *
 * Must be created before `page_sections` (block_id FK, §16.1 item 4).
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('blocks', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->unsignedBigInteger('site_id')->default(1);

            // Stable developer handle (global.cta_band) so a hard-coded layout
            // slot can resolve a block without a magic id.
            $table->string('key', 100);
            $table->string('name', 191);
            $table->string('description', 500)->nullable();

            // Registry key. Not an FK: section types live in PHP, and an
            // unknown key must render a fallback rather than throw.
            $table->string('section_type', 100);

            $table->boolean('is_locked')->default(false);

            // Trait-owned operational switch. Never editorial.
            $table->enum('status', Status::getValues())
                ->default(Status::ACTIVE->value);

            // Editorial state. Never touched by handleBulkAction().
            $table->enum('publish_status', ContentStatus::getValues())
                ->default(ContentStatus::PUBLISHED->value);

            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->integer('sort_order')->default(0);

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();

            $table->timestamps();
            $table->softDeletes();

            $table->unique('uuid', 'blocks_uuid_unique');
            $table->unique(['site_id', 'key'], 'blocks_key_unique');
            $table->index(['site_id', 'status', 'publish_status'], 'blocks_admin_list');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blocks');
    }
};

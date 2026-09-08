<?php

use App\Enums\Cms\SectionLinkType;
use App\Enums\Common\Status;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The repeater. One row per repeated item inside a section: a stat, a feature,
 * a timeline entry, a pricing tier, a logo, a process step.
 *
 * Rows rather than page_sections.data->items[] because a JSON array fails on
 * four independent counts: reordering is read-modify-write under a race; an
 * array index is not a stable translation address; a media id inside JSON gets
 * no FK and no reverse lookup; and toggling one item rewrites the whole
 * document. The cost — one extra query — is answered by a single with('blocks')
 * eager-load across all sections of a page.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('section_blocks', function (Blueprint $table) {
            $table->id();

            // Route key AND the stable translation address the Phase 5 overlay
            // writes against.
            $table->uuid('uuid');

            $table->unsignedBigInteger('page_section_id');

            // One level of nesting (tab -> tab items). Depth capped at 2 in the
            // service.
            $table->unsignedBigInteger('parent_id')->nullable();

            // Registry key when a section supports heterogeneous repeaters.
            $table->string('block_type', 100)->default('item');

            $table->string('label', 191)->nullable();

            // Deliberately a string: "500+" and "24/7" are not numbers.
            $table->string('value', 191)->nullable();

            $table->text('description')->nullable();
            $table->longText('body')->nullable();

            // Icon registry key (lucide name). Not a file.
            $table->string('icon', 100)->nullable();

            $table->unsignedBigInteger('media_id')->nullable();
            $table->unsignedBigInteger('cta_id')->nullable();

            // Bare link resolution, for items that need a destination but not a
            // full ctas row.
            $table->enum('link_type', SectionLinkType::getValues())
                ->default(SectionLinkType::NONE->value);
            $table->string('link_target_type', 60)->nullable();
            $table->unsignedBigInteger('link_target_id')->nullable();
            $table->string('link_url', 500)->nullable();

            $table->json('data')->nullable();
            $table->json('settings')->nullable();

            $table->enum('status', Status::getValues())
                ->default(Status::ACTIVE->value);

            // The reason this table exists.
            $table->integer('sort_order')->default(0);

            // No publish_status / published_at / expires_at: a repeater item
            // does not schedule independently of its section, and `status`
            // already covers show/hide. Adding them later touches no row.
            //
            // No created_by / updated_by: the section is the meaningful audit
            // unit, and a section revision snapshots its blocks, so per-block
            // authorship stays recoverable without 2 columns x N rows.
            $table->timestamps();
            $table->softDeletes();

            $table->unique('uuid', 'section_blocks_uuid_unique');

            // The render query: all visible items for a section, in order.
            $table->index(['page_section_id', 'status', 'sort_order'], 'section_blocks_render');

            $table->index(['parent_id', 'sort_order'], 'section_blocks_parent');
            $table->index('media_id', 'section_blocks_media');
            $table->index(['link_target_type', 'link_target_id'], 'section_blocks_link_target');

            $table->foreign('page_section_id', 'section_blocks_page_section_id_foreign')
                ->references('id')->on('page_sections')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->foreign('parent_id', 'section_blocks_parent_id_foreign')
                ->references('id')->on('section_blocks')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->foreign('media_id', 'section_blocks_media_id_foreign')
                ->references('id')->on('media')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->foreign('cta_id', 'section_blocks_cta_id_foreign')
                ->references('id')->on('ctas')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('section_blocks');
    }
};

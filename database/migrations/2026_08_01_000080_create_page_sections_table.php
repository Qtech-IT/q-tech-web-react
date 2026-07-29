<?php

use App\Enums\Cms\ContentStatus;
use App\Enums\Common\Status;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * An ordered, typed slot on a page. Holds the six universal content scalars as
 * real columns and everything else as JSON, per the §4.2 rule.
 *
 * Depends on: media, ctas, blocks, pages — all created before this.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('page_sections', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');

            // Denormalized from `pages` so section queries never need the join.
            $table->unsignedBigInteger('site_id')->default(1);

            // Exactly one of page_id / block_id is the owner. Nullable on both
            // sides because a `blocks` row's body IS a page_sections row with
            // page_id = NULL. The invariant is enforced in PageSectionService,
            // not by a CHECK constraint: MySQL 8 honours CHECK but produces
            // opaque errors the AppResponse error path cannot translate.
            $table->unsignedBigInteger('page_id')->nullable();
            $table->unsignedBigInteger('block_id')->nullable();

            // Registry key (hero.split, stats.counter). Not an FK — an unknown
            // key must render the missing-section fallback, never throw.
            $table->string('section_type', 100);

            // Internal label for the admin outline. Never rendered publicly.
            $table->string('name', 191)->nullable();

            // id attribute for in-page anchors and menu #target items.
            $table->string('anchor', 100)->nullable();

            // The six universal scalars, as columns rather than JSON: they give
            // media_id a real FK, make "find every section with an empty
            // heading" indexable, and let one admin header editor serve every
            // section type.
            $table->string('eyebrow', 191)->nullable();
            $table->string('heading', 255)->nullable();
            $table->string('subheading', 500)->nullable();
            $table->longText('body')->nullable();
            $table->unsignedBigInteger('media_id')->nullable();
            $table->unsignedBigInteger('cta_id')->nullable();

            // Two CTAs is the observed ceiling. A third means it is a repeater
            // and belongs in section_blocks.
            $table->unsignedBigInteger('secondary_cta_id')->nullable();

            // Type-specific singular TRANSLATABLE fields, registry-validated.
            $table->json('data')->nullable();

            // Type-specific PRESENTATION fields. Never translatable, never free
            // text — values come from a fixed set the code defines.
            $table->json('settings')->nullable();

            // Trait-owned. This is the one place `status` genuinely means
            // "show it" — and it is still Status, so bulk toggle stays safe.
            $table->enum('status', Status::getValues())
                ->default(Status::ACTIVE->value);

            // Defaults to published: a section inherits its page's gate.
            // Drafting a single section is the exception, not the rule.
            $table->enum('publish_status', ContentStatus::getValues())
                ->default(ContentStatus::PUBLISHED->value);

            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->integer('sort_order')->default(0);

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();

            $table->timestamps();
            $table->softDeletes();

            $table->unique('uuid', 'page_sections_uuid_unique');

            // The public page render: every visible section in order, one scan.
            $table->index(['page_id', 'status', 'publish_status', 'sort_order'], 'page_sections_render');

            $table->index('block_id', 'page_sections_block');
            $table->index(['site_id', 'section_type'], 'page_sections_type');
            $table->index('media_id', 'page_sections_media');
            $table->index(['publish_status', 'published_at', 'expires_at'], 'page_sections_schedule');

            // CASCADE: a section has no meaning without its page. Soft deletes
            // mean this only ever fires on force-delete.
            $table->foreign('page_id', 'page_sections_page_id_foreign')
                ->references('id')->on('pages')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            // SET NULL: deleting a global block degrades the section to a local
            // copy rather than vaporizing the page.
            $table->foreign('block_id', 'page_sections_block_id_foreign')
                ->references('id')->on('blocks')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            // SET NULL: media deletion must never delete content. The public
            // component handles the missing-image state.
            $table->foreign('media_id', 'page_sections_media_id_foreign')
                ->references('id')->on('media')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->foreign('cta_id', 'page_sections_cta_id_foreign')
                ->references('id')->on('ctas')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->foreign('secondary_cta_id', 'page_sections_secondary_cta_id_foreign')
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
        Schema::dropIfExists('page_sections');
    }
};

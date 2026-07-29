<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Polymorphic SEO record, one per (owner, locale).
 *
 * Polymorphic rather than 24 inline columns per routable owner: nine eventual
 * owners would be 216 duplicated columns and a nine-table migration to add a
 * single SEO field. Rows exist only for entities an editor has customised;
 * everything else falls back through SeoService.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('seo_meta', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->unsignedBigInteger('site_id')->default(1);

            // Morph-map ALIAS, 60 chars. Permitted values are constrained in
            // the Form Request against config('morph-map.columns.seoable').
            $table->string('seoable_type', 60);
            $table->unsignedBigInteger('seoable_id');

            // Present even for row-per-locale owners, so a non-routable owner
            // can hold several.
            $table->string('locale', 10);

            $table->string('meta_title', 255)->nullable();
            $table->string('meta_description', 500)->nullable();

            // Legacy, but editors expect the field to exist.
            $table->string('meta_keywords', 500)->nullable();

            // NULL = canonical is self.
            $table->string('canonical_url', 500)->nullable();

            $table->boolean('robots_index')->default(true);
            $table->boolean('robots_follow')->default(true);
            $table->string('robots_advanced', 191)->nullable();

            $table->string('og_title', 255)->nullable();
            $table->string('og_description', 500)->nullable();
            $table->string('og_type', 50)->default('website');
            $table->unsignedBigInteger('og_media_id')->nullable();

            $table->string('twitter_card', 50)->default('summary_large_image');
            $table->string('twitter_title', 255)->nullable();
            $table->string('twitter_description', 500)->nullable();
            $table->unsignedBigInteger('twitter_media_id')->nullable();

            $table->string('schema_type', 60)->nullable();

            // Extra JSON-LD properties merged over the generated graph.
            // Machine-shaped and per-type variable -> JSON is correct.
            $table->json('schema_data')->nullable();

            $table->string('focus_keyword', 191)->nullable();
            $table->unsignedTinyInteger('seo_score')->nullable();

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();

            // No soft delete: SEO meta dies with its owner.
            $table->timestamps();

            $table->unique('uuid', 'seo_meta_uuid_unique');

            // One SEO record per owner per locale, and the eager-load key.
            $table->unique(['seoable_type', 'seoable_id', 'locale'], 'seo_meta_owner_unique');

            $table->index('og_media_id', 'seo_meta_og_media');
            $table->index('twitter_media_id', 'seo_meta_twitter_media');

            // The "pages excluded from sitemap" report.
            $table->index(['site_id', 'robots_index'], 'seo_meta_robots');

            $table->foreign('og_media_id', 'seo_meta_og_media_id_foreign')
                ->references('id')->on('media')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->foreign('twitter_media_id', 'seo_meta_twitter_media_id_foreign')
                ->references('id')->on('media')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seo_meta');
    }
};

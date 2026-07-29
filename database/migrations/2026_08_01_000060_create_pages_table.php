<?php

use App\Enums\Cms\ContentStatus;
use App\Enums\Cms\PageType;
use App\Enums\Common\Status;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The routable container: one row per (site, locale, slug). Owns a URL and an
 * ordered list of sections.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');

            // NOT NULL and defaulted: NULL is distinct in MySQL unique indexes
            // and would silently void UNIQUE (site_id, locale, path).
            $table->unsignedBigInteger('site_id')->default(1);

            // Groups the locale variants of one logical page. Self-assigned on
            // create; routable content is row-per-locale from day one.
            $table->uuid('translation_group_id');

            // Matches languages.code. Deliberately NOT an FK: LanguageService
            // hard-deletes language rows, and neither RESTRICT (blocks the
            // delete) nor CASCADE (deletes every page in that locale) is the
            // behaviour we want. Orphaned locale content should become
            // invisible but recoverable, which no-FK plus ->published() gives.
            $table->string('locale', 10);

            $table->unsignedBigInteger('parent_id')->nullable();

            // Last URL segment only, not the full path.
            $table->string('slug', 191);

            // Denormalized full path, leading slash, no trailing slash.
            // Makes the public lookup a single unique-index probe instead of a
            // recursive CTE per request.
            $table->string('path', 500);

            $table->unsignedTinyInteger('depth')->default(0);

            $table->string('title', 191);

            $table->enum('page_type', PageType::getValues())
                ->default(PageType::STANDARD->value);

            // Registry key selecting the React layout shell.
            $table->string('template', 100)->default('default');

            // Fast root lookup. A partial unique index is not expressible here
            // (many falses), so single-homepage is a PageService invariant.
            $table->boolean('is_homepage')->default(false);

            // Editor kill-switch for noindex. Duplicated from seo_meta on
            // purpose, so the robots decision survives a missing SEO row.
            $table->boolean('is_indexable')->default(true);

            // Page-level presentation only (header variant, hide-footer, theme
            // accent). Never content — see the §4.2 rule.
            $table->json('settings')->nullable();

            $table->enum('status', Status::getValues())
                ->default(Status::ACTIVE->value);

            $table->enum('publish_status', ContentStatus::getValues())
                ->default(ContentStatus::DRAFT->value);

            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->integer('sort_order')->default(0);

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();

            $table->timestamps();
            $table->softDeletes();

            $table->unique('uuid', 'pages_uuid_unique');

            // The public request, and the only real guard against two pages
            // claiming one URL.
            $table->unique(['site_id', 'locale', 'path'], 'pages_path_unique');

            // Prevents duplicate siblings before `path` is computed.
            $table->unique(['site_id', 'locale', 'parent_id', 'slug'], 'pages_slug_unique');

            // Language switcher: same page, other locale.
            $table->index(['translation_group_id', 'locale'], 'pages_group');

            // The ->published() scope. Equality columns lead, range column
            // trails — correct B-tree order. expires_at is deliberately absent:
            // after a range column it contributes nothing to the tree.
            $table->index(['site_id', 'locale', 'publish_status', 'published_at'], 'pages_publish');

            $table->index(['parent_id', 'sort_order'], 'pages_parent');
            $table->index(['site_id', 'page_type'], 'pages_type');
            $table->index('deleted_at', 'pages_deleted');

            // RESTRICT: deleting a parent must not silently orphan a live URL
            // tree. Force the editor to re-parent first.
            $table->foreign('parent_id', 'pages_parent_id_foreign')
                ->references('id')->on('pages')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};

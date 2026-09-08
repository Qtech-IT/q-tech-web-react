<?php

use App\Enums\Cms\MenuLinkType;
use App\Enums\Cms\MenuVisibility;
use App\Enums\Common\Status;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adjacency list with denormalized `path` and `depth`.
 *
 * Not nested sets: menu editing is nothing but reordering, so the nested-set
 * write cost (rewrite half the tree under a lock on every move) is paid
 * constantly while its read benefit is paid never — the assembled tree is
 * cached wholesale and rebuilt only on write. `path` recovers the two things
 * adjacency lacks: single-query subtree selection, and O(1) rejection of a
 * reparent-into-self.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');

            $table->unsignedBigInteger('menu_id');
            $table->unsignedBigInteger('parent_id')->nullable();

            // Materialized ancestor id path: /1/14/37/. Enables single-query
            // subtree ops via LIKE '/1/14/%'.
            $table->string('path', 255);
            $table->unsignedTinyInteger('depth')->default(0);

            $table->string('label', 191);
            $table->string('aria_label', 191)->nullable();
            $table->string('description', 500)->nullable();
            $table->string('icon', 100)->nullable();
            $table->unsignedBigInteger('media_id')->nullable();

            // Includes `heading` and `separator` so mega-menu column titles are
            // structurally honest instead of href="#" fakes — a heading renders
            // as a real heading, not a focusable dead link.
            $table->enum('link_type', MenuLinkType::getValues())
                ->default(MenuLinkType::URL->value);

            $table->string('url', 500)->nullable();
            $table->string('route_name', 191)->nullable();
            $table->json('route_params')->nullable();
            $table->unsignedBigInteger('page_id')->nullable();
            $table->string('target_type', 60)->nullable();
            $table->unsignedBigInteger('target_id')->nullable();

            $table->boolean('opens_in_new_tab')->default(false);
            $table->string('rel', 100)->nullable();

            $table->string('badge_label', 50)->nullable();
            $table->string('badge_variant', 30)->nullable();

            $table->enum('visibility', MenuVisibility::getValues())
                ->default(MenuVisibility::ALWAYS->value);

            $table->json('settings')->nullable();

            $table->enum('status', Status::getValues())
                ->default(Status::ACTIVE->value);

            $table->integer('sort_order')->default(0);

            $table->timestamps();
            $table->softDeletes();

            $table->unique('uuid', 'menu_items_uuid_unique');

            // Full tree fetch, ordered, one scan.
            $table->index(['menu_id', 'parent_id', 'sort_order'], 'menu_items_tree');

            // Subtree ops: WHERE menu_id = ? AND path LIKE '/1/14/%'.
            $table->index(['menu_id', 'path'], 'menu_items_path');

            // "Which menus link to this page?" — required before a page delete.
            $table->index('page_id', 'menu_items_page');
            $table->index(['target_type', 'target_id'], 'menu_items_target');

            $table->foreign('menu_id', 'menu_items_menu_id_foreign')
                ->references('id')->on('menus')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->foreign('parent_id', 'menu_items_parent_id_foreign')
                ->references('id')->on('menu_items')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->foreign('page_id', 'menu_items_page_id_foreign')
                ->references('id')->on('pages')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->foreign('media_id', 'menu_items_media_id_foreign')
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
        Schema::dropIfExists('menu_items');
    }
};

<?php

use App\Enums\Cms\CtaLinkType;
use App\Enums\Cms\IconPosition;
use App\Enums\Common\Status;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Every button, everywhere. One table.
 *
 * NOTE the circular dependency (§16.1 item 2): `page_sections` FKs to `ctas`,
 * so `ctas` must exist first — but `ctas.page_id` FKs to `pages`. That column
 * is therefore added by a separate Schema::table() migration after `pages`.
 * Do not try to order around it; one of the two FKs must be added separately.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ctas', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->unsignedBigInteger('site_id')->default(1);

            $table->string('label', 191);

            // Accessible name when the label alone is ambiguous
            // ("Learn more" x 8). A WCAG AA requirement, not a nicety.
            $table->string('aria_label', 191)->nullable();

            $table->enum('link_type', CtaLinkType::getValues())
                ->default(CtaLinkType::URL->value);

            $table->string('url', 500)->nullable();

            // Named route survives URL restructuring in a way a raw URL cannot.
            $table->string('route_name', 191)->nullable();

            // Singular, never translated, never queried -> JSON is correct.
            $table->json('route_params')->nullable();

            // page_id is added after `pages` exists — see the class docblock.

            $table->string('target_type', 60)->nullable();
            $table->unsignedBigInteger('target_id')->nullable();

            $table->string('variant', 50)->default('primary');
            $table->string('size', 20)->default('md');

            // Icon registry key (lucide name), not a file.
            $table->string('icon', 100)->nullable();
            $table->enum('icon_position', IconPosition::getValues())
                ->default(IconPosition::NONE->value);

            $table->boolean('opens_in_new_tab')->default(false);
            $table->boolean('is_download')->default(false);
            $table->string('rel', 100)->nullable();

            // Analytics event name, editor-settable so campaigns need no deploy.
            $table->string('tracking_id', 100)->nullable();

            $table->enum('status', Status::getValues())
                ->default(Status::ACTIVE->value);

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();

            $table->timestamps();
            $table->softDeletes();

            $table->unique('uuid', 'ctas_uuid_unique');
            $table->index(['target_type', 'target_id'], 'ctas_target');
            $table->index(['site_id', 'status'], 'ctas_site_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ctas');
    }
};

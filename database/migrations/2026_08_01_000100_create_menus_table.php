<?php

use App\Enums\Common\Status;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->unsignedBigInteger('site_id')->default(1);

            // Developer handle: header, footer_services, legal, social, mobile.
            $table->string('key', 100);
            $table->string('name', 191);

            // Theme slot this menu is mounted in.
            $table->string('location', 100)->nullable();

            // Editor guard-rail, enforced against menu_items.depth.
            $table->unsignedTinyInteger('max_depth')->default(3);

            // Presentation: mega-menu on/off, column count, featured block id.
            $table->json('settings')->nullable();

            $table->boolean('is_locked')->default(false);

            $table->enum('status', Status::getValues())
                ->default(Status::ACTIVE->value);

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();

            $table->timestamps();
            $table->softDeletes();

            $table->unique('uuid', 'menus_uuid_unique');
            $table->unique(['site_id', 'key'], 'menus_key_unique');
            $table->index(['site_id', 'location', 'status'], 'menus_location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};

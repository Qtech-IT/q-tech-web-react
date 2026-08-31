<?php

use App\Enums\Common\Status;
use App\Enums\Marketing\SubscriberStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Newsletter subscribers.
 *
 * WHY EMAIL IS UNIQUE PER SITE AND NOT GLOBALLY
 * ---------------------------------------------
 * Every CMS table in this schema carries `site_id` so multi-site is a
 * migration rather than a rewrite. A list is per-property — the same person
 * may subscribe to two of them — so the unique index is the pair, not the
 * address alone.
 *
 * WHY THERE IS NO `name` COLUMN
 * -----------------------------
 * The form asks for an email address and nothing else, because every extra
 * field measurably costs signups and because collecting a name we never use
 * is data we then have to protect and delete on request. Add the column when
 * something actually personalises on it.
 *
 * CONSENT EVIDENCE — `consent_ip`, `consent_at` and `source` exist so the
 * business can answer "prove they opted in", which is a GDPR obligation and
 * not an analytics nicety. `consent_ip` is nullable and 45 chars for IPv6.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscribers', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->unsignedBigInteger('site_id')->default(1);

            $table->string('email', 191);

            // The consent state. NOT the same as `status` below — see the enum.
            $table->enum('subscription_status', SubscriberStatus::getValues())
                ->default(SubscriberStatus::SUBSCRIBED->value);

            // Which locale they signed up in, so a future campaign can send
            // them the language they were reading when they opted in.
            $table->string('locale', 10)->nullable();

            // Where the signup happened — a section anchor, a campaign slug.
            // Editor-settable per form, so attribution needs no deploy.
            $table->string('source', 100)->nullable();

            $table->string('consent_ip', 45)->nullable();
            $table->timestamp('consent_at')->nullable();
            $table->timestamp('unsubscribed_at')->nullable();

            // Admin soft-disable. Never written by the public form.
            $table->enum('status', Status::getValues())
                ->default(Status::ACTIVE->value);

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();

            $table->timestamps();
            $table->softDeletes();

            $table->unique(['site_id', 'email']);
            $table->index(['site_id', 'subscription_status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscribers');
    }
};

<?php

use App\Enums\Common\Status;
use App\Enums\Marketing\ContactStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Contact enquiries submitted from the public contact page.
 *
 * WHY A TABLE AND NOT JUST AN EMAIL
 * --------------------------------
 * A `mailto:` link or a fire-and-forget notification loses every enquiry the
 * moment the inbox is busy, and gives the business no way to see volume,
 * response time, or which enquiries were never answered. The row is the record
 * of truth; the notification email is a convenience layered on top.
 *
 * WHY `handling_status` IS SEPARATE FROM `status`
 * ----------------------------------------------
 * `status` (Active/Inactive) is the admin's soft-disable. `handling_status`
 * (New/Read/Replied/Archived/Spam) is the triage state — see `ContactStatus`.
 * Conflating them means "archived" and "hidden" become the same flag and one
 * of the two behaviours is lost.
 *
 * CONSENT & PROVENANCE — `ip`, `user_agent`, `locale` and `source` exist so
 * the business can answer "where did this come from" and satisfy a data
 * request. `ip` is nullable and 45 chars for IPv6.
 *
 * `mailed_at` records the last time a templated reply went out from the admin,
 * so a bulk send can skip addresses already contacted and an off-platform
 * reply can be marked by hand.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_submissions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->unsignedBigInteger('site_id')->default(1);

            $table->string('name', 150);
            $table->string('email', 191);
            $table->string('phone', 40)->nullable();
            $table->string('company', 150)->nullable();
            $table->text('message');

            $table->enum('handling_status', ContactStatus::getValues())
                ->default(ContactStatus::NEW->value);

            $table->string('locale', 10)->nullable();
            // Editor-set on the section (a page slug, a campaign) so attribution
            // needs no deploy. Alpha-dash only — never a free-text sink.
            $table->string('source', 100)->nullable();
            $table->string('ip', 45)->nullable();
            $table->string('user_agent', 512)->nullable();

            $table->timestamp('read_at')->nullable();
            $table->timestamp('replied_at')->nullable();
            $table->timestamp('mailed_at')->nullable();

            // Admin soft-disable. Never written by the public form.
            $table->enum('status', Status::getValues())
                ->default(Status::ACTIVE->value);

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();

            $table->timestamps();
            $table->softDeletes();

            $table->unique('uuid');
            $table->index(['site_id', 'handling_status']);
            $table->index(['site_id', 'email']);
            $table->index(['site_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_submissions');
    }
};

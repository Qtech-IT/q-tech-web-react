<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Backfill `files.fileable_type` from raw FQCNs to morph-map aliases.
 *
 * Ordered deliberately BEFORE every new CMS table migration. Not because of a
 * schema dependency — there is none — but so that a failure here aborts
 * `migrate` before any CMS table has been created, making the rollback a no-op
 * rather than a partial schema. See schema doc §4.1 step 2 and §16.1 item 10.
 *
 * The map registered in AppServiceProvider is non-enforcing, so both the old
 * FQCN rows and the new alias rows resolve while this runs. Enforcement is a
 * later release.
 */
return new class extends Migration
{
    /**
     * Legacy owner classes and the aliases they become.
     *
     * Hard-coded rather than read from config('morph-map.aliases') on purpose:
     * a migration must describe the transformation it actually performed, and
     * must keep doing so after the config file changes.
     *
     * @var array<string, string>
     */
    private array $legacyMap = [
        'App\Models\User' => 'user',
        'App\Models\AppSetting' => 'app_setting',
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::transaction(function (): void {
            foreach ($this->legacyMap as $class => $alias) {
                DB::table('files')
                    ->where('fileable_type', $class)
                    ->update(['fileable_type' => $alias]);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::transaction(function (): void {
            foreach ($this->legacyMap as $class => $alias) {
                DB::table('files')
                    ->where('fileable_type', $alias)
                    ->update(['fileable_type' => $class]);
            }
        });
    }
};

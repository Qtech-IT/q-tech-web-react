<?php

namespace Database\Seeders;

use App\Data\Seeder\Roles;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Seed the roles table with optimized approach
     * 
     * Strategy:
     * 1. Create or update each role (firstOrCreate)
     * 2. Clear only that role's permissions
     * 3. Sync with new permissions from config
     * 
     * Result: No data loss, safe incremental updates, no FK errors
     */
    public function run(): void
    {
        $this->command->info('╔════════════════════════════════════════════════════════╗');
        $this->command->info('║     OPTIMIZED ROLE SEEDING                             ║');
        $this->command->info('╚════════════════════════════════════════════════════════╝');
        $this->command->newLine();

        try {
            $rolesConfig = Roles::ALL;

            $this->command->info('👥 Syncing roles with permissions...');
            $this->command->newLine();

            foreach ($rolesConfig as $roleKey => $roleData) {
                $this->syncRole($roleKey, $roleData);
            }

            // Clear cache once at the end
            $this->clearCache();

            $this->command->newLine();
            $this->command->info('╔════════════════════════════════════════════════════════╗');
            $this->command->info('║     ✅ ROLE SEEDING COMPLETED SUCCESSFULLY!          ║');
            $this->command->info('║     All user assignments preserved!                   ║');
            $this->command->info('╚════════════════════════════════════════════════════════╝');
        } catch (\Exception $e) {
            $this->command->error("❌ Error during seeding: {$e->getMessage()}");
            throw $e;
        }
    }

    /**
     * Sync single role:
     * 1. Create or get role (no deletion)
     * 2. Clear only that role's permissions
     * 3. Sync with new permissions
     * 
     * This way:
     * ✅ Role is preserved
     * ✅ User-role assignments stay intact
     * ✅ Permissions are updated
     * ✅ No FK errors
     */
    protected function syncRole(string $roleKey, array $roleData): void
    {
        // Step 1: Create or get the role (never delete)
        $role = Role::firstOrCreate(
            ['name' => $roleKey],
            [
                'display_name'   => $roleData['label'],
                'description'    => $roleData['description']    ?? null,
                'is_super_admin' => $roleData['is_super_admin'] ?? false,
                'order_index'    => $roleData['order']          ?? 0,
                'guard_name'     => 'web',
            ]
        );

        // Update role data in case config changed
        $role->update([
            'display_name'   => $roleData['label'],
            'description'    => $roleData['description']    ?? null,
            'is_super_admin' => $roleData['is_super_admin'] ?? false,
            'order_index'    => $roleData['order']          ?? 0,
        ]);

        // Step 2: Clear only this role's permissions (not the role itself)
        // This is safe because role-permission is a pivot table relationship
        $role->syncPermissions([]);
        $this->command->line("   🧹 Cleared permissions for: {$role->display_name}");

        // Step 3: Sync with new permissions from config

        $assignablePermissions = $roleData['permissions'];

        $permissions = Permission::where('is_group', false)
                                ->when(
                                    $assignablePermissions === 'all' || $roleData['is_super_admin'] === true,
                                    fn(Builder $q): Builder => $q->orderBy('order_index'),
                                    fn(Builder $q): Builder => $q->whereIn('name', $assignablePermissions)
                                )
                                ->get();

        // Assign permissions
        $role->syncPermissions($permissions);
        $this->command->info("   ✨ {$role->display_name} - {$permissions->count()} permissions synced");
    }

    /**
     * Clear permission cache
     */
    protected function clearCache(): void
    {
        Artisan::call('permission:cache-reset');
        $this->command->line('   💾 Cache cleared');
    }
}

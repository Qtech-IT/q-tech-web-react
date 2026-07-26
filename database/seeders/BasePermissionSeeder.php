<?php

// ============================================
// File: database/seeders/BasePermissionSeeder.php
// ============================================

namespace Database\Seeders;

use App\Data\Seeder\Permissions;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

abstract class BasePermissionSeeder extends Seeder
{
    /**
     * Get the module name this seeder handles
     */
    abstract protected function getModuleName(): string;

    /**
     * Get the module configuration
     */
    protected function getModuleConfig(): array
    {
        $allModules = Permissions::getAll();
        $moduleName = $this->getModuleName();

        if (!isset($allModules[$moduleName])) {
            throw new \Exception("Module '{$moduleName}' not found in config/permissions.php");
        }

        return $allModules[$moduleName];
    }

    /**
     * Run seeding
     */
    public function run(): void
    {
        $moduleName = $this->getModuleName();
        $this->command->info("🔄 Syncing {$moduleName} permissions...");

        $this->createModulePermissions($moduleName);

        $this->clearCache();

        $this->command->info("✅ {$moduleName} permissions synced!");
    }

    /**
     * Create permissions for the module using firstOrCreate
     * 
     * Safe approach:
     * - If permission exists: preserved as-is
     * - If permission new: created
     * - Never deletes anything
     */
    protected function createModulePermissions(string $moduleName): void
    {
        $moduleConfig = $this->getModuleConfig();
        $order = 0;

        // Create module parent permission
        $moduleParent = $this->createPermission(
            $moduleName,
            $moduleConfig['label'],
            "Access to {$moduleConfig['label']}",
            $moduleName,
            'access',
            null,
            true,
            $order++
        );

        // Create resource group permissions and their actions
        foreach ($moduleConfig['permissions'] as $resourceKey => $resourceData) {

            $groupFullName = "{$moduleName}.{$resourceKey}";

            // Create resource group parent
            $groupParent = $this->createPermission(
                $groupFullName,
                $resourceData['label'],
                "Access to {$resourceData['label']}",
                $moduleName,
                $resourceKey,
                $moduleParent->id,
                true,
                $order++
            );

            // Create individual action permissions
            foreach ($resourceData['permissions'] as $action => $displayName) {
                $permissionName = "{$resourceKey}.{$action}";

                $this->createPermission(
                    $permissionName,
                    $displayName,
                    null,
                    $moduleName,
                    $action,
                    $groupParent->id,
                    false,
                    $order++
                );
            }
        }

        $this->command->line("   📌 {$moduleConfig['label']} permissions ready");
    }

    /**
     * Create or get permission (safe - never deletes)
     */
    protected function createPermission(
        string $name,
        string $displayName,
        ?string $description = null,
        string $module = 'system',
        string $action = 'manage',
        ?int $parentId = null,
        bool $isGroup = false,
        int $order = 0
    ): Permission {
        return Permission::firstOrCreate(
            ['name' => $name],
            [
                'display_name' => $displayName,
                'description'  => $description,
                'module'       => $module,
                'action'       => $action,
                'parent_id'    => $parentId,
                'is_group'     => $isGroup,
                'order_index'  => $order,
                'guard_name'   => 'web',
            ]
        );
    }

    /**
     * Clear cache
     */
    protected function clearCache(): void
    {
        Artisan::call('permission:cache-reset');
    }
}

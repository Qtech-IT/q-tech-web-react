<?php

namespace Database\Seeders;

use Database\Seeders\Permissions\AdminModulePermissionSeeder;
use Database\Seeders\Permissions\DashboardModuelPermissionSeeder;
use Database\Seeders\Permissions\FormModulePermissionSeeder;
use Database\Seeders\Permissions\SystemModulePermissionSeeder;
use Database\Seeders\Permissions\UserModulePermissionSeeder;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
	/**
	 * List of all module seeders
	 * Add new module seeders here when creating new modules
	 */
	protected array $moduleSeders = [
		AdminModulePermissionSeeder::class,
		DashboardModuelPermissionSeeder::class,
		SystemModulePermissionSeeder::class,
	];

	/**
	 * Run all permission seeders
	 */
	public function run(): void
	{
		$this->command->info('╔════════════════════════════════════════════════════════╗');
		$this->command->info('║     PERMISSION & ROLE SEEDING                          ║');
		$this->command->info('╚════════════════════════════════════════════════════════╝');
		$this->command->newLine();

		try {
			$this->seedModulePermissions();

			$this->command->newLine();

			$this->call(RoleSeeder::class);

			$this->command->newLine();
			$this->command->info('╔════════════════════════════════════════════════════════╗');
			$this->command->info('║     ✅ SEEDING COMPLETED SUCCESSFULLY!                ║');
			$this->command->info('╚════════════════════════════════════════════════════════╝');
		} catch (\Exception $e) {
			$this->command->error("❌ Error during seeding: {$e->getMessage()}");
			throw $e;
		}
	}

	/**
	 * Seed all module permissions
	 */
	protected function seedModulePermissions(): void
	{
		$this->command->info('📦 SEEDING MODULE PERMISSIONS');
		$this->command->line('─────────────────────────────────────────────────────');
		$this->command->newLine();

		foreach ($this->moduleSeders as $seeder) {
			$this->call($seeder);
			$this->command->newLine();
		}
	}
}

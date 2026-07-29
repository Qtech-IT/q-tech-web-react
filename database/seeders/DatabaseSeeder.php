<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
	/**
	 * Seed the application's database.
	 */
	public function run(): void
	{
		$this->call([
			// LanguageSeeder::class,
			PermissionSeeder::class,
			AdminSeeder::class,
			// NotificationTemplateSeeder::class,

			// // CMS. Ordered after PermissionSeeder so the CMS roles it creates
			// // have permissions to sync, and after LanguageSeeder because
			// // menus and pages are seeded per locale.
			// CmsSettingsSeeder::class,
			// CoreMenusSeeder::class,
			// GlobalBlocksSeeder::class,
		]);
	}
}

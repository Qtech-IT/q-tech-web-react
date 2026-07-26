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
			// KycSeeder::class,
			// AdminSeeder::class,
			// FormSeeder::class
			// PolicyPageSeeder::class,
			// NotificationTemplateSeeder::class
		]);
	}
}

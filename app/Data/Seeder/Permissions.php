<?php

namespace App\Data\Seeder;

class Permissions
{
	/**
	 * Summary of getAll
	 * @return array{admin: array, dashboard: array, distribution: array, export-log: array, form: array, import-log: array, location: array, notification-log: array, notification-template: array, reason: array, system: array, user: array, workflow: array}
	 */
	public static function getAll(): array
	{
		return  [
			/**
			 * Permission Configuration - Professional Format
			 * Naming: module.resource.action
			 * Example: workflow.view, workflow.create, step.edit
			 */

			...DashboardPermissions::getAll(),
			...AdminUserPermissions::getAll(),
			...UserPermissions::getAll(),
			...NotificationPermissions::getAll(),
			...FormPermissions::getAll(),
			...SystemPermissions::getAll(),
		];
	}
}

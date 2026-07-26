<?php

namespace App\Data\Seeder;

class NotificationPermissions
{
	/**
	 * Summary of getAll
	 * @return array
	 */
	public static function getAll(): array
	{
		return  [
			'notification-log' => [
				'label'       => ('Notification Log Management'),
				'description' => ('Manage system notification activity'),
				'permissions' => [
					'notification-log' => [
						'label'       => ('Notification Log'),
						'permissions' => [
							'view'   => ('View Log'),
							'delete' => ('Delete Log')
						]
					]
				]
			],

			'notification-template' => [
				'label'       => ('Notification Template Management'),
				'description' => ('Manage system notification templates'),
				'permissions' => [
					'notification-template' => [
						'label'       => ('Notification Template'),
						'permissions' => [
							'view' => ('View Templates'),
							'edit' => ('Edit Templates')
						]
					]
				]
			],
		];
	}
}

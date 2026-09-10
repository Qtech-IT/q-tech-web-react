<?php

namespace App\Notifications;

use App\Enums\Notifications\NotificationTemplateEnum;
use App\Notifications\Contracts\NotificationTemplate;
use App\Notifications\Templates\EmailVerificationTemplate;
use App\Notifications\Templates\NewUserAlertTemplate;
use App\Notifications\Templates\PasswordResetTemplate;
use App\Notifications\Templates\UserRegisterTemplate;
use App\Notifications\Templates\UserStatusUpdateTemplate;

class NotificationTemplateFactory
{
	/**
	 * Get template builder for a notification key
	 *
	 * @param string $key
	 * @return NotificationTemplate
	 * @throws \Exception
	 */
	public static function make(string $key): NotificationTemplate
	{
		try {
			return match ($key) {
				NotificationTemplateEnum::PASSWORD_RESET->value => new PasswordResetTemplate(),
				default                                         => throw new \Exception("Unknown notification template: {$key}")
			};
		} catch (\Exception $ex) {
		}

		throw new \Exception("Unknown notification template: {$key}");
	}
}

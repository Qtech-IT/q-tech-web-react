<?php

namespace App\Notifications;

class NotificationBuilder
{
	public static function build(string $templateKey, array $data): array
	{
		$template = NotificationTemplateFactory::make($templateKey);
		return $template->build($data);
	}
}

<?php

namespace App\Notifications\Contracts;

interface NotificationTemplate
{
	/**
	 * Build notification template data
	 *
	 * @param array $data Input data for template
	 * @return array Prepared notification data
	 */
	public function build(array $data): array;
}

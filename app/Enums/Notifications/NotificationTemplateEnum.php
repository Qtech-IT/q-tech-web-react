<?php

namespace App\Enums\Notifications;

use App\Enums\EnumTrait;

enum NotificationTemplateEnum: string
{
	use EnumTrait;

	case TEST_MAIL          = 'TEST_MAIL';
	case PASSWORD_RESET     = 'PASSWORD_RESET';
	case EMAIL_VERIFICATION = 'EMAIL_VERIFICATION';

	case USER_STATUS_UPDATE = 'USER_STATUS_UPDATE';

	case USER_REGISTERED      = 'USER_REGISTERED';
	case ADMIN_NEW_USER_ALERT = 'ADMIN_NEW_USER_ALERT';

	/**
	 * Get Notification Template
	 *
	 * @return array
	 */
	public static function getTemplates(): array
	{
		return [
			self::PASSWORD_RESET->value => [
				'name'     => key_to_value(self::PASSWORD_RESET->value),
				'subject'  => 'Password Reset',
				'body'     => 'We have received a request to reset the password for your account. OTP: {{otp_code}}, Request time: {{time}}',
				'sms_body' => 'Password reset request received. OTP: {{otp_code}}, Time: {{time}}',

				'template_key' => [
					'otp_code'         => 'Password Reset Code',
					'time'             => 'Password Reset Time',
					'operating_system' => 'Operating System',
					'ip'               => 'IP Address',
					'expired_time'     => 'OTP Expired Time'
				],
				'type'                 => NotificationType::BOTH,
				'is_real_time_disable' => true
			],

			self::TEST_MAIL->value => [
				'name'         => key_to_value(self::TEST_MAIL->value),
				'subject'      => 'Test Mail',
				'body'         => 'This is a test email for mail configuration. Sent at {{time}}',
				'template_key' => [
					'time' => 'Time',
				],
				'is_real_time_disable' => true,
				'is_sms_disable'       => true,
				'type'                 => NotificationType::OUTGOING,
			],
		];
	}
}

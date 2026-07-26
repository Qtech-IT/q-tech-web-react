<?php

namespace App\Traits\Common;

use App\Constants\FilePathConstants;
use App\Enums\Common\Status;
use App\Enums\Notifications\NotificationChannel;
use App\Enums\Notifications\NotificationLogStatus;
use App\Enums\Settings\SettingKey;
use App\Jobs\SendNotificationJob;
use App\Models\AppSetting;
use App\Models\NotificationLog;
use App\Models\NotificationTemplate;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

/**
 * Trait Notify
 *
 * Provides notification sending functionality including email, push, and site notifications.
 */
trait Notify
{
	use Fileable;

	/**
	 * Send a notification based on a template key.
	 *
	 * Supports email, push, and site notifications.
	 *
	 * @param string $templateKey The key identifying the notification template
	 * @param array $data Additional data for placeholders and receiver info
	 * @return bool True if notification processing attempted, false if template not found
	 */
	public function sendNotification(string $templateKey, array $data = []): bool
	{
		$template = NotificationTemplate::where('key', $templateKey)->first();

		if (!$template) {
			return false;
		}

		$templateCode                   = Arr::get($data, 'template_code');
		$data['custom_data']['subject'] = $this->replaceSubjectPlaceholders($template->subject, $templateCode);

		$messageData = [
			'tmpCodes' => $templateCode,
			'userinfo' => Arr::get($data, 'receiver_model')
		];

		$notificationConfigurations = [
			'email_notification' => [
				'status'              => $template->email_notification,
				'body'                => $template->mail_body,
				'global_template_key' => SettingKey::DEFAULT_MAIL_TEMPLATE->value,
				'channel'             => NotificationChannel::EMAIL,
				'gateway'             => AppSetting::where('slug', SettingKey::MAIL_CONFIGURATION->value)
													 ->first()
			]
		];

		foreach ($notificationConfigurations as $type => $config) {
			if ($config['status'] == Status::ACTIVE) {
				if ($config['body']) {
					$message = $this->replaceMessagePlaceholders(
					    $config['body'],
					    $config['global_template_key'],
					    ...$messageData
					);
					$this->createLog($message, $data, $config['gateway'], $config['channel']);
				}
			}
		}

		return true;
	}

	/**
	 * Summary of replaceSubjectPlaceholders
	 * @param string $subject
	 * @param array $tmpCodes
	 * @return string
	 */
	public function replaceSubjectPlaceholders(string $subject, array $tmpCodes): string
	{
		return(str_replace(
		    array_map(fn ($key) => '{{' . $key . '}}', array_keys($tmpCodes)),
		    array_values($tmpCodes),
		    $subject
		));
	}

	/**
	 * Replace placeholders in a template with actual data.
	 *
	 * @param string $body Template body
	 * @param string $settingsKey Global template key
	 * @param array $tmpCodes Placeholder codes
	 * @param mixed $userinfo Receiver user info
	 * @return array|string
	 */
	public function replaceMessagePlaceholders(string $body, string $settingsKey, array $tmpCodes, mixed $userinfo): array|string
	{
		$siteLogo = AppSetting::with('file')
							  ->where('slug', SettingKey::COMPANY_LOGO->value)
							  ->first();

		$logo = $this->getFileURL(
		    $siteLogo?->file,
		    FilePathConstants::getPath(SettingKey::COMPANY_LOGO->value)['path']
		);

		$settings = AppSetting::with('file')
							->whereIn('slug', [
								SettingKey::COMPANY_NAME->value,
								SettingKey::COMPANY_PHONE->value,
								SettingKey::COMPANY_EMAIL->value,
								$settingsKey
							])
							->pluck('setting_value', 'slug')
							->toArray();

		$siteName       = Arr::get($settings, SettingKey::COMPANY_NAME->value, 'system');
		$sitePhone      = Arr::get($settings, SettingKey::COMPANY_PHONE->value, '11233');
		$email          = Arr::get($settings, SettingKey::COMPANY_EMAIL->value, 'system@gmail.com');
		$globalTemplate = Arr::get($settings, $settingsKey, '{{message}}');

		// Replace template codes
		$replaced = str_replace(
		    array_map(fn ($key) => '{{' . $key . '}}', array_keys($tmpCodes)),
		    array_values($tmpCodes),
		    str_replace(
		        ['{{name}}', '{{message}}', '{{company_name}}', '{{company_phone}}', '{{company_email}}', '{{company_logo}}'],
		        [
					$userinfo->username ?? $siteName,
					$body               ?? translate('Dummy message'),
					$siteName,
					$sitePhone,
					$email,
					$logo
				],
		        $globalTemplate
		    )
		);

		return $replaced;
	}

	/**
	 * Summary of createLog
	 * @param string $message
	 * @param array $data
	 * @param mixed $gateway
	 * @param NotificationChannel $channel
	 * @return void
	 */
	public function createLog(string $message, array $data, mixed $gateway = null, NotificationChannel $channel): void
	{
		$notificationLog = new NotificationLog();

		$receiverModel = Arr::get($data, 'receiver_model');
		$customData    = Arr::get($data, 'custom_data');

		$isModel = $receiverModel !== null && $receiverModel instanceof Model;

		unset($customData['push_notification']['receiver_model']);

		$notificationLog->receiver_model = $isModel
											? get_class($receiverModel)
											: null;

		$notificationLog->receiver_id = $isModel
											? $receiverModel?->id
											: null;

		$notificationLog->gateway_id  = $gateway ? $gateway->id : null;
		$notificationLog->custom_data = $customData;
		$notificationLog->message     = $message;
		$notificationLog->status      = NotificationLogStatus::PENDING;
		$notificationLog->channel     = $channel;
		$notificationLog->save();

		SendNotificationJob::dispatch($notificationLog->loadMissing(['receiver', 'gateway']));
	}
}

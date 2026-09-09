<?php

namespace App\Constants;

use App\Constants\GlobalConfig as ConstantsGlobalConfig;
use App\Enums\Common\Status;
use App\Enums\Settings\SettingKey;
use App\Enums\Settings\StorageKey;
use Illuminate\Support\Arr;

class DefaultSettings
{
	/**
	 * Summary of getNumericKeys
	 * @return SettingKey[]
	 */
	public static function getNumericKeys(): array
	{
		return [
			SettingKey::PAGINATION_NUMBER->value,
			SettingKey::EXCHANGE_RATE_WITH_USD->value
		];
	}

	/**
	 * Summary of getLogoKeys
	 * @return string[]
	 */
	public static function getLogoKeys(): array
	{
		return [
			SettingKey::COMPANY_LOGO->value,
			SettingKey::FAVICON->value,
		];
	}

	/**
	 * Summary of getDefaultSetting
	 * @param mixed $key
	 * @return mixed
	 */
	public static function get(?string $key = null): mixed
	{
		$defaultSettings = [
			SettingKey::COMPANY_NAME->value      => config('app.name'),
			SettingKey::PAGINATION_NUMBER->value => 20,
			SettingKey::DATE_FORMAT->value       => 'd M, Y',
			SettingKey::TIME_FORMAT->value       => 'H:i',
			SettingKey::TIMEZONE->value          => 'UTC',
			SettingKey::MAX_FILE_UPLOAD->value   => 4,
			SettingKey::STORAGE->value           => StorageKey::LOCAL->value,

			SettingKey::MAX_FILE_SIZE->value => 20000,

			SettingKey::COPY_RIGHT_TEXT->value => 'All rights reserved.',

			SettingKey::OTP_EXPIRY_SECONDS->value => 200,

			SettingKey::S3_CONFIGURATION->value => json_encode([
				's3_key'    => '@@',
				's3_secret' => '@@',
				's3_region' => '@@',
				's3_bucket' => '@@'
			]),

			SettingKey::FTP_CONFIGURATION->value => json_encode([
				'host'      => '@@',
				'port'      => '@@',
				'user_name' => '@@',
				'password'  => '@@',
				'root'      => '/'
			]),
			SettingKey::DEFAULT_MAIL_TEMPLATE->value => '{{message}}',
			SettingKey::DEFAULT_SMS_TEMPLATE->value  => '{{message}}',
			SettingKey::DEFAULT_PUSH_TEMPLATE->value => '{{message}}',

			SettingKey::THEME_MODE->value               => 'light',
			SettingKey::FONT->value                     => 'inter',
			SettingKey::LAYOUT->value                   => 'default',
			SettingKey::SIDEBAR->value                  => 'inset',
			SettingKey::DIRECTION->value                => 'LTR',
			SettingKey::MINIMUM_PASSWORD_LENGTH->value  => 6,
			SettingKey::LOGIN_ATTEMPT_VALIDATION->value => Status::INACTIVE->value,
			SettingKey::SESSION_TIMEOUT->value          => 120,
			SettingKey::STRONG_PASSWORD->value          => Status::INACTIVE->value,
			SettingKey::MAINTENANCE_MODE->value         => Status::INACTIVE->value,
			SettingKey::MAINTENANCE_TITLE->value        => 'We\'ll be back soon!',
			SettingKey::MAINTENANCE_DESCRIPTION->value  => 'Sorry for the inconvenience but we\'re performing some maintenance at the moment. We\'ll be back online shortly!',

			SettingKey::SITEMAP_ENABLED->value      => Status::ACTIVE->value,
			SettingKey::SITEMAP_CHANGEFREQ->value   => 'weekly',
			SettingKey::ROBOTS_ALLOW_INDEXING->value => Status::ACTIVE->value,
			SettingKey::ROBOTS_AI_CRAWLERS->value   => Status::ACTIVE->value,
		];

		if ($key) {
			return Arr::get($defaultSettings, $key, null);
		}

		return   $defaultSettings;
	}

	/**
	 * Summary of isKeyContainsJsonValue
	 * @param mixed $key
	 * @return bool
	 */
	public static function isKeyContainsJsonValue(string $key): bool
	{
		return in_array($key, ConstantsGlobalConfig::SETTINGS_JSON_KEYS);
	}
}

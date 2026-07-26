<?php

namespace App\Constants;

class FilePathConstants
{
	const FILE_PATH_PREFIX  = 'files/';
	const IMAGE_PATH_PREFIX = 'images/';

	const FILE_PATHS = [
		'profile' => [
			'path' => self::IMAGE_PATH_PREFIX . 'users/profiles',
			'size' => '100x100',
		],

		'text_editor' => [
			'path' => self::IMAGE_PATH_PREFIX . 'content/texteditor',
		],

		'deposit_voucher' => [
			'path' => self::FILE_PATH_PREFIX . 'deposits/vouchers',
		],
		'loan_request' => [
			'path' => self::FILE_PATH_PREFIX . 'loan_requests',
		],

		'company_logo' => [
			'path' => self::IMAGE_PATH_PREFIX . 'branding/logos',
			'size' => '200x80',
		],

		'banner' => [
			'path' => self::IMAGE_PATH_PREFIX . 'banners',
		],

		'crypto_logo' => [
			'path' => self::IMAGE_PATH_PREFIX . 'crypto/logo',
			'size' => '200x80',
		],

		'favicon' => [
			'path' => self::IMAGE_PATH_PREFIX . 'branding/favicon',
			'size' => '32x32',
		],
	];

	/**
	 * Summary of getPath
	 * @param mixed $type
	 * @param mixed $subtype
	 * @return mixed
	 */
	public static function getPath($type, $subtype = null): mixed
	{
		if ($subtype && isset(self::FILE_PATHS[$type][$subtype])) {
			return self::FILE_PATHS[$type][$subtype];
		}
		return self::FILE_PATHS[$type] ?? null;
	}
}

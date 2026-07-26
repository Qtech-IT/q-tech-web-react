<?php

use App\Constants\DefaultSettings;
use App\Constants\FilePathConstants;
use App\Enums\Common\Status;
use App\Enums\Settings\SettingKey;
use App\Enums\System\CacheKey;
use App\Models\AppSetting;
use App\Models\Language;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;
use Jenssegers\Agent\Agent;
use Stevebauman\Location\Facades\Location;

/**
 * Clear all cached files, routes, config, and views
 */
if (!function_exists('optimize_clear')) {
	function optimize_clear(): void
	{
		Artisan::call('optimize:clear');
	}
}

/**
 * Limit a text to a number of words or characters
 */
if (!function_exists('limit_words')) {
	function limit_words(string $text, int|string $limit): string
	{
		return Str::limit($text, $limit, '...');
	}
}

/**
 * Another function to limit text (alias)
 */
if (!function_exists('limitText')) {
	function limitText(string $text, int|string $length): string
	{
		return Str::limit($text, $length);
	}
}

/**
 * Get pagination number from site settings
 */
if (!function_exists('paginateNumber')) {
	function paginateNumber(int $default = 10): int
	{
		$number = (int) site_settings(SettingKey::PAGINATION_NUMBER->value) ?? $default ;

		return $number < 5 ? 10 : $number;
	}
}

/**
 * Convert text to slug format
 */
if (!function_exists('make_slug')) {
	function make_slug(mixed $text): string
	{
		$string = preg_replace('/\s+/u', '-', trim(strtolower($text)));
		$string = preg_replace('/-+/', '-', $string);
		return trim($string, '-');
	}
}

/**
 * Standard unauthorized access message
 */
if (!function_exists('unauthorized_message')) {
	function unauthorized_message(string $message = 'Unauthorized access'): string
	{
		return translate($message);
	}
}

/**
 * Get the current application locale
 */
if (!function_exists('get_system_locale')) {
	function get_system_locale(): string
	{
		return App::getLocale();
	}
}

/**
 * Convert a datetime string to human-readable diff
 */
if (!function_exists('diff_for_humans')) {
	function diff_for_humans(string $date): string
	{
		return Carbon::parse($date)->diffForHumans();
	}
}

/**
 * Generate notification message by replacing template placeholders
 */
if (!function_exists('notificationMessage')) {
	function notificationMessage(array $tmpCodes, string $body, object $userinfo): string
	{
		return str_replace(
		    array_map(fn ($key) => '{{' . $key . '}}', array_keys($tmpCodes)),
		    array_values($tmpCodes),
		    str_replace(
		        ['{{name}}', '{{message}}', '{{company_name}}', '{{phone}}', '{{email}}'],
		        [
					$userinfo->username ?? $userinfo->name,
					$body,
					site_settings('site_name'),
					site_settings('phone'),
					site_settings('email')
				],
		        site_settings('default_mail_template')
		    )
		);
	}
}

/**
 * Convert key-like text to human-readable value
 */
if (!function_exists('key_to_value')) {
	function key_to_value(string $text): string
	{
		return ucfirst(preg_replace('/[^A-Za-z0-9 ]/', ' ', $text));
	}
}

/**
 * Convert value to key format (snake_case by default)
 */
if (!function_exists('value_to_key')) {
	function value_to_key(string $text, ?string $replace = '_'): string
	{
		return strtolower(strip_tags(str_replace(' ', $replace, $text)));
	}
}

/**
 * Generate a unique numeric code based on microtime
 */
if (!function_exists('generateUniqueCode')) {
	function generateUniqueCode(int $minDigits = 6, int $maxDigits = 6): string
	{
		$timestamp  = (string) abs(intval(microtime(true) * 1000000));
		$codeLength = rand($minDigits, $maxDigits);
		return str_pad(substr($timestamp, -$codeLength), $codeLength, '0', STR_PAD_LEFT);
	}
}

/**
 * Get IP-related info with location, device, OS, browser
 */
if (!function_exists('getIpInfo')) {
	function getIpInfo(mixed $ip = null): array
	{
		$ip       = $ip ?? request()->ip();
		$location = Location::get($ip);
		$agent    = new Agent();

		return [
			'ip'           => $ip,
			'country'      => $location->countryName ?? 'Unknown',
			'country_code' => $location->countryCode ?? null,
			'region'       => $location->regionName  ?? 'Unknown',
			'city'         => $location->cityName    ?? 'Unknown',
			'latitude'     => $location->latitude    ?? null,
			'longitude'    => $location->longitude   ?? null,
			'timezone'     => $location->timezone    ?? null,
			'os'           => $agent->platform()     ?? 'Unknown',
			'browser'      => $agent->browser()      ?? 'Unknown',
			'device'       => $agent->device()       ?? 'Unknown',
		];
	}
}

/**
 * Format a datetime string according to site settings
 */
if (!function_exists('get_date_time')) {
	function get_date_time(?string $date, ?string $timeZone = null, ?string $format = null): ?string
	{
		if (!$date) {
			return null;
		}

		$timeZone = site_settings(SettingKey::TIMEZONE->value) ?? 'UTC';
		$format   = ($format ?? site_settings(SettingKey::DATE_FORMAT->value) . ' ' . site_settings(SettingKey::TIME_FORMAT->value));

		$carbon = Carbon::parse($date, 'UTC');

		return Carbon::createFromFormat('Y-m-d H:i:s', $date, 'UTC')
								->setTimezone($timeZone)
								->format($format);
	}
}

/**
 * Generate a random numeric OTP
 */
if (!function_exists('generateOTP')) {
	function generateOTP(int $min = 100000, int $max = 999999): int
	{
		return rand($min, $max);
	}
}

/**
 * Translate a string using current locale
 */
if (!function_exists('translate')) {
	function translate(string $value): string
	{
		$local = App::getLocale();

		try {
		
			$lang_array = include base_path('resources/lang/' . $local . '/messages.php');
			$value      = remove_special_characters($value);
			$key        = value_to_key($value);

			if (!array_key_exists($key, $lang_array)) {
				$lang_array[$key] = $value;
				$str              = '<?php return ' . var_export($lang_array, true) . ';';
				file_put_contents(base_path('resources/lang/' . $local . '/messages.php'), $str);
				return $value;
			}

			return trans('messages.' . $key);
		} catch (\Exception $ex) {

			//dd($ex->getMessage());
			return $value;
		}
	}
}

/**
 * Remove special characters from string
 */
if (!function_exists('remove_special_characters')) {
	function remove_special_characters(?string $text): ?string
	{
		return str_ireplace(
		    ["'", '"', ',', ';', '<', '>', '?'],
		    ' ',
		    preg_replace('/\s\s+/', ' ', $text)
		);
	}
}

/**
 * Update .env key with new value
 */
if (!function_exists('update_env')) {
	function update_env(string $key, string $newValue): void
	{
		$path       = base_path('.env');
		$envContent = file_get_contents($path);

		if (preg_match('/^' . preg_quote($key, '/') . '=/m', $envContent)) {
			$envContent = preg_replace('/^' . preg_quote($key, '/') . '.*/m', $key . '=' . $newValue, $envContent);
		} else {
			$envContent .= PHP_EOL . $key . '=' . $newValue . PHP_EOL;
		}

		file_put_contents($path, $envContent);
	}
}

/**
 * Convert HEX color to RGBA string
 */
if (!function_exists('hexa_to_rgba')) {
	function hexa_to_rgba(string $code): string
	{
		list($r, $g, $b) = sscanf($code, '#%02x%02x%02x');
		return "$r,$g,$b";
	}
}

/**
 * Return default image path
 */
if (!function_exists('get_default_img')) {
	function get_default_img(): string
	{
		return asset('assets/images/default/default.web');
	}
}

/**
 * Convert an array to an object
 */
if (!function_exists('array_to_object')) {
	function array_to_object(array $payload): object
	{
		return (object) $payload;
	}
}

// ---------------------------
// Site Settings Helpers
// ---------------------------

if (!function_exists('site_settings')) {
	/**
	 * Get site setting by key or default
	 *
	 * @param string|null $key
	 * @param mixed $default
	 * @return string|array|null
	 */
	function site_settings(?string $key = null, mixed $default = null): string|array|null
	{
		try {
			$settings = Cache::remember(CacheKey::DEFAULT_SETTINGS->value, 24 * 60, function () {
				return AppSetting::with('file')->pluck('setting_value', 'slug')->toArray();
			});

			if (isset($settings[$key])) {
				return Arr::get($settings, $key, $default);
			}

			return DefaultSettings::get($key);
		} catch (Exception $e) {
			return DefaultSettings::get($key);
		}
	}
}

if (!function_exists('site_logo')) {
	/**
	 * Get site logo by key
	 *
	 * @param string $key
	 * @return string|array|object|null
	 */
	function site_logo(string $key): string|array|object|null
	{
		$settings = Cache::remember(CacheKey::COMPANY_LOGOS->value, 24 * 60, function () {
			return AppSetting::with('file')
							->whereIn('slug', DefaultSettings::getLogoKeys())
							->get();
		});

		return $settings->where('slug', $key)->first();
	}
}

if (!function_exists('auth_user')) {
	/**
	 * Get authenticated user
	 *
	 * @param string $guard
	 * @return mixed
	 */
	function auth_user(string $guard = 'web'): mixed
	{
		return auth()->guard($guard)->user();
	}
}

// ---------------------------
// Response Helpers
// ---------------------------

if (!function_exists('response_status')) {
	/**
	 * Standard API response format
	 *
	 * @param string $message
	 * @param string $key
	 * @return array
	 */
	function response_status(string $message = 'Successfully Completed', string $key = 'success'): array
	{
		return [
			$key => translate($message)
		];
	}
}

// ---------------------------
// Session Helpers
// ---------------------------

if (!function_exists('updateSession')) {
	/**
	 * Update the current session's last activity
	 *
	 * @param string $guardName
	 */
	function updateSession(): void
	{
		$sessionId = request()->session()->getId();

		$sessionTableName = 'sessions';

		$session = DB::table($sessionTableName)->where('id', $sessionId)->first();

		if ($session) {
			$lastActivity = isset($session->last_activity_at)
									? Carbon::parse($session->last_activity_at)
									: null;

			if (is_null($lastActivity) || $lastActivity->diffInMinutes(now()) >= 5) {
				DB::table($sessionTableName)
					->where('id', $sessionId)
					->update([
						'last_activity_at' => now(),
					]);
			}
		}
	}
}

// ---------------------------
// Resource Formatting Helper
// ---------------------------

if (!function_exists('formatResourceResponse')) {
	/**
	 * Format a resource, collection, or paginator response.
	 *
	 * @param mixed $data
	 * @param string $resourceClass
	 * @return mixed
	 */
	function formatResourceResponse($data, string $resourceClass): mixed
	{
		if (!class_exists($resourceClass)) {
			throw new InvalidArgumentException("Resource class {$resourceClass} does not exist");
		}

		return match (true) {
			// Single Model
			$data instanceof \Illuminate\Database\Eloquent\Model => new $resourceClass($data),

			// LengthAwarePaginator
			$data instanceof \Illuminate\Pagination\LengthAwarePaginator => formatLengthAwarePagination($data, $resourceClass),

			// Simple Paginator
			$data instanceof \Illuminate\Pagination\Paginator => formatSimplePagination($data, $resourceClass),

			// Cursor Pagination
			$data instanceof \Illuminate\Pagination\CursorPaginator => formatCursorPagination($data, $resourceClass),

			// Normal Collection
			$data instanceof \Illuminate\Support\Collection => $resourceClass::collection($data),

			$data === null => null,

			default => $data
		};
	}
}

if (!function_exists('formatLengthAwarePagination')) {
	/**
	 * Format LengthAwarePaginator response.
	 *
	 * @param LengthAwarePaginator $paginator
	 * @param class-string<JsonResource> $resourceClass
	 * @return array
	 */
	function formatLengthAwarePagination(LengthAwarePaginator $paginator, string $resourceClass): array
	{
		return [
			'data' => $resourceClass::collection($paginator->items()),
			'meta' => [
				'current_page' => $paginator->currentPage(),
				'last_page'    => $paginator->lastPage(),
				'per_page'     => $paginator->perPage(),
				'total'        => $paginator->total(),
				'from'         => $paginator->firstItem(),
				'to'           => $paginator->lastItem(),
			],
			'links' => [
				'first' => $paginator->url(1),
				'last'  => $paginator->url($paginator->lastPage()),
				'prev'  => $paginator->previousPageUrl(),
				'next'  => $paginator->nextPageUrl(),
			],
		];
	}
}

if (!function_exists('formatSimplePagination')) {
	/**
	 * Format SimplePaginator response.
	 *
	 * @param Paginator $paginator
	 * @param class-string<JsonResource> $resourceClass
	 * @return array
	 */
	function formatSimplePagination(Paginator $paginator, string $resourceClass): array
	{
		return [
			'data' => $resourceClass::collection($paginator->items()),
			'meta' => [
				'current_page' => $paginator->currentPage(),
				'per_page'     => $paginator->perPage(),
			],
			'links' => [
				'prev' => $paginator->previousPageUrl(),
				'next' => $paginator->nextPageUrl(),
			],
		];
	}
}

if (!function_exists('formatCursorPagination')) {
	/**
	 * Format CursorPaginator response.
	 *
	 * @param CursorPaginator $paginator
	 * @param class-string<JsonResource> $resourceClass
	 * @return array
	 */
	function formatCursorPagination(CursorPaginator $paginator, string $resourceClass): array
	{
		return [
			'data' => $resourceClass::collection($paginator->items()),
			'meta' => [
				'per_page' => $paginator->perPage(),
			],
			'links' => [
				'prev' => $paginator->previousPageUrl(),
				'next' => $paginator->nextPageUrl(),
			],
		];
	}
}

// ---------------------------
// String and Array Helpers
// ---------------------------

if (!function_exists('string_to_array')) {
	/**
	 * Convert string to array using separator
	 *
	 * @param string $text
	 * @param string $separator
	 * @return array
	 */
	function string_to_array(string $text, string $separator = ','): array
	{
		return array_map('trim', explode($separator, $text));
	}
}

// ---------------------------
// Number Helpers
// ---------------------------

if (!function_exists('numSuffix')) {
	/**
	 * Get number suffix for K, M, B, T
	 *
	 * @param int|float $n
	 * @return string
	 */
	function numSuffix(int|float $n): string
	{
		$n = abs(($n));
		return $n < 900 ? '' :
				($n < 900_000 ? 'K' :
				($n < 900_000_000 ? 'M' :
				($n < 900_000_000_000 ? 'B' : 'T')));
	}
}

if (!function_exists('format_number_short')) {
	/**
	 * Format number with suffix (K, M, B, T) using site settings
	 *
	 * @param int|float $amount
	 * @return string
	 */
	function format_number_short(int|float $amount): string
	{
		$suffix = numSuffix($amount);

		$divisor = match ($suffix) {
			'K'     => 1_000,
			'M'     => 1_000_000,
			'B'     => 1_000_000_000,
			'T'     => 1_000_000_000_000,
			default => 1,
		};

		$value = $amount / $divisor;

		// Use your existing format_number()
		$formatted = format_number($value);

		// Remove trailing .00 or .0
		$formatted = rtrim(rtrim($formatted, '0'), '.');

		return $formatted . $suffix;
	}
}

// ---------------------------
// Language Helpers
// ---------------------------

if (!function_exists('site_languages')) {
	/**
	 * Get all active site languages
	 *
	 * @return Collection<int, \App\Models\AppSetting>
	 */
	function site_languages(): mixed
	{
		return Cache::rememberForever(CacheKey::SITE_LANGUAGES->value, function () {
			return Language::active()->get();
		});
	}
}

if (!function_exists('getTranslationsFlat')) {
	/**
	 * Get all translation key/value pairs for current locale
	 *
	 * @return array
	 */
	function getTranslationsFlat(): array
	{
		$locale   = App::getLocale();
		$filePath = base_path("resources/lang/{$locale}/messages.php");

		if (!file_exists($filePath)) {
			return [];
		}

		return include $filePath;
	}
}

// ---------------------------
// JSON Helper
// ---------------------------

if (!function_exists('isJson')) {
	/**
	 * Check if a string is valid JSON
	 *
	 * @param mixed $string
	 * @return bool
	 */
	function isJson(mixed $string): bool
	{
		if (!is_string($string)) {
			return false;
		}
		json_decode($string);
		return json_last_error() === JSON_ERROR_NONE;
	}
}

// ---------------------------
// Currency & Number Formatting
// ---------------------------

if (!function_exists('format_number')) {
	/**
	 * Format a number according to site settings
	 *
	 * @param mixed $amount
	 * @return string
	 */
	function format_number(mixed $amount): string
	{
		$decimalPlaces     = (int) site_settings(SettingKey::DECIMAL_PLACES->value) ?? 2;
		$decimalSeparator  = site_settings(SettingKey::DECIMAL_SEPARATOR->value)    ?? '.';
		$thousandSeparator = site_settings(SettingKey::THOUSAND_SEPARATOR->value)   ?? ',';

		return number_format((float) $amount, $decimalPlaces, $decimalSeparator, $thousandSeparator);
	}
}

if (!function_exists('app_format_currency')) {
	/**
	 * Format a number with currency symbol
	 *
	 * @param mixed $amount
	 * @param bool $includeCode
	 * @return string
	 */
	function app_format_currency(mixed $amount, bool $includeCode = false, bool $formatNumberShort = false): string
	{
		if(!$amount || !is_numeric($amount)) {
			$amount = 0;
		}

		$symbol       = site_settings(SettingKey::CURRENCY_SYMBOL->value)   ?? '$';
		$position     = site_settings(SettingKey::CURRENCY_POSITION->value) ?? 'left';
		$currencyCode = site_settings(SettingKey::DEFAULT_CURRENCY->value)  ?? 'USD';
		$formatted    = $formatNumberShort ? format_number_short($amount) : format_number($amount) ;

		$withSymbol = match ($position) {
			'left'        => "{$symbol}{$formatted}",
			'left_space'  => "{$symbol} {$formatted}",
			'right'       => "{$formatted}{$symbol}",
			'right_space' => "{$formatted} {$symbol}",
			default       => "{$symbol}{$formatted}",
		};

		if ($includeCode || site_settings(SettingKey::SHOW_CURRENCY_CODE->value) == Status::ACTIVE->value) {
			$withSymbol .= " {$currencyCode}";
		}

		return $withSymbol;
	}
}

if (!function_exists('format_decimal')) {
	/**
	 * Format decimal number without thousand separator
	 *
	 * @param mixed $amount
	 * @return string
	 */
	function format_decimal(mixed $amount): string
	{
		$decimalPlaces = (int) site_settings(SettingKey::DECIMAL_PLACES->value) ?? 2;
		return number_format((float) $amount, $decimalPlaces, '.', '');
	}
}

if (!function_exists('isAdminRoute')) {
	/**
	 * Summary of isAdminRoute
	 * @return bool
	 */
	function isAdminRoute(): bool
	{
		return request()->is('admin/*') || request()->is('admin');
	}
}

if (!function_exists('isTrashRequest')) {
	/**
	 * Summary of isTrashRequest
	 * @return bool
	 */
	function isTrashRequest(): bool
	{
		return request()->has('is_trash');
	}
}

if (!function_exists('getGuestOnboardingStatus')) {
	/**
	 * Summary of getGuestOnboardingStatus
	 * @return mixed
	 */
	function getGuestOnboardingStatus(): mixed
	{
		return Cache::rememberForever(
		    CacheKey::GUEST_ONBOARDING_COMPLETED->value,
		    fn (): mixed => AppSetting::where('slug', SettingKey::GUEST_ONBOARDING_COMPLETED->value)
				->value('setting_value') ?? false
		);
	}
}

if (!function_exists('getAuthOnboardingStatus')) {
	/**
	 * Summary of getAuthOnboardingStatus
	 * @return mixed
	 */
	function getAuthOnboardingStatus(): mixed
	{
		return Cache::rememberForever(
		    CacheKey::AUTH_ONBOARDING_COMPLETED->value,
		    fn (): mixed => AppSetting::where('slug', SettingKey::AUTH_ONBOARDING_COMPLETED->value)
				->value('setting_value') ?? false
		);
	}
}

if (!function_exists('isSuperAdminUser')) {
	/**
	 * Summary of isSuperAdminUser
	 * @param mixed $user
	 * @return bool
	 */
	function isSuperAdminUser(?User $user = null): bool
	{
		if (!$user) {
			return false;
		}
		$user->loadMissing('roles');
		return $user->roles->contains('is_super_admin', true);
	}
}

if (!function_exists('getAuditUserMeta')) {
	/**
	 * Summary of isSuperAdminUser
	 * @param mixed $user
	 * @return bool
	 */
	function getAuditUserMeta(?User $user, array $attributes = ['id', 'name']): array
	{
		$meta = [];

		try {
			foreach ($attributes as $attribute) {
				$meta[$attribute] = $user?->{$attribute};
			}
		} catch (\Throwable $th) {
			//throw $th;
		}

		return $meta;
	}
}

if (!function_exists('getCopyRightText')) {
	function getCopyRightText(): string
	{
		$text     = site_settings(SettingKey::COPY_RIGHT_TEXT->value);
		$siteName = site_settings(SettingKey::COMPANY_NAME->value);
		if (str_contains($text, '{company_name}')) {
			return str_replace('{company_name}', $siteName, $text);
		}

		return trim($siteName . ' ' . $text);
	}
}

if (!function_exists('abortIfAuthUser')) {
	/**
	 * Throw exception if the authenticated user matches the given user.
	 *
	 * @param \App\Models\User $user
	 * @param string $message
	 * @throws \Illuminate\Auth\Access\AuthorizationException
	 */
	function abortIfAuthUser($user, $message = 'Action not allowed on yourself.')
	{
		if (auth()?->id() === $user->id) {
			throw new AuthorizationException(translate($message));
		}
	}
}

if (!function_exists('build_dom_document')) {
	/**
	 * Summary of build_dom_document
	 * @param mixed $text
	 * @param mixed $name
	 * @return array{files: array, html: string|array{files: mixed, html: string}}
	 */
	function build_dom_document($text, $name = 'text_area'): array
	{
		$dom = new \DOMDocument();
		libxml_use_internal_errors(true);
		$dom->loadHTML('<meta charset=utf-8">' . $text);
		libxml_use_internal_errors(false);
		$imageFile = $dom->getElementsByTagName('img');

		if ($imageFile) {
			$files = [];
			foreach ($imageFile as $item => $image) {
				$data           = $image->getAttribute('src');
				$check_b64_data = preg_match("/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).base64,.*/", $data);

				if ($check_b64_data) {
					list($type, $data) = explode(';', $data);
					list(, $data)      = explode(',', $data);
					$imgeData          = base64_decode($data);
					$image_name        = $name . time() . $item . '.png';
					$save_path         = FilePathConstants::getPath('text_editor')['path'];

					try {
						if (!file_exists($save_path)) {
							mkdir($save_path, 0755, true);
						}

						$saveableImage = Image::read($imgeData);
						$tempPath      = sys_get_temp_dir() . '/' . $image_name;
						$saveableImage->save($tempPath);

						Storage::disk('public')->putFileAs(
						    $save_path,
						    new \Illuminate\Http\File($tempPath),
						    $image_name
						);

						@unlink($tempPath);

						$imageURL = Storage::disk('public')->url($save_path . '/' . $image_name);

						$image->removeAttribute('src');

						$image->setAttribute('src', $imageURL);

						array_push($files, $image_name);
					} catch (Exception $e) {
					}
				}
			}
		}
		$html = $dom->saveHTML();
		$html = html_entity_decode($html, ENT_COMPAT, 'UTF-8');
		return [
			'html'  => restoreEncodedPlaceholders($html),
			'files' => $files,
		];
	}
}

if (!function_exists('restoreEncodedPlaceholders')) {
	/**
	 * Summary of restoreEncodedPlaceholders
	 * @param string $html
	 * @return array|string|null
	 */
	function restoreEncodedPlaceholders(string $html): string
	{
		// Decode URL-encoded placeholders inside attributes
		$html = preg_replace_callback(
		    '/%7B%7B(.*?)%7D%7D/i',
		    fn ($m) => '{{' . $m[1] . '}}',
		    $html
		);

		// Decode HTML-entity encoded placeholders (safety)
		$html = preg_replace_callback(
		    '/&#123;&#123;(.*?)&#125;&#125;/',
		    fn ($m) => '{{' . $m[1] . '}}',
		    $html
		);

		return $html;
	}
}

if (!function_exists('isAdmin')) {
	function isAdmin(User $user): bool
	{
		return $user->is_admin;
	}
}

if (!function_exists('isBackendRoute')) {
	function isBackendRoute(): bool
	{
		return request()->is('backend/*') || request()->is('backend') || request()->routeIs('backend.*');
	}
}

if(!function_exists('getArea')) {
	function getArea(): string | null
	{
		return  request()->route('area');
	}
}

if(!function_exists('isBackenArea')) {
	function isBackenArea(): bool
	{
		return  getArea() === 'backend';
	}
}

<?php

use App\Http\Controllers\Auth\AuthenticateController;
use App\Http\Controllers\Backend\AdminUserController;
use App\Http\Controllers\Backend\DashboardController;
use App\Http\Controllers\Backend\Job\FailedJobController;
use App\Http\Controllers\Backend\Job\JobController;
use App\Http\Controllers\Backend\LanguageController;
use App\Http\Controllers\Backend\NotificationLogController;
use App\Http\Controllers\Backend\NotificationTemplate\NotificationTemplateController;
use App\Http\Controllers\Backend\OtpCodeController;
use App\Http\Controllers\Backend\PermissionController;
use App\Http\Controllers\Backend\Profile\ProfileController;
use App\Http\Controllers\Backend\Profile\TwoFactorController;
use App\Http\Controllers\Backend\RoleController;
use App\Http\Controllers\Backend\Settings\AutomationController;
use App\Http\Controllers\Backend\Settings\BackupController;
use App\Http\Controllers\Backend\Settings\CacheController;
use App\Http\Controllers\Backend\Settings\MailConfigurationController;
use App\Http\Controllers\Backend\Settings\SettingsController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;

use Illuminate\Support\Str;
use SebastianBergmann\CodeCoverage\Report\Xml\Report;

// Group routes with sanitization and user session middleware
Route::middleware(['sanitization', 'throttle:60,1'])->group(function (): void {
	//GUEST USER ROUTE

	require __DIR__ . '/auth.php';

	Route::get('/', fn (): RedirectResponse => redirect(route('backend.login')));

	/**
	 * ======================================
	 * AUTHENTICATED BACKEND ROUTES
	 * ======================================
	 */
	Route::group([
		'middleware' => ['auth:web']
	], function () {
		/**
		 * ======================================
		 * AUTH ONBOARDING USERS ROUTES
		 * ======================================
		 */

		// Dashboard
		Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

		Route::post('/logout', [AuthenticateController::class, 'logout'])->name('logout');

		/**
		 * =========================
		 * SETTINGS ROUTES
		 * =========================
		 */
		Route::controller(SettingsController::class)
			->prefix('settings/')
			->name('settings.')
			->group(function () {
				Route::get('index', 'index')->name('index');
				Route::get('appearance', 'appearance')->name('appearance');
				Route::get('logo', 'logo')->name('logo');
				Route::get('storage', 'storage')->name('storage');
				Route::get('security', 'security')->name('security');
				Route::get('system', 'system')->name('system');
				Route::get('currency', 'currency')->name('currency');
				Route::get('support', 'support')->name('support');

				Route::post('store', 'store')->name('store');

				Route::post('toggle-app-debug', 'toggleAppDebug')
							  ->name('toggle.app.debug');
				Route::post('switch-language', 'switchLanguage')
							  ->name('switch.language');
			});

		Route::get('system-information', [SettingsController::class, 'systemInformation'])->name('system.information');

		/**
		 * =========================
		 * MAIL CONFIGURATION ROUTES
		 * =========================
		 */

		Route::controller(MailConfigurationController::class)
			->prefix('mail-configurations')
			->name('mail.configuration.')
			->group(function () {
				Route::get('/', 'index')->name('index');
				Route::post('/store', 'store')->name('store');
				Route::post('/test', 'test')->name('test');
			});

		/**
		 * =========================
		 * BACKUP ROUTES
		 * =========================
		 */
		Route::controller(BackupController::class)
			->prefix('backups')
			->name('backups.')
			->group(function () {
				Route::get('/', 'index')->name('index');
				Route::post('create', 'createBackup')->name('create');
				Route::post('delete/{backupId}', 'deleteBackup')->name('delete');
				Route::post('delete-all', 'deleteAllBackups')->name('delete.all');
				Route::get('download/{backupId}', 'downloadBackup')->name('download');
			});

		/**
		 * =========================
		 * CACHE ROUTES
		 * =========================
		 */
		Route::controller(CacheController::class)
			->prefix('cache')
			->name('cache.')
			->group(function () {
				Route::get('/cache', 'index')->name('index');
				Route::post('/cache/clear/{type}', 'clearSpecificCache')->name('clear');
				Route::post('/cache/clear-all', 'clearAllCache')->name('clear-all');
			});

		/**
		 * =========================
		 * AUTOMATION & CRON ROUTES
		 * =========================
		 */
		Route::controller(AutomationController::class)
			->prefix('automation')
			->name('automation.')
			->group(function () {
				Route::get('automation', 'index')->name('index');
				Route::post('run/{commandId}', 'runCommand')->name('run');
				Route::post('clear/cache', 'clearCommandCache')->name('clear.cache');
			});

		/**
		 * =========================
		 * NOTIFICATION TEMPLATE  ROUTES
		 * =========================
		 */
		Route::controller(NotificationTemplateController::class)
		 ->prefix('notification-templates/')
		 ->name('notification-templates.')->group(function () {
		 	Route::get('global', 'globalTemplate')->name('global');
		 	Route::post('update/global-template', 'globalTemplate')->name('global');
		 });

		/**
		 * =========================
		 * LANGUAGES  ROUTES
		 * =========================
		 */
		Route::controller(LanguageController::class)
		  ->prefix('languages/')
		  ->name('languages.')
		  ->group(function () {
		  	Route::post('update-status', 'updateStatus')
		  							  ->name('update.status');
		  	Route::get('translation/{code}', 'getTranslation')
		  							  ->name('translation');
		  	Route::post('translate', 'translate')
		  							  ->name('translate');

		  	Route::post('make-default', 'makeDefault')
		  							  ->name('make.default');
		  });

		/**
		 * =========================
		 * JOBS  ROUTES
		 * =========================
		 */
		Route::controller(JobController::class)
			->prefix('jobs')
			->name('jobs.')
			->group(function () {
				Route::post('bulk/action', 'bulkAction')->name('bulk.action');
				Route::post('{job}/retry', 'retry')->name('retry');
				Route::get('{job}/run', 'run')->name('run');
			});

		/**
		 * =========================
		 * FAILED JOBS  ROUTES
		 * =========================
		 */
		Route::controller(FailedJobController::class)
			->prefix('failed-jobs')
			->name('failed-jobs.')
			->group(function () {
				Route::post('bulk/action', 'bulkAction')->name('bulk.action');
				Route::get('{failedJob}/retry', 'retry')->name('retry');
				Route::post('retry-all', 'retryAll')->name('retry-all');
				Route::delete('clear-all', 'clearAll')->name('clear-all');
			});

		/**
		 * =========================
		 * RESOURCE ROUTES
		 * =========================
		 */
		Route::resources(
		    [
				'admin-users'            => AdminUserController::class,
				'otp-codes'              => OtpCodeController::class,
				'roles'                  => RoleController::class,
				'profile'                => ProfileController::class,
				'notification-templates' => NotificationTemplateController::class,
				'notification-logs'      => NotificationLogController::class,
				'languages'              => LanguageController::class,
				'jobs'                   => JobController::class,
				'failed-jobs'            => FailedJobController::class,
				'permissions'            => PermissionController::class
			],
		);

		/**
		 * =========================
		 * NOTIFICATION LOG ROUTES
		 * =========================
		 */
		Route::controller(NotificationLogController::class)
			->prefix('notification-logs')
			->name('notification-logs.')
			->group(function () {
				Route::post('bulk/action', 'bulkAction')->name('bulk.action');
			});

		/**
		 * =========================
		 * USER & ROLES MANAGEMENT ROUTES
		 * =========================
		 */
		Route::controller(RoleController::class)
			->prefix('roles')
			->name('roles.')
			->group(function () {
				Route::get('/clone/{id}', 'clone')->name('clone');
			});

		Route::controller(AdminUserController::class)
			->prefix('admin-users')
			->name('admin-users.')
			->group(function () {
				Route::post('update-status', 'updateStatus')->name('update.status');
				Route::post('2fa/update', 'update2FA')->name('2fa.update');
			});

		/**
		 * =========================
		 * PROFILE ROUTES
		 * =========================
		 */
		Route::controller(ProfileController::class)->name('profile.')->group(function () {
			Route::get('password', 'password')
					->name('password.index');

			Route::post('password/update', 'passwordUpdate')
					->name('password.update');

			Route::get('browser/session', 'getBrowserSession')
					->name('browser.session');

			Route::post('verify-email-otp', 'verifyEmailOtp')
					->name('verify-email-otp');

			Route::post('/resend-otp', 'resendOtp')
					->name('resend-otp');
		});

		/**
		 * =========================
		 * TWO-FACTOR AUTHENTICATION ROUTES
		 * =========================
		 */
		Route::controller(TwoFactorController::class)
			->prefix('2fa/')
			->name('2fa.')
			->group(function () {
				Route::get('/', 'index')->name('index');
				Route::post('verify', 'verify')->name('verify');
				Route::post('disable', 'disable')->name('disable');
				Route::post('recovery-code/regenerate', 'regenerateRecoveryCodes')->name('regenerate.code');
			});

		/**
		 * =========================
		 * PROFILE ROUTES
		 * =========================
		 */
		Route::controller(ProfileController::class)->name('profile.')->group(function () {
			Route::get('password', 'password')->name('password.index');
			Route::post('password/update', 'passwordUpdate')->name('password.update');
			Route::get('browser/session', 'getBrowserSession')->name('browser.session');
		});
	});
});

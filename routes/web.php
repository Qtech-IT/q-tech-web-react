<?php

use App\Http\Controllers\Auth\AuthenticateController;
use App\Http\Controllers\Auth\User\AuthenticateController as UserAuthenticateController;
use App\Http\Controllers\Backend\AdminUserController;
use App\Http\Controllers\Backend\BannerController;
use App\Http\Controllers\Backend\CryptoController;
use App\Http\Controllers\Backend\CryptoWalletAddressController;
use App\Http\Controllers\Backend\DashboardController;
use App\Http\Controllers\Backend\FaqController;
use App\Http\Controllers\Backend\Job\FailedJobController;
use App\Http\Controllers\Backend\Job\JobController;
use App\Http\Controllers\Backend\KycLogController;
use App\Http\Controllers\Backend\LanguageController;
use App\Http\Controllers\Backend\LoanProductController;
use App\Http\Controllers\Backend\LoanRequestController;
use App\Http\Controllers\Backend\NotificationLogController;
use App\Http\Controllers\Backend\NotificationTemplate\NotificationTemplateController;
use App\Http\Controllers\Backend\OtpCodeController;
use App\Http\Controllers\Backend\PermissionController;
use App\Http\Controllers\Backend\PolicyPageController;
use App\Http\Controllers\Backend\Profile\ProfileController;
use App\Http\Controllers\Backend\Profile\TwoFactorController;
use App\Http\Controllers\Backend\ReportController;
use App\Http\Controllers\Backend\RoleController;
use App\Http\Controllers\Backend\Settings\AutomationController;
use App\Http\Controllers\Backend\Settings\BackupController;
use App\Http\Controllers\Backend\Settings\CacheController;
use App\Http\Controllers\Backend\Settings\MailConfigurationController;
use App\Http\Controllers\Backend\Settings\SettingsController;
use App\Http\Controllers\Backend\SystemUserController;
use App\Http\Controllers\Backend\TradeController as BackendTradeController;
use App\Http\Controllers\Backend\TradeSettingController;
use App\Http\Controllers\Backend\UserWalletController;
use App\Http\Controllers\CronController;
use App\Http\Controllers\Frontend\HistoryController;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\ProfileController as FrontendProfileController;
use App\Http\Controllers\Frontend\TradeController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;
use SebastianBergmann\CodeCoverage\Report\Xml\Report;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Str;

Route::get('/extract-translations', function () {

    $path  = resource_path('js');
    $files = new \RecursiveIteratorIterator(
        new \RecursiveDirectoryIterator($path)
    );

    $strings = [];

    // ✅ Step 1: Extract all t('...') strings
    foreach ($files as $file) {
        if ($file->isFile() && in_array($file->getExtension(), ['js', 'jsx', 'ts', 'tsx'])) {

            $content = file_get_contents($file->getPathname());

            preg_match_all("/\bt\s*\(\s*['\"`]([^'\"`]+)['\"`]\s*\)/", $content, $matches);

            foreach ($matches[1] ?? [] as $match) {
                $strings[$match] = $match; // unique values
            }
        }
    }

    $local   = App::getLocale();
    $langPath = base_path("resources/lang/{$local}/messages.php");

    // ✅ Step 2: Load file ONCE
    $lang_array = file_exists($langPath) ? include $langPath : [];

    // ✅ Step 3: Process strings
    foreach ($strings as $value) {

        $value = trim($value);

        // Generate key (slug style)
        $key = Str::slug($value, '_');

        // ✅ Fix duplicate key issue
        if (isset($lang_array[$key]) && $lang_array[$key] !== $value) {
            $key .= '_' . substr(md5($value), 0, 5);
        }

        // ✅ Insert if not exists
        if (!isset($lang_array[$key])) {
            $lang_array[$key] = $value;
        }
    }

    // ✅ Step 4: Write file ONCE
    $content = '<?php return ' . var_export($lang_array, true) . ';';
    file_put_contents($langPath, $content);

    return response()->json([
        'status'  => 'success',
        'total'   => count($strings),
        'updated' => count($lang_array),
    ]);
});

 Route::get('/run/cron', [CronController::class, 'runCron'])->name('run.cron');

 Route::get('/coin/price/sync', [CronController::class, 'coinPriceSync'])->name('coin.price.sync');

// Group routes with sanitization and user session middleware
Route::middleware(['sanitization', 'throttle:60,1'])->group(function (): void {
	//GUEST USER ROUTE

	require __DIR__ . '/auth.php';

	//==========================================frontend==========================================//

	Route::get('/', [HomeController::class, 'index'])->name('frontend.home');
	Route::get('/markets', [HomeController::class, 'market'])->name('market');
	Route::get('/pages/{slug}', [HomeController::class, 'page'])->name('pages');

	Route::post('/switch-language', [HomeController::class, 'switchLanguage'])
							  ->name('switch.language');

	Route::group([
		'middleware' => ['auth:web', 'check.user.status'],
		'prefix'     => 'user',
		'as'         => 'user.'
	], function () {
		Route::middleware(['kyc.verification'])->controller(TradeController::class)
		->prefix('trade/')
		->name('trade.')
		->group(function () {
			Route::get('/', 'index')->name('index');
			Route::get('/options', 'option')->name('options');

			Route::get('show/{crypto}', 'show')->name('show');
			Route::post('open', 'open')->name('open');
			Route::post('settle', 'settle')->name('settle');
		});

		Route::get('flash/swap', [HomeController::class, 'flashSwap'])->name('flash.swap');
		Route::get('transfer', [HomeController::class, 'transfer'])->name('transfer');

		Route::post('/logout', [UserAuthenticateController::class, 'logout'])->name('logout');

		Route::get('support', [FrontendProfileController::class, 'support'])->name('support');

		// loan
		Route::get('user/loan', [HomeController::class, 'loan'])->name('loan');
		Route::get('user/loan/product/{id}', [HomeController::class, 'loanProduct'])->name('loan.product');

		Route::post('user/loan', [HomeController::class, 'loanRequest'])->name('loan.request');
		Route::delete('user/loan/destroy/{loanRequest}', [HomeController::class, 'deletLoanRequest'])->name('loan.request.destroy');

		Route::controller(FrontendProfileController::class)->name('profile.')->group(function () {
			Route::get('/', 'index')->name('index');

			Route::get('/show', 'show')->name('show');
			Route::post('/update', 'update')->name('update');
			Route::get('password', 'password')->name('password.index');
			Route::post('password/update', 'passwordUpdate')->name('password.update');

			Route::get('withdraw/addresses', 'withdrawAddresses')->name('withdraw.addresses');
			Route::post('withdraw/addresses', 'updateWithdrawAddress')->name('withdraw.addresses.update');

			Route::get('assets', 'assets')->name('assets');
		});

		// Deposit Routes

		Route::controller(HistoryController::class)->group(function () {
			Route::get('/deposit', 'deposit')->name('deposit');
			Route::post('/deposit/request', 'depositRequest')->name('deposit.request');

			Route::get('/deposit/history', 'depositHistory')->name('deposit.history');

			Route::get('/withdrawal', 'withdrawal')->name('withdrawal');
			Route::post('/withdrawal/request', 'withdrawalRequest')->name('withdrawal.request');

			Route::get('/withdrawal/history', 'withdrawalHistory')->name('withdraw.history');

			// Trade Routes
			Route::get('/trades', 'trades')->name('trade');

			//
			Route::get('/kyc-logs', 'kycLog')->name('kyc.logs');

			// KYC Routes
			Route::get('/kyc-apply', 'kycApply')->name('kyc.apply');
			Route::post('/kyc-apply', 'kycApplySubmit')->name('kyc.submit');
		});
	});

	//==========================================frontend==========================================//

	//==========================================backend==========================================//

	Route::get('/backend', fn (): RedirectResponse => redirect(route('backend.login')));

	/**
	 * ======================================
	 * AUTHENTICATED BACKEND ROUTES
	 * ======================================
	 */
	Route::group([
		'middleware' => ['auth:web', 'check.user.status', 'check.admin'],
		'prefix'     => 'backend',
		'as'         => 'backend.'
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
				Route::get('withdraw-deposit/configuration', 'withdrawDepositConfiguration')->name('withdraw-deposit.configuration');
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

		Route::controller(CryptoController::class)
		->prefix('crypto-currencies')
		->name('crypto-currencies.')
		->group(function () {
				Route::post('update-status', 'updateStatus')->name('update.status');
				Route::get('/search-coin', 'searchCoinGecko')->name('search.coin');
				Route::get('/sync', 'sync')->name('sync');

				Route::get('/get-markets', 'getMarketList')->name('get.market');
				Route::post('/update-order', 'updateOrder')->name('update.order');
		});

		Route::controller(CryptoWalletAddressController::class)
		->prefix('crypto-wallets-addresses')
		->name('crypto-wallets-addresses.')
		->group(function () {
				Route::post('update-status', 'updateStatus')->name('update.status');
		});

		/**
		 * =========================
		 * RESOURCE ROUTES
		 * =========================
		 */
		Route::resources(
		    [
				'admin-users'              => AdminUserController::class,
				'loan-products'            => LoanProductController::class,
				'loan-requests'            => LoanRequestController::class,
				'kyc-logs'                 => KycLogController::class,
				'crypto-currencies'        => CryptoController::class,
				'trade-settings'           => TradeSettingController::class,
				'trades'                   => BackendTradeController::class,
				'crypto-wallets-addresses' => CryptoWalletAddressController::class,
				'users'                    => SystemUserController::class,
				'faqs'                     => FaqController::class,
				'banners'                  => BannerController::class,
				'policy-pages'             => PolicyPageController::class,
				'otp-codes'                => OtpCodeController::class,
				'roles'                    => RoleController::class,
				'profile'                  => ProfileController::class,
				'notification-templates'   => NotificationTemplateController::class,
				'notification-logs'        => NotificationLogController::class,
				'languages'                => LanguageController::class,
				'jobs'                     => JobController::class,
				'failed-jobs'              => FailedJobController::class,
				'permissions'              => PermissionController::class
			],
		);

		//user wallets

		Route::controller(UserWalletController::class)
		->prefix('user-wallets')
		->name('user-wallet.')
		->group(function () {
			Route::get('/', 'index')->name('index');
			Route::post('/handle', 'handle')->name('handle');
			Route::get('/deposits', 'deposit')->name('deposit');
			Route::get('/deposit-updates', 'depositUpdate')->name('deposit.update');

			Route::get('/withdraws', 'withdraw')->name('withdraw');
			Route::get('/withdraw-updates', 'withdrawUpdate')->name('withdraw.update');

			Route::get('/transactions', 'transaction')->name('transaction');
		});

		// report controller

		Route::controller(ReportController::class)
		->group(function () {
			//DEPOSIT ROUTES
			Route::get('deposits', 'deposit')->name('deposit.index');
			Route::post('deposit-update', 'depositUpdate')->name('deposit.update');
			Route::delete('deposit/{deposit}/delete', 'depositDelete')->name('deposit.delete');

			//WITHDRAWAL ROUTES
			Route::get('withdrawals', 'withdrawal')->name('withdrawal.index');
			Route::post('withdrawal-update', 'withdrawalUpdate')->name('withdrawal.update');
			Route::delete('withdrawal/{withdrawal}/delete', 'withdrawalDelete')->name('withdrawal.delete');
		});

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

		Route::controller(SystemUserController::class)
			->prefix('users')
			->name('users.')
			->group(function () {
				Route::post('update-status', 'updateStatus')->name('update.status');

				Route::post('bulk/action', 'bulkAction')->name('bulk.action');
				Route::post('update-winner', 'updateWinner')->name('update-winner');
			});

		// form Routes
		require __DIR__ . '/form.php';

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

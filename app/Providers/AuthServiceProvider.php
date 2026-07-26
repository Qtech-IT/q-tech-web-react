<?php

namespace App\Providers;

use App\Models\Banner;
use App\Models\Crypto;
use App\Models\CryptoWalletAddress;
use App\Models\KycLog;
use App\Models\LoanProduct;
use App\Models\LoanRequest;
use App\Models\TradeSetting;
use App\Models\User;
use App\Models\UserBalance;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
	protected $policies = [
		\Spatie\Permission\Models\Role::class => \App\Policies\RolePolicy::class,
		\App\Models\User::class               => \App\Policies\UserPolicy::class,
		\App\Models\VerificationCode::class   => \App\Policies\OtpPolicy::class,

		\App\Models\Form::class                 => \App\Policies\FormPolicy::class,
		\App\Models\FormField::class            => \App\Policies\FormFieldPolicy::class,
		\App\Models\NotificationTemplate::class => \App\Policies\NotificationTemplatePolicy::class,
		\App\Models\Language::class             => \App\Policies\LanguagePolicy::class,
		\App\Models\NotificationLog::class      => \App\Policies\NotificationLogPolicy::class,

		\App\Models\PolicyPage::class => \App\Policies\PolicyPagePolicy::class,
		\App\Models\Faq::class        => \App\Policies\FaqPolicy::class,
		UserBalance::class            => \App\Policies\UserBalancePolicy::class,
		Crypto::class                 => \App\Policies\CryptoPolicy::class,
		CryptoWalletAddress::class    => \App\Policies\CryptoWalletAddressPolicy::class,
		KycLog::class                 => \App\Policies\KycLogPolicy::class,
		Banner::class                 => \App\Policies\BannerPolicy::class,
		TradeSetting::class           => \App\Policies\TradeSettingPolicy::class,
		LoanProduct::class            => \App\Policies\LoanProductPolicy::class,
		LoanRequest::class            => \App\Policies\LoanRequestPolicy::class,

		'dashboard'         => \App\Policies\DashboardPolicy::class,
		'setting'           => \App\Policies\AppSettingPolicy::class,
		'cache'             => \App\Policies\CachePolicy::class,
		'backup'            => \App\Policies\BackupPolicy::class,
		'mailConfiguration' => \App\Policies\MailConfigurationPolicy::class,
		'job'               => \App\Policies\JobPolicy::class,
	];

	public function boot(): void
	{
		$this->registerPolicies();

		// Superadmin bypass - Check is_superadmin in roles table
		Gate::before(function ($user, $ability) {
			if (isSuperAdminUser($user)) {
				return true;
			}
		});

		// Deny by default
		Gate::after(function ($user, $ability) {
			return false;
		});

		// Register Gates for non-model modules
	}
}

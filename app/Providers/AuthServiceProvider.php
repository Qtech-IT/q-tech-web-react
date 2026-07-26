<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
	protected $policies = [
		\Spatie\Permission\Models\Role::class   => \App\Policies\RolePolicy::class,
		\App\Models\User::class                 => \App\Policies\UserPolicy::class,
		\App\Models\VerificationCode::class     => \App\Policies\OtpPolicy::class,
		\App\Models\NotificationTemplate::class => \App\Policies\NotificationTemplatePolicy::class,
		\App\Models\Language::class             => \App\Policies\LanguagePolicy::class,
		\App\Models\NotificationLog::class      => \App\Policies\NotificationLogPolicy::class,

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
		// Gate::before(function ($user, $ability) {
		// 	// if (isSuperAdminUser($user)) {
		// 	// 	return true;
		// 	// }
		// });

		// Deny by default
		Gate::after(function ($user, $ability) {
			return false;
		});

		// Register Gates for non-model modules
	}
}

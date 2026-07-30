<?php

namespace App\Http\Controllers\Auth;

use App\Builders\AppResponseBuilder;
use App\Enums\Common\Status;
use App\Enums\Settings\SessionKey;
use App\Enums\Settings\SettingKey;
use App\Http\Requests\Backend\Auth\AuthenticateRequest;
use App\Http\Services\Backend\Auth\AuthService;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

/**
 * Class AuthenticateController
 *
 * Handles user authentication including:
 * - Login form display
 * - Authentication
 * - Two-Factor Authentication (2FA)
 * - Logout and logout from other browsers
 * - Maximum login attempts validation
 *
 */
class AuthenticateController extends Controller
{
	protected bool $isAdminRoute = true;
	/**
	 * Inject AuthService for authentication-related operations.
	 */
	public function __construct(protected AuthService $authService)
	{
	}

	/**
	 * Display the user login form.
	 *
	 * @return Response
	 */
	public function login(): Response
	{
		return AppResponseBuilder::asSuccess()
						->withComponent('Auth/Login', [
							'title'        => translate('Login'),
							'isAdminRoute' => $this->isAdminRoute
						])->build();
	}

	/**
	 * Authenticate web credentials and handle 2FA if enabled.
	 *
	 * @param AuthenticateRequest $request
	 * @return RedirectResponse|Response
	 */
	public function authenticate(AuthenticateRequest $request): RedirectResponse|Response
	{
		try {
			$username = $request->input('username');

			$user = User::where('username', $username)->first();

			if(!$user) {
				return back()->with(response_status('Invalid credentials.', 'error'));
			}

			// Check if login attempt validation is enabled
			if ($this->isLoginAttemptValidationEnabled()) {
				// Check if account is locked
				if ($this->isAccountLocked($username)) {
					$lockoutTimeRemaining = $this->getLockoutTimeRemaining($username);
					return back()->with(response_status(
					    "Too many login attempts. Please try again after {$lockoutTimeRemaining} minutes.",
					    'error'
					));
				}
			}

			$remember = (bool) $request->input('remember_me');

			if (Auth::guard('web')->attempt([
				'username' => $username,
				'password' => $request->input('password')
			], $remember)) {
				$user = Auth::guard('web')->user();

				// Clear failed login attempts on successful login
				if ($this->isLoginAttemptValidationEnabled()) {
					$this->clearFailedLoginAttempts($username);
				}

				// Check if account is inactive
				if ($user->status !== Status::ACTIVE) {
					Auth::guard('web')->logout();
					return back()->with(response_status('Your account is inactive. Please contact support.', 'error'));
				}

				if ($user->two_factor_enabled) {
					session()->put(SessionKey::TWO_STEP_VERIFICATION_INFO->value, [
						'model_id' => $user->id,
						'remember' => $remember,
					]);

					// Logout to enforce 2FA
					Auth::guard('web')->logout();

					return redirect()
								->route('backend.2fa.verification.form')
								->with(response_status('Please complete two-factor authentication to continue.'));
				}

				return $this->completeLogin($user, $request->input('remember'));
			}

			// Increment failed login attempts if validation is enabled
			if ($this->isLoginAttemptValidationEnabled()) {
				$this->incrementFailedLoginAttempts($username);

				$maxAttempts       = $this->getMaximumLoginAttempts();
				$attempts          = $this->getFailedLoginAttempts($username);
				$remainingAttempts = max(0, $maxAttempts - $attempts);

				if ($remainingAttempts > 0) {
					return back()->with(response_status(
					    "Invalid Credentials. {$remainingAttempts} attempt(s) remaining.",
					    'error'
					));
				}
			}

			return back()->with(response_status('Invalid Credentials', 'error'));
		} catch (\Exception $ex) {
			return back()->with('error', $ex->getMessage());
		}
	}

	/**
	 * Show the 2FA verification form.
	 *
	 * @return Response
	 */
	public function show2faForm(): Response
	{
		return AppResponseBuilder::asSuccess()
				->withComponent('Auth/TwoFactorVerification', [
					'title'        => translate(value: '2FA Verification'),
					'isAdminRoute' => $this->isAdminRoute
				])->build();
	}

	/**
	 * Verify the 2FA code entered by the admin and complete login.
	 *
	 * @param Request $request
	 * @return RedirectResponse
	 */
	public function verify2FA(Request $request): RedirectResponse
	{
		$request->validate([
			'verification_code' => 'required|string|size:6'
		]);

		try {
			$twoFaInfo = session()->get(SessionKey::TWO_STEP_VERIFICATION_INFO->value);

			if (!$twoFaInfo) {
				return redirect()->route('backend.login')
								 ->with(response_status('Invalid request', 'error'));
			}

			$twoFaInfo = (object) $twoFaInfo ;

			$userId   = $twoFaInfo?->model_id;
			$remember = $twoFaInfo?->remember;

			if (!$userId) {
				return redirect()->route('backend.login')
								 ->with(response_status('Session expired. Please login again.', 'error'));
			}

			$user = User::active()->findOrFail($userId);

			if (!$user || !$this->authService->verifyTwoFactorCode($user, $request->input('verification_code'))) {
				return back()->with(response_status('Invalid verification code', 'error'));
			}

			// Clear 2FA session data
			session()->forget(SessionKey::TWO_STEP_VERIFICATION_INFO->value);

			Auth::guard('web')->login($user, $remember);

			return $this->completeLogin($user, $remember);
		} catch (\Exception $ex) {
			return back()->with('error', $ex->getMessage());
		}
	}

	/**
	 * Complete the login process by updating last login and redirecting.
	 *
	 * @param User $user
	 * @param bool $remember
	 * @return RedirectResponse
	 */
	private function completeLogin(User $user, bool $remember = false): RedirectResponse
	{
		$intendedUrl = session()->get('url.intended');

		session()->forget('url.intended');

		if ($intendedUrl) {
			if (str_contains($intendedUrl, '/backend') || str_contains($intendedUrl, '/backend')) {
				return redirect()->to($intendedUrl)
					->with(response_status('Successfully Logged In'));
			}

			return redirect()->route( $this->isAdminRoute ? 'backend.dashboard' : 'frontend.home')->with(response_status('Successfully Logged In'));
		}

		return redirect()->route( $this->isAdminRoute ? 'backend.dashboard' : 'frontend.home')->with(response_status('Successfully Logged In'));
	}

	/**
	 * Logout the current user and clear session & FCM token.
	 *
	 * @return RedirectResponse
	 */
	public function logout(Request $request): RedirectResponse
	{
		Auth::guard('web')->logout();

		$request->session()->invalidate();
		$request->session()->regenerateToken();

		return redirect()->route( $this->isAdminRoute ? 'backend.login' : 'login');
	}

	/**
	 * Logout the user from all other browser sessions.
	 *
	 * @return RedirectResponse
	 */
	public function logoutOtherBrowser(): RedirectResponse
	{
		$user             = request()->user();
		$currentSessionId = session()->getId();

		DB::table('sessions')
					->where('id', '!=', $currentSessionId)
					->where('user_id', $user->id)
					->delete();

		return redirect()->back()
						 ->with(response_status('Successfully logged out from other browsers'));
	}

	// ============== LOGIN ATTEMPT VALIDATION METHODS ==============

	/**
	 * Check if login attempt validation is enabled in settings.
	 *
	 * @return bool
	 */
	private function isLoginAttemptValidationEnabled(): bool
	{
		return site_settings(SettingKey::LOGIN_ATTEMPT_VALIDATION->value) == Status::ACTIVE->value;
	}

	/**
	 * Get maximum login attempts from settings.
	 *
	 * @return int
	 */
	private function getMaximumLoginAttempts(): int
	{
		$maxAttempts = site_settings(SettingKey::MAXIMUM_LOGIN_ATTEMPTS->value);
		return (int) $maxAttempts;
	}

	/**
	 * Get the cache key for login attempts tracking.
	 *
	 * @param string $username
	 * @return string
	 */
	private function getLoginAttemptsKey(string $username): string
	{
		return "login_attempts:{$username}";
	}

	/**
	 * Get the cache key for account lockout.
	 *
	 * @param string $username
	 * @return string
	 */
	private function getAccountLockKey(string $username): string
	{
		return "account_locked:{$username}";
	}

	/**
	 * Get the number of failed login attempts for a username.
	 *
	 * @param string $username
	 * @return int
	 */
	private function getFailedLoginAttempts(string $username): int
	{
		return Cache::get($this->getLoginAttemptsKey($username), 0);
	}

	/**
	 * Increment the failed login attempts counter.
	 *
	 * @param string $username
	 * @return void
	 */
	private function incrementFailedLoginAttempts(string $username): void
	{
		$attemptsKey            = $this->getLoginAttemptsKey($username);
		$attempts               = $this->getFailedLoginAttempts($username);
		$maxAttempts            = $this->getMaximumLoginAttempts();
		$lockoutDurationMinutes = 15;
		$unlockTime             = now()->addMinutes($lockoutDurationMinutes);

		$attempts++;
		Cache::put($attemptsKey, $attempts, $unlockTime);

		// Lock account if max attempts exceeded
		if ($attempts >= $maxAttempts) {
			Cache::put(
			    $this->getAccountLockKey($username),
			    $unlockTime->timestamp,
			    $unlockTime
			);
		}
	}

	/**
	 * Clear failed login attempts for a username.
	 *
	 * @param string $username
	 * @return void
	 */
	private function clearFailedLoginAttempts(string $username): void
	{
		Cache::forget($this->getLoginAttemptsKey($username));
		Cache::forget($this->getAccountLockKey($username));
	}

	/**
	 * Check if an account is locked due to too many failed attempts.
	 *
	 * @param string $username
	 * @return bool
	 */
	private function isAccountLocked(string $username): bool
	{
		return Cache::has($this->getAccountLockKey($username));
	}

	/**
	 * Get remaining lockout time in minutes.
	 *
	 * @param string $username
	 * @return int
	 */
	private function getLockoutTimeRemaining(string $username): int
	{
		$lockKey = $this->getAccountLockKey($username);

		$unlockTimestamp = Cache::get($lockKey);

		if (!$unlockTimestamp) {
			return 0;
		}

		// Calculate remaining time in minutes

		$remainingSeconds = $unlockTimestamp - now()->timestamp;

		return max(1, ceil($remainingSeconds / 60));
	}
}

<?php

namespace App\Http\Services\Backend\Profile;

use App\Constants\FilePathConstants;
use App\Enums\Notifications\NotificationTemplateEnum;
use App\Enums\Settings\FileKey;
use App\Enums\Settings\SessionKey;
use App\Http\Services\Backend\Auth\AuthService;
use App\Models\User;
use App\Notifications\NotificationBuilder;
use App\Traits\Common\Fileable;
use App\Traits\Common\ModelAction;
use App\Traits\Common\Notify;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfileService
{
	use Fileable , ModelAction , Notify;

	public function __construct(private AuthService $authService)
	{
	}

	/**
	 * Summary of update
	 * @param Request $request
	 * @return array
	 */
	public function update(Request $request): array
	{
		$user = $request->user();
		$user->loadMissing('file');

		$newEmail     = $request->input('email');
		$emailChanged = $user->email !== $newEmail;

		return DB::transaction(function () use ($request, $user, $emailChanged, $newEmail): array {
			$user->name     = $request->input('name');
			$user->phone    = $request->input('phone');
			$user->username = $request->input('username');

			switch ($emailChanged) {
				case true:
					session()->put(
					    SessionKey::PENDING_EMAIL->value . '_' . $user->id,
					    $newEmail
					);

					$this->sendEmailVerificationCode(
					    email: $newEmail,
					    user: $user
					);
					break;

				default:
					$user->email = $newEmail;
			}

			$user->save();

			if ($request->hasFile('image')) {
				$pathConfig = FilePathConstants::getPath('profile');

				$this->saveFile(
				    model: $user,
				    response: $this->storeFile(
				        file: $request->file('image'),
				        location : $pathConfig['path'],
				        removeFile:  $user?->file
				    ),
				    type: FileKey::AVATAR->value
				);
			}

			return [
				'user'          => $user->fresh(),
				'email_changed' => $emailChanged,
				'pending_email' => $emailChanged ? $newEmail : null
			];
		});
	}

	/**
	 * Summary of updatePassword
	 * @param \Illuminate\Http\Request $request
	 * @return void
	 */
	public function updatePassword(Request $request): void
	{
		$user           = $request->user();
		$user->password = $request->input('password');
		$user->save();
	}

	/**
	 * Summary of verifyEmailOtp
	 * @param Request $request
	 * @throws \Exception
	 * @return bool
	 */
	public function verifyEmailOtp(Request $request): bool
	{
		try {
			$user  = $request->user();
			$otp   = $request->input('otp');
			$email = $request->input('email');

			$this->verifyOtp($user, $otp);
			$newEmail = session()->get(SessionKey::PENDING_EMAIL->value . '_' . $user->id);

			if ($email !== $newEmail) {
				throw new \Exception('Invalid request');
			}

			$user->update(['email' => $email]);

			session()->forget(SessionKey::PENDING_EMAIL->value . '_' . $user->id);

			return true;
		} catch (\Throwable $th) {
			return false;
		}
	}

	/**
	 * Resend OTP
	 */
	public function resendOtp(Request $request): bool
	{
		$user     = $request->user();
		$newEmail = session()->get(SessionKey::PENDING_EMAIL->value . '_' . $user->id);

		return !$newEmail ? false : $this->sendEmailVerificationCode(
		    email: $newEmail,
		    user: $user
		);
	}

	/**
	 * Summary of sendEmailVerificationCode
	 * @param string $email
	 * @param User $user
	 * @return bool
	 */
	private function sendEmailVerificationCode(string $email, User $user): bool
	{
		$templateKey = NotificationTemplateEnum::EMAIL_VERIFICATION->value;
		$otp         = $this->saveOTP($user, $templateKey, true);
		$ipInfo      = getIpInfo();

		return $this->sendNotification(
		    ...NotificationBuilder::build($templateKey, [
				'userinfo' => [
					'username' => $user->name,
					'email'    => $email
				],
				'otp_code'   => $otp->otp,
				'ip_info'    => $ipInfo,
				'expired_at' => $otp->expired_at
			])
		);
	}
}

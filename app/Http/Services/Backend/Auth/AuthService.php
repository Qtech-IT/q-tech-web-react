<?php

namespace App\Http\Services\Backend\Auth;

use App\Enums\Notifications\NotificationKey;
use App\Enums\Settings\SessionKey;
use App\Models\User;
use App\Notifications\NotificationBuilder;
use App\Traits\Common\ModelAction;
use App\Traits\Common\Notify;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use PragmaRX\Google2FA\Google2FA;

/**
 * Class AuthService
 *
 * This service handles all user authentication-related logic,
 * including:
 * - Verifying Google 2FA codes.
 * - Sending email OTP verification codes.
 * - Managing password reset flow (OTP validation + password update).
 * - Locating active user accounts.
 *
 * It centralizes authentication actions so controllers remain clean
 * and business logic stays organized and reusable across modules.
 */
class AuthService
{
    use ModelAction, Notify;

    /**
     * Verify a Google Authenticator 2FA code.
     *
     * @param User        $user  User model instance.
     * @param int|string  $code   The submitted 2FA code.
     * @return bool               True if valid, otherwise false.
     */
    public function verifyTwoFactorCode(User $user, int|string $code): bool
    {
        $google2fa = new Google2FA();

        return $google2fa->verifyKey($user->google2fa_secret, $code);
    }

    /**
     * Send an email verification OTP to an user.
     *
     * @param string $email        User email address.
     * @param string $templateKey  Notification template key.
     * @return bool                True if notification was sent.
     */
    public function sendEmailVerificationCode(string $email, string $templateKey): bool
    {
        $user = User::where('email', $email)
                    ->firstOrFail();

        $otp = $this->saveOTP($user, $templateKey, true);

        $ipInfo = getIpInfo();

        $response = $this->sendNotification(
            ...NotificationBuilder::build($templateKey, [
                                        'user'       => $user,
                                        'otp_code'   => $otp->otp,
                                        'ip_info'    => $ipInfo,
                                        'expired_at' => $otp->expired_at
                                    ])
        );

        if ($response) {
            session()->put(SessionKey::PASSWORD_RESET->value, [
                'key'        => NotificationKey::PASSWORD_RESET->value,
                'model_data' => $user,
            ]);
        }

        return $response;
    }

    /**
     * Verify OTP and reset the user password.
     *
     * @param Request $request  Incoming request containing new password.
     * @return array  with success/error message.
     */
    public function verifyAndUpdatePassword(Request $request): array
    {
        $password = $request->input('password');

        $sessionData = session()->get(SessionKey::PASSWORD_RESET->value, []);

        $modelData = Arr::get($sessionData, 'model_data');
        $otpCode   = Arr::get($sessionData, 'verification_code');

        $user = $this->findActiveUser(['email' => $modelData?->email]);

        $otp = $user->otp()
                            ->where('otp', $otpCode)
                            ->first();

        if (!$otp) {
            return [
                'status'  => false,
                'message' => 'Invalid OTP code'
            ];
        }

        $user->password = $password;
        $user->save();
        $otp->delete();

        session()->forget(SessionKey::PASSWORD_RESET->value);

        return [
            'status'  => true,
            'message' => 'Your password has been reset successfully.'
        ];
    }

    /**
     * Find an active user using given attributes.
     *
     * @param array $attributes  Search conditions.
     * @return User             Active user model.
     */
    private function findActiveUser(array $attributes): User
    {
        return User::active()
                    ->where($attributes)
                    ->firstOrFail();
    }
}

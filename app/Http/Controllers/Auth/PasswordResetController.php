<?php

namespace App\Http\Controllers\Auth;

use App\Builders\AppResponseBuilder;
use App\Enums\Notifications\NotificationKey;
use App\Enums\Notifications\NotificationTemplateEnum;
use App\Enums\Settings\SessionKey;
use App\Enums\Settings\SettingKey;
use App\Facades\AppResponse;
use App\Http\Services\Backend\Auth\AuthService;
use App\Models\User;
use App\Traits\Common\ModelAction;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Arr;
use Inertia\Response;

/**
 * Class PasswordResetController
 *
 * Handles the password reset flow for admin users.
 * This includes sending OTPs, verifying OTPs, and updating the password.
 *
 */
class PasswordResetController extends Controller
{
    use ModelAction;

    protected bool $isAdminRoute = false;
    /**
     * Inject AuthService for handling authentication-related operations.
     */
    public function __construct(protected AuthService $authService) {
        $this->isAdminRoute = isAdminRoute();
    }

    /**
     * Display the email verification request form.
     *
     * @param Request $request
     * @return Response
     */
    public function showRequestForm(Request $request): Response
    {
        return AppResponseBuilder::asSuccess()
                        ->withComponent('Auth/ResetPassword', [
                            'title'        => translate(value: 'Verify your email'),
                            'isAdminRoute' => true,
                        ])->build();
    }

    /**
     * Handle sending OTP to the admin's email for password reset.
     *
     * @param Request $request
     * @return RedirectResponse|Response
     */
    public function sendOtp(Request $request): RedirectResponse|Response
    {
        $request->validate(['email' => 'required|exists:users,email']);

        $email = $request->input('email');

        $status = $this->authService->sendEmailVerificationCode(
            email: $email,
            templateKey: NotificationTemplateEnum::PASSWORD_RESET->value
        );

        if ($status) {
            return AppResponse::asSuccess()
                        ->withRedirect('backend.password.verify.form')
                        ->withMessage('Check your email. A verification code has been sent successfully.')
                        ->build();
        }

        return AppResponse::asError()
                        ->withMessage('Something went wrong! Please check your email configuration.')
                        ->build();
    }

    /**
     * Display the OTP verification form.
     *
     * @param Request $request
     * @return Response
     */
    public function showOtpForm(Request $request): Response
    {
        return AppResponseBuilder::asSuccess()
                        ->withComponent('Auth/OtpVerification', [
                            'title'        => translate(value: 'OTP Verification'),
                            'isAdminRoute' => $this->isAdminRoute
                        ])->build();
    }

    /**
     * Verify the OTP entered by the admin.
     * Stores the verified OTP in the session for password reset.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function verifyOtp(Request $request): RedirectResponse
    {
        $request->validate(['verification_code' => ['required']]);

        $sessionData = session()->get(SessionKey::PASSWORD_RESET->value);
        $key         = Arr::get($sessionData, 'key');
        $modelData   = Arr::get($sessionData, 'model_data');

        if (!$sessionData || $key !== NotificationKey::PASSWORD_RESET->value) {
            return AppResponseBuilder::asError()
                        ->withMessage('Invalid request! Please try again.')
                        ->build();
        }

        $user = User::active()
                    ->where('email', $modelData->email)
                    ->where('id', $modelData->id)
                    ->firstOrFail();

        $otpCode = $request->input('verification_code');

        $otp = $user->otp()
                        ->where('otp', $otpCode)
                        ->first();

        if (!$otp) {
            return AppResponseBuilder::asError()
                        ->withMessage('Invalid OTP code')
                        ->build();
        }

        if (Carbon::now()->gt($otp->expired_at)) {
            $otp->delete();
            return AppResponseBuilder::asError()
                            ->withMessage('OTP has expired')
                            ->build();
        }

        // Store OTP in session for password reset
        $sessionData['verification_code'] = $otpCode;
        session()->put(SessionKey::PASSWORD_RESET->value, $sessionData);

        return AppResponseBuilder::asSuccess()
                        ->withRedirect('backend.password.reset.form')
                        ->withMessage('Check your email. A verification code has been sent successfully.')
                        ->build();
    }

    /**
     * Show the form to update the password after OTP verification.
     *
     * @param Request $request
     * @return Response
     */
    public function showResetPasswordForm(Request $request): Response
    {
        return AppResponseBuilder::asSuccess()
                    ->withComponent('Auth/UpdatePassword', [
                        'title'                 => translate(value: 'Update password'),
                        'isAdminRoute'          => $this->isAdminRoute,
                        'minimumPasswordLength' => site_settings(SettingKey::MINIMUM_PASSWORD_LENGTH->value)
                    ])->build();
    }

    /**
     * Validate and update the admin's password.
     * Calls AuthService to handle password verification and update.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $minlen = site_settings(SettingKey::MINIMUM_PASSWORD_LENGTH->value);

        $request->validate([
            'password' => $this->getPasswordRules($minlen )
        ]);

        $response = $this->authService->verifyAndUpdatePassword($request);

        $status          = Arr::get($response, 'status');
        $message         = Arr::get($response, 'message');
        $responseBuilder = $status ? AppResponseBuilder::asSuccess() : AppResponseBuilder::asError();

        return $responseBuilder->withRedirect('backend.login')
                        ->withMessage($message)
                        ->build();
    }
}

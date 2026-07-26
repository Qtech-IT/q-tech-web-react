<?php

namespace App\Http\Controllers\Backend\Profile;

use App\Facades\AppResponse;
use App\Http\Requests\Backend\Auth\PasswordUpdateRequest;
use App\Http\Requests\Backend\Auth\ProfileRequest;
use App\Http\Services\Backend\Profile\ProfileService;
use App\Traits\Common\ModelProperty;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    use ModelProperty;
    protected array $modelProperty;

    public function __construct(protected ProfileService $profileService){
        $this->modelProperty = $this->getCommonProperty(
            routePrefix: 'backend.profile'
        );
    }

    /**
     * Summary of index
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        return AppResponse::asSuccess()
                    ->withComponent('Backend/Profile/Index', [
                        'title'         => translate('Account'),
                        'component'     => 'ProfileForm',
                        'modelProperty' => $this->modelProperty
                    ])->build();
    }

    /**
     * Summary of password
     * @return \Inertia\Response
     */
    public function password(): Response
    {
        return AppResponse::asSuccess()
                    ->withComponent('Backend/Profile/Index', [
                        'title'         => translate('Password'),
                        'component'     => 'PasswordForm',
                        'modelProperty' => $this->modelProperty
                    ])->build();
    }

    /**
     * Summary of getBrowserSession
     * @return \Inertia\Response
     */
    public function getBrowserSession(): Response
    {
        $user = request()->user();

        $sessions = DB::table('sessions')
                    ->where('user_id', $user->id)
                    ->get()
                    ->map(function ($session) {
                        $userAgent = new \Jenssegers\Agent\Agent();
                        $userAgent->setUserAgent($session->user_agent);

                        return [
                            'id'            => $session->id,
                            'ip_address'    => $session->ip_address,
                            'device'        => $userAgent->device(),
                            'platform'      => $userAgent->platform(),
                            'browser'       => $userAgent->browser(),
                            'last_activity' => $session->last_activity
                                                 ? diff_for_humans(Carbon::createFromTimestamp($session->last_activity))
                                                 : null,
                            'is_current' => $session->id === session()->getId(),
                        ];
                    });

        return AppResponse::asSuccess()
                    ->withComponent('Backend/Profile/Index', [
                        'title'         => translate('Session'),
                        'component'     => 'BrowserSessions',
                        'modelProperty' => $this->modelProperty,
                        'sessions'      => $sessions
                    ])->build();
    }

    /**
     * Summary of update
     * @param \App\Http\Requests\Backend\Auth\ProfileRequest $request
     * @param int|string $id
     * @return RedirectResponse
     */
    public function update(ProfileRequest $request, int | string $id): RedirectResponse
    {
        try {
            $response = $this->profileService->update($request);

            if ($response['email_changed']) {
                return AppResponse::asSuccess()
                                    ->withData([
                                        'show_otp_modal' => true ,
                                        'pending_email'  => $response['pending_email']
                                    ])
                                    ->withMessage('Profile updated. Please check your email for OTP to verify your new email address.')
                                    ->build();
            }

            return AppResponse::asSuccess()
                                ->withMessage('Profile updated successfully')
                                ->build();
        } catch (\Exception $ex) {
             return AppResponse::asError()
                                ->withMessage($ex->getMessage())
                                ->build();
        }
    }

    /**
     * Summary of passwordUpdate
     * @param \App\Http\Requests\Backend\Auth\PasswordUpdateRequest $request
     * @return RedirectResponse
     */
    public function passwordUpdate(PasswordUpdateRequest $request): RedirectResponse
    {
        try {
           $this->profileService->updatePassword($request);
        } catch (\Exception $ex) {
            return AppResponse::asError()
                                ->withMessage($ex->getMessage())
                                ->build();
        }

        return AppResponse::asSuccess()
                            ->withMessage('Updated')
                            ->build();
    }

    /**
     * Summary of resendOtp
     * @param Request $request
     * @return JsonResponse
     */
    public function resendOtp(Request $request): JsonResponse
    {
        try {
            $sent = $this->profileService->resendOtp($request);

            return response()->json([
                'success' => $sent,
                'message' => translate($sent ? 'OTP sent successfully' : 'No pending email verification')
            ], $sent ? 200 : 422);
        } catch (\Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => $ex->getMessage()
            ], 500);
        }
    }

    /**
     * Summary of verifyEmailOtp
     * @param Request $request
     * @return JsonResponse
     */
    public function verifyEmailOtp(Request $request): JsonResponse
    {
        $request->validate([
            'otp'   => 'required',
            'email' => 'required|email'
        ]);

        try {
            $verified = $this->profileService->verifyEmailOtp($request);

            return response()->json([
                'success' => $verified,
                'message' => translate($verified ? 'Email verified successfully' : 'Invalid or expired OTP')
            ], $verified ? 200 : 422);
        } catch (\Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => $ex->getMessage()
            ], 500);
        }
    }
}

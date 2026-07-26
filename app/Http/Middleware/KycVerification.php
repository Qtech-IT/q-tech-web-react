<?php

namespace App\Http\Middleware;

use App\Enums\Common\Status;
use App\Enums\Settings\SettingKey;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class KycVerification
{
	/**
	 * Handle an incoming request.
	 */
	public function handle(Request $request, Closure $next): Response
	{
        try {
            $kycVerification = site_settings(SettingKey::KYC_VERIFICATION->value) == Status::ACTIVE->value;

            if($kycVerification) {
               $user = Auth::guard('web')->user();

               if(!$user->is_kyc_verified) {
                return redirect()->route('user.profile.index')->with('error', translate('Please verify your KYC first'));
               }
            }
        } catch (\Throwable $th) {
            //throw $th;
        }

		return $next($request);
	}
}

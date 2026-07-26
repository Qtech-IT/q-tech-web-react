<?php

namespace App\Http\Services\Backend\Profile;

use App\Enums\Settings\SettingKey;
use PragmaRX\Google2FA\Google2FA;
use Illuminate\Support\Str;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Http\RedirectResponse;

class TwoFactorService
{

    /**
     * Summary of getSetupData
     * @return array
     */
    public function getSetupData(): array
    {

        $user      = auth_user();
        $google2fa = new Google2FA();
        $secret    = $user->google2fa_secret;

        if (!$user->google2fa_secret ) {

            $secret                   = $google2fa->generateSecretKey();
            $user->google2fa_secret   = $secret;
            $user->two_factor_enabled = false;
            $user->recovery_codes     = $this->generateRecoveryCodes();
            $user->save();
        }

        $qrText = $google2fa->getQRCodeUrl(
            site_settings(SettingKey::COMPANY_NAME->value),
            $user->email,
            $secret
        );

        $renderer     = new ImageRenderer(new RendererStyle(200), new SvgImageBackEnd());
        $writer       = new Writer($renderer);
        $qrCodeSvg    = $writer->writeString($qrText);
        $qrCodeBase64 = 'data:image/svg+xml;base64,' . base64_encode($qrCodeSvg);

        return [
            'qr_code' => $qrCodeBase64,
            'secret'  => $secret
        ];
    }

    /**
     * Summary of verify2faCode
     * @param int|string $code
     * @return array
     */
    public function verify2faCode(int | string $code): array
    {

        $user      = auth_user();
        $google2fa = new Google2FA();
        $valid     = $google2fa->verifyKey($user->google2fa_secret,  $code , 1);

        if (!$valid){

            return [
                'status'  => false,
                'message' => translate('Invalid Code')
            ];
        }

        $user->two_factor_enabled      = true;
        $user->two_factor_confirmed_at = now();
        $user->save();

        return [
            'status'  => true,
            'message' => translate('2FA Enabled') 
        ];
 
    }

    /**
     * Summary of disable2fa
     * @return array
     */
    public function disable2fa(): array
    {

        $user                          = auth_user();
        $user->google2fa_secret        = null;
        $user->recovery_codes          = null;
        $user->two_factor_enabled      = false;
        $user->two_factor_confirmed_at = null;
        $user->save();

        return [
            'status' => true,
            'message'=> translate('2FA Disabled') 
        ];
    }

    /**
     * Summary of saveNewRecoveryCode
     * @return array
     */
    public function saveNewRecoveryCode(): array
    {
        $user = auth_user();

        if(!$user->two_factor_enabled){

            return [
                'status'  => false,
                'message' => translate('2FA is disabled')
            ];
        }

        $user->recovery_codes = $this->generateRecoveryCodes();
        $user->save();

        return [
            'status'  => true,
            'message' => translate('Code Regenerated!!')
        ];
    }

    /**
     * Summary of generateRecoveryCodes
     * @return string[]
     */
    private function generateRecoveryCodes(): array
    {
        $codes = [];
        for ($i = 0; $i < 8; $i++) {
            $codes[] = Str::random(10) . '-' . Str::random(5);
        }
        return $codes;
    }




}
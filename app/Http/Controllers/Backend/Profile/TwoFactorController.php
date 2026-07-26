<?php

namespace App\Http\Controllers\Backend\Profile;

use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Services\Backend\Profile\TwoFactorService;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TwoFactorController extends Controller
{

    use ModelProperty;

    protected array $modelProperty;

    public function __construct(protected TwoFactorService $twoFactorService){

        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix :'Profile',
			routePrefix        :'backend.2fa'
		);
        
    }


   /**
     * Summary of index
     * @return \Inertia\Response
     */
    public function index(): Response
    {

        return AppResponse::asSuccess()
                    ->withComponent($this->modelProperty['pagePrefix'].'Index', [
                        'title'         => translate('2FA Configuration'),
                        'component'     => 'TwoFAConfig',
                        'modelProperty' => $this->modelProperty,
                        'setupData'     => $this->twoFactorService->getSetupData()
                    ])->build();
    }


    /**z
     * Summary of verify
     * @param \Illuminate\Http\Request $request
     * @return RedirectResponse
     */
    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'code'    => ['required','digits:6']
        ]);

        return $this->handleResponse($this->twoFactorService->verify2faCode($request->input('code')));
    }

    /**
     * Summary of disable
     * @param \Illuminate\Http\Request $request
     * @return RedirectResponse
     */
    public function disable(Request $request): RedirectResponse
    {
        return $this->handleResponse($this->twoFactorService->disable2fa());
    }

    /**
     * Summary of regenerateRecoveryCodes
     * @param \Illuminate\Http\Request $request
     * @return RedirectResponse
     */
    public function regenerateRecoveryCodes(Request $request): RedirectResponse
    {
        return $this->handleResponse($this->twoFactorService->saveNewRecoveryCode());

    }


  

}

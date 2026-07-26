<?php

namespace App\Http\Controllers\Backend;

use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\Backend\OtpCodeResource;
use App\Http\Services\Backend\OtpCodeService;
use App\Models\VerificationCode;
use App\Traits\Common\ModelAction;
use App\Traits\Common\ModelProperty;
use Exception;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class OtpCodeController extends Controller
{
    use ModelAction ,ModelProperty;

    protected array $modelProperty ;


    /**
     * Constructor to inject services and apply middleware
     */
    public function __construct(
        protected OtpCodeService $service,
    )
    {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix :'OtpCode',
			routePrefix: 'backend.otp-codes'
		);
        
        $this->authorizeResource(VerificationCode::class);

    }

    /**
     * Display a listing of users
     */
    public function index(): Response
    {
        $data = formatResourceResponse(
            $this->service->getAllCode(),
            OtpCodeResource::class
        );

        return AppResponse::asSuccess()
                    ->withComponent($this->modelProperty['pagePrefix'].'Index', [
                            'title'                => translate('OTP Codes'),
                            'data'                 => $data,
                            'modelProperty'        => $this->modelProperty,
                            'advanceFilterOptions' => $this->service->getAdvanceFilterOptions()
                    ])->build();
    }

   
    /**
     * Summary of destroy
     * @param VerificationCode $otpCode
     * @return RedirectResponse
     */
    public function destroy(VerificationCode $otpCode): RedirectResponse
    {

        try {

            $this->service->delete($otpCode->id);
            return AppResponse::asSuccess()
                                ->withMessage('OTP Code deleted successfully.')
                                ->build();

        } catch (\Exception $e) {
            return AppResponse::asError()
                                ->withMessage($e->getMessage())
                                ->build();
        }
    }


    
}

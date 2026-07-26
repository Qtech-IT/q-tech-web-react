<?php

namespace App\Http\Controllers\Backend\Settings;

use App\Enums\System\CacheKey;
use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Services\Backend\Settings\AutomationService;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;

class AutomationController extends Controller
{

    use ModelProperty;

    /**
     * Summary of __construct
     * @param AutomationService $automationService
     */
    protected array $modelProperty ;
    public function __construct(protected AutomationService $automationService)
    {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix :'Automation',
			routePrefix: 'backend.automation'
		);
    }



    /**
     * Summary of index
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        $this->authorize('viewAutomation', 'setting');

        return AppResponse::asSuccess()
                    ->withComponent($this->modelProperty['pagePrefix'].'Index', [
                        'title'          => translate('Automation & Cron Jobs'),
                        'automationData' => $this->automationService->getAutomationData(),
                        'modelProperty'  => $this->modelProperty,
                    ])->build();
    }


    /**
     * Summary of runCommand
     * @param mixed $commandId
     * @return RedirectResponse
     */
    public function runCommand($commandId): RedirectResponse
    {
        $this->authorize('runAutomation', 'setting');

        try {
            $result       = $this->automationService->runCommandById($commandId);

            $appResponse  =  $result 
                                    ? AppResponse::asSuccess()
                                    : AppResponse::asError();

            return $appResponse->withMessage(
                                             $result 
                                                ? 'Command executed successfully.'
                                                :'Something went wrong!!'
                                            )
                                    ->build();


        } catch (\Exception $e) {

            return AppResponse::asError()
                        ->withMessage($e->getMessage())
                        ->build();
        }
    }



    /**
     * Summary of clearCommandCache
     * @return RedirectResponse
     */
    public function clearCommandCache(): RedirectResponse
    {

        $this->authorize('viewAutomation', 'setting');

        try {

            Cache::forget(CacheKey::AUTOMATION_EXECUTION_HISTORY->value);


            return AppResponse::asSuccess()
                        ->withMessage('History cleared')
                        ->build();


        } catch (\Exception $e) {

           return AppResponse::asError()
                        ->withMessage($e->getMessage())
                        ->build();
        }

    }
}

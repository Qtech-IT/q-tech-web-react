<?php

namespace App\Http\Controllers\Backend;

use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\Backend\NotificationLogResource;
use App\Http\Services\Backend\NotificationLogService;
use App\Models\NotificationLog;
use App\Models\User;
use App\Traits\Common\ModelAction;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;
use Inertia\Response;

class NotificationLogController extends Controller
{
    
    use ModelAction ,ModelProperty;

    protected array $modelProperty;

    /**
     * Constructor to inject services and apply middleware
     */
    public function __construct(
        protected NotificationLogService $service )
    {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix : 'NotificationLog',
			routePrefix        : 'backend.notification-logs'
		);
        
        $this->authorizeResource(NotificationLog::class);
    }

    
    /**
     * Summary of index
     * @return Response
     */
    public function index(): Response
    {
        $data = formatResourceResponse(
            $this->service->getAllLogs(),
            NotificationLogResource::class
        );

        return AppResponse::asSuccess()
                    ->withComponent($this->modelProperty['pagePrefix'].'Index', [
                        'title'                    => translate('Notification Log'),
                        'data'                     => $data,
                        'stats'                    => $this->service->getStats(),
                        'modelProperty'            => $this->modelProperty,
                        'advanceFilterOptions'     => $this->service->getAdvanceFilterOptions()
                    ])->build();
    }

 
    /**
     * Summary of destroy
     * @param NotificationLog $notificationLog
     * @return RedirectResponse
     */
    public function destroy(NotificationLog $notificationLog): RedirectResponse
    {
       
        try {
            $this->service->deleteLog($notificationLog->id);

            return AppResponse::asSuccess()
                                ->withMessage('Log deleted successfully.')
                                ->build();

        } catch (\Exception $e) {
            return AppResponse::asError()
                                ->withMessage($e->getMessage())
                                ->build();
        }
    }


    /**
     * Summary of bulkAction
     * @param Request $request
     * @return RedirectResponse
     */
    public function bulkAction(Request $request): RedirectResponse
    {

        $request->validate([
            'ids'    => ['required', 'array'],
            'ids.*'  => ['exists:notification_logs,id'],
            'action' => ['required' , new Enum(\App\Enums\Settings\BulkActionType::class)]
        ]);

      
        $action = $request->input('action');
        $ids    = $request->input('ids');

        $this->authorizeBulkAction($action , User::class);
        
        try {

            $this->service->handleBulkAction($ids , $action);

            return AppResponse::asSuccess()
                            ->withMessage('Bulk action performed successfully.')
                            ->build();
        } catch (\Exception $e) {

            return AppResponse::asError()
                            ->withMessage($e->getMessage())
                            ->build();

        }
    }

}
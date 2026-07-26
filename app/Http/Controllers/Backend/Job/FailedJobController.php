<?php

namespace App\Http\Controllers\Backend\Job;

use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\Backend\Job\FailedJobResource as JobFailedJobResource;
use App\Http\Services\Backend\Job\FailedJobService as JobFailedJobService;
use App\Traits\Common\ModelAction;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;
use Inertia\Response;

class FailedJobController extends Controller
{
    use ModelAction, ModelProperty;

    protected array $modelProperty;

    /**
     * Constructor to inject services and apply middleware
     */
    public function __construct(
        protected JobFailedJobService $service
    ) {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix: 'FailedJob',
            routePrefix: 'backend.failed-jobs'
        );
    }

    /**
     * Display a listing of failed jobs
     */
    public function index(): Response
    {
        $this->authorize('view', 'job');

        $data = formatResourceResponse(
            $this->service->getAllFailedJobs(),
            JobFailedJobResource::class
        );

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'] . 'Index', [
                'title'                => translate('Failed Jobs'),
                'data'                 => $data,
                'stats'                => $this->service->getStats(),
                'modelProperty'        => $this->modelProperty,
                'advanceFilterOptions' => $this->service->getAdvanceFilterOptions()
            ])->build();
    }

   

    /**
     * Remove the specified failed job
     */
    public function destroy(string $id): RedirectResponse
    {

        $this->authorize('delete', 'job');

        try {
            $this->service->deleteFailedJob($id);

            return AppResponse::asSuccess()
                        ->withMessage('Failed job deleted successfully.')
                        ->build();

        } catch (\Exception $e) {
            return AppResponse::asError()
                        ->withMessage($e->getMessage())
                        ->build();
        }
    }

    /**
     * Retry a specific failed job
     */
    public function retry(string $id): RedirectResponse
    {

        $this->authorize('retry', 'job');

        try {
            $this->service->retryFailedJob($id);

            return AppResponse::asSuccess()
                        ->withMessage('Failed job queued for retry.')
                        ->build();
        } catch (\Exception $e) {
            return AppResponse::asError()
                        ->withMessage($e->getMessage())
                        ->build();
        }
    }

    /**
     * Retry all failed jobs
     */
    public function retryAll(): RedirectResponse
    {
        $this->authorize('retry', 'job');

        try {

            $count = $this->service->retryAllFailedJobs();

            return AppResponse::asSuccess()
                        ->withMessage("Successfully queued {$count} failed jobs for retry.")
                        ->build();
        } catch (\Exception $e) {

            return AppResponse::asError()
                        ->withMessage($e->getMessage())
                        ->build();
        }
    }

    /**
     * Clear all failed jobs
     */
    public function clearAll(): RedirectResponse
    {

        $this->authorize('delete', 'job');
        
        try {
            $count = $this->service->clearAllFailedJobs();

            return AppResponse::asSuccess()
                            ->withMessage("Successfully cleared {$count} failed jobs.")
                            ->build();
        } catch (\Exception $e) {
            return AppResponse::asError()
                ->withMessage($e->getMessage())
                ->build();
        }
    }

    /**
     * Handle bulk actions
     */
    public function bulkAction(Request $request): RedirectResponse
    {
        $request->validate([
            'ids'    => ['required', 'array'],
            'ids.*'  => ['required'],
            'action' => ['required', new Enum(\App\Enums\Settings\BulkActionType::class)]
        ]);

        $action = $request->input('action');
        $ids    = $request->input('ids');

        try {
            $this->service->handleBulkAction($ids, $action);

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
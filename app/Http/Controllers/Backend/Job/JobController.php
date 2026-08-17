<?php

namespace App\Http\Controllers\Backend\Job;

use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\Backend\Job\JobResource;
use App\Http\Services\Backend\Job\JobService;
use App\Traits\Common\ModelAction;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;
use Inertia\Response;

class JobController extends Controller
{
    use ModelAction, ModelProperty;

    protected array $modelProperty;

    /**
     * Constructor to inject services and apply middleware
     */
    public function __construct(
        protected JobService $service
    ) {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix: 'Job',
            routePrefix: 'backend.jobs'
        );
    }

    /**
     * Display a listing of jobs
     */
    public function index(): Response
    {
        $this->authorize('view', 'job');

        $data = formatResourceResponse(
            $this->service->getAllJobs(),
            JobResource::class
        );

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Index', [
                'title' => translate('Jobs'),
                'data' => $data,
                'stats' => $this->service->getStats(),
                'modelProperty' => $this->modelProperty,
                'advanceFilterOptions' => $this->service->getAdvanceFilterOptions(),
            ])->build();
    }

    /**
     * Remove the specified job
     */
    public function destroy(string $id): RedirectResponse
    {
        $this->authorize('delete', 'job');

        try {
            $this->service->deleteJob($id);

            return AppResponse::asSuccess()
                ->withMessage('Job deleted successfully.')
                ->build();
        } catch (\Exception $e) {
            return AppResponse::asError()
                ->withMessage($e->getMessage())
                ->build();
        }
    }

    /**
     * Retry a specific job
     */
    public function retry(string $id): RedirectResponse
    {
        $this->authorize('retry', 'job');

        try {
            $this->service->retryJob($id);

            return AppResponse::asSuccess()
                ->withMessage('Job queued for retry.')
                ->build();
        } catch (\Exception $e) {
            return AppResponse::asError()
                ->withMessage($e->getMessage())
                ->build();
        }
    }

    /**
     * Run/Execute a specific job immediately
     */
    public function run(string $id): RedirectResponse
    {
        $this->authorize('run', 'job');

        try {
            $this->service->runJob($id);

            return AppResponse::asSuccess()
                ->withMessage('Job executed successfully.')
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
            'ids' => ['required', 'array'],
            'ids.*' => ['required'],
            'action' => ['required', new Enum(\App\Enums\Settings\BulkActionType::class)],
        ]);

        $action = $request->input('action');
        $ids = $request->input('ids');

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

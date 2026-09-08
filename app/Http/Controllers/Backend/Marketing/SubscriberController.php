<?php

namespace App\Http\Controllers\Backend\Marketing;

use App\Enums\Common\Status;
use App\Enums\Settings\BulkActionType;
use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\Backend\Marketing\SubscriberResource;
use App\Http\Services\Backend\Marketing\SubscriberService;
use App\Models\Subscriber;
use App\Traits\Common\ModelAction;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Inertia\Response;

class SubscriberController extends Controller
{
    use ModelAction, ModelProperty;

    protected array $modelProperty;

    public function __construct(
        protected SubscriberService $service,
    ) {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix: 'Subscriber',
            routePrefix: 'backend.subscribers',
        );

        $this->authorizeResource(Subscriber::class);
    }

    public function index(): Response
    {
        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Index', [
                'title' => translate('Newsletter Subscribers'),
                'data' => formatResourceResponse($this->service->getAll(), SubscriberResource::class),
                'stats' => $this->service->getStats(),
                'modelProperty' => $this->modelProperty,
                'advanceFilterOptions' => $this->service->getAdvanceFilterOptions(),
            ])->build();
    }

    /**
     * The admin soft-disable — `status`, never `subscription_status`. Consent
     * is the subscriber's to change.
     */
    public function update(Request $request, Subscriber $subscriber): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::enum(Status::class)],
        ]);

        $subscriber->update(['status' => $validated['status']]);

        return AppResponse::asSuccess()->withMessage(translate('Subscriber updated.'))->build();
    }

    public function destroy(Subscriber $subscriber): RedirectResponse
    {
        try {
            $this->service->delete($subscriber->id);

            return AppResponse::asSuccess()->withMessage(translate('Subscriber deleted.'))->build();
        } catch (\Exception $e) {
            return AppResponse::asError()->withMessage($e->getMessage())->build();
        }
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:subscribers,id'],
            'action' => ['required', new Enum(BulkActionType::class)],
        ]);

        $this->authorizeBulkAction($request->input('action'), Subscriber::class);

        try {
            $this->service->handleBulkAction($request->input('ids'), $request->input('action'));

            return AppResponse::asSuccess()->withMessage(translate('Bulk action complete.'))->build();
        } catch (\Exception $e) {
            return AppResponse::asError()->withMessage($e->getMessage())->build();
        }
    }
}

<?php

namespace App\Http\Controllers\Backend\Marketing;

use App\Enums\Marketing\ContactStatus;
use App\Enums\Settings\BulkActionType;
use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\Backend\Marketing\ContactSubmissionResource;
use App\Http\Services\Backend\Marketing\ContactSubmissionService;
use App\Models\ContactSubmission;
use App\Traits\Common\ModelAction;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Inertia\Response;

class ContactSubmissionController extends Controller
{
    use ModelAction, ModelProperty;

    protected array $modelProperty;

    public function __construct(
        protected ContactSubmissionService $service,
    ) {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix: 'ContactSubmission',
            routePrefix: 'backend.contact-submissions',
        );

        $this->authorizeResource(ContactSubmission::class);
    }

    public function index(): Response
    {
        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Index', [
                'title' => translate('Contact Enquiries'),
                'data' => formatResourceResponse($this->service->getAll(), ContactSubmissionResource::class),
                'stats' => $this->service->getStats(),
                'modelProperty' => $this->modelProperty,
                'advanceFilterOptions' => $this->service->getAdvanceFilterOptions(),
            ])->build();
    }

    /**
     * Move an enquiry through the triage workflow. `read` also stamps
     * `read_at`; `replied` stamps `replied_at`.
     */
    public function update(Request $request, ContactSubmission $contactSubmission): RedirectResponse
    {
        $validated = $request->validate([
            'handling_status' => ['required', Rule::enum(ContactStatus::class)],
        ]);

        $this->service->changeStatus($contactSubmission, ContactStatus::from($validated['handling_status']));

        return AppResponse::asSuccess()
            ->withMessage(translate('Status updated.'))
            ->build();
    }

    public function destroy(ContactSubmission $contactSubmission): RedirectResponse
    {
        try {
            $this->service->delete($contactSubmission->id);

            return AppResponse::asSuccess()->withMessage(translate('Enquiry deleted.'))->build();
        } catch (\Exception $e) {
            return AppResponse::asError()->withMessage($e->getMessage())->build();
        }
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:contact_submissions,id'],
            'action' => ['required', new Enum(BulkActionType::class)],
        ]);

        $this->authorizeBulkAction($request->input('action'), ContactSubmission::class);

        try {
            $this->service->handleBulkAction($request->input('ids'), $request->input('action'));

            return AppResponse::asSuccess()->withMessage(translate('Bulk action complete.'))->build();
        } catch (\Exception $e) {
            return AppResponse::asError()->withMessage($e->getMessage())->build();
        }
    }
}

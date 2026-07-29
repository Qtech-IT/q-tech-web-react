<?php

namespace App\Http\Controllers\Backend\Cms;

use App\Enums\Cms\CtaLinkType;
use App\Enums\Cms\IconPosition;
use App\Enums\Common\Status;
use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Cms\CtaSaveRequest;
use App\Http\Resources\Backend\Cms\CtaResource;
use App\Http\Services\Backend\Cms\CtaService;
use App\Models\Cta;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

/**
 * Reusable call-to-action records, referenced by sections and repeater items
 * rather than duplicated into each of them.
 */
class CtaController extends Controller
{
    use ModelProperty;

    protected array $modelProperty;

    /**
     * Constructor to inject services and apply middleware
     */
    public function __construct(
        protected CtaService $service
    ) {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix: 'Ctas',
            routePrefix: 'backend.ctas'
        );

        $this->authorizeResource(Cta::class);
    }

    /**
     * Summary of index
     */
    public function index(): Response
    {
        $data = formatResourceResponse(
            $this->service->getCtas(),
            CtaResource::class
        );

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Index', [
                'title' => translate('Call To Actions'),
                'data' => $data,
                'linkTypes' => CtaLinkType::options(),
                'iconPositions' => IconPosition::options(),
                'statuses' => Status::options(),
                'modelProperty' => $this->modelProperty,
            ])->build();
    }

    /**
     * Summary of create
     */
    public function create(): Response
    {
        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Save', [
                'title' => translate('Create Call To Action'),
                'linkTypes' => CtaLinkType::options(),
                'iconPositions' => IconPosition::options(),
                'statuses' => Status::options(),
                'modelProperty' => $this->modelProperty,
            ])->build();
    }

    /**
     * Summary of store
     */
    public function store(CtaSaveRequest $request): RedirectResponse
    {
        $this->service->save($request);

        return AppResponse::asSuccess()
            ->withMessage(translate('Call to action created successfully'))
            ->build();
    }

    /**
     * Summary of edit
     */
    public function edit(Cta $cta): Response
    {
        $cta->loadMissing(['page:id,uuid,title,path']);

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Save', [
                'title' => translate('Update Call To Action'),
                'item' => formatResourceResponse($cta, CtaResource::class),
                'linkTypes' => CtaLinkType::options(),
                'iconPositions' => IconPosition::options(),
                'statuses' => Status::options(),
                'modelProperty' => $this->modelProperty,
            ])->build();
    }

    /**
     * Summary of update
     */
    public function update(CtaSaveRequest $request, Cta $cta): RedirectResponse
    {
        $this->service->save($request, $cta);

        return AppResponse::asSuccess()
            ->withMessage(translate('Call to action updated successfully'))
            ->build();
    }

    /**
     * Summary of destroy
     */
    public function destroy(Cta $cta): RedirectResponse
    {
        $this->service->destroy($cta);

        return AppResponse::asSuccess()
            ->withMessage(translate('Call to action deleted successfully'))
            ->build();
    }
}

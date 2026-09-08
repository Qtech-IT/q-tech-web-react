<?php

namespace App\Http\Controllers\Backend\Cms;

use App\Enums\Cms\RedirectSource;
use App\Enums\Common\Status;
use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Cms\RedirectSaveRequest;
use App\Http\Resources\Backend\Cms\RedirectResource;
use App\Http\Services\Backend\Cms\RedirectService;
use App\Models\Redirect;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

/**
 * Flat CRUD. Most rows are created automatically by PageService on a slug
 * change; this screen exists so an editor can add and audit the manual ones.
 */
class RedirectController extends Controller
{
    use ModelProperty;

    protected array $modelProperty;

    /**
     * Constructor to inject services and apply middleware
     */
    public function __construct(
        protected RedirectService $service
    ) {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix: 'Redirects',
            routePrefix: 'backend.redirects'
        );

        $this->authorizeResource(Redirect::class);
    }

    /**
     * Summary of index
     */
    public function index(): Response
    {
        $data = formatResourceResponse(
            $this->service->getRedirects(),
            RedirectResource::class
        );

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Index', [
                'title' => translate('Redirects'),
                'data' => $data,
                'sources' => RedirectSource::options(),
                'statusCodes' => Redirect::STATUS_CODES,
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
                'title' => translate('Create Redirect'),
                'sources' => RedirectSource::options(),
                'statusCodes' => Redirect::STATUS_CODES,
                'statuses' => Status::options(),
                'modelProperty' => $this->modelProperty,
            ])->build();
    }

    /**
     * Summary of store
     */
    public function store(RedirectSaveRequest $request): RedirectResponse
    {
        $this->service->save($request);

        return AppResponse::asSuccess()
            ->withMessage(translate('Redirect created successfully'))
            ->build();
    }

    /**
     * Summary of edit
     */
    public function edit(Redirect $redirect): Response
    {
        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Save', [
                'title' => translate('Update Redirect'),
                'item' => formatResourceResponse($redirect, RedirectResource::class),
                'sources' => RedirectSource::options(),
                'statusCodes' => Redirect::STATUS_CODES,
                'statuses' => Status::options(),
                'modelProperty' => $this->modelProperty,
            ])->build();
    }

    /**
     * Summary of update
     */
    public function update(RedirectSaveRequest $request, Redirect $redirect): RedirectResponse
    {
        $this->service->save($request, $redirect);

        return AppResponse::asSuccess()
            ->withMessage(translate('Redirect updated successfully'))
            ->build();
    }

    /**
     * Summary of destroy
     */
    public function destroy(Redirect $redirect): RedirectResponse
    {
        $this->service->destroy($redirect);

        return AppResponse::asSuccess()
            ->withMessage(translate('Redirect deleted successfully'))
            ->build();
    }

    /**
     * Restore from trash.
     */
    public function restore(Redirect $redirect): RedirectResponse
    {
        $this->authorize('restore', Redirect::class);

        $this->service->restore($redirect);

        return AppResponse::asSuccess()
            ->withMessage(translate('Redirect restored successfully'))
            ->build();
    }

    /**
     * Permanently delete.
     */
    public function forceDestroy(Redirect $redirect): RedirectResponse
    {
        $this->authorize('forceDelete', Redirect::class);

        $this->service->forceDestroy($redirect);

        return AppResponse::asSuccess()
            ->withMessage(translate('Redirect permanently deleted successfully'))
            ->build();
    }
}

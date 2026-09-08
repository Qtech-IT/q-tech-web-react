<?php

namespace App\Http\Controllers\Backend\Cms;

use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Cms\FolderSaveRequest;
use App\Http\Resources\Backend\Cms\MediaFolderResource;
use App\Http\Services\Backend\Cms\MediaFolderService;
use App\Models\MediaFolder;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

/**
 * The media library's folder tree. Writes only reparent and rename — moving
 * assets between folders belongs to MediaController::move().
 */
class MediaFolderController extends Controller
{
    use ModelProperty;

    protected array $modelProperty;

    /**
     * Constructor to inject services and apply middleware
     */
    public function __construct(
        protected MediaFolderService $service
    ) {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix: 'MediaFolders',
            routePrefix: 'backend.media-folders'
        );

        $this->authorizeResource(MediaFolder::class);
    }

    /**
     * Summary of index
     */
    public function index(): Response
    {
        $data = formatResourceResponse(
            $this->service->getFolders(),
            MediaFolderResource::class
        );

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Index', [
                'title' => translate('Media Folders'),
                'data' => $data,
                'modelProperty' => $this->modelProperty,
            ])->build();
    }

    /**
     * Summary of store
     */
    public function store(FolderSaveRequest $request): RedirectResponse
    {
        $this->service->save($request);

        return AppResponse::asSuccess()
            ->withMessage(translate('Folder created successfully'))
            ->build();
    }

    /**
     * A rename or reparent rewrites path and depth for the whole subtree, in
     * one transaction.
     */
    public function update(FolderSaveRequest $request, MediaFolder $mediaFolder): RedirectResponse
    {
        $this->service->save($request, $mediaFolder);

        return AppResponse::asSuccess()
            ->withMessage(translate('Folder updated successfully'))
            ->build();
    }

    /**
     * Summary of destroy
     */
    public function destroy(MediaFolder $mediaFolder): RedirectResponse
    {
        $this->service->destroy($mediaFolder);

        return AppResponse::asSuccess()
            ->withMessage(translate('Folder deleted successfully'))
            ->build();
    }

    /**
     * Restore from trash.
     */
    public function restore(MediaFolder $mediaFolder): RedirectResponse
    {
        $this->authorize('restore', MediaFolder::class);

        $this->service->restore($mediaFolder);

        return AppResponse::asSuccess()
            ->withMessage(translate('Folder restored successfully'))
            ->build();
    }

    /**
     * Permanently delete.
     */
    public function forceDestroy(MediaFolder $mediaFolder): RedirectResponse
    {
        $this->authorize('forceDelete', MediaFolder::class);

        $this->service->forceDestroy($mediaFolder);

        return AppResponse::asSuccess()
            ->withMessage(translate('Folder permanently deleted successfully'))
            ->build();
    }
}

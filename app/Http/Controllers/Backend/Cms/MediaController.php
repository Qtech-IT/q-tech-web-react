<?php

namespace App\Http\Controllers\Backend\Cms;

use App\Enums\Cms\MediaType;
use App\Enums\Common\Status;
use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Cms\MediaAttachmentReorderRequest;
use App\Http\Requests\Backend\Cms\MediaAttachRequest;
use App\Http\Requests\Backend\Cms\MediaDetachRequest;
use App\Http\Requests\Backend\Cms\MediaMoveRequest;
use App\Http\Requests\Backend\Cms\MediaUpdateRequest;
use App\Http\Requests\Backend\Cms\MediaUploadRequest;
use App\Http\Resources\Backend\Cms\MediaFolderResource;
use App\Http\Resources\Backend\Cms\MediaResource;
use App\Http\Services\Backend\Cms\MediaFolderService;
use App\Http\Services\Backend\Cms\MediaService;
use App\Models\Media;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

/**
 * The media library. Reused by every other module through the picker modal,
 * so the index ships the folder sidebar alongside the grid rather than making
 * the client issue a second request for it.
 */
class MediaController extends Controller
{
    use ModelProperty;

    protected array $modelProperty;

    /**
     * Constructor to inject services and apply middleware
     */
    public function __construct(
        protected MediaService $service,
        protected MediaFolderService $folders,
    ) {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix: 'Media',
            routePrefix: 'backend.media'
        );

        $this->authorizeResource(Media::class);
    }

    /**
     * Summary of index
     */
    public function index(): Response
    {
        $data = formatResourceResponse(
            $this->service->getMedia(),
            MediaResource::class
        );

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Index', [
                'title' => translate('Media Library'),
                'data' => $data,
                'folders' => formatResourceResponse(
                    $this->folders->getFolders(),
                    MediaFolderResource::class
                ),
                'mediaTypes' => MediaType::options(),
                'statuses' => Status::options(),
                'modelProperty' => $this->modelProperty,
            ])->build();
    }

    /**
     * Upload one asset. Dimensions, MIME and checksum are read server-side by
     * the service, never taken from the client claim.
     */
    public function store(MediaUploadRequest $request): RedirectResponse
    {
        $this->service->upload($request);

        return AppResponse::asSuccess()
            ->withMessage(translate('File uploaded successfully'))
            ->build();
    }

    /**
     * Update editorial metadata — alt text, caption, focal point. Never the
     * file itself; a replacement is a new upload.
     */
    public function update(MediaUpdateRequest $request, Media $media): RedirectResponse
    {
        $this->service->update($request, $media);

        return AppResponse::asSuccess()
            ->withMessage(translate('File updated successfully'))
            ->build();
    }

    /**
     * Soft delete. The physical file survives so a restore from trash can bring
     * it back — see forceDestroy().
     */
    public function destroy(Media $media): RedirectResponse
    {
        $this->service->destroy($media);

        return AppResponse::asSuccess()
            ->withMessage(translate('File moved to trash successfully'))
            ->build();
    }

    /**
     * Bring a trashed asset back. The file was never unlinked, so this is only
     * the row.
     */
    public function restore(Media $media): RedirectResponse
    {
        $this->authorize('restore', Media::class);

        $this->service->restore($media);

        return AppResponse::asSuccess()
            ->withMessage(translate('File restored successfully'))
            ->build();
    }

    /**
     * Permanently delete the row and unlink the file.
     */
    public function forceDestroy(Media $media): RedirectResponse
    {
        $this->authorize('forceDelete', Media::class);

        $this->service->forceDestroy($media);

        return AppResponse::asSuccess()
            ->withMessage(translate('File permanently deleted successfully'))
            ->build();
    }

    /**
     * Move a selection into a folder in one statement.
     */
    public function move(MediaMoveRequest $request): RedirectResponse
    {
        $this->authorize('update', Media::class);

        $this->service->move(
            $request->validated('ids'),
            $request->input('folder_id') !== null ? (int) $request->input('folder_id') : null
        );

        return AppResponse::asSuccess()
            ->withMessage(translate('Files moved successfully'))
            ->build();
    }

    /**
     * Where an asset is used, so "delete this image?" can answer itself before
     * an editor breaks a live page.
     */
    /*
     * Return type is a union because `AppResponse::build()` decides the
     * response class from the REQUEST: a JsonResponse when the caller wants
     * JSON, a RedirectResponse otherwise. This endpoint is fetched with axios
     * rather than the Inertia router, so it always takes the JSON branch —
     * declaring `RedirectResponse` alone made every call a TypeError 500.
     */
    public function usage(Media $media): JsonResponse|RedirectResponse
    {
        $this->authorize('view', Media::class);

        return AppResponse::asSuccess()
            ->withData($this->service->usage($media))
            ->withMessage(translate('Usage loaded successfully'))
            ->build();
    }

    /**
     * Attach library assets to a content owner's named slot.
     *
     * Two authorizations, both necessary and neither sufficient: `view` on
     * Media (you may not attach what you may not see) and `update` on the
     * resolved owner, so a Media Manager with no page rights cannot edit a
     * page's gallery. The owner is resolved through the morph map, never from
     * a class name in the payload.
     */
    public function attach(MediaAttachRequest $request): RedirectResponse
    {
        $this->authorize('view', Media::class);

        $owner = $this->service->resolveOwner(
            $request->validated('mediable_type'),
            $request->validated('mediable_id')
        );

        $this->authorize('update', $owner);

        $this->service->attach(
            $owner,
            $request->validated('media_ids'),
            $request->validated('collection')
        );

        return AppResponse::asSuccess()
            ->withMessage(translate('Media attached successfully'))
            ->build();
    }

    /**
     * Remove attachments from an owner. Pivot rows only — the library asset
     * itself survives, because other pages may still be using it.
     */
    public function detach(MediaDetachRequest $request): RedirectResponse
    {
        $this->authorize('view', Media::class);

        $owner = $this->service->resolveOwner(
            $request->validated('mediable_type'),
            $request->validated('mediable_id')
        );

        $this->authorize('update', $owner);

        $this->service->detach(
            $owner,
            $request->validated('media_ids') ?? [],
            $request->validated('collection')
        );

        return AppResponse::asSuccess()
            ->withMessage(translate('Media detached successfully'))
            ->build();
    }

    /**
     * Persist a drag-and-drop order inside one collection.
     */
    public function reorderAttachments(MediaAttachmentReorderRequest $request): RedirectResponse
    {
        $this->authorize('view', Media::class);

        $owner = $this->service->resolveOwner(
            $request->validated('mediable_type'),
            $request->validated('mediable_id')
        );

        $this->authorize('update', $owner);

        $this->service->reorderAttachments(
            $owner,
            $request->validated('media_ids'),
            $request->validated('collection')
        );

        return AppResponse::asSuccess()
            ->withMessage(translate('Media reordered successfully'))
            ->build();
    }
}

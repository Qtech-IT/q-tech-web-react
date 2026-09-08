<?php

namespace App\Http\Controllers\Backend\Cms;

use App\Enums\Cms\ContentStatus;
use App\Enums\Cms\PageType;
use App\Enums\Common\Status;
use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Cms\PagePublishRequest;
use App\Http\Requests\Backend\Cms\PageSaveRequest;
use App\Http\Requests\Backend\Cms\PageStatusRequest;
use App\Http\Requests\Backend\Cms\PageTranslationRequest;
use App\Http\Resources\Backend\Cms\PageResource;
use App\Http\Resources\Backend\Cms\PageTreeResource;
use App\Http\Services\Backend\Cms\PageService;
use App\Http\Services\Backend\Cms\PageTreeService;
use App\Models\Page;
use App\Traits\Common\ModelAction;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class PageController extends Controller
{
    use ModelAction, ModelProperty;

    protected array $modelProperty;

    /**
     * Constructor to inject services and apply middleware
     */
    public function __construct(
        protected PageService $service,
        protected PageTreeService $treeService,
    ) {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix: 'Pages',
            routePrefix: 'backend.pages'
        );

        $this->authorizeResource(Page::class);
    }

    /**
     * Summary of index
     */
    public function index(): Response
    {
        $data = formatResourceResponse(
            $this->service->getPages(),
            PageResource::class
        );

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Index', [
                'title' => translate('Pages'),
                'data' => $data,
                'pageTypes' => PageType::options(),
                'publishStatuses' => ContentStatus::options(),
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
                'title' => translate('Create Page'),
                'pageTypes' => PageType::options(),
                'publishStatuses' => ContentStatus::options(),
                'statuses' => Status::options(),
                'modelProperty' => $this->modelProperty,
            ])->build();
    }

    /**
     * Summary of store
     */
    public function store(PageSaveRequest $request): RedirectResponse
    {
        $this->service->save($request);

        return AppResponse::asSuccess()
            ->withMessage(translate('Page created successfully'))
            ->build();
    }

    /**
     * Summary of edit
     */
    public function edit(Page $page): Response
    {
        $page->loadMissing(['parent:id,title,path', 'seo', 'createdBy', 'updatedBy']);

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Save', [
                'title' => translate('Update Page'),
                'item' => formatResourceResponse($page, PageResource::class),
                'pageTypes' => PageType::options(),
                'publishStatuses' => ContentStatus::options(),
                'statuses' => Status::options(),
                'modelProperty' => $this->modelProperty,
            ])->build();
    }

    /**
     * Summary of update
     */
    public function update(PageSaveRequest $request, Page $page): RedirectResponse
    {
        $this->service->save($request, $page);

        return AppResponse::asSuccess()
            ->withMessage(translate('Page updated successfully'))
            ->build();
    }

    /**
     * Create a locale variant of this page.
     *
     * The new row shares the source's translation group and owns its own URL,
     * title and SEO record — but no sections: section structure is
     * locale-neutral (schema doc §8.2) and is translated through the overlay.
     * Lands as a draft.
     */
    public function storeTranslation(PageTranslationRequest $request, Page $page): RedirectResponse
    {
        $this->authorize('translate', $page);

        $this->service->createTranslation($page, $request->string('locale')->toString(), [
            'slug' => $request->input('slug'),
            'title' => $request->input('title'),
        ]);

        return AppResponse::asSuccess()
            ->withMessage(translate('Translation page created'))
            ->build();
    }

    /**
     * Summary of destroy
     */
    public function destroy(Page $page): RedirectResponse
    {
        $this->service->destroy($page);

        return AppResponse::asSuccess()
            ->withMessage(translate('Page deleted successfully'))
            ->build();
    }

    /**
     * Restore from trash.
     */
    public function restore(Page $page): RedirectResponse
    {
        $this->authorize('restore', Page::class);

        $this->service->restore($page);

        return AppResponse::asSuccess()
            ->withMessage(translate('Page restored successfully'))
            ->build();
    }

    /**
     * Permanently delete.
     */
    public function forceDestroy(Page $page): RedirectResponse
    {
        $this->authorize('forceDelete', Page::class);

        $this->service->forceDestroy($page);

        return AppResponse::asSuccess()
            ->withMessage(translate('Page permanently deleted successfully'))
            ->build();
    }

    /**
     * The admin page tree, flat and depth-ordered so the client nests it
     * without a query per level.
     */
    public function tree(): Response
    {
        $this->authorize('viewAny', Page::class);

        $data = formatResourceResponse(
            $this->treeService->tree(get_system_locale(), (int) config('cms.site_id')),
            PageTreeResource::class
        );

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Tree', [
                'title' => translate('Page Tree'),
                'data' => $data,
                'modelProperty' => $this->modelProperty,
            ])->build();
    }

    /**
     * Publish, unpublish, schedule or archive — one page at a time, behind its
     * own permission so a junior editor can draft without going live.
     */
    public function publish(PagePublishRequest $request, Page $page): RedirectResponse
    {
        $this->authorize('publish', Page::class);

        $this->service->publish($request, $page);

        return AppResponse::asSuccess()
            ->withMessage(translate('Page publishing updated successfully'))
            ->build();
    }

    /**
     * Summary of makeHomepage
     */
    public function makeHomepage(Page $page): RedirectResponse
    {
        $this->authorize('publish', Page::class);

        $this->service->makeHomepage($page);

        return AppResponse::asSuccess()
            ->withMessage(translate('Homepage updated successfully'))
            ->build();
    }

    /**
     * The `status` kill switch — App\Enums\Common\Status, never the editorial
     * state. Publishing goes through publish() above.
     */
    public function updateStatus(PageStatusRequest $request): RedirectResponse
    {
        $this->authorize('update', Page::class);

        $page = Page::findOrFail($request->input('id'));

        $this->changeStatus(request: $request->except(keys: '_token'), actionData: [
            'model' => new Page,
            'filterable_attributes' => ['id' => $request->input('id')],
        ]);

        // `status` is ANDed into the ->published() scope, so flipping it changes
        // what the public site renders and the cached payload is now stale.
        $this->service->forgetPage($page);

        return AppResponse::asSuccess()
            ->withMessage(translate('Page status updated successfully'))
            ->build();
    }
}

<?php

namespace App\Http\Controllers\Backend\Cms;

use App\Enums\Cms\ContentStatus;
use App\Enums\Common\Status;
use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Cms\SectionDuplicateRequest;
use App\Http\Requests\Backend\Cms\SectionReorderRequest;
use App\Http\Requests\Backend\Cms\SectionSaveRequest;
use App\Http\Requests\Backend\Cms\SectionStatusRequest;
use App\Http\Resources\Backend\Cms\PageResource;
use App\Http\Resources\Backend\Cms\PageSectionResource;
use App\Http\Resources\Backend\Cms\SectionTypeResource;
use App\Http\Services\Backend\Cms\PageSectionService;
use App\Http\Services\Backend\Cms\SectionTypeRegistry;
use App\Models\Page;
use App\Models\PageSection;
use App\Traits\Common\ModelAction;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

/**
 * The page builder. Sections are always addressed through their owning page,
 * because a section has no meaning on its own and the editor never lists them
 * globally.
 */
class PageSectionController extends Controller
{
    use ModelAction, ModelProperty;

    protected array $modelProperty;

    /**
     * Constructor to inject services and apply middleware
     */
    public function __construct(
        protected PageSectionService $service,
        protected SectionTypeRegistry $registry,
    ) {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix: 'PageSections',
            routePrefix: 'backend.page-sections'
        );

        $this->authorizeResource(PageSection::class);
    }

    /**
     * The section editor for one page: its sections, plus the registry payload
     * the dynamic form renders itself from.
     */
    public function index(Page $page): Response
    {
        $data = formatResourceResponse(
            $this->service->getForPage($page),
            PageSectionResource::class
        );

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Index', [
                'title' => translate('Page Sections'),
                'data' => $data,
                'page' => formatResourceResponse($page, PageResource::class),
                'sectionTypes' => SectionTypeResource::collection($this->registry->all()),
                'sectionTypeGroups' => $this->registry->grouped(),
                'publishStatuses' => ContentStatus::options(),
                'statuses' => Status::options(),
                'modelProperty' => $this->modelProperty,
            ])->build();
    }

    /**
     * Summary of store
     */
    public function store(SectionSaveRequest $request): RedirectResponse
    {
        $this->service->save($request);

        return AppResponse::asSuccess()
            ->withMessage(translate('Section created successfully'))
            ->build();
    }

    /**
     * Summary of update
     */
    public function update(SectionSaveRequest $request, PageSection $pageSection): RedirectResponse
    {
        $this->service->save($request, $pageSection);

        return AppResponse::asSuccess()
            ->withMessage(translate('Section updated successfully'))
            ->build();
    }

    /**
     * Summary of destroy
     */
    public function destroy(PageSection $pageSection): RedirectResponse
    {
        $this->service->destroy($pageSection);

        return AppResponse::asSuccess()
            ->withMessage(translate('Section deleted successfully'))
            ->build();
    }

    /**
     * Deep-copy a section and everything under it.
     *
     * Authorized as `create`, not a dedicated `section.duplicate` permission:
     * a duplicate is a create that happens to be pre-filled, and anyone who
     * may add a section may add this one. The copy lands as a draft, so no
     * `publish` right is involved either.
     */
    public function duplicate(SectionDuplicateRequest $request, PageSection $pageSection): RedirectResponse
    {
        $this->authorize('create', PageSection::class);

        $this->service->duplicate($pageSection, $request->validated('name'));

        return AppResponse::asSuccess()
            ->withMessage(translate('Section duplicated successfully'))
            ->build();
    }

    /**
     * Persist a drag-and-drop order — one UPDATE per row, which is what makes
     * two editors reordering at once safe.
     */
    public function reorder(SectionReorderRequest $request): RedirectResponse
    {
        $this->authorize('reorder', PageSection::class);

        $this->service->reorder($request->validated('sections'));

        return AppResponse::asSuccess()
            ->withMessage(translate('Sections reordered successfully'))
            ->build();
    }

    /**
     * Enable or disable a section without deleting it — the `status` kill
     * switch, not the editorial state.
     */
    public function updateStatus(SectionStatusRequest $request): RedirectResponse
    {
        $this->authorize('update', PageSection::class);

        $section = PageSection::findOrFail($request->input('id'));

        $this->changeStatus(request: $request->except(keys: '_token'), actionData: [
            'model' => new PageSection,
            'filterable_attributes' => ['id' => $request->input('id')],
        ]);

        $this->service->forgetSection($section);

        return AppResponse::asSuccess()
            ->withMessage(translate('Section status updated successfully'))
            ->build();
    }
}

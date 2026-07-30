<?php

namespace App\Http\Controllers\Backend\Cms;

use App\Enums\Cms\ContentStatus;
use App\Enums\Common\Status;
use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Cms\BlockSaveRequest;
use App\Http\Resources\Backend\Cms\BlockResource;
use App\Http\Resources\Backend\Cms\SectionTypeResource;
use App\Http\Services\Backend\Cms\BlockService;
use App\Http\Services\Backend\Cms\SectionTypeRegistry;
use App\Models\Block;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

/**
 * Global blocks — reusable section bodies mounted on many pages.
 *
 * A block's content IS a page_sections row with page_id NULL, so editing the
 * body goes through PageSectionController; this controller owns only the block
 * record itself.
 */
class BlockController extends Controller
{
    use ModelProperty;

    protected array $modelProperty;

    /**
     * Constructor to inject services and apply middleware
     */
    public function __construct(
        protected BlockService $service,
        protected SectionTypeRegistry $registry,
    ) {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix: 'Blocks',
            routePrefix: 'backend.blocks'
        );

        $this->authorizeResource(Block::class);
    }

    /**
     * Summary of index
     */
    public function index(): Response
    {
        $data = formatResourceResponse(
            $this->service->getBlocks(),
            BlockResource::class
        );

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Index', [
                'title' => translate('Global Blocks'),
                'data' => $data,
                'sectionTypeGroups' => $this->registry->grouped(),
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
                'title' => translate('Create Global Block'),
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
    public function store(BlockSaveRequest $request): RedirectResponse
    {
        $this->service->save($request);

        return AppResponse::asSuccess()
            ->withMessage(translate('Block created successfully'))
            ->build();
    }

    /**
     * Summary of edit
     */
    public function edit(Block $block): Response
    {
        $block->loadMissing(['body', 'createdBy', 'updatedBy']);

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Save', [
                'title' => translate('Update Global Block'),
                'item' => formatResourceResponse($block, BlockResource::class),
                'sectionTypes' => SectionTypeResource::collection($this->registry->all()),
                'sectionTypeGroups' => $this->registry->grouped(),
                'publishStatuses' => ContentStatus::options(),
                'statuses' => Status::options(),
                'modelProperty' => $this->modelProperty,
            ])->build();
    }

    /**
     * Summary of update
     */
    public function update(BlockSaveRequest $request, Block $block): RedirectResponse
    {
        $this->service->save($request, $block);

        return AppResponse::asSuccess()
            ->withMessage(translate('Block updated successfully'))
            ->build();
    }

    /**
     * Summary of destroy
     */
    public function destroy(Block $block): RedirectResponse
    {
        $this->service->destroy($block);

        return AppResponse::asSuccess()
            ->withMessage(translate('Block deleted successfully'))
            ->build();
    }

    /**
     * Restore from trash.
     */
    public function restore(Block $block): RedirectResponse
    {
        $this->authorize('restore', Block::class);

        $this->service->restore($block);

        return AppResponse::asSuccess()
            ->withMessage(translate('Block restored successfully'))
            ->build();
    }

    /**
     * Permanently delete.
     */
    public function forceDestroy(Block $block): RedirectResponse
    {
        $this->authorize('forceDelete', Block::class);

        $this->service->forceDestroy($block);

        return AppResponse::asSuccess()
            ->withMessage(translate('Block permanently deleted successfully'))
            ->build();
    }
}

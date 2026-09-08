<?php

namespace App\Http\Controllers\Backend\Cms;

use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Cms\SectionBlockReorderRequest;
use App\Http\Requests\Backend\Cms\SectionBlockSaveRequest;
use App\Http\Services\Backend\Cms\SectionBlockService;
use App\Models\SectionBlock;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;

/**
 * Repeater items inside a section.
 *
 * No index and no editor page of its own: items are rendered inline by the
 * section editor, which already loads them through PageSectionService. This
 * controller is writes only.
 *
 * Authorization resolves to SectionBlockPolicy, which extends PageSectionPolicy
 * — an editor who may edit a section may edit the items inside it.
 */
class SectionBlockController extends Controller
{
    use ModelProperty;

    protected array $modelProperty;

    /**
     * Constructor to inject services and apply middleware
     */
    public function __construct(
        protected SectionBlockService $service
    ) {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix: 'SectionBlocks',
            routePrefix: 'backend.section-blocks'
        );

        $this->authorizeResource(SectionBlock::class);
    }

    /**
     * Summary of store
     */
    public function store(SectionBlockSaveRequest $request): RedirectResponse
    {
        $this->service->save($request);

        return AppResponse::asSuccess()
            ->withMessage(translate('Item created successfully'))
            ->build();
    }

    /**
     * Summary of update
     */
    public function update(SectionBlockSaveRequest $request, SectionBlock $sectionBlock): RedirectResponse
    {
        $this->service->save($request, $sectionBlock);

        return AppResponse::asSuccess()
            ->withMessage(translate('Item updated successfully'))
            ->build();
    }

    /**
     * Summary of destroy
     */
    public function destroy(SectionBlock $sectionBlock): RedirectResponse
    {
        $this->service->destroy($sectionBlock);

        return AppResponse::asSuccess()
            ->withMessage(translate('Item deleted successfully'))
            ->build();
    }

    /**
     * Persist a drag-and-drop order for one repeater.
     */
    public function reorder(SectionBlockReorderRequest $request): RedirectResponse
    {
        $this->authorize('reorder', SectionBlock::class);

        $this->service->reorder($request->validated('blocks'));

        return AppResponse::asSuccess()
            ->withMessage(translate('Items reordered successfully'))
            ->build();
    }
}

<?php

namespace App\Http\Controllers\Backend\Cms;

use App\Enums\Cms\MenuLinkType;
use App\Enums\Cms\MenuVisibility;
use App\Enums\Common\Status;
use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Cms\MenuItemMoveRequest;
use App\Http\Requests\Backend\Cms\MenuItemSaveRequest;
use App\Http\Resources\Backend\Cms\MenuItemResource;
use App\Http\Resources\Backend\Cms\MenuResource;
use App\Http\Services\Backend\Cms\MenuService;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

/**
 * The drag-and-drop menu tree.
 *
 * Items are always addressed through their menu, and the tree is shipped flat
 * and pre-ordered so the client nests it from parent_id without a query per
 * level.
 */
class MenuItemController extends Controller
{
    use ModelProperty;

    protected array $modelProperty;

    /**
     * Constructor to inject services and apply middleware
     */
    public function __construct(
        protected MenuService $service
    ) {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix: 'MenuItems',
            routePrefix: 'backend.menu-items'
        );

        $this->authorizeResource(MenuItem::class);
    }

    /**
     * The tree editor for one menu.
     */
    public function index(Menu $menu): Response
    {
        $data = formatResourceResponse(
            $this->service->getItems($menu),
            MenuItemResource::class
        );

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Index', [
                'title' => translate('Menu Items'),
                'data' => $data,
                'menu' => formatResourceResponse($menu, MenuResource::class),
                'linkTypes' => MenuLinkType::options(),
                'visibilities' => MenuVisibility::options(),
                'statuses' => Status::options(),
                'modelProperty' => $this->modelProperty,
            ])->build();
    }

    /**
     * Summary of store
     */
    public function store(MenuItemSaveRequest $request): RedirectResponse
    {
        $this->service->saveItem($request);

        return AppResponse::asSuccess()
            ->withMessage(translate('Menu item created successfully'))
            ->build();
    }

    /**
     * Summary of update
     */
    public function update(MenuItemSaveRequest $request, MenuItem $menuItem): RedirectResponse
    {
        $this->service->saveItem($request, $menuItem);

        return AppResponse::asSuccess()
            ->withMessage(translate('Menu item updated successfully'))
            ->build();
    }

    /**
     * Summary of destroy
     */
    public function destroy(MenuItem $menuItem): RedirectResponse
    {
        $this->service->destroyItem($menuItem);

        return AppResponse::asSuccess()
            ->withMessage(translate('Menu item deleted successfully'))
            ->build();
    }

    /**
     * Persist one drag: the new parent AND the full new sibling order, in a
     * single request and a single transaction.
     *
     * Splitting reparent and reorder into two calls is what produces a tree
     * that is briefly wrong between them — and permanently wrong if the second
     * request fails.
     */
    public function move(MenuItemMoveRequest $request, MenuItem $menuItem): RedirectResponse
    {
        $this->authorize('reorder', MenuItem::class);

        $parent = $request->filled('parent_id')
            ? MenuItem::findOrFail($request->input('parent_id'))
            : null;

        $this->service->moveItem($menuItem, $parent, $request->validated('siblings'));

        return AppResponse::asSuccess()
            ->withMessage(translate('Menu updated successfully'))
            ->build();
    }
}

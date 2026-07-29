<?php

namespace App\Http\Controllers\Backend\Cms;

use App\Enums\Common\Status;
use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Cms\MenuSaveRequest;
use App\Http\Resources\Backend\Cms\MenuResource;
use App\Http\Services\Backend\Cms\MenuService;
use App\Models\Menu;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

/**
 * The menu record itself. Its items — and the drag-and-drop tree — live in
 * MenuItemController.
 */
class MenuController extends Controller
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
            resourcePagePrefix: 'Menus',
            routePrefix: 'backend.menus'
        );

        $this->authorizeResource(Menu::class);
    }

    /**
     * Summary of index
     */
    public function index(): Response
    {
        $data = formatResourceResponse(
            $this->service->getMenus(),
            MenuResource::class
        );

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Index', [
                'title' => translate('Menus'),
                'data' => $data,
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
                'title' => translate('Create Menu'),
                'statuses' => Status::options(),
                'modelProperty' => $this->modelProperty,
            ])->build();
    }

    /**
     * Summary of store
     */
    public function store(MenuSaveRequest $request): RedirectResponse
    {
        $this->service->save($request);

        return AppResponse::asSuccess()
            ->withMessage(translate('Menu created successfully'))
            ->build();
    }

    /**
     * Summary of edit
     */
    public function edit(Menu $menu): Response
    {
        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Save', [
                'title' => translate('Update Menu'),
                'item' => formatResourceResponse($menu, MenuResource::class),
                'statuses' => Status::options(),
                'modelProperty' => $this->modelProperty,
            ])->build();
    }

    /**
     * Summary of update
     */
    public function update(MenuSaveRequest $request, Menu $menu): RedirectResponse
    {
        $this->service->save($request, $menu);

        return AppResponse::asSuccess()
            ->withMessage(translate('Menu updated successfully'))
            ->build();
    }

    /**
     * Summary of destroy
     */
    public function destroy(Menu $menu): RedirectResponse
    {
        $this->service->destroy($menu);

        return AppResponse::asSuccess()
            ->withMessage(translate('Menu deleted successfully'))
            ->build();
    }
}

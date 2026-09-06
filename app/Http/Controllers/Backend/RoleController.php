<?php

namespace App\Http\Controllers\Backend;

use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Role\StoreRoleRequest;
use App\Http\Requests\Backend\Role\UpdateRoleRequest;
use App\Http\Resources\Backend\Role\RoleResource;
use App\Http\Services\Backend\RoleService;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    use ModelProperty;

    protected $modelProperty = [];

    public function __construct(protected RoleService $roleService)
    {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix : 'Roles',
            routePrefix     : 'backend.roles'
        );

        $this->authorizeResource(Role::class);
    }

    /**
     * Display a listing of roles
     */
    public function index(Request $request): Response
    {
        $roles = formatResourceResponse(
            $this->roleService->getAllRoles(),
            RoleResource::class
        );

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Index', [
                'title' => translate('Roles'),
                'data' => $roles,
                'stats' => $this->roleService->getRoleStatistics(),
                'modelProperty' => $this->modelProperty,
                'advanceFilterOptions' => $this->roleService->getAdvanceFilterOptions(),
            ])->build();
    }

    /**
     * Show the form for creating a new role
     */
    public function create(): Response
    {
        $permissions = $this->roleService->getPermissionsGrouped();

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Save', [
                'title' => translate('Create Role'),
                'permissions' => $permissions,
                'modelProperty' => $this->modelProperty,
                'roleTypes' => RoleType::options(),
            ])->build();
    }

    /**
     * Store a newly created role with permissions
     */
    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $role = $this->roleService->createRoleWithPermissions(
            $request->validated()
        );

        return AppResponse::asSuccess()
            ->withMessage('Role created successfully.')
            ->build();
    }

    /**
     * Summary of clone
     */
    public function clone(int $id): RedirectResponse
    {
        $this->authorize('clone', Role::class);

        $role = Role::with(['permissions'])->where('id', $id)->firstOrfail();

        $this->roleService->cloneRoleWithPermissions($role);

        return AppResponse::asSuccess()
            ->withMessage('Role cloned successfully.')
            ->build();
    }

    /**
     * Show the form for editing the specified role
     */
    public function edit(Role $role): Response
    {
        $role->loadMissing(['permissions']);

        $permissions = $this->roleService->getPermissionsGrouped();

        return AppResponse::asSuccess()
            ->withComponent($this->modelProperty['pagePrefix'].'Save', [
                'title' => translate('Update Role'),
                'permissions' => $permissions,
                'item' => formatResourceResponse($role, RoleResource::class),
                'modelProperty' => $this->modelProperty,
            ])->build();
    }

    /**
     * Update the specified role with permissions
     */
    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        $this->roleService->updateRoleWithPermissions($role, $request->validated());

        return AppResponse::asSuccess()
            ->withMessage('Role updated successfully.')
            ->build();
    }

    /**
     * Delete the specified role
     */
    public function destroy(Role $role): RedirectResponse
    {
        if ($role->is_super_admin) {
            return AppResponse::asError()
                ->withMessage('Cannot delete super admin role')
                ->build();
        }

        if (DB::table('model_has_roles')->where('role_id', $role->id)->exists()) {
            return AppResponse::asError()
                ->withMessage('This role is assigned to one or more users and cannot be deleted.')
                ->build();
        }

        $this->roleService->deleteRole($role);

        return AppResponse::asSuccess()
            ->withMessage('Role deleted successfully')
            ->build();
    }
}

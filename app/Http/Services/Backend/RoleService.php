<?php

namespace App\Http\Services\Backend;

use App\Enums\Common\Status;
use App\Enums\Settings\InputEnum;
use App\Enums\User\RoleType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleService
{
    protected string $model = Role::class;

    /**
     * Get all roles with filtering and pagination
     */
    public function getAllRoles(): LengthAwarePaginator
    {
        $query = Role::where('is_super_admin', false)
                 ->withCount(['permissions']);

        $this->applyRoleFilters($query);

        return $query
                    ->latest()
                    ->paginate(paginateNumber())
                    ->appends(request()->all());
    }

    /**
     * Summary of applyRoleFilters
     * @param Builder $query
     * @return Builder
     */
    private function applyRoleFilters(Builder $query): Builder
    {
        $search = request()->input('search');
        $status = request()->input('status');
        $type   = request()->input('type');

        return $query
            ->when($search, function (Builder $q) use ($search) {
                $q->where(function (Builder $sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('display_name', 'like', "%{$search}%");
                });
            })
            ->when($status, fn (Builder $q) => $q->where('status', $status))
            ->when($type, fn (Builder $q) => $q->where('type', $type));
    }

    /**
     * Summary of getActiveRoles
     * @return Collection<int, TModel>
     */
    public function getActiveRoles(): Collection
    {
        $query = Role::where('is_super_admin', false)
                      ->where('status', Status::ACTIVE->value);

        // $this->applyRoleFilters($query);

        return $query->get();
    }

    /**
     * Create a new role with permissions
     */
    public function createRoleWithPermissions(array $data): Role
    {
        $role = Role::create([
                    'name'           => $data['name'],
                    'display_name'   => $data['display_name'],
                    'guard_name'     => 'web',
                    'description'    => $data['description'] ?? null,
                    'order_index'    => $data['order_index'] ?? 0,
                    'is_super_admin' => false,
                    'type'           => $data['type']   ?? RoleType::DEFAULT->value,
                    'status'         => $data['status'] ?? Status::ACTIVE->value,
                ]);

        // Sync permissions if provided
        if (!empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role;
    }

    /**
     * Summary of cloneRoleWithPermissions
     * @param Role $role
     * @return void
     */
    public function cloneRoleWithPermissions(Role $role): void
    {
        $uniqueId = time();

        $clonedRole = $role->replicate()->fill([
            'name'         => $role->name . '_clone_' . $uniqueId,
            'display_name' => $role->display_name . ' (Clone)',
        ]);

        $clonedRole->save();

        // Sync permissions from original role to cloned role
        $clonedRole->syncPermissions($role->permissions->pluck('id')->toArray());
    }

    /**
     * Update role with permissions
     */
    public function updateRoleWithPermissions(Role $role, array $data): Role
    {
        $role->update([
            'name'         => $data['name']         ?? $role->name,
            'display_name' => $data['display_name'] ?? $role->display_name,
            'description'  => $data['description']  ?? $role->description,
            'order_index'  => $data['order_index']  ?? $role->order_index,
            'status'       => $data['status']       ?? $role->status,
             'type'        => $data['type']         ?? $role->type,
        ]);

        // Sync permissions if provided
        if (array_key_exists('permissions', $data)) {
            $role->syncPermissions($data['permissions'] ?? []);
        }

        return $role;
    }

    /**
     * Delete a role
     */
    public function deleteRole(Role $role): bool
    {
        if ($role->is_super_admin) {
            throw new \Exception(translate('Super admin role cannot be deleted.'));
        }
        $role->delete();
        return true;
    }

    /**
     * Summary of buildTree
     * @param mixed $permissions
     * @param mixed $parentId
     * @return mixed
     */
    private function buildTree($permissions, $parentId = null): mixed
    {
        return $permissions->where('parent_id', $parentId)->map(function($perm) use ($permissions): array
        {
            $children = $this->buildTree($permissions, $perm->id);
            return [
                'id'           => $perm->id,
                'name'         => $perm->name,
                'display_name' => $perm->display_name,
                'action'       => $perm->action,
                'children'     => $children->toArray()
            ];
        });
    }

    /**
     * Get all permissions grouped by module
     */
    public function getPermissionsGrouped(): array
    {
        $permissions = Permission::where('guard_name', 'web')
                                ->orderBy('order_index')
                                ->orderBy('module')
                                ->get();

        return $this->buildTree($permissions)->toArray();
    }

    /**
     * Summary of getNonGroupChildPermissions
     * @return array
     */
    public function getNonGroupChildPermissions(): array
    {
        return Permission::where('is_group', false)
                    ->whereNotNull('parent_id')
                    ->orderBy('parent_id')
                    ->orderBy('order_index')
                    ->get()
                    ->map(function (Permission $perm) {
                        return [
                            'id'           => $perm->id,
                            'name'         => $perm->name,
                            'display_name' => $perm->display_name,
                        ];
                    })
                    ->values()
                    ->toArray();
    }

    /**
     * Get all permissions (not grouped)
     */
    public function getAllPermissions(): Collection
    {
        return Permission::where('guard_name', 'web')
                            ->orderBy('module')
                            ->orderBy('order_index')
                            ->get();
    }

    /**
     * Check if role has specific permission
     */
    public function roleHasPermission(Role $role, int $permissionId): bool
    {
        return $role->permissions()->where('permissions.id', $permissionId)->exists();
    }

    /**
     * Get role by name
     */
    public function getRoleByName(string $name): ?Role
    {
        return Role::where('name', $name)->first();
    }

    /**
     * Get all super admin roles
     */
    public function getSuperAdminRoles()
    {
        return Role::where('is_super_admin', true)
                            ->orderBy('created_at', 'desc')
                            ->get();
    }

    /**
     * Count total roles
     */
    public function getTotalRoles(): int
    {
        return Role::where('is_super_admin', false)->count();
    }

    /**
     * Get roles by status
     */
    public function getRolesByStatus(string $status): Collection
    {
        return Role::where('status', $status)
                                ->orderBy('created_at', 'desc')
                                ->get();
    }

    /**
     * Get roles by guard name
     */
    public function getRolesByGuard(string $guardName): Collection
    {
        return Role::where('guard_name', $guardName)
                        ->orderBy('created_at', 'desc')
                        ->get();
    }

    /**
     * Get role statistics
     */
    public function getRoleStatistics(): array
    {
        return [
                'total'  => $this->getTotalRoles(),
                'active' => Role::where('is_super_admin', false)
                                            ->where('status', Status::ACTIVE->value)
                                            ->count(),
                'inactive' => Role::where('is_super_admin', false)
                                            ->where('status', Status::INACTIVE->value)
                                            ->count(),
                'assigned' => Role::where('is_super_admin', false)
                                           ->whereIn('id', function ($query) {
                                                $query->select('role_id')
                                                    ->from('model_has_roles')
                                                    ->distinct();
                                            })->count()
            ];
    }

    /**
     * Summary of getAdvanceFilter
     * @return array[]
     */
    public function getAdvanceFilterOptions(): array
    {
        return [
             [
                'key'     => 'type',
                'label'   => translate('Role Type'),
                'type'    => InputEnum::SELECT->value,
                'options' => [
                                ['value' => '',         'label' => translate('All Types')],
                                ...RoleType::options(),
                            ],
                        ],
            [
                'key'     => 'status',
                'label'   => translate('Status'),
                'type'    => InputEnum::SELECT->value,
                'options' => [
                                ['value' => '',         'label' => translate('All Status')],
                                ...Status::options(),
                            ],
            ]
        ];
    }
}

<?php

namespace App\Http\Resources\Backend\Role;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            ...$this->getBaseAttributes($request),
            'name'              => $this->name,
            'guard_name'        => $this->guard_name,
            'display_name'      => $this->display_name,
            'total_permissions' => $this->permissions_count,
            'is_super_admin'    => (bool) $this->is_super_admin,
            'order_index'       => $this->order_index,
            'description'       => $this->description,
            'type'              => $this->type
        ];

        if($this->relationLoaded('permissions')){
            $permissions         = $this->permissions;
            $data['permissions'] = formatResourceResponse(  $permissions, PermissionResource::class);
        }

        return $data;
    }
}

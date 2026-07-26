<?php

namespace App\Http\Resources\Backend\Role;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class PermissionResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...$this->getBaseAttributes($request),
            'name'         => $this->name,
            'display_name' => $this->display_name,
            'module'       => $this->module,
            'action'       => $this->action
        ];
    }
}

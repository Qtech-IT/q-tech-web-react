<?php

namespace App\Http\Resources\Backend\Cms;

use App\Contracts\Cms\SectionTypeContract;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Not a BaseResource: a section type is a PHP object from the registry, not an
 * Eloquent row, so it has no id, uuid, status, or audit metadata for
 * getBaseAttributes() to emit.
 *
 * This is what the admin section editor renders its whole form from — the
 * descriptors go straight into the same field-rendering switch the existing
 * resources/js/Config/crud/ configs use, which is why the descriptor `type`
 * reuses InputEnum values rather than inventing a parallel list.
 */
class SectionTypeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        /** @var SectionTypeContract $type */
        $type = $this->resource;

        return [
            'key' => $type->key(),
            'label' => $type->label(),
            'description' => $type->description(),
            'icon' => $type->icon(),
            'group' => $type->group(),
            'fields' => $type->fields(),
            'block_types' => $type->blockTypes(),
            'relations' => $type->relations(),
            'preview_component' => $type->previewComponent(),
            'defaults' => $type->defaults(),
        ];
    }
}

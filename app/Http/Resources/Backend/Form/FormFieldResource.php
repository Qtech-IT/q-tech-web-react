<?php

namespace App\Http\Resources\Backend\Form;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class FormFieldResource extends BaseResource
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
                    'name'             => $this->name,
                    'label'            => $this->label,
                    'hint_text'        => $this->hint_text,
                    'parent_id'        => $this->parent_id,
                    'input_type'       => $this->input_type,
                    'placeholder'      => $this->placeholder,
                    'description'      => $this->description,
                    'order_level'      => $this->order_level ?? 1,
                    'is_required'      => (bool) $this->is_required,
                    'is_read_only'     => (bool) $this->is_read_only,
                    'is_hidden'        => (bool) $this->is_hidden,
                    'default_value'    => $this->default_value,
                    'values'           => $this->values,
                    'validation_rules' => $this->validation_rules
                ];



        if($this->relationLoaded('parent') && $this->parent){
            $parent = $this->parent;
            $data['parent'] = [
                'id'    => $parent->id,
                'label' => $parent->label
            ];
        }


         if($this->relationLoaded('form') && $this->form){
            $form = $this->form;
            $data['form'] = [
                'id'    => $form->id,
                'name'  => $form->name
            ];
        }

        return $data;

    }

}

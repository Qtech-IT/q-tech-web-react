<?php

namespace App\Http\Services\Backend\Form;

use App\Enums\Common\Status;
use App\Enums\Settings\BulkActionType;
use App\Models\Form;
use App\Models\FormField;
use App\Traits\Common\ModelAction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Pagination\CursorPaginator;

use App\Enums\Settings\InputEnum;

class FormFieldService
{
    use ModelAction;

    

    /**
     * Summary of getAllFormFields
     * @param mixed $form
     * @return LengthAwarePaginator|Collection
     */
    public function getFieldsByForm(Form $form ,  bool $isCollection = false ): LengthAwarePaginator | Collection | CursorPaginator
    {
        
        return FormField::with(['form:id,name','parent:id,label'])
                        ->orderBy('order_level')
                        ->ofForm($form)
                        ->date()
                        ->search(['name','label'])
                        ->filter(['status','form:name','parent:name'])
                        ->fetch($isCollection);
    }


    /**
     * Summary of getActiveFormFields
     * @param array $columns
     * @return Collection
     */
    public function getActiveFormFields(array $columns = ['id','label']): Collection
    {
        return FormField::active()
                        ->orderBy('order_level','desc')
                        ->select($columns)
                        ->get();
    }



    /**
     * Summary of getSelectParentFormFields
     * @param Form $form
     * @param array $columns
     * @return Collection
     */
    public function getSelectParentFormFields(Form $form , array $columns = ['id','label'] , array $ignoreIds = []): Collection
    {
        return FormField::active()
                        ->whereNull('parent_id')
                        ->orderBy('order_level')
                        ->where('form_id',$form->id)
                        ->when(count($ignoreIds) > 0, fn (Builder $query) :Builder  => 
                                $query->whereNotIn('id', $ignoreIds))

                        ->whereIn('input_type',[InputEnum::SELECT->value, InputEnum::MULTI_SELECT->value])
                        ->select($columns) 
                        ->get();
    }


    /**
     * Summary of getStats
     * @return array{active: mixed, inactive: mixed, total: mixed, trashed: int}
     */
    public function getStats(Form $form): array
    {
        return [
            'total'    => FormField::query()->ofForm($form)->count(),
            'active'   => FormField::query()->ofForm($form)->active()->count(),
            'inactive' => FormField::query()->ofForm($form)->inactive()->count(),
            'required' => FormField::query()->ofForm($form)->where('is_required',true)->count()

        ];
    }

    
    /**
     * Summary of saveFormField
     * @param Request $request
     * @param Form $form
     * @param mixed $id
     * @return FormField
     */
    public function saveFormField(Request $request, Form $form , ?int $id = null): FormField
    {

        $formField = $id ? FormField::where('form_id',$form->id)->findOrFail($id) : new FormField();

        $formField->form_id          = $form->id;
        $formField->parent_id        = $request->input('parent_id');
        $formField->name             = $request->input('name');
        $formField->label            = $request->input('label');
        $formField->hint_text        = $request->input('hint_text');
        $formField->input_type       = $request->input('input_type');
        $formField->placeholder      = $request->input('placeholder');
        $formField->description      = $request->input('description');
        $formField->is_required      = (bool) $request->input('is_required');
        $formField->is_read_only     = (bool) $request->input('is_read_only');
        $formField->is_hidden        = (bool) $request->input('is_hidden');
        $formField->default_value    = $request->input('default_value');
        $formField->values           = $request->input('values');
        $formField->validation_rules = $request->input('validation_rules');
        $formField->status           = $request->input('status'); 
        $formField->order_level      = $request->input('order_level',0);        

        $formField->save();

        return $formField;
    }


    /**
     * Summary of deleteFormField
     * @param string $uuid
     * @return void
     */
    public function deleteFormField(int $formId , string $uuid): void
    {
        $formField = FormField::where('form_id',$formId)->findOrFailByUuid($uuid);
        $formField->delete();
        return;
    }


   
    /**
     * Summary of handleBulkAction
     * @param array $ids
     * @param string $action
     * @return mixed
     */
    public function handleBulkAction(array $ids, string $action): mixed
    {

        $query = FormField::whereIn('id', $ids);

        return match ($action) {
            BulkActionType::ACTIVE->value    => $this->bulkStatusChange($query, Status::ACTIVE),
            BulkActionType::INACTIVE->value  => $this->bulkStatusChange($query, Status::INACTIVE),
            BulkActionType::DELETE->value    => $this->bulkDelete($query ),

            default => throw new \Exception("Invalid action"),
        };
    }

    

    /**
     * Summary of bulkDelete
     * @param Builder $query
     * @return void
     */
    private function bulkDelete(Builder $query): void
    {
        $query->delete();
    }


    /**
     * Summary of getAdvanceFilter
     * @return array[]
     */
    public function getAdvanceFilterOptions(): array
    {
        return $this->getCommonFilters();
    }

}

<?php

namespace App\Http\Services\Backend\Form;

use App\Enums\Common\Status;
use App\Enums\Settings\BulkActionType;
use App\Models\Form;
use App\Traits\Common\ModelAction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class FormService
{
    use ModelAction;

    /**
     * Summary of getAllForms
     * @return LengthAwarePaginator|Collection
     */
    public function getAllForms(): LengthAwarePaginator | Collection
    {
        return Form::latest()
                    ->with(['createdBy:id,name', 'updatedBy:id,name'])
                    ->withCount(['fields'])
                    ->date()
                    ->search(['name'])
                    ->filter(['status'])
                    ->fetch();
    }

    /**
     * Summary of getActiveForms
     * @return Collection
     */
    public function getActiveForms(array $columns = ['id', 'name']): Collection
    {
        return Form::active()
                    ->latest()
                    ->select($columns)
                    ->get();
    }

    /**
     * Returns an array of form select options.
     *
     * @return array
     */
    public function getFormSelectOptions(): array
    {
        // Get all active forms
        $forms = $this->getActiveForms();

        // Map each form to an array of 'value' and 'label'
        // where 'value' is the form's ID and 'label' is the form's name
        $options = $forms->map(function (Form $form): array {
                        return [
                            'value' => (string) $form->id,
                            'label' => $form->name
                        ];
                    });

        // Convert the collection to an array
        return $options->toArray();
    }

    /**
     * Summary of getStats
     * @return array{active: mixed, inactive: mixed, total: mixed, trashed: int}
     */
    public function getStats(): array
    {
        return [
            'total'    => Form::recycle()->count(),
            'active'   => Form::recycle()->active()->count(),
            'inactive' => Form::recycle()->inactive()->count(),
        ];
    }

    

    /**
     * Summary of getAdvanceFilter
     * @return array[]
     */
    public function getAdvanceFilterOptions(): array
    {
        return  $this->getCommonFilters();
    }
}

<?php

namespace App\Http\Services\Backend;
use App\Enums\Notifications\NotificationLogStatus;
use App\Enums\Settings\BulkActionType;
use App\Enums\Settings\InputEnum;
use App\Models\NotificationLog;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class NotificationLogService
{


    /**
     * Summary of getAllLogs
     * @return LengthAwarePaginator|Collection
     */
    public function getAllLogs(): LengthAwarePaginator | Collection
    {
        return NotificationLog::latest()
                        ->with(['receiver'])
                        ->date()
                        ->search(['message'])
                        ->filter(['status'])
                        ->fetch();
    }

 
    
    /**
     * Summary of deleteLog
     * @param int $id
     * @return void
     */
    public function deleteLog(int $id): void
    {
        $notificationLog = NotificationLog::findOrFail($id);
        $notificationLog->delete();
    }


    /**
     * Get statistics
     */
    public function getStats(): array
    {
        return [
            'total'      => NotificationLog::count(),
            'processing' => NotificationLog::where('status', NotificationLogStatus::PROCESSING)->count(),
            'success'    => NotificationLog::where('status', NotificationLogStatus::SUCCESS)->count(),
            'failed'     => NotificationLog::where('status', NotificationLogStatus::FAILED)->count(),
        ];
    }





    /**
     * Summary of handleBulkAction
     * @param array $ids
     * @param string $action
     * @return mixed
     */
    public function handleBulkAction(array $ids, string $action): mixed
    {

        $query = NotificationLog::whereIn('id', $ids);

        return match ($action) {
            BulkActionType::DELETE->value   => $query->delete(),
            default => throw new \Exception("Invalid action"),
        };
    }


    /**
     * Get advance filter options
     */
    public function getAdvanceFilterOptions(): array
    {

         return [

            [
                'key'     => 'status',
                'label'   => translate('Status'),
                'type'    => InputEnum::SELECT->value,
                'options' => [
                                ['value' => '', 'label' => translate('All Status')],
                                ...NotificationLogStatus::options(),
                            ],
            ],

            [
                'key'     => 'date_range',
                'label'   => translate('Date'),
                'type'    => InputEnum::DATERANGE->value,
            ]
        ];
    }

   
}
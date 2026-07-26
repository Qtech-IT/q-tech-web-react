<?php

namespace App\Http\Services\Backend\Job;

use App\Enums\Settings\BulkActionType;
use App\Enums\Settings\InputEnum;
use App\Traits\Common\ModelAction;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class FailedJobService
{
    use ModelAction;

    /**
     * Get all failed jobs
     */
    public function getAllFailedJobs(): LengthAwarePaginator | Collection
    {

        $dateRangeString = request()->input('date_range');

        return DB::table('failed_jobs')
                ->orderBy('failed_at', 'desc')
                ->when(request('search'), function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('queue', 'like', "%{$search}%")
                        ->orWhere('exception', 'like', "%{$search}%")
                        ->orWhere('payload', 'like', "%{$search}%");
                    });
                })
                ->when(request('queue'), function ($query, $queue) {
                    $query->where('queue', $queue);
                })
                ->when(request('connection'), function ($query, $connection) {
                    $query->where('connection', $connection);
                })
                ->when($dateRangeString, function ($query)  use($dateRangeString) {

                    if (str_contains($dateRangeString, ' - ')) {
                        [$from, $to] = explode(' - ', $dateRangeString);

                        $startDate = Carbon::createFromFormat('m/d/Y', trim($from))->startOfDay();
                        $endDate   = Carbon::createFromFormat('m/d/Y', trim($to))->endOfDay();

                        return $query->whereBetween('created_at', [$startDate, $endDate]);
                    }
                    return $query;
                })
                ->paginate(paginateNumber());
    }

    /**
     * Get failed job by ID
     */
    public function getFailedJobById(string $id)
    {
        return DB::table('failed_jobs')->where('id', $id)->firstOrFail();
    }

    /**
     * Delete a failed job
     */
    public function deleteFailedJob(string $id): void
    {
        DB::table('failed_jobs')->where('id', $id)->delete();
    }

    /**
     * Retry a failed job
     */
    public function retryFailedJob(string $id): void
    {
        Artisan::call('queue:retry', ['id' => [$id]]);
    }

    /**
     * Retry all failed jobs
     */
    public function retryAllFailedJobs(): int
    {
        $count = DB::table('failed_jobs')->count();
        Artisan::call('queue:retry', ['id' => ['all']]);
        return $count;
    }

    /**
     * Clear all failed jobs
     */
    public function clearAllFailedJobs(): int
    {
        $count = DB::table('failed_jobs')->count();
        DB::table('failed_jobs')->truncate();
        return $count;
    }

    /**
     * Get statistics
     */
    public function getStats(): array
    {
        $total = DB::table('failed_jobs')->count();
        
        $byQueue = DB::table('failed_jobs')
                        ->select('queue', DB::raw('count(*) as count'))
                        ->groupBy('queue')
                        ->get();

        $byConnection = DB::table('failed_jobs')
                        ->select('connection', DB::raw('count(*) as count'))
                        ->groupBy('connection')
                        ->get();

        $today = DB::table('failed_jobs')
                        ->whereDate('failed_at', today())
                        ->count();

        $thisWeek = DB::table('failed_jobs')
                        ->whereBetween('failed_at', [now()->startOfWeek(), now()->endOfWeek()])
                        ->count();

        $thisMonth = DB::table('failed_jobs')
                        ->whereMonth('failed_at', now()->month)
                        ->whereYear('failed_at', now()->year)
                        ->count();

        $queues = [];
        foreach ($byQueue as $item) {
            $queues[$item->queue] = $item->count;
        }

        $connections = [];
        foreach ($byConnection as $item) {
            $connections[$item->connection] = $item->count;
        }

        return [
            'total'       => $total,
            'today'       => $today,
            'this_week'   => $thisWeek,
            'this_month'  => $thisMonth,
            'queues'      => $queues,
            'connections' => $connections,
        ];
    }

    /**
     * Handle bulk actions
     */
    public function handleBulkAction(array $ids, string $action): mixed
    {
        return match ($action) {
            BulkActionType::DELETE->value => DB::table('failed_jobs')->whereIn('id', $ids)->delete(),
            'retry' => Artisan::call('queue:retry', ['id' => $ids]),
            default => throw new \Exception("Invalid action"),
        };
    }

    /**
     * Get advance filter options
     */
    public function getAdvanceFilterOptions(): array
    {
        $queues = DB::table('failed_jobs')
                        ->select('queue')
                        ->distinct()
                        ->pluck('queue')
                        ->map(fn($queue) => ['value' => $queue, 'label' => ucfirst($queue)])
                        ->toArray();

        $connections = DB::table('failed_jobs')
                        ->select('connection')
                        ->distinct()
                        ->pluck('connection')
                        ->map(fn($conn) => ['value' => $conn, 'label' => ucfirst($conn)])
                        ->toArray();

        return [
            [
                'key'     => 'queue',
                'label'   => translate('Queue'),
                'type'    => InputEnum::SELECT->value,
                'options' => [
                    ['value' => '', 'label' => translate('All Queues')],
                    ...$queues,
                ],
            ],
            [
                'key'     => 'connection',
                'label'   => translate('Connection'),
                'type'    => InputEnum::SELECT->value,
                'options' => [
                    ['value' => '', 'label' => translate('All Connections')],
                    ...$connections,
                ],
            ],
            [
                'key'   => 'date_range',
                'label' => translate('Date'),
                'type'  => InputEnum::DATERANGE->value,
            ]
        ];
    }
}
<?php

namespace App\Http\Services\Backend\Job;

use App\Enums\Settings\BulkActionType;
use App\Enums\Settings\InputEnum;
use App\Traits\Common\ModelAction;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class JobService
{
    use ModelAction;

    /**
     * Get all jobs
     */
    public function getAllJobs(): LengthAwarePaginator | Collection
    {

        $dateRangeString = request()->input('date_range');

        return DB::table('jobs')
                    ->orderBy('created_at', 'desc')

                    ->when(request('search'), function ($query, $search) {
                        $query->where(function ($q) use ($search) {
                            $q->where('queue', 'like', "%{$search}%")
                            ->orWhere('payload', 'like', "%{$search}%");
                        });
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
                    ->when(request('queue'), function ($query, $queue) {
                        $query->where('queue', $queue);
                    })
                    ->paginate(paginateNumber());
    }

    /**
     * Get job by ID
     */
    public function getJobById(string $id)
    {
        return DB::table('jobs')->where('id', $id)->firstOrFail();
    }

    /**
     * Delete a job
     */
    public function deleteJob(string $id): void
    {
        DB::table('jobs')->where('id', $id)->delete();
    }

    /**
     * Retry a job (move to queue again)
     */
    public function retryJob(string $id): void
    {
        $job     = $this->getJobById($id);
        $payload = json_decode($job->payload, true);

        DB::table('jobs')->where('id', $id)->update([
            'attempts'    => 0,
            'reserved_at' => null,
        ]);
    }


    /**
     * Run/Execute a job immediately
     */
    public function runJob(string $id): void
    {
        $job = $this->getJobById($id);

        if ($job->reserved_at !== null) {
            throw new \Exception('Job is currently running and cannot be executed.');
        }
        
        // Decode the payload
        $payload = json_decode($job->payload, true);
        
        // Unserialize the job command
        $command = unserialize($payload['data']['command']);
        
        // Delete the job from queue first
        DB::table('jobs')->where('id', $id)->delete();
        
        // Execute the job immediately
        dispatch_sync($command);
    }

    /**
     * Get statistics
     */
    public function getStats(): array
    {
        $total   = DB::table('jobs')->count();
        $byQueue = DB::table('jobs')
                        ->select('queue', DB::raw('count(*) as count'))
                        ->groupBy('queue')
                        ->get();

        $queues = [];
        foreach ($byQueue as $item) {
            $queues[$item->queue] = $item->count;
        }

        return [
            'total'   => $total,
            'default' => $queues['default'] ?? 0,
            'high'    => $queues['high'] ?? 0,
            'low'     => $queues['low'] ?? 0,
            'queues'  => $queues,
        ];
    }

    /**
     * Handle bulk actions
     */
    public function handleBulkAction(array $ids, string $action): mixed
    {
        $query = DB::table('jobs')->whereIn('id', $ids);

        return match ($action) {
            BulkActionType::DELETE->value => $query->delete(),
            default => throw new \Exception("Invalid action"),
        };
    }

    /**
     * Get advance filter options
     */
    public function getAdvanceFilterOptions(): array
    {
        $queues = DB::table('jobs')
                        ->select('queue')
                        ->distinct()
                        ->pluck('queue')
                        ->map(fn($queue) => ['value' => $queue, 'label' => ucfirst($queue)])
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
                'key'   => 'date_range',
                'label' => translate('Date'),
                'type'  => InputEnum::DATERANGE->value,
            ]
        ];
    }
}
<?php

namespace App\Jobs;

use App\Http\Services\Backend\Marketing\BulkMailService;
use App\Models\NotificationTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

/**
 * Sends one chunk of a large bulk send off the request thread.
 *
 * Only used above `BulkMailController::INLINE_LIMIT` — a smaller send runs
 * inline so its logs appear immediately. The controller resolves the audience
 * once and hands each job a plain list of `[id, email, name]` rows; every
 * recipient is then logged and queued individually by `BulkMailService::
 * sendBatch()`, so one bad address cannot fail the chunk.
 */
class SendBulkMarketingMail implements ShouldQueue
{
    use Queueable;

    /**
     * @param  class-string  $modelClass
     * @param  array<int, array{id: int|string, email: string, name: string|null}>  $recipients
     */
    public function __construct(
        public int $templateId,
        public string $modelClass,
        public array $recipients,
    ) {}

    public function handle(BulkMailService $service): void
    {
        $template = NotificationTemplate::find($this->templateId);

        if (! $template) {
            Log::warning('Bulk mail aborted: template missing', ['template' => $this->templateId]);

            return;
        }

        $service->sendBatch($template, $this->modelClass, $this->recipients);
    }
}

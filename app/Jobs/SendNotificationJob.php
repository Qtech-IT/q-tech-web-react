<?php

namespace App\Jobs;

use App\Enums\Notifications\NotificationChannel;
use App\Enums\Notifications\NotificationLogStatus;
use App\Models\NotificationLog;
use App\Notify\SendMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

/**
 * Class SendNotificationJob
 *
 * This job handles sending notifications based on the configured gateway.
 * It supports sending:
 *   - Emails via MAIL_GATEWAY
 *   - Push notifications via FIREBASE_GATEWAY
 *
 * The job retrieves the receiver from the NotificationLog instance.
 * If no receiver is available, it can fallback to custom data.
 */
class SendNotificationJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     *
     * @param NotificationLog $log The notification log containing the message and receiver info.
     */
    public function __construct(public NotificationLog $log)
    {
        $this->log = $log;
    }

    /**
     * Execute the job.
     *
     * Determines the receiver and gateway type, then dispatches
     * the notification using the appropriate notification service.
     */
    public function handle(): void
    {
        // Determine the receiver for the notification

        $receiverInstance = $this->log?->receiver ?: $this->log->custom_data;

        $channel = $this->log->channel;

        if ($this->log->gateway) {
            switch (true) {
                case ($channel === NotificationChannel::EMAIL && $receiverInstance):
                    SendMail::send($this->log, $receiverInstance);
                    break;
            }

            return ;
        }

        $channel = key_to_value($channel->value);

        $this->log->update([
            'status' => NotificationLogStatus::FAILED,
            'gateway_response' => (object) [
                                        'status' => false,
                                        'message' => $channel . translate(' configuration is missing.')
                                    ]
        ]);
    }
}

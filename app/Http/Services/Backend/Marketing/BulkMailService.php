<?php

namespace App\Http\Services\Backend\Marketing;

use App\Enums\Notifications\NotificationChannel;
use App\Enums\Settings\SettingKey;
use App\Models\AppSetting;
use App\Models\NotificationTemplate;
use App\Traits\Common\Notify;
use Illuminate\Database\Eloquent\Model;

/**
 * Sends one notification template to many external recipients — newsletter
 * subscribers or contact enquirers — reusing the platform's own notification
 * pipeline (`Notify::createLog()` → `SendNotificationJob` → `SendMail`).
 *
 * WHY IT DOES NOT CALL `sendNotification()`
 * ----------------------------------------
 * That method gates on `template.email_notification === ACTIVE`, which is the
 * switch for TRANSACTIONAL notification types (password reset, verification).
 * A marketing blast is a deliberate, permission-gated admin action against a
 * template an operator chose on purpose — the transactional switch is not the
 * right gate for it — so this builds the message and logs it directly.
 *
 * WHY THE RECIPIENT IS `custom_data`, NOT a `receiver`
 * --------------------------------------------------
 * `NotificationLog.receiver` is a morph to a `User`. A `Subscriber` or a
 * `ContactSubmission` is not one, so the address rides in `custom_data.email`
 * and `SendNotificationJob` falls through to that path.
 */
class BulkMailService
{
    use Notify;

    /**
     * Queue one recipient's copy and stamp `mailed_at` on the source row.
     *
     * @param  class-string<Model>  $modelClass
     * @param  array<string, string>  $codes  Extra `{{placeholder}}` values.
     */
    public function sendOne(
        NotificationTemplate $template,
        string $modelClass,
        int|string $recordId,
        string $email,
        ?string $name,
        array $codes = [],
    ): void {
        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return;
        }

        $gateway = AppSetting::where('slug', SettingKey::MAIL_CONFIGURATION->value)->first();

        // Per-recipient `{{name}}` — blank for subscribers, who have no name.
        $codes = array_merge(['name' => $name ?? ''], $codes);

        $subject = $this->replaceSubjectPlaceholders($template->subject, $codes);

        $message = $this->replaceMessagePlaceholders(
            (string) $template->mail_body,
            SettingKey::DEFAULT_MAIL_TEMPLATE->value,
            $codes,
            (object) ['username' => $name ?: null],
        );

        $this->createLog(
            $message,
            [
                'receiver_model' => null,
                'custom_data' => [
                    'subject' => $subject,
                    'email' => $email,
                    'username' => $name,
                ],
            ],
            $gateway,
            NotificationChannel::EMAIL,
        );

        $modelClass::query()->whereKey($recordId)->update(['mailed_at' => now()]);
    }

    /**
     * Send a whole batch now, in the request cycle.
     *
     * Each recipient gets a `NotificationLog` row created SYNCHRONOUSLY — the
     * same as every transactional notification in the app — so the operator
     * sees the send in Notification Logs immediately, whether or not a queue
     * worker is running. Only the actual mail delivery is queued (per row, via
     * `createLog()` → `SendNotificationJob`). One bad recipient is reported and
     * skipped, never aborts the batch.
     *
     * @param  class-string<Model>  $modelClass
     * @param  array<int, array{id: int|string, email: string, name: string|null}>  $recipients
     * @return int rows for which a log was created
     */
    public function sendBatch(NotificationTemplate $template, string $modelClass, array $recipients): int
    {
        $sent = 0;

        foreach ($recipients as $recipient) {
            try {
                $this->sendOne(
                    $template,
                    $modelClass,
                    $recipient['id'],
                    $recipient['email'],
                    $recipient['name'] ?? null,
                );
                $sent++;
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return $sent;
    }

    /**
     * The template's subject with placeholders left as-is — a campaign template
     * usually has none in the subject, and showing `{{code}}` is clearer than
     * guessing a value for a preview.
     */
    public function renderSubject(NotificationTemplate $template): string
    {
        return (string) $template->subject;
    }

    /**
     * The full wrapped HTML an operator would receive, with sample values for
     * the standard placeholders.
     */
    public function renderPreview(NotificationTemplate $template): string
    {
        return $this->replaceMessagePlaceholders(
            (string) $template->mail_body,
            SettingKey::DEFAULT_MAIL_TEMPLATE->value,
            ['name' => 'Sample Recipient'],
            (object) ['username' => 'Sample Recipient'],
        );
    }
}

<?php

namespace App\Http\Services\Frontend;

use App\Enums\Marketing\ContactStatus;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Public contact-form submissions.
 *
 * WHY THE ROW IS WRITTEN BEFORE ANY MAIL IS SENT
 * ----------------------------------------------
 * The record is the source of truth; the inbox notification is a convenience.
 * If mail delivery is down the enquiry must still be recoverable from the
 * admin, so the row is committed first and the alert is sent after — and a
 * mail failure is logged, never surfaced to the visitor.
 *
 * WHY THE RESPONSE IS ALWAYS THE SAME
 * ----------------------------------
 * Like `SubscriptionService`, the caller gets one success shape regardless of
 * what happened, so a public form cannot be used to probe anything.
 */
class ContactService
{
    /**
     * Record an enquiry and notify the destination inbox.
     *
     * `$isSpam` is set by the controller when the honeypot was tripped. Such a
     * submission is STILL SAVED — as `spam`, and with no inbox alert — never
     * dropped: a real person whose browser or password manager autofilled the
     * hidden field would otherwise vanish without trace. An operator can move a
     * false positive back to `new` from the admin.
     *
     * @param  array{name: string, email: string, phone?: string|null, company?: string|null, message: string, source?: string|null}  $data
     */
    public function submit(array $data, Request $request, ?string $notifyEmail = null, bool $isSpam = false): ContactSubmission
    {
        $submission = ContactSubmission::create([
            'site_id' => (int) config('cms.site_id'),
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'company' => $data['company'] ?? null,
            'message' => $data['message'],
            'locale' => app()->getLocale(),
            'source' => $data['source'] ?? null,
            'ip' => $request->ip(),
            'user_agent' => mb_substr((string) $request->userAgent(), 0, 512),
        ]);

        if ($isSpam) {
            // `handling_status` is guarded — it is never mass assigned.
            $submission->forceFill(['handling_status' => ContactStatus::SPAM])->save();

            Log::info('Contact enquiry flagged as spam by honeypot', [
                'submission' => $submission->uuid,
                'ip' => $request->ip(),
            ]);

            return $submission;
        }

        $this->alertInbox($submission, $notifyEmail);

        return $submission;
    }

    /**
     * Best-effort alert to the destination inbox. A delivery failure must not
     * fail the request — the row is already saved.
     */
    protected function alertInbox(ContactSubmission $submission, ?string $notifyEmail): void
    {
        $inbox = $notifyEmail
            ?: (string) (site_settings('email') ?: config('mail.from.address'));

        if (! filter_var($inbox, FILTER_VALIDATE_EMAIL)) {
            return;
        }

        try {
            Mail::raw(
                "New contact enquiry\n\n"
                    ."Name: {$submission->name}\n"
                    ."Email: {$submission->email}\n"
                    .'Phone: '.($submission->phone ?: '—')."\n"
                    .'Company: '.($submission->company ?: '—')."\n\n"
                    .$submission->message,
                function ($mail) use ($inbox, $submission) {
                    $mail->to($inbox)
                        ->replyTo($submission->email, $submission->name)
                        ->subject('New enquiry from '.$submission->name);
                }
            );
        } catch (\Throwable $e) {
            Log::warning('Contact enquiry inbox alert failed', [
                'submission' => $submission->uuid,
                'error' => $e->getMessage(),
            ]);
        }
    }
}

<?php

namespace App\Http\Controllers\Backend\Marketing;

use App\Enums\Marketing\ContactStatus;
use App\Enums\Marketing\SubscriberStatus;
use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Services\Backend\Marketing\BulkMailService;
use App\Http\Services\Backend\Marketing\ContactSubmissionService;
use App\Http\Services\Backend\Marketing\SubscriberService;
use App\Jobs\SendBulkMarketingMail;
use App\Models\ContactSubmission;
use App\Models\NotificationTemplate;
use App\Models\Subscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Response;

/**
 * Campaign sends — one notification template to many enquirers or subscribers.
 *
 * A dedicated screen rather than a table bulk-action: a marketing send is a
 * deliberate act with an audience, a template and a preview, not a row
 * operation. The recipient list is resolved server-side from the chosen
 * audience filter every time — the browser never supplies addresses.
 */
class BulkMailController extends Controller
{
    public function __construct(
        protected ContactSubmissionService $contacts,
        protected SubscriberService $subscribers,
    ) {}

    protected function authorizeAny(): void
    {
        abort_unless(
            auth()->user()?->hasPermissionTo('contact-submission.reply')
                || auth()->user()?->hasPermissionTo('subscriber.mail'),
            403,
        );
    }

    public function index(): Response
    {
        $this->authorizeAny();

        $templates = NotificationTemplate::query()
            ->whereNotNull('mail_body')
            ->orderBy('name')
            ->get(['id', 'uuid', 'name', 'subject']);

        return AppResponse::asSuccess()
            ->withComponent('Backend/Marketing/BulkMail', [
                'title' => translate('Send Campaign'),
                'templates' => $templates,
                'audiences' => [
                    'subscribers' => [
                        'label' => translate('Newsletter Subscribers'),
                        'eligible' => Subscriber::where('subscription_status', SubscriberStatus::SUBSCRIBED->value)
                            ->where('status', 'active')->count(),
                        'can' => (bool) auth()->user()?->hasPermissionTo('subscriber.mail'),
                    ],
                    'contacts' => [
                        'label' => translate('Contact Enquiries'),
                        'eligible' => ContactSubmission::whereNotIn('handling_status', [
                            ContactStatus::SPAM->value, ContactStatus::ARCHIVED->value,
                        ])->count(),
                        'can' => (bool) auth()->user()?->hasPermissionTo('contact-submission.reply'),
                    ],
                ],
            ])->build();
    }

    /**
     * Render one template filled with sample data, for the preview pane.
     */
    public function preview(Request $request, BulkMailService $service): RedirectResponse
    {
        $this->authorizeAny();

        $template = NotificationTemplate::where('uuid', $request->string('template'))->firstOrFail();

        return AppResponse::asSuccess()
            ->withData([
                'preview' => [
                    'subject' => $service->renderSubject($template),
                    'html' => $service->renderPreview($template),
                ],
            ])
            ->build();
    }

    /**
     * Above this many recipients the send is handed to the queue in chunks
     * rather than run in the request. Below it, run inline so the logs — and
     * any misconfiguration — show up immediately.
     */
    protected const INLINE_LIMIT = 400;

    public function send(Request $request, BulkMailService $mailer): RedirectResponse
    {
        $validated = $request->validate([
            'audience' => ['required', Rule::in(['subscribers', 'contacts'])],
            'template' => ['required', 'string', 'exists:notification_templates,uuid'],
            'mode' => ['required', Rule::in(['send', 'mark'])],
            'ids' => ['nullable', 'array'],
            'ids.*' => ['integer'],
        ]);

        $isContacts = $validated['audience'] === 'contacts';

        abort_unless(
            $isContacts
                ? auth()->user()?->hasPermissionTo('contact-submission.reply')
                : auth()->user()?->hasPermissionTo('subscriber.mail'),
            403,
        );

        $service = $isContacts ? $this->contacts : $this->subscribers;
        $modelClass = $isContacts ? ContactSubmission::class : Subscriber::class;

        $recipients = $service->bulkRecipients($validated['ids'] ?? null);

        if ($recipients === []) {
            return AppResponse::asError()->withMessage(translate('No recipients matched that audience.'))->build();
        }

        if ($validated['mode'] === 'mark') {
            $service->markMailed(array_column($recipients, 'id'));

            return AppResponse::asSuccess()
                ->withMessage(translate(':count records marked as contacted.', ['count' => count($recipients)]))
                ->build();
        }

        $template = NotificationTemplate::where('uuid', $validated['template'])->firstOrFail();

        if (count($recipients) > self::INLINE_LIMIT) {
            collect($recipients)->chunk(200)->each(
                fn ($chunk) => SendBulkMarketingMail::dispatch($template->id, $modelClass, $chunk->values()->all())
            );

            return AppResponse::asSuccess()
                ->withMessage(translate(':count emails queued for delivery — run the queue worker to send them.', ['count' => count($recipients)]))
                ->build();
        }

        $sent = $mailer->sendBatch($template, $modelClass, $recipients);

        return AppResponse::asSuccess()
            ->withMessage(translate(':count emails logged and queued for delivery.', ['count' => $sent]))
            ->build();
    }
}

<?php

namespace App\Http\Controllers\Frontend;

use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\ContactRequest;
use App\Http\Services\Frontend\ContactService;
use App\Models\PageSection;
use Symfony\Component\HttpFoundation\Response;

class ContactController extends Controller
{
    public function __construct(
        protected ContactService $contact,
    ) {}

    /**
     * Record a contact enquiry.
     *
     * Thin by contract: validation is `ContactRequest`, the write and the
     * inbox alert are `ContactService`, rate limiting is on the route.
     * Redirects back so the Inertia form keeps its place.
     *
     * THE DESTINATION INBOX IS RESOLVED SERVER-SIDE from the section named in
     * the request — never from an address the request carried, which would
     * make the form an open relay.
     */
    public function store(ContactRequest $request): Response
    {
        // Honeypot: a filled hidden field is almost always a bot. We still
        // record the enquiry — as spam, with no inbox alert — rather than drop
        // it, because a browser or password manager that autofills the hidden
        // field would otherwise make a real person disappear with no trace and
        // no error. The response is identical either way, so a scraper learns
        // nothing.
        $this->contact->submit(
            $request->safe()->except(['section', 'hp_channel', 'consent']),
            $request,
            $this->resolveInbox($request->input('section')),
            isSpam: $this->isBot($request),
        );

        return AppResponse::asSuccess()
            ->withMessage(translate('Thanks — your message is with us. We reply within one working day.'))
            ->build();
    }

    protected function isBot(ContactRequest $request): bool
    {
        return filled($request->input('hp_channel'));
    }

    /**
     * The `notify_email` an editor set on the given section, if it is a real
     * address. Anything else falls through to the site default in the service.
     */
    protected function resolveInbox(?string $sectionUuid): ?string
    {
        if (! $sectionUuid) {
            return null;
        }

        $section = PageSection::query()
            ->where('uuid', $sectionUuid)
            ->first(['settings']);

        $email = $section?->settings['notify_email'] ?? null;

        return is_string($email) && filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : null;
    }
}

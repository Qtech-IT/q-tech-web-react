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
        // Honeypot: a filled hidden field means a bot. Answer exactly as we
        // would a real submission — same message, same status — but store
        // nothing, so a scraper cannot tell the trap from a success.
        if (!$this->isBot($request)) {
            $this->contact->submit(
                $request->safe()->except(['section', 'hp_channel', 'consent']),
                $request,
                $this->resolveInbox($request->input('section')),
            );
        }

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
        if (!$sectionUuid) {
            return null;
        }

        $section = PageSection::query()
            ->where('uuid', $sectionUuid)
            ->first(['settings']);

        $email = $section?->settings['notify_email'] ?? null;

        return is_string($email) && filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : null;
    }
}

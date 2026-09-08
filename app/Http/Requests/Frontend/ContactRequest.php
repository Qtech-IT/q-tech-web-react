<?php

namespace App\Http\Requests\Frontend;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The public contact form.
 *
 * PUBLIC AND UNAUTHENTICATED — every rule here defends that. Rate limiting is
 * on the route; this is the content guard.
 *
 * `hp_channel` is a HONEYPOT — rendered off-screen, empty for a person, filled
 * by naive bots. It is NOT validated here: a hard `prohibited` failure also
 * caught real people whose browser or password manager autofilled the hidden
 * field. The controller checks it instead and silently drops a filled one, so
 * a scraper learns nothing and a mis-autofilled human is not blocked.
 *
 * `section` is the UUID of the `contact.*` section the form was rendered from.
 * The controller resolves the destination inbox from THAT section's
 * admin-controlled settings — the recipient address is never taken from the
 * request, or the form is an open relay.
 */
class ContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            // `email:rfc` only — NOT `dns`. The DNS check rejects perfectly
            // valid addresses whenever the resolver is slow, rate-limited or
            // offline, and a bounced enquiry the visitor never sees is worse
            // than the odd typo'd domain reaching the inbox.
            'email' => ['required', 'string', 'email:rfc', 'max:191'],
            'phone' => ['nullable', 'string', 'max:40', 'regex:/^[0-9+()\-.\s]{4,40}$/'],
            'company' => ['nullable', 'string', 'max:150'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],

            // Editor-set on the section, alpha-dash so it cannot be a sink.
            'source' => ['nullable', 'string', 'max:100', 'regex:/^[A-Za-z0-9._-]+$/'],

            // Points at the section whose settings hold the destination inbox.
            'section' => ['nullable', 'string', 'uuid'],

            // Explicit contact consent — required TRUE, not merely present.
            'consent' => ['accepted'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => translate('Please tell us your name.'),
            'email.required' => translate('Enter your email address.'),
            'email.email' => translate('That does not look like a working email address.'),
            'message.required' => translate('Let us know what you are after.'),
            'message.min' => translate('A sentence or two of context helps us route your enquiry.'),
            'consent.accepted' => translate('Please confirm you are happy for us to reply.'),
        ];
    }

    protected function prepareForValidation(): void
    {
        $email = $this->input('email');

        $this->merge([
            'email' => is_string($email) ? mb_strtolower(trim($email)) : $email,
        ]);
    }
}

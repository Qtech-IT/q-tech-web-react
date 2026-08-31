<?php

namespace App\Http\Requests\Frontend;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The newsletter form.
 *
 * PUBLIC AND UNAUTHENTICATED, which is what every rule here is defending
 * against. Rate limiting lives on the route; this is the content guard.
 *
 * `website` is a HONEYPOT, not a field a human ever sees — it is rendered
 * off-screen and left empty by a person, filled in by most naive bots.
 * Rejecting a filled honeypot here (rather than in the service) keeps the bot
 * out of the service entirely, and `prohibited` produces the same 422 shape as
 * any other validation failure so a scraper learns nothing from the response.
 */
class SubscribeRequest extends FormRequest
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
            /*
             * `email:rfc,dns` and not merely `email`: the whole point of this
             * table is that we can post to these addresses later, and a
             * syntactically valid address at a domain with no MX record is a
             * guaranteed bounce that also damages sender reputation.
             */
            'email' => ['required', 'string', 'email:rfc,dns', 'max:191'],

            // Editor-set on the section, so attribution needs no deploy. Kept
            // short and alpha-dash so it cannot become a free-text sink.
            'source' => ['nullable', 'string', 'max:100', 'regex:/^[A-Za-z0-9._-]+$/'],

            // Honeypot. A human never sees this input.
            'website' => ['prohibited'],

            // Explicit opt-in. Required to be TRUE, not merely present — an
            // unchecked consent box is a refusal, and accepting it would make
            // every row in the table indefensible.
            'consent' => ['accepted'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => translate('Enter your email address.'),
            'email.email' => translate('That does not look like a working email address.'),
            'consent.accepted' => translate('Please confirm you would like to receive our emails.'),
            // Deliberately vague: telling a bot it tripped a honeypot tells it
            // how to pass next time.
            'website.prohibited' => translate('We could not process that. Please try again.'),
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

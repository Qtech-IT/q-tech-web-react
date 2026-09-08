<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The contact hub — the working part of a contact page: an enquiry form beside
 * the ways to reach the company, a map, and a "book a call" scheduler embed.
 *
 * EVERYTHING IS A FIELD
 * ---------------------
 * The destination inbox, the scheduler URL, the map location, the intro copy,
 * every contact detail and the form's success message are all editable here —
 * no code change moves the pin, swaps the Calendly link, or points enquiries
 * at a different mailbox.
 *
 * THE DESTINATION INBOX IS NOT SENT BY THE BROWSER
 * -----------------------------------------------
 * `notify_email` lives in the section's settings. `ContactController` reads it
 * from the stored section, keyed by the section UUID the form posts — the
 * address itself never travels in the request, or the form is an open relay.
 *
 * THE SCHEDULER IS AN IFRAME TO A URL THE EDITOR PASTES
 * ---------------------------------------------------
 * Calendly, Brevo Meetings, SavvyCal — all expose an embeddable URL. The field
 * takes that URL and the component frames it; there is no per-vendor
 * integration and switching providers is an edit.
 */
class ContactHubType implements SectionTypeContract
{
    public function key(): string
    {
        return 'contact.hub';
    }

    public function label(): string
    {
        return translate('Contact Hub');
    }

    public function description(): string
    {
        return translate('An enquiry form beside the ways to reach you, a map, and a scheduler embed. Every address, link and pin is editable here.');
    }

    public function icon(): string
    {
        return 'mail';
    }

    public function group(): string
    {
        return translate('Conversion');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function fields(): array
    {
        return [
            SectionField::make(
                name: 'eyebrow',
                label: translate('Eyebrow'),
                type: InputEnum::TEXT->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:191'],
            ),

            SectionField::make(
                name: 'heading',
                label: translate('Headline'),
                type: InputEnum::TEXT->value,
                store: FieldStore::COLUMN,
                translatable: true,
                required: true,
                rules: ['max:200'],
            ),

            SectionField::make(
                name: 'heading_highlight',
                label: translate('Highlighted Words'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:255'],
                help: translate('Comma-separated words from the headline to accent. Plain text only.'),
            ),

            SectionField::make(
                name: 'subheading',
                label: translate('Intro'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:600'],
                help: translate('One or two sentences above the form — who should get in touch and what happens next.'),
            ),

            SectionField::make(
                name: 'detail',
                label: translate('Contact Details'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
            ),

            // --- Form --------------------------------------------------------

            SectionField::make(
                name: 'notify_email',
                label: translate('Send Enquiries To'),
                type: InputEnum::EMAIL->value,
                store: FieldStore::SETTINGS,
                rules: ['nullable', 'email', 'max:191'],
                default: null,
                group: 'Form',
                help: translate('The inbox that receives a copy of each enquiry. Leave empty to use the site contact address from Settings.'),
            ),

            SectionField::make(
                name: 'form_source',
                label: translate('Attribution Tag'),
                type: InputEnum::TEXT->value,
                store: FieldStore::SETTINGS,
                rules: ['nullable', 'string', 'max:100', 'regex:/^[A-Za-z0-9._-]+$/'],
                default: 'contact-page',
                group: 'Form',
                help: translate('Stored on every enquiry from this form, e.g. "contact-page". Letters, numbers, dot, dash, underscore.'),
            ),

            SectionField::make(
                name: 'button_label',
                label: translate('Submit Button Label'),
                type: InputEnum::TEXT->value,
                store: FieldStore::SETTINGS,
                translatable: false,
                rules: ['nullable', 'string', 'max:60'],
                default: 'Send Enquiry',
                group: 'Form',
            ),

            SectionField::make(
                name: 'success_message',
                label: translate('Success Message'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:300'],
                group: 'Form',
                help: translate('Shown in place of the form after a successful send.'),
            ),

            SectionField::make(
                name: 'show_company',
                label: translate('Ask For Company'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: true,
                group: 'Form',
            ),

            SectionField::make(
                name: 'show_phone',
                label: translate('Ask For Phone'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: true,
                group: 'Form',
            ),

            SectionField::make(
                name: 'consent_label',
                label: translate('Consent Checkbox Label'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:255'],
                default: null,
                group: 'Form',
                help: translate('The wording beside the required consent checkbox.'),
            ),

            // --- Scheduler -------------------------------------------------

            SectionField::make(
                name: 'meeting_url',
                label: translate('Scheduler URL'),
                type: InputEnum::URL->value,
                store: FieldStore::SETTINGS,
                rules: ['nullable', 'url', 'max:500'],
                default: null,
                group: 'Scheduler',
                help: translate('An embeddable booking link — Calendly, Brevo Meetings, SavvyCal. Leave empty to hide the scheduler.'),
            ),

            SectionField::make(
                name: 'meeting_heading',
                label: translate('Scheduler Heading'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:120'],
                default: null,
                group: 'Scheduler',
            ),

            SectionField::make(
                name: 'meeting_text',
                label: translate('Scheduler Text'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:300'],
                default: null,
                group: 'Scheduler',
            ),

            // --- Map -----------------------------------------------------------

            SectionField::make(
                name: 'show_map',
                label: translate('Show Map'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: false,
                group: 'Map',
            ),

            SectionField::make(
                name: 'map_address',
                label: translate('Address'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:300'],
                default: null,
                group: 'Map',
                help: translate('Shown beside the map and used for the "get directions" link.'),
            ),

            SectionField::make(
                name: 'map_lat',
                label: translate('Latitude'),
                type: InputEnum::TEXT->value,
                store: FieldStore::SETTINGS,
                rules: ['nullable', 'numeric', 'between:-90,90'],
                default: null,
                group: 'Map',
                help: translate('Decimal degrees, e.g. 51.5074. Required for the map to render.'),
            ),

            SectionField::make(
                name: 'map_lng',
                label: translate('Longitude'),
                type: InputEnum::TEXT->value,
                store: FieldStore::SETTINGS,
                rules: ['nullable', 'numeric', 'between:-180,180'],
                default: null,
                group: 'Map',
                help: translate('Decimal degrees, e.g. -0.1278.'),
            ),

            SectionField::make(
                name: 'map_zoom',
                label: translate('Zoom'),
                type: InputEnum::NUMBER->value,
                store: FieldStore::SETTINGS,
                rules: ['nullable', 'integer', 'between:1,19'],
                default: 14,
                group: 'Map',
            ),

            // --- Layout ------------------------------------------------------

            SectionField::make(
                name: 'form_side',
                label: translate('Form Side'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'start', 'label' => translate('Left')],
                    ['value' => 'end', 'label' => translate('Right')],
                ],
                default: 'start',
                group: 'Layout',
            ),

            SectionField::make(
                name: 'theme',
                label: translate('Section Theme'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'default', 'label' => translate('Default')],
                    ['value' => 'subtle', 'label' => translate('Subtle Band')],
                    ['value' => 'inverted', 'label' => translate('Inverted')],
                ],
                default: 'default',
                group: 'Layout',
            ),

            SectionField::make(
                name: 'spacing',
                label: translate('Vertical Spacing'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'sm', 'label' => translate('Compact')],
                    ['value' => 'default', 'label' => translate('Default')],
                    ['value' => 'lg', 'label' => translate('Generous')],
                ],
                default: 'lg',
                group: 'Layout',
            ),

            SectionField::make(
                name: 'animation',
                label: translate('Entrance Animation'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'none', 'label' => translate('None')],
                    ['value' => 'fade', 'label' => translate('Fade In')],
                    ['value' => 'rise', 'label' => translate('Rise Up')],
                ],
                default: 'fade',
                group: 'Animation',
            ),
        ];
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function blockTypes(): array
    {
        return [
            'detail' => [
                'label' => translate('Contact Detail'),
                'min' => 0,
                'max' => 6,
                'fields' => [
                    SectionField::make(
                        name: 'label',
                        label: translate('Label'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        required: true,
                        rules: ['max:80'],
                        help: translate('e.g. "Email", "Call us", "Studio".'),
                    ),

                    SectionField::make(
                        name: 'value',
                        label: translate('Value'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:255'],
                        help: translate('e.g. "hello@qtech.com", "+44 20 1234 5678".'),
                    ),

                    SectionField::make(
                        name: 'body',
                        label: translate('Link'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        rules: ['nullable', 'string', 'max:255'],
                        help: translate('Optional. A full URL, or "mailto:" / "tel:" — makes the value clickable.'),
                    ),

                    SectionField::make(
                        name: 'icon',
                        label: translate('Icon'),
                        type: FieldType::ICON->value,
                        store: FieldStore::COLUMN,
                        group: 'Media',
                    ),
                ],
            ],
        ];
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function relations(): array
    {
        return [];
    }

    public function previewComponent(): string
    {
        return 'Frontend/Sections/ContactHub';
    }

    /**
     * @return array{data: array<string, mixed>, settings: array<string, mixed>}
     */
    public function defaults(): array
    {
        return [
            'data' => [
                'version' => 1,
                'heading_highlight' => null,
                'success_message' => null,
                'consent_label' => null,
                'meeting_heading' => null,
                'meeting_text' => null,
                'map_address' => null,
            ],
            'settings' => [
                'notify_email' => null,
                'form_source' => 'contact-page',
                'button_label' => 'Send Enquiry',
                'show_company' => true,
                'show_phone' => true,
                'meeting_url' => null,
                'show_map' => false,
                'map_lat' => null,
                'map_lng' => null,
                'map_zoom' => 14,
                'form_side' => 'start',
                'theme' => 'default',
                'spacing' => 'lg',
                'animation' => 'fade',
            ],
        ];
    }
}

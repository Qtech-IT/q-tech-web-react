<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * The newsletter band — one email field, one button, and the consent line
 * that makes the signup lawful.
 *
 * WHY THE FORM'S STRINGS ARE FIELDS AND NOT HARDCODED
 * ---------------------------------------------------
 * Placeholder, button label, consent sentence and success message are the
 * four strings a marketing team rewrites most often and the four a developer
 * is most tempted to inline. They are CMS fields for the reason every string
 * on this site is: changing "Subscribe" to "Get started" must not be a
 * deploy. The consent sentence in particular is a LEGAL string — it is the
 * wording the business will be held to — and it must be editable by the
 * people who own that wording.
 *
 * WHY THERE IS NO NAME FIELD, AND NO SECOND FIELD OF ANY KIND
 * ----------------------------------------------------------
 * Every extra input measurably costs signups, and a field nothing personalises
 * on is personal data we then have to store, protect and delete on request.
 * `subscribers` has no `name` column for the same reason.
 *
 * `source` is what makes attribution work without a deploy: the same section
 * placed on two pages can report which one converts. It is validated as a
 * slug on the way in (see `SubscribeRequest`), so it cannot become a
 * free-text sink.
 */
class NewsletterSignupType implements SectionTypeContract
{
    public function key(): string
    {
        return 'newsletter.signup';
    }

    public function label(): string
    {
        return translate('Newsletter Signup');
    }

    public function description(): string
    {
        return translate('An email capture form with a consent line, and an optional row of faces for reassurance.');
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
                rules: ['max:255'],
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
                label: translate('Subheadline'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::COLUMN,
                translatable: true,
                rules: ['max:500'],
                help: translate('What they get and how often, e.g. "One email a month. No pitches."'),
            ),

            SectionField::make(
                name: 'placeholder',
                label: translate('Field Placeholder'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:120'],
                help: translate('Defaults to "Enter your email address". The field always keeps a visible label for screen readers regardless.'),
            ),

            SectionField::make(
                name: 'button_label',
                label: translate('Button Label'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:60'],
                help: translate('Defaults to "Subscribe".'),
            ),

            SectionField::make(
                name: 'consent_label',
                label: translate('Consent Sentence'),
                type: InputEnum::TEXTAREA->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:400'],
                help: translate('The wording beside the opt-in checkbox. This is the promise the business is held to — have whoever owns your privacy policy write it.'),
            ),

            SectionField::make(
                name: 'success_message',
                label: translate('Success Message'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:255'],
                help: translate('Shown in place of the form after a successful signup.'),
            ),

            SectionField::make(
                name: 'source',
                label: translate('Attribution Tag'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                rules: ['max:100', 'regex:/^[A-Za-z0-9._-]+$/'],
                help: translate('Stored with each signup so you can tell which placement converts, e.g. "home-footer". Letters, numbers, dot, dash and underscore only.'),
            ),

            SectionField::make(
                name: 'trust_label',
                label: translate('Reassurance Line'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:120'],
                help: translate('Sits beside the faces below, e.g. "Our experts are ready to help!"'),
            ),

            SectionField::make(
                name: 'face',
                label: translate('Faces'),
                type: FieldType::REPEATER->value,
                store: FieldStore::BLOCK,
                repeatable: true,
            ),

            SectionField::make(
                name: 'footnote',
                label: translate('Footnote'),
                type: InputEnum::TEXT->value,
                store: FieldStore::DATA,
                translatable: true,
                rules: ['max:255'],
                help: translate('Small print under the form, e.g. "Unsubscribe in one click."'),
            ),

            SectionField::make(
                name: 'layout',
                label: translate('Layout'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'centered', 'label' => translate('Centered')],
                    ['value' => 'split', 'label' => translate('Split — Copy Beside Form')],
                ],
                default: 'centered',
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
                name: 'show_consent',
                label: translate('Show Consent Checkbox'),
                type: InputEnum::SWITCH->value,
                store: FieldStore::SETTINGS,
                default: true,
                group: 'Layout',
                help: translate('Turning this off does NOT turn off the consent requirement — the server still requires it, and the form will submit it implicitly. Only switch it off where your legal basis is documented elsewhere.'),
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
                    ['value' => 'stagger', 'label' => translate('Staggered')],
                ],
                default: 'rise',
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
            'face' => [
                'label' => translate('Face'),
                'min' => 0,
                'max' => 6,
                'fields' => [
                    SectionField::make(
                        name: 'media_id',
                        label: translate('Photo'),
                        type: FieldType::MEDIA->value,
                        store: FieldStore::COLUMN,
                        required: true,
                        group: 'Media',
                        help: translate('Shown as a small overlapping circle. Use a real person who has agreed to appear here.'),
                    ),

                    SectionField::make(
                        name: 'label',
                        label: translate('Name'),
                        type: InputEnum::TEXT->value,
                        store: FieldStore::COLUMN,
                        translatable: true,
                        rules: ['max:120'],
                        help: translate('Not displayed — used as the image\'s alt text when the media library has none.'),
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
        return 'Frontend/Sections/NewsletterSignup';
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
                'placeholder' => null,
                'button_label' => null,
                'consent_label' => null,
                'success_message' => null,
                'source' => null,
                'trust_label' => null,
                'footnote' => null,
            ],
            'settings' => [
                'layout' => 'centered',
                'theme' => 'default',
                'spacing' => 'lg',
                'show_consent' => true,
                'animation' => 'rise',
            ],
        ];
    }
}

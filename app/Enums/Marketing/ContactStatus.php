<?php

namespace App\Enums\Marketing;

use App\Enums\EnumTrait;

/**
 * Where a contact enquiry is in the handling workflow.
 *
 * Separate from the generic `Status` enum (Active/Inactive) for the same
 * reason `SubscriberStatus` is: an inactive *record* and an unactioned
 * *enquiry* are different facts. `status` on the row is the admin's
 * soft-disable; this column is the triage state a person moves it through.
 *
 * SPAM is kept rather than deleted so a filter can be trained and a false
 * positive recovered — a hard delete of a misjudged enquiry is a lost lead.
 */
enum ContactStatus: string
{
    use EnumTrait;

    case NEW = 'new';
    case READ = 'read';
    case REPLIED = 'replied';
    case ARCHIVED = 'archived';
    case SPAM = 'spam';

    /**
     * Human-readable text.
     */
    public function values(): string
    {
        return match ($this) {
            self::NEW => 'New',
            self::READ => 'Read',
            self::REPLIED => 'Replied',
            self::ARCHIVED => 'Archived',
            self::SPAM => 'Spam',
        };
    }

    /**
     * List all values.
     *
     * @return array<int, string>
     */
    public static function getValues(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}

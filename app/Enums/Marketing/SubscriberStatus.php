<?php

namespace App\Enums\Marketing;

use App\Enums\EnumTrait;

/**
 * Where a newsletter subscriber is in their lifecycle.
 *
 * Separate from the generic `Status` enum on purpose: an inactive *record* and
 * an unsubscribed *person* are not the same fact, and conflating them is how
 * mailing lists end up sending to people who asked to be removed. `status`
 * (Active/Inactive) still exists on the row for the admin's soft-disable; this
 * column is the consent state and only the subscriber may change it.
 *
 * PENDING is the double-opt-in state. Nothing in this build sends the
 * confirmation email yet, so `SubscriptionService` writes SUBSCRIBED directly
 * and this case is reserved rather than used — when the confirmation mail
 * lands, the service changes and no schema does.
 */
enum SubscriberStatus: string
{
    use EnumTrait;

    case PENDING = 'pending';
    case SUBSCRIBED = 'subscribed';
    case UNSUBSCRIBED = 'unsubscribed';
    case BOUNCED = 'bounced';

    /**
     * Human-readable text.
     */
    public function values(): string
    {
        return match ($this) {
            self::PENDING => 'Pending Confirmation',
            self::SUBSCRIBED => 'Subscribed',
            self::UNSUBSCRIBED => 'Unsubscribed',
            self::BOUNCED => 'Bounced',
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

<?php

namespace App\Http\Services\Backend\Marketing;

use App\Enums\Common\Status;
use App\Enums\Marketing\SubscriberStatus;
use App\Enums\Settings\BulkActionType;
use App\Enums\Settings\InputEnum;
use App\Models\Subscriber;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

/**
 * Admin-side reads and management of newsletter subscribers.
 *
 * The consent state (`subscription_status`) is the subscriber's to change —
 * the admin can only soft-disable the record via `status`, or hard-remove it.
 * That boundary is the whole reason the two status columns exist.
 */
class SubscriberService
{
    public function getAll(): LengthAwarePaginator|Collection
    {
        return Subscriber::query()
            ->latest()
            ->search(['email', 'source'])
            ->filter(['subscription_status', 'status', 'source'])
            ->date()
            ->fetch();
    }

    public function delete(int $id): void
    {
        Subscriber::findOrFail($id)->delete();
    }

    /**
     * `[id, email, name]` rows for a bulk send. Without ids, every subscriber
     * matching the current filter who is still SUBSCRIBED and whose record is
     * ACTIVE — an unsubscribe or a soft-disable is a hard exclusion, never a
     * thing a UI filter can override.
     *
     * @param  array<int, int|string>|null  $ids
     * @return array<int, array{id: int, email: string, name: string|null}>
     */
    public function bulkRecipients(?array $ids): array
    {
        $query = Subscriber::query()
            ->select(['id', 'email'])
            ->where('subscription_status', SubscriberStatus::SUBSCRIBED->value)
            ->where('status', Status::ACTIVE->value);

        if ($ids !== null && $ids !== []) {
            $query->whereIn('id', $ids);
        } else {
            $query
                ->search(['email', 'source'])
                ->filter(['subscription_status', 'status', 'source'])
                ->date();
        }

        return $query->get()
            ->map(fn (Subscriber $s): array => [
                'id' => $s->id,
                'email' => $s->email,
                'name' => null,
            ])
            ->all();
    }

    public function markMailed(array $ids): int
    {
        return Subscriber::whereIn('id', $ids)->update(['mailed_at' => now()]);
    }

    public function handleBulkAction(array $ids, string $action): mixed
    {
        $query = Subscriber::whereIn('id', $ids);

        return match ($action) {
            BulkActionType::DELETE->value => $query->delete(),
            BulkActionType::ACTIVE->value => $query->update(['status' => Status::ACTIVE->value]),
            BulkActionType::INACTIVE->value => $query->update(['status' => Status::INACTIVE->value]),
            default => throw new \Exception('Invalid action'),
        };
    }

    public function getStats(): array
    {
        return [
            'total' => Subscriber::count(),
            'subscribed' => Subscriber::where('subscription_status', SubscriberStatus::SUBSCRIBED)->count(),
            'unsubscribed' => Subscriber::where('subscription_status', SubscriberStatus::UNSUBSCRIBED)->count(),
            'this_month' => Subscriber::where('consent_at', '>=', now()->startOfMonth())->count(),
        ];
    }

    public function getAdvanceFilterOptions(): array
    {
        return [
            [
                'key' => 'subscription_status',
                'label' => translate('Consent'),
                'type' => InputEnum::SELECT->value,
                'options' => [
                    ['value' => '', 'label' => translate('All')],
                    ...array_map(
                        fn (SubscriberStatus $c): array => ['value' => $c->value, 'label' => $c->values()],
                        SubscriberStatus::cases()
                    ),
                ],
            ],
            [
                'key' => 'date_range',
                'label' => translate('Date'),
                'type' => InputEnum::DATERANGE->value,
            ],
        ];
    }
}

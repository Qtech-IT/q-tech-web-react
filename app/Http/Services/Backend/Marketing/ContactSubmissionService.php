<?php

namespace App\Http\Services\Backend\Marketing;

use App\Enums\Marketing\ContactStatus;
use App\Enums\Settings\BulkActionType;
use App\Enums\Settings\InputEnum;
use App\Models\ContactSubmission;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

/**
 * Admin-side reads and triage of contact enquiries.
 *
 * There is no create or store — an enquiry is only ever born from the public
 * form. `changeStatus()` moves the triage state and stamps `read_at` /
 * `replied_at` as a side effect, which is why it lives here and not as a
 * fillable column.
 */
class ContactSubmissionService
{
    public function getAll(): LengthAwarePaginator|Collection
    {
        return ContactSubmission::query()
            ->latest()
            ->search(['name', 'email', 'company', 'message', 'source'])
            ->filter(['handling_status', 'source'])
            ->date()
            ->fetch();
    }

    public function markRead(ContactSubmission $submission): void
    {
        if ($submission->handling_status === ContactStatus::NEW) {
            $submission->forceFill([
                'handling_status' => ContactStatus::READ,
                'read_at' => now(),
            ])->save();
        }
    }

    public function changeStatus(ContactSubmission $submission, ContactStatus $status): void
    {
        $submission->forceFill([
            'handling_status' => $status,
            'read_at' => $submission->read_at ?? now(),
            'replied_at' => $status === ContactStatus::REPLIED ? now() : $submission->replied_at,
        ])->save();
    }

    public function delete(int $id): void
    {
        ContactSubmission::findOrFail($id)->delete();
    }

    /**
     * `[id, email, name]` rows for a bulk send. With ids, exactly those;
     * without, every enquiry matching the current search/filter — spam and
     * archived excluded, because a blast to those is never intended.
     *
     * @param  array<int, int|string>|null  $ids
     * @return array<int, array{id: int, email: string, name: string|null}>
     */
    public function bulkRecipients(?array $ids): array
    {
        $query = ContactSubmission::query()->select(['id', 'email', 'name']);

        if ($ids !== null && $ids !== []) {
            $query->whereIn('id', $ids);
        } else {
            $query
                ->whereNotIn('handling_status', [ContactStatus::SPAM->value, ContactStatus::ARCHIVED->value])
                ->search(['name', 'email', 'company', 'message', 'source'])
                ->filter(['handling_status', 'source'])
                ->date();
        }

        return $query->get()
            ->map(fn (ContactSubmission $c): array => [
                'id' => $c->id,
                'email' => $c->email,
                'name' => $c->name,
            ])
            ->all();
    }

    public function markMailed(array $ids): int
    {
        return ContactSubmission::whereIn('id', $ids)->update(['mailed_at' => now()]);
    }

    public function handleBulkAction(array $ids, string $action): mixed
    {
        $query = ContactSubmission::whereIn('id', $ids);

        return match ($action) {
            BulkActionType::DELETE->value => $query->delete(),
            default => throw new \Exception('Invalid action'),
        };
    }

    public function getStats(): array
    {
        return [
            'total' => ContactSubmission::count(),
            'new' => ContactSubmission::where('handling_status', ContactStatus::NEW)->count(),
            'replied' => ContactSubmission::where('handling_status', ContactStatus::REPLIED)->count(),
            'this_week' => ContactSubmission::where('created_at', '>=', now()->subWeek())->count(),
        ];
    }

    public function getAdvanceFilterOptions(): array
    {
        return [
            [
                'key' => 'handling_status',
                'label' => translate('Status'),
                'type' => InputEnum::SELECT->value,
                'options' => [
                    ['value' => '', 'label' => translate('All Statuses')],
                    ...array_map(
                        fn (ContactStatus $c): array => ['value' => $c->value, 'label' => $c->values()],
                        ContactStatus::cases()
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

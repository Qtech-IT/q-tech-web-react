<?php

namespace App\Models;

use App\Enums\Common\Status;
use App\Enums\Marketing\SubscriberStatus;
use App\Traits\Cms\HasAuditUsers;
use App\Traits\Common\Filterable;
use App\Traits\Common\HasUuid;
use App\Traits\Common\UsesUuidRouting;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * One newsletter subscriber.
 *
 * `email` is mass assignable but `subscription_status` is NOT: consent is
 * changed by `SubscriptionService`, never by whatever array a request happened
 * to carry. That is the whole reason the two status columns are separate.
 */
class Subscriber extends Model
{
    use Filterable;
    use HasAuditUsers;
    use HasUuid;
    use SoftDeletes;
    use UsesUuidRouting;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'site_id',
        'email',
        'locale',
        'source',
        'consent_ip',
        'consent_at',
        'unsubscribed_at',
        'status',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'subscription_status' => SubscriberStatus::class,
            'status' => Status::class,
            'consent_at' => 'datetime',
            'unsubscribed_at' => 'datetime',
            'mailed_at' => 'datetime',
        ];
    }

    /**
     * Columns `Filterable::search()` may match on.
     *
     * @var array<int, string>
     */
    protected array $searchable = [
        'email',
        'source',
    ];
}

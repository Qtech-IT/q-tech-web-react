<?php

namespace App\Models;

use App\Enums\Common\Status;
use App\Enums\Marketing\ContactStatus;
use App\Traits\Cms\HasAuditUsers;
use App\Traits\Common\Filterable;
use App\Traits\Common\HasUuid;
use App\Traits\Common\UsesUuidRouting;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * One contact enquiry from the public contact page.
 *
 * The visitor-supplied fields are mass assignable; `handling_status`,
 * `read_at`, `replied_at` and `mailed_at` are NOT — the triage state is moved
 * by `ContactService`, never by whatever array a request carried. Same
 * reasoning as `Subscriber::$subscription_status`.
 */
class ContactSubmission extends Model
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
        'name',
        'email',
        'phone',
        'company',
        'message',
        'locale',
        'source',
        'ip',
        'user_agent',
        'status',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'handling_status' => ContactStatus::class,
            'status' => Status::class,
            'read_at' => 'datetime',
            'replied_at' => 'datetime',
            'mailed_at' => 'datetime',
        ];
    }

    /**
     * Columns `Filterable::search()` may match on.
     *
     * @var array<int, string>
     */
    protected array $searchable = [
        'name',
        'email',
        'company',
        'message',
        'source',
    ];
}

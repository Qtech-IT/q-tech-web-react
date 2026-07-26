<?php

namespace App\Models;

use App\Enums\Common\Status;
use App\Enums\Notifications\NotificationType;
use App\Traits\Common\HasUuid;
use App\Traits\Common\UsesUuidRouting;
use App\Traits\Common\Filterable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class NotificationTemplate extends Model
{

    use Filterable , UsesUuidRouting , HasUuid;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'key',
        'subject',
        'mail_body',
        'sms_body',
        'push_notification_body',
        'template_key',
        'editor_files',
        'type',
        'real_time_disable',
        'sms_disable',
        'mail_disable',
        'sms_notification',
        'email_notification',
        'push_notification',
        'site_notificaton'
    ];


    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'template_key' => 'object',
            'editor_files' => 'array',

            'type'               => NotificationType::class,
            'sms_notification'   => Status::class,
            'email_notification' => Status::class,
            'push_notification'  => Status::class,
            'site_notificaton'   => Status::class,
            'real_time_disable'  => 'boolean',
            'sms_disable'        => 'boolean',
            'mail_disable'       => 'boolean'
        ];
    }


    /**
     * Summary of scopeIncoming
     * @param Builder $q
     * @return Builder
     */
    public function scopeIncoming(Builder $q): Builder
    {
        return $q->where('type',NotificationType::INCOMING);
    }

    /**
     * Summary of scopeOutgoing
     * @param Builder $q
     * @return Builder
     */
    public function scopeOutgoing(Builder $q): Builder
    {
        return $q->where('type',NotificationType::OUTGOING);
    }

    /**
     * Summary of scopeBoth
     * @param Builder $q
     * @return Builder
     */
    public function scopeBoth(Builder $q): Builder
    {
        return $q->where('type',NotificationType::BOTH);
    }


}

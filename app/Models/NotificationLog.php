<?php

namespace App\Models;

use App\Enums\Notifications\NotificationChannel;
use App\Enums\Notifications\NotificationLogStatus;
use App\Traits\Common\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class NotificationLog extends Model
{
   use HasFactory ,Filterable;


    protected $fillable = [
        'gateway_id',
        'receiver_model',
        'receiver_id',
        'custom_data',
        'message',
        'gateway_response',
        'status',
        'channel'
    ];





    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'custom_data'      => 'object',
            'gateway_response' => 'object',
            'status'  => NotificationLogStatus::class,
            'channel' => NotificationChannel::class
        ];
    }


    /**
     * Summary of receiver
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function receiver(): MorphTo
    {
        return $this->morphTo(__FUNCTION__, 'receiver_model', 'receiver_id');
    }


    /**
     * Summary of gateway
     * @return BelongsTo<AppSetting, NotificationLog>
     */
    public function gateway(): BelongsTo
    {
        return $this->belongsTo(AppSetting::class, 'gateway_id');
    }



}

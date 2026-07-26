<?php

namespace App\Models;

use App\Traits\Common\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class VerificationCode extends Model
{


    use Filterable;

    protected $fillable = [
        'otpable_type',
        'otpable_id',
        'otp',
        'type',
        'expired_at'
    ];

    protected $hidden = [
        'otp',
        'created_at',
        'updated_at'
    ];


    /**
     * Summary of otpable
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function otpable(): MorphTo
    {
        return $this->morphTo();
    }

}

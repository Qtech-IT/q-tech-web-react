<?php

namespace App\Notifications\Templates;

use App\Enums\Notifications\NotificationTemplateEnum;
use App\Notifications\Contracts\NotificationTemplate;
use Carbon\Carbon;
use Illuminate\Support\Arr;

class PasswordResetTemplate implements NotificationTemplate
{

    /**
     * Summary of build
     * @param array $data
     * @return array<array|string>
     */
    public function build(array $data): array
    {
        
       $key         = NotificationTemplateEnum::PASSWORD_RESET->value;
       $user        = Arr::get($data, 'user');
       $otp         = Arr::get($data, 'otp_code');
       $ipInfo      = Arr::get($data, 'ip_info');
       $expiredTime = Arr::get($data, 'expired_at');

       return [
                $key,
                [
                    'template_code' => [
                        'otp_code'         => $otp,
                        'ip'               => Arr::get($ipInfo,'ip'),
                        'time'             => Carbon::now(),
                        'expired_time'     => get_date_time($expiredTime),
                        'operating_system' => Arr::get($ipInfo,'os')
                    ],
                    'receiver_model' => $user
                ]
            ];
    }
}

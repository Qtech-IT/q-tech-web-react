<?php

namespace Database\Seeders;

use App\Enums\Common\Status;
use App\Enums\Notifications\NotificationTemplateEnum;
use App\Models\NotificationTemplate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class NotificationTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        NotificationTemplate::query()->delete();
        
        collect(NotificationTemplateEnum::getTemplates())
            ->except(NotificationTemplate::pluck('key')->toArray())
            ->each(function(array $template , string $key) :void{
                 NotificationTemplate::withoutEvents(function () use($template , $key) {
                    NotificationTemplate::create([
                        'key'                      => $key,
                        'uuid'                     => Str::uuid(),
                        'name'                     => Arr::get($template , 'name'),
                        'subject'                  => Arr::get($template , 'subject'),
                        'mail_body'                => Arr::get($template , 'body'),
                        'sms_body'                 => Arr::get($template , 'sms_body'),
                        'push_notification_body'   => Arr::get($template , 'push_notification_body' ),
                        'template_key'             => Arr::get($template , 'template_key'),
                        'type'                     => Arr::get($template , 'type'),
                        'real_time_disable'        => Arr::get($template , 'is_real_time_disable' ,false),
                        'sms_disable'              => Arr::get($template , 'is_sms_disable' ,false),
                        'mail_disable'             => Arr::get($template , 'is_mail_disable' ,false),
                        'email_notification'       => Status::ACTIVE,
                        'sms_notification'         => Status::INACTIVE,
                        'push_notification'        => Status::INACTIVE,
                        'site_notificaton'         => Status::INACTIVE
                    ]);
                });
        });

    }
}

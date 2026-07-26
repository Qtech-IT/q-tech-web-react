<?php

namespace App\Http\Resources\Backend\NotificationTemplate;

use App\Http\Resources\BaseResource;

class NotificationTemplateResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request
     * @return array
     */
    public function toArray($request): array
    {
        return [

            ...$this->getBaseAttributes($request),
            'id'               => $this->id,
            'name'             => $this->name,
            'key'              => $this->key ,
            'subject'          => $this->subject ,
            'mail_body'        => $this->mail_body,
            'sms_body'         => $this->sms_body,

            'push_notification_body' => $this->push_notification_body ,
            'template_key'           => $this->template_key ,
            'type'                   => $this->type ,
            'is_real_time_disable'   => $this->real_time_disable,
            'is_mail_disable'        => $this->mail_disable,
            'email_notification'     => $this->email_notification ,
            'push_notification'      => $this->push_notification,
            'site_notificaton'       => $this->site_notificaton

        ];
    }
}

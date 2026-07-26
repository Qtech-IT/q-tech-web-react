<?php

namespace App\Http\Services\Backend\NotificationTemplate;

use App\Enums\Common\Status;
use App\Models\NotificationTemplate;
use App\Traits\Common\ModelAction;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class NotificationTemplateService
{
    use  ModelAction ;

    /**
     * Summary of getTemplates
     * @return Collection
     */
    public function getTemplates(): Collection
    {
        return NotificationTemplate::latest()
                            ->search(['name', 'subject'])
                            ->filter(['type'])
                            ->get();
    }

    /**
     * Summary of save
     * @param Request $request
     * @param NotificationTemplate $notificationTemplate
     * @return void
     */
    public function save(Request $request, NotificationTemplate $notificationTemplate): void
    {
        $notificationTemplate->subject = $request->input('subject');

        if ($request->input('push_notification_body')) {
            $notificationTemplate->push_notification_body = $request->input('push_notification_body');
        }

        $notificationTemplate->push_notification = $request->input('push_notification') ? Status::ACTIVE : Status::INACTIVE;
        $notificationTemplate->site_notificaton = $request->input('site_notificaton') ? Status::ACTIVE : Status::INACTIVE;
        $notificationTemplate->email_notification = $request->input('email_notification') ? Status::ACTIVE : Status::INACTIVE;

        if ($request->input('mail_body')) {
            $mailBody = build_dom_document($request->input('mail_body'));
            $notificationTemplate->mail_body = Arr::get($mailBody, 'html');
            $this->unlinkEditorFiles($template?->editor_files ?? []);
            $notificationTemplate->editor_files = Arr::get($mailBody, 'files');
        }

        $notificationTemplate->save();
    }

    /** */
    public function getStats(): array
    {
        return [
            'total' => NotificationTemplate::count(),
            'incoming' => NotificationTemplate::query()->incoming()->count(),
            'outgoing' => NotificationTemplate::query()->outgoing()->count(),
            'both' => NotificationTemplate::query()->both()->count()
        ];
    }
}

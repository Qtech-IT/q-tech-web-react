<?php

namespace App\Http\Requests\Backend\NotificationTemplate;

use Illuminate\Foundation\Http\FormRequest;

class NotificationTemplateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
       return  [
            'subject'              => ['nullable','max:150'],
            'email_notification'   => ['boolean' ],
            'push_notification'    => ['boolean'],
            'site_notificaton'     => ['boolean']
       ];
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }
}

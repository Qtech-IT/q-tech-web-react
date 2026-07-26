<?php

namespace App\Http\Controllers\Backend\Settings;

use App\Enums\Notifications\NotificationChannel;
use App\Enums\Notifications\NotificationLogStatus;
use App\Enums\Notifications\NotificationTemplateEnum;
use App\Enums\Settings\SettingKey;
use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Services\Backend\Settings\SettingsService;
use App\Models\AppSetting;
use App\Models\NotificationLog;
use App\Models\NotificationTemplate;
use App\Notify\SendMail;
use App\Traits\Common\ModelProperty;
use App\Traits\Common\Notify;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Response as InertiaResponse;

class MailConfigurationController extends Controller
{
    use ModelProperty , Notify;

    protected array $modelProperty ;

    public function __construct(protected SettingsService $settingsService)
    {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix :'MailConfiguration',
            routePrefix: 'backend.mail.configuration'
        );
    }

    /**
     * Display general settings page.
     *
     * @return JsonResponse|InertiaResponse
     */
    public function index(): JsonResponse|InertiaResponse
    {
        $this->authorize('view', 'mailConfiguration');

        $setting = AppSetting::where('slug', SettingKey::MAIL_CONFIGURATION->value)
                                            ->first();

        return AppResponse::asSuccess()
                    ->withComponent($this->modelProperty['pagePrefix'] . 'Index', [
                        'title'             => translate('Mail Configuration'),
                        'modelProperty'     => $this->modelProperty,
                        'mailConfiguration' => $setting?->setting_value ? json_decode($setting->setting_value, true) : null,
                    ])
                    ->build();
    }

    /**
     * Summary of store
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('edit', 'mailConfiguration');

        $request->validate([
                                    'mail_mailer' => [
                                        'required',
                                        'string'
                                    ],
                                    'mail_host'  => 'required|string|max:255',
                                    'mail_port'  => 'required|integer|min:1|max:65535',
                                    'encryption' => [
                                        'required',
                                        'string',
                                        Rule::in(['tls', 'ssl', 'none'])
                                    ],
                                    'mail_username'     => 'required|string|max:255',
                                    'mail_password'     => 'required|string|max:255',
                                    'mail_form_address' => 'required|email|max:255',
                            ]);

        $setting = AppSetting::firstOrNew([
                        'slug' => SettingKey::MAIL_CONFIGURATION->value
                    ]);

        $setting->title         = key_to_value(SettingKey::MAIL_CONFIGURATION->value);
        $setting->setting_value = json_encode([
                                                        'mail_mailer'       => $request->input('mail_mailer'),
                                                        'mail_host'         => $request->input('mail_host'),
                                                        'mail_port'         => $request->input('mail_port'),
                                                        'mail_username'     => $request->input('mail_username'),
                                                        'mail_password'     => $request->input('mail_password'),
                                                        'mail_form_address' => $request->input('mail_form_address'),
                                                        'encryption'        => $request->input('encryption')
                                                    ]);

        $setting->save();

        return AppResponse::asSuccess()
                        ->withMessage('Mail configuration saved successfully')
                        ->build();
    }

    /**
     * Summary of test
     * @param Request $request
     * @return RedirectResponse
     */
    public function test(Request $request): RedirectResponse
    {
        $this->authorize('test', 'mailConfiguration');

        $request->validate([
            'email' => 'required|email',
        ]);

        $mailGateway = AppSetting::where('slug', SettingKey::MAIL_CONFIGURATION->value)
                                ->firstOrfail();

        $template = NotificationTemplate::where('key', NotificationTemplateEnum::TEST_MAIL->value)
                                ->firstOrfail();

        $email = $request->input('email');

        $messageData = [
            'tmpCodes' => ['time' => Carbon::now()],
            'userinfo' => (object) ['email' => $email , 'username' => $email]
        ];

        $message = $this->replaceMessagePlaceholders($template->mail_body, SettingKey::DEFAULT_MAIL_TEMPLATE->value, ...$messageData);

        $notificationLog              = new NotificationLog();
        $notificationLog->gateway_id  = $mailGateway->id;
        $notificationLog->message     = $message;
        $notificationLog->custom_data = (object) [
                                                 'subject'  => $template->subject,
                                                 'email'    => $email ,
                                                 'username' => $email
                                              ];
        $notificationLog->status  = NotificationLogStatus::PENDING;
        $notificationLog->channel = NotificationChannel::EMAIL;
        $notificationLog->save();

        SendMail::send(
            log: $notificationLog->load(['gateway']),
            receiverInstance: (object) ['email' => $email , 'username' => $email]
        );

        $isSuccess = $notificationLog->status == NotificationLogStatus::SUCCESS;

        $message = $isSuccess
                        ? translate('Test mail sent to your email!!')
                        : $notificationLog->gateway_response->message;

        $response = $isSuccess
                        ? AppResponse::asSuccess()
                        : AppResponse::asError();

        return $response->withMessage($message)
                            ->build();
    }
    }

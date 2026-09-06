<?php

namespace App\Enums\Notifications;

use App\Enums\EnumTrait;

enum NotificationTemplateEnum: string
{
    use EnumTrait;

    case TEST_MAIL = 'TEST_MAIL';
    case PASSWORD_RESET = 'PASSWORD_RESET';
    case NEWSLETTER_CAMPAIGN = 'NEWSLETTER_CAMPAIGN';
    case CONTACT_REPLY = 'CONTACT_REPLY';

    /**
     * Get Notification Template
     */
    public static function getTemplates(): array
    {
        return [
            self::PASSWORD_RESET->value => [
                'name' => key_to_value(self::PASSWORD_RESET->value),
                'subject' => 'Password Reset',
                'body' => 'We have received a request to reset the password for your account. OTP: {{otp_code}}, Request time: {{time}}',
                'sms_body' => 'Password reset request received. OTP: {{otp_code}}, Time: {{time}}',

                'template_key' => [
                    'otp_code' => 'Password Reset Code',
                    'time' => 'Password Reset Time',
                    'operating_system' => 'Operating System',
                    'ip' => 'IP Address',
                    'expired_time' => 'OTP Expired Time',
                ],
                'type' => NotificationType::BOTH,
                'is_real_time_disable' => true,
            ],

            self::TEST_MAIL->value => [
                'name' => key_to_value(self::TEST_MAIL->value),
                'subject' => 'Test Mail',
                'body' => 'This is a test email for mail configuration. Sent at {{time}}',
                'template_key' => [
                    'time' => 'Time',
                ],
                'is_real_time_disable' => true,
                'is_sms_disable' => true,
                'type' => NotificationType::OUTGOING,
            ],

            /*
             * Marketing blast sent from Marketing → Send Campaign. Plain,
             * editable body — an operator rewrites it per campaign. `{{name}}`
             * resolves to the recipient's name (blank for subscribers).
             */
            self::NEWSLETTER_CAMPAIGN->value => [
                'name' => key_to_value(self::NEWSLETTER_CAMPAIGN->value),
                'subject' => 'News from QTECH',
                'body' => '<p>Hi {{name}},</p><p>Edit this template in Notifications → Templates before you send. Use it for product news, insights and announcements to people who opted in.</p><p>— The QTECH Team</p>',
                'template_key' => [
                    'name' => 'Recipient Name',
                ],
                'is_real_time_disable' => true,
                'is_sms_disable' => true,
                'type' => NotificationType::OUTGOING,
            ],

            /*
             * Reply to a single contact enquiry, also used by Send Campaign when
             * the audience is contact enquirers.
             */
            self::CONTACT_REPLY->value => [
                'name' => key_to_value(self::CONTACT_REPLY->value),
                'subject' => 'Re: your enquiry to QTECH',
                'body' => '<p>Hi {{name}},</p><p>Thanks for getting in touch. Edit this template before you send — it is a starting point for replying to enquiries from the contact page.</p><p>— The QTECH Team</p>',
                'template_key' => [
                    'name' => 'Recipient Name',
                ],
                'is_real_time_disable' => true,
                'is_sms_disable' => true,
                'type' => NotificationType::OUTGOING,
            ],
        ];
    }
}

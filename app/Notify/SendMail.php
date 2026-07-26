<?php

namespace App\Notify;

use App\Enums\Notifications\NotificationLogStatus;
use App\Enums\Settings\SettingKey;
use App\Models\NotificationLog;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport;

class SendMail
{
    /**
     * Send email based on the configured gateway.
     *
     * @param NotificationLog $log
     * @param mixed $receiverInstance
     */
    public static function send(NotificationLog $log, mixed $receiverInstance): void
    {
        self::sendSMTPMail($log, $receiverInstance);
    }

    

    /**
     * Send email using SMTP configuration.
     */
    public static function sendSMTPMail(NotificationLog $log, mixed $receiverInstance): void
    {
        $status = true;
        $responseMessage = translate("Email Send Successfully");

        try {

            $gateway  = json_decode($log->gateway->setting_value);

            $username = preg_match('/[\?#\[\]@!$&\'()\*\+,;=]/', $gateway->mail_username) 
                                ? urlencode($gateway->mail_username) 
                                : $gateway->mail_username;

            $password = preg_match('/[\?#\[\]@!$&\'()\*\+,;=]/', $gateway->mail_password) 
                                ? urlencode($gateway->mail_password) 
                                : $gateway->mail_password;

            $dsn = sprintf(
                'smtp://%s:%s@%s:%d?encryption=%s',
                $username,
                $password,
                $gateway->mail_host,
                $gateway->mail_port,
                $gateway->encryption
            );

            $transport = Transport::fromDsn($dsn);
            $mailer    = new Mailer($transport);
            $formName  = site_settings( SettingKey::COMPANY_NAME->value);

            $email     = (new Email())
                                ->from(new Address($gateway->mail_form_address, $formName))
                                ->to($receiverInstance->email)
                                ->replyTo($gateway->mail_form_address)
                                ->subject($log->custom_data->subject)
                                ->html($log->message);

            $mailer->send($email);
            $log->status = NotificationLogStatus::SUCCESS;

        } catch (\Exception $e) {
            $log->status     = NotificationLogStatus::FAILED;
            $status          = false;
            $responseMessage = $e->getMessage();
        }

        $log->gateway_response = (object) [
            "status"  => $status,
            "message" => $responseMessage
        ];

        $log->save();
    }

   
}

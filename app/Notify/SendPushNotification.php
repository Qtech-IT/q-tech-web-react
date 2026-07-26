<?php

namespace App\Notify;

use App\Enums\Notifications\NotificationLogStatus;
use App\Models\NotificationLog;

/**
 * Class SendPushNotification
 *
 * Handles sending push notifications via Firebase Cloud Messaging (FCM).
 * Supports sending to topics or individual users.
 * Uses polymorphic user device tokens.
 * Full payload is sent as a JSON-encoded string in the `data` key.
 */
class SendPushNotification
{
    /**
     * Generate an OAuth token for Firebase API using JWT.
     *
     * @param object $firebaseConfiguration Firebase service account credentials
     * @return string|null Access token or null if failed
     */
    public static function generateOAuthToken($firebaseConfiguration): ?string
    {
        $url = "https://www.googleapis.com/oauth2/v4/token";

        $postData = [
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => self::generateJWT($firebaseConfiguration)
        ];

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query($postData),
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded']
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);
        return $data['access_token'] ?? null;
    }

    /**
     * Generate a JWT for Firebase service account authentication.
     *
     * @param object $firebaseConfiguration Firebase service account credentials
     * @return string JWT token
     */
    public static function generateJWT($firebaseConfiguration): string
    {
        $payload = [
            'iss' => $firebaseConfiguration->client_email,
            'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
            'aud' => 'https://www.googleapis.com/oauth2/v4/token',
            'exp' => time() + 3600,
            'iat' => time()
        ];

        $encodedPayload = base64_encode(json_encode($payload));
        $encodedHeader  = base64_encode(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));

        $privateKey = $firebaseConfiguration->private_key;
        openssl_sign("$encodedHeader.$encodedPayload", $signature, $privateKey, OPENSSL_ALGO_SHA256);
        $encodedSignature = base64_encode($signature);

        return "$encodedHeader.$encodedPayload.$encodedSignature";
    }

    /**
     * Send push notification.
     *
     * @param NotificationLog $log Notification log instance
     * @param mixed $receiverInstance Admin, User, or any model using polymorphic device tokens
     * @param bool $broadcast True if sending to a topic
     */
    public static function send(NotificationLog $log, mixed $receiverInstance, bool $broadcast = false): void
    {
        $status = true;
        $responseMessage = translate("Notification Send Successfully");
        $payload = $log?->custom_data?->push_notification?->payload;

        // Prepare FCM data payload
        $data = [
            "title"   => $log?->custom_data?->subject ?? '',
            "body"    => $log?->message ?? '',
            "payload" => json_encode($payload) // Full payload as string
        ];

        try {
            // Firebase configuration
            $firebaseConfiguration = json_decode($log->gateway->value);
            $projectId = $firebaseConfiguration->project_id ?? '';
            $accessToken = self::generateOAuthToken($firebaseConfiguration);

            $url = "https://fcm.googleapis.com/v1/projects/{$projectId}/messages:send";
            $header = [
                "Authorization: Bearer " . $accessToken,
                "Content-Type: application/json"
            ];

            // Prepare FCM message
            $postData = ["message" => ["data" => $data]];

            if ($broadcast) {
                // Send to topic
                $postData['message']['topic'] = $payload->topic ?? '';
                self::sendCurlRequest($postData, $url, $header);
            } else {
                // Send to user device tokens (polymorphic)
               $receiverInstance->userDeviceTokens()
                ->chunk(50, function ($tokensChunk) use ($postData, $url, $header) {
                    $tokensChunk->map(function ($deviceToken) use ($postData, $url, $header) {
                        $postData['message']['token'] = $deviceToken->fcm_token;
                        self::sendCurlRequest($postData, $url, $header);
                    });
                });
            }

            $log->status = NotificationLogStatus::SUCCESS;

        } catch (\Exception $e) {
            $log->status = NotificationLogStatus::FAILED;
            $status = false;
            $responseMessage = $e->getMessage();
        }

        // Save log response
        $log->gateway_response = (object)[
            "status"  => $status,
            "message" => $responseMessage
        ];
        $log->save();
    }

    /**
     * Helper method to send the cURL request to FCM.
     *
     * @param array $postData Payload to send
     * @param string $url FCM endpoint URL
     * @param array $header HTTP headers
     */
    private static function sendCurlRequest(array $postData, string $url, array $header): void
    {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($postData),
            CURLOPT_HTTPHEADER => $header
        ]);
        curl_exec($ch);
        curl_close($ch);
    }
}

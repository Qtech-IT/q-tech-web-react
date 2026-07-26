<?php

namespace App\Http\Services\Backend;

use App\Enums\Notifications\NotificationTemplateEnum;
use App\Enums\Settings\InputEnum;
use App\Models\VerificationCode;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class OtpCodeService
{
    /**
     * Summary of getAllCode
     * @return LengthAwarePaginator|Collection
     */
    public function getAllCode(): LengthAwarePaginator | Collection
    {
        return VerificationCode::with(['otpable'])->latest()
                    ->date('expired_at')
                    ->search(['type', 'otp'])
                    ->filter(['type'])
                    ->fetch();
    }

    /**
     * Summary of delete
     * @param int $id
     * @return void
     */
    public function delete(int $id): void
    {
        $verificationCode = VerificationCode::findOrFail($id);
        $verificationCode->delete();
    }

    /**
     * Get advance filter options
     */
    public function getAdvanceFilterOptions(): array
    {
        return [
            [
                'key'     => 'type',
                'label'   => translate('Type'),
                'type'    => InputEnum::SELECT->value,
                'options' => [
                    ['value' => '', 'label' => translate('Select Type')],

                    ['value' => strtolower(NotificationTemplateEnum::TEST_MAIL->value), 'label' => translate('Test Mail')],

                    ['value' => strtolower(NotificationTemplateEnum::PASSWORD_RESET->value),
                     'label' => translate('Password Reset')],

                    ['value' => strtolower(NotificationTemplateEnum::EMAIL_VERIFICATION->value),
                     'label' => translate('Email Verification')],
                ],
            ],

            [
                'key'   => 'date_range',
                'label' => translate('Expired date'),
                'type'  => InputEnum::DATERANGE->value,
            ]
        ];
    }
   }

<?php

namespace App\Http\Requests\Backend\Cms;

use App\Enums\Settings\SettingKey;
use Illuminate\Foundation\Http\FormRequest;

class MediaUploadRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * The size cap comes from the existing MAX_FILE_SIZE setting rather than a
     * new one, so an admin changes it in the place they already know.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $maxKilobytes = (int) site_settings(SettingKey::MAX_FILE_SIZE->value, 20000);

        return [
            'file' => [
                'required',
                'file',
                'max:'.max($maxKilobytes, 1),

                // mimetypes checks the server-detected type, not the client's
                // claimed extension — the extension alone is trivially spoofed.
                'mimetypes:'.implode(',', [
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'image/webp',
                    'image/avif',
                    'image/svg+xml',
                    'video/mp4',
                    'video/webm',
                    'audio/mpeg',
                    'audio/wav',
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/zip',
                ]),
            ],
            'folder_id' => ['nullable', 'exists:media_folders,id'],
            'alt_text' => ['nullable', 'string', 'max:500'],
            'title' => ['nullable', 'string', 'max:191'],
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}

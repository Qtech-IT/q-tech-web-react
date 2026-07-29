<?php

namespace App\Enums\Cms;

use App\Enums\EnumTrait;

/**
 * Coarse media classification driving the library filter tabs.
 */
enum MediaType: string
{
    use EnumTrait;

    case IMAGE = 'image';
    case VIDEO = 'video';
    case AUDIO = 'audio';
    case DOCUMENT = 'document';
    case ARCHIVE = 'archive';
    case OTHER = 'other';

    /**
     * Resolve the coarse type from a real (server-detected) MIME type.
     */
    public static function fromMimeType(?string $mimeType): self
    {
        $mimeType = strtolower((string) $mimeType);

        return match (true) {
            str_starts_with($mimeType, 'image/') => self::IMAGE,
            str_starts_with($mimeType, 'video/') => self::VIDEO,
            str_starts_with($mimeType, 'audio/') => self::AUDIO,
            in_array($mimeType, [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'text/plain',
                'text/csv',
            ], true) => self::DOCUMENT,
            in_array($mimeType, [
                'application/zip',
                'application/x-tar',
                'application/gzip',
                'application/x-7z-compressed',
                'application/vnd.rar',
            ], true) => self::ARCHIVE,
            default => self::OTHER,
        };
    }

    /**
     * List all values.
     */
    public static function getValues(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}

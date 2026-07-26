<?php

namespace App\Traits\Common;

use App\Constants\FilePathConstants;
use App\Enums\Settings\SettingKey;
use App\Enums\Settings\StorageKey;
use App\Models\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use Throwable;

/**
 * Trait Fileable
 *
 * Provides reusable methods to handle file upload, storage, deletion, and URL retrieval.
 */
trait Fileable
{
    /**
     * Store uploaded file in specified location with optional image resizing and deletion of previous file.
     *
     * @param UploadedFile $file
     * @param string $location Storage folder path
     * @param string|null $size Optional size for image resizing (e.g., '200x300')
     * @param File|null $removeFile Optional existing file to remove
     * @param string|null $name Optional file name
     * @return array{
     *     status: bool,
     *     name: string,
     *     display_name: string,
     *     disk: string|null,
     *     size: string,
     *     extension: string
     * }
     */
    private function storeFile(
        UploadedFile $file,
        string $location,
        ?string $size = null,
        ?File $removeFile = null,
        ?string $name = null
    ): array {
        $name   = uniqid() . time() . '.' . $file->getClientOriginalExtension();
        $status = true;
        $disk   = site_settings(SettingKey::STORAGE->value);

        if ($removeFile) {
            $this->unlink($location, $removeFile);
        }

        switch ($disk) {
            case StorageKey::LOCAL->value:
                if (str_starts_with($file->getMimeType(), 'image')) {
                    $image = Image::read(file_get_contents($file));
                    if ($size) {
                        [$width, $height] = explode('x', strtolower($size));
                        $image->resize($width, $height);
                    }
                    $tempPath = sys_get_temp_dir() . '/' . $name;
                    $image->save($tempPath);
                    Storage::disk('public')->putFileAs($location, new \Illuminate\Http\File($tempPath), $name);
                    @unlink($tempPath);
                } else {
                    Storage::disk('public')->putFileAs($location, $file, $name);
                }
                break;

            default:
                $configurationFn = StorageKey::getConfigurationFnName($disk);
                if ($configurationFn) {
                    $this->{$configurationFn}();
                    Storage::disk($disk)->putFileAs($location, $file, $name);
                }
                break;
        }

        try {
            $size = $file->getSize();
        } catch (Throwable $th) {
            $size = 0;
        }

        return [
            'status'       => $status,
            'name'         => $name,
            'display_name' => $file->getClientOriginalName(),
            'disk'         => $disk,
            'size'         => $this->formatSize($size),
            'extension'    => strtolower($file->getClientOriginalExtension()),
        ];
    }

    /**
     * Format file size to human-readable string.
     *
     * @param int|string $bytes
     * @return string
     */
    private function formatSize(string|int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        for ($i = 0; $bytes >= 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Delete a stored file from disk and database.
     *
     * @param string $location
     * @param File|null $file
     * @return bool
     */
    private function unlink(string $location, ?File $file = null): bool
    {
        if (!$file) {
            return true;
        }

        try {
            $filePath = $location . '/' . $file->name;
            $disk     = $file->disk;

            switch ($disk) {
                case StorageKey::LOCAL->value:
                    if (Storage::disk('public')->exists($filePath)) {
                        Storage::disk('public')->delete($filePath);
                    }
                    break;
                default:
                    $configurationFn = StorageKey::getConfigurationFnName($disk);
                    if ($configurationFn) {
                        $this->{$configurationFn}();
                        if (Storage::disk($disk)->exists($filePath)) {
                            Storage::disk($disk)->delete($filePath);
                        }
                    }
                    break;
            }

            $file->delete();
            return true;
        } catch (Throwable $th) {
            return false;
        }
    }

    /**
     * Delete files from a text editor (HTML content) upload.
     *
     * @param array $files
     * @return void
     */
    private function unlinkEditorFiles(array $files): void
    {
        $location = FilePathConstants::getPath('text_editor')['path'];
        try {
            foreach ($files as $file) {
                $filePath = $location . '/' . $file;
                if (Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->delete($filePath);
                }
            }
        } catch (Throwable $th) {
            // Silently ignore
        }
    }

    /**
     * Get public URL of a file, fallback to default image if not exists.
     *
     * @param File|null $file
     * @param string $location
     * @param string|null $forceSize
     * @return string
     */
    private function getFileURL(?File $file, string $location, ?string $forceSize = null): string
    {
        $default = Storage::disk('public')->url('images/default/default.webp');

        if (!$file)  return $default;

        $filePath = $location . '/' . $file->name;
        $disk     = $file->disk;

        switch ($disk) {
            case StorageKey::LOCAL->value:
                if (Storage::disk('public')->exists($filePath)) {
                    return Storage::disk('public')->url($filePath);
                }
                break;
            default:
                $configurationFn = StorageKey::getConfigurationFnName($disk);
                if ($configurationFn) {
                    $this->{$configurationFn}();
                    if (Storage::disk($disk)->exists($filePath)) {
                        return Storage::disk($disk)->url($filePath);
                    }
                }
                break;
        }

        return $default;
    }

    /**
     * Check if a remote file exists by URL.
     *
     * @param string $url
     * @return bool
     */
    public static function checkFile(string $url): bool
    {
        $headers = @get_headers($url);
        return $headers && preg_match('/\bContent-Type:\s+(?:image|audio|video)/i', implode("\n", $headers));
    }

    /**
     * Delete associated files of a model from a given path.
     *
     * @param Model $model
     * @param string $path
     * @return bool
     */
    public function unlinkLogFile(Model $model, string $path): bool
    {
        try {
            $model?->file?->each(fn (File $file) => $this->unlink($path, $file));
            return true;
        } catch (Throwable $th) {
            return false;
        }
    }

    /**
     * Set AWS S3 configuration dynamically.
     *
     * @return void
     */
    private function setAWSConfig(): void
    {
        $awsConfig = json_decode(site_settings(SettingKey::S3_CONFIGURATION->value), true);
        config([
            'filesystems.disks.s3.key'                     => Arr::get($awsConfig, 's3_key'),
            'filesystems.disks.s3.secret'                  => Arr::get($awsConfig, 's3_secret'),
            'filesystems.disks.s3.region'                  => Arr::get($awsConfig, 's3_region'),
            'filesystems.disks.s3.bucket'                  => Arr::get($awsConfig, 's3_bucket'),
            'filesystems.disks.s3.use_path_style_endpoint' => false,
        ]);
    }

    /**
     * Set FTP configuration dynamically.
     *
     * @return void
     */
    public function setFTPConfig(): void
    {
        $ftpConfig = json_decode(site_settings(SettingKey::FTP_CONFIGURATION->value), true);
        config([
            'filesystems.disks.ftp.host'     => Arr::get($ftpConfig, 'host'),
            'filesystems.disks.ftp.username' => Arr::get($ftpConfig, 'user_name'),
            'filesystems.disks.ftp.password' => Arr::get($ftpConfig, 'password'),
            'filesystems.disks.ftp.port'     => (int) Arr::get($ftpConfig, 'port'),
            'filesystems.disks.ftp.root'     => Arr::get($ftpConfig, 'root'),
        ]);
    }
}

<?php
namespace App\Enums\Settings;

use App\Enums\EnumTrait;

enum StorageKey: string
{
    use EnumTrait;

    case S3           = "s3";
    case FTP          = "ftp";
    case LOCAL        = "local";

    
    /**
     * Summary of getConfigurationFnName
     * @param string $disk
     * @return string|null
     */
    public static function getConfigurationFnName(string $disk): ?string
    {
        return match ($disk) {
            self::S3->value  => 'setAWSConfig',
            self::FTP->value => 'setFTPConfig',
            default          => null,
        };
    }


    
}
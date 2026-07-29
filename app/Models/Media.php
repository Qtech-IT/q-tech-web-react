<?php

namespace App\Models;

use App\Enums\Cms\MediaType;
use App\Enums\Common\Status;
use App\Traits\Cms\HasAuditUsers;
use App\Traits\Common\Filterable;
use App\Traits\Common\HasUuid;
use App\Traits\Common\UsesUuidRouting;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    use Filterable;
    use HasAuditUsers;
    use HasUuid;
    use SoftDeletes;
    use UsesUuidRouting;

    /**
     * `media` is already the correct plural; Laravel would otherwise guess
     * `medias`.
     *
     * @var string
     */
    protected $table = 'media';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'site_id',
        'folder_id',
        'disk',
        'path',
        'file_name',
        'original_name',
        'mime_type',
        'extension',
        'media_type',
        'size',
        'width',
        'height',
        'duration',
        'alt_text',
        'caption',
        'title',
        'description',
        'credit',
        'focal_x',
        'focal_y',
        'blurhash',
        'conversions',
        'checksum',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'media_type' => MediaType::class,
            'status' => Status::class,
            'conversions' => 'array',
            'size' => 'integer',
            'width' => 'integer',
            'height' => 'integer',
            'duration' => 'integer',
            'focal_x' => 'float',
            'focal_y' => 'float',
        ];
    }

    /**
     * The folder this asset is filed in. NULL means the library root.
     */
    public function folder(): BelongsTo
    {
        return $this->belongsTo(MediaFolder::class, 'folder_id');
    }

    /**
     * Public URL for the stored file.
     *
     * Reads `disk` + `path` directly rather than reconstructing a location from
     * FilePathConstants the way `files` does — a folder-organised library moves
     * files, so the path must be stored, not derived.
     */
    protected function url(): Attribute
    {
        return Attribute::get(function (): ?string {
            if (blank($this->path)) {
                return null;
            }

            try {
                return Storage::disk($this->disk)->url($this->path);
            } catch (\Throwable) {
                return null;
            }
        });
    }

    /**
     * Named derivative URL (thumb, webp, ...), falling back to the original so
     * a public component never renders a broken image when the conversion
     * pipeline has not run yet.
     */
    public function conversionUrl(string $name): ?string
    {
        $path = data_get($this->conversions, $name.'.path');

        if (blank($path)) {
            return $this->url;
        }

        try {
            return Storage::disk($this->disk)->url($path);
        } catch (\Throwable) {
            return $this->url;
        }
    }
}

<?php

namespace App\Http\Resources\Backend\Cms;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class MediaResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...$this->getBaseAttributes($request),
            'folder_id' => $this->folder_id,
            'folder' => $this->whenLoaded('folder', fn (): array => [
                'uuid' => $this->folder->uuid,
                'name' => $this->folder->name,
                'path' => $this->folder->path,
            ]),
            'disk' => $this->disk,
            'path' => $this->path,
            'url' => $this->url,
            'file_name' => $this->file_name,
            'original_name' => $this->original_name,
            'mime_type' => $this->mime_type,
            'extension' => $this->extension,
            'media_type' => $this->media_type,
            'size' => $this->size,
            'size_human' => $this->humanSize(),

            // Emitted so the public component can set width/height attributes
            // and reserve the box before the image loads. Missing dimensions
            // are the single most common cause of cumulative layout shift.
            'width' => $this->width,
            'height' => $this->height,
            'duration' => $this->duration,

            'alt_text' => $this->alt_text,
            'caption' => $this->caption,
            'title' => $this->title,
            'description' => $this->description,
            'credit' => $this->credit,
            'focal_x' => $this->focal_x,
            'focal_y' => $this->focal_y,
            'blurhash' => $this->blurhash,
            'conversions' => $this->conversions,

            // Pivot data is only present when loaded through `mediables`.
            'collection' => $this->whenPivotLoaded('mediables', fn () => $this->pivot->collection),
            'sort_order' => $this->whenPivotLoaded('mediables', fn () => $this->pivot->sort_order),
        ];
    }

    /**
     * Human-readable size. Computed here rather than stored, because `size` is
     * an integer specifically so it can be summed and sorted.
     */
    protected function humanSize(): string
    {
        $bytes = (int) $this->size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes >= 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2).' '.$units[$i];
    }
}

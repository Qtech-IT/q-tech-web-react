<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class File extends Model
{

    protected $fillable = [
        'fileable_type',
        'fileable_id',
        'name',
        'display_name',
        'disk',
        'type',
        'size',
        'extension'
    ];


    /**
     * Summary of fileable
     * @return MorphTo<Model, File>
     */
    public function fileable(): MorphTo
    {
        return $this->morphTo();
    }
}

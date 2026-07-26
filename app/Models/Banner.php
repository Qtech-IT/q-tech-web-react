<?php

namespace App\Models;

use App\Traits\Common\Filterable;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use Filterable;

    protected $guarded = [];

    public function file()
    {
        return $this->morphOne(File::class, 'fileable');
    }
}

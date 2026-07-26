<?php

namespace App\Models;

use App\Enums\Common\Status;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class AppSetting extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'parent_id',
        'order_index',
        'description',
        'input_type',
        'default_value',
        'input_options',
        'setting_value',
        'status'
    ];


    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'input_options' => 'array',
            'status'        =>  Status::class
        ];
    }


    /**
     * Summary of booted
     * @return void
     */
    protected static function booted(): void
    {
        static::creating(function (Model $model) {
            $model->status     = Status::ACTIVE;
        });
    }


    /**
     * Summary of file
     * @return \Illuminate\Database\Eloquent\Relations\MorphOne
     */
    public function file(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable');
    }



    /**
     * scopeActive
     *
     * @param Builder $q
     *
     * @return Builder
     */
    public function scopeActive(Builder $q): Builder
    {
        return $q->where('status',Status::ACTIVE);
    }



}

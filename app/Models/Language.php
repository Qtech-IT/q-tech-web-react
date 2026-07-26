<?php

namespace App\Models;

use App\Enums\Common\Status;
use App\Traits\Common\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Language extends Model
{
	use Filterable;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array<int, string>
	 */
	protected $fillable = [
		'name',
		'code',
		'direction',
		'status',
		'is_default'
	];

	/**
	 * Get the attributes that should be cast.
	 *
	 * @return array<string, string>
	 */
	protected function casts(): array
	{
		return [
			'status'        => Status::class
		];
	}

	/**
	 * Summary of scopeDefault
	 * @param Builder $q
	 * @return Builder
	 */
	public function scopeDefault(Builder $q): Builder
	{
		return $q->where('is_default', true);
	}
}

<?php

namespace App\Models;

use App\Enums\Common\Status;
use App\Traits\Common\Filterable;
use App\Traits\Common\HasUuid;
use App\Traits\Common\Notify;
use App\Traits\Common\UsesUuidRouting;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
	use HasFactory;
	use Notifiable;
	use HasApiTokens;
	use Filterable ;
	use Notify ;
	use HasRoles ;
	use UsesUuidRouting ;
	use HasUuid;

	/**
	 * The attributes that are mass assignable.
	 */
	protected $fillable = [
		'name',
		'created_by',
		'updated_by',
		'uuid',
		'username',
		'email',
		'phone',
		'email_verified_at',
		'address',
		'password',
		'google2fa_secret',
		'recovery_codes',
		'two_factor_enabled',
		'two_factor_confirmed_at',
		'status',
		'is_kyc_verified',
		'last_login_at',
		'last_login_ip',
	];

	/**
	 * The attributes that should be hidden for arrays.
	 */
	protected $hidden = [
		'password',
		'remember_token',
		'google2fa_secret',
		'recovery_codes',
	];

	/**
	 * Get the attributes that should be cast.
	 *
	 * @return array<string, string>
	 */
	protected function casts(): array
	{
		return [
			'password'          => 'hashed',
			'address'           => 'object',
			'recovery_codes'    => 'object',
			'email_verified_at' => 'datetime',
			'status'            => Status::class,
			'last_login_at'     => 'datetime',
		];
	}

	/**
	 * Get the attributes that should be cast.
	 *
	 * @return array<string, string>
	 */
	protected function hidden(): array
	{
		return [
			'password'
		];
	}

	/**
	 * Summary of booted
	 * @return void
	 */
	protected static function booted(): void
	{
		static::creating(function (Model $model) {
			$model->created_by = auth_user()?->id;
		});

		static::updating(function (Model $model) {
			$model->updated_by = auth_user()?->id;
		});
	}

	/**
	 * Summary of otp
	 * @return \Illuminate\Database\Eloquent\Relations\MorphMany
	 */
	public function otp(): MorphMany
	{
		return $this->morphMany(VerificationCode::class, 'otpable');
	}

	/**
	 * Summary of file
	 * @return MorphOne<File, User>
	 */
	public function file(): MorphOne
	{
		return $this->morphOne(File::class, 'fileable');
	}

	/**
	 * Summary of createdBy
	 * @return BelongsTo<User, User>
	 */
	public function createdBy(): BelongsTo
	{
		return $this->belongsTo(self::class, 'created_by');
	}

	/**
	 * Summary of updatedBy
	 * @return BelongsTo<User, User>
	 */
	public function updatedBy(): BelongsTo
	{
		return $this->belongsTo(self::class, 'updated_by');
	}

	/**
	 * Summary of scopeWithNonSuperAdminRoles
	 * @param Builder $query
	 * @return Builder
	 */
	public function scopeWithNonSuperAdminRoles(Builder $query): Builder
	{
		return $query->whereHas('roles', fn ($q) => $q->where('is_super_admin', false));
	}
}

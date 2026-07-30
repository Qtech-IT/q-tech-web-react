<?php

namespace App\Http\Services\Backend;

use App\Constants\FilePathConstants;
use App\Enums\Common\Status;
use App\Enums\Settings\BulkActionType;
use App\Enums\Settings\FileKey;
use App\Enums\Settings\InputEnum;
use App\Models\KycLog;
use App\Models\User;
use App\Models\UserBalance;
use App\Traits\Common\Fileable;
use App\Traits\Common\ModelAction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Class AdminUserService
 *
 * Service class responsible for managing users, including CRUD operations,
 * file uploads, wallet creation, bulk actions, and statistics.
 */
class SystemUserService
{
	use ModelAction , Fileable ;

	/**
	 * Retrieve all users with optional search, date filters, and boolean filters.
	 *
	 * @return LengthAwarePaginator | Collection
	 */
	public function getAllUsers(): LengthAwarePaginator | Collection
	{
		return User::with(['file', 'createdBy:id,name', 'updatedBy:id,name'])
						->sortDefault()
						->booleanFilters(['is_kyc_verified'])
						->date()
						->search(['name', 'email', 'phone', 'username'])
						->filter(['status'])
						->fetch();
	}

	/**
	 * Get a list of active users with selected columns.
	 *
	 * @param array $columns Columns to select (default: ['id', 'name', 'email'])
	 * @return \Illuminate\Database\Eloquent\Collection
	 */
	public function getAllUsersList(array $columns = ['id', 'name', 'email']): \Illuminate\Database\Eloquent\Collection
	{
		return User::select($columns)
							->active()
							->orderBy('name')
							->fetch();
	}

	/**
	 * Get user statistics including total, active, inactive, and email verified count.
	 *
	 * @return array{active: int, email_verified: int, inactive: int, total: int}
	 */
	public function getUserStats(): array
	{
		return [
			'total'    => User::count(),
			'active'   => User::active()->count(),
			'inactive' => User::inactive()->count()
        ];
	}

	/**
	 * Create or update a user with optional profile image upload.
	 *
	 * @param Request $request
	 * @param int|null $id
	 * @return User
	 */
	public function saveUser(Request $request, ?int $id = null): User
	{
		return DB::transaction(callback: function () use ($request, $id): User {
			$user = $id ? User::with(['file'])
							  ->nonAdmin()
							  ->findOrFail($id) : new User();

			$user->name     = $request->input('name');
			$user->username = $request->input('username');
			$user->email    = $request->input('email');
			$user->phone    = $request->input('phone');
			$user->address  = $request->input('address');
			$user->status   = $request->input('status');

			if ($request->filled('password')) {
				$user->password = $request->input('password');
			}

			$user->save();

			// Handle profile image upload
			if ($request->hasFile('image')) {
				$pathConfig = FilePathConstants::getPath('profile');
				$this->saveFile(
				    model: $user,
				    response: $this->storeFile(
				        file: $request->file('image'),
				        location: $pathConfig['path'],
				        removeFile: $user?->file
				    ),
				    type: FileKey::AVATAR->value
				);
			}

			return $user->loadMissing(['file']);
		});
	}

	/**
	 * Delete a user along with associated files and wallets.
	 *
	 * @param string $uuid
	 * @return void
	 */
	public function deleteUser(string $uuid): void
	{
		$user = User::with(['file'])
						->findOrFailByUuid($uuid);

		DB::transaction(function () use ($user) {
			$this->purgeUser($user);
		});
	}

	/**
	 * Perform a bulk action on multiple users (active, inactive, delete, force delete , or restore).
	 *
	 * @param array $ids
	 * @param string $action
	 * @return void
	 * @throws \Exception
	 */
	public function handleBulkAction(array $ids, string $action): void
	{
		$query = User::whereIn('id', $ids);

		match ($action) {
			BulkActionType::ACTIVE->value   => $this->bulkStatusChange($query, Status::ACTIVE),
			BulkActionType::INACTIVE->value => $this->bulkStatusChange($query, Status::INACTIVE),
			BulkActionType::DELETE->value   => $this->bulkDelete($query),

			default => throw new \Exception('Invalid action'),
		};
	}

	/**
	 * Summary of bulkDelete
	 * @param Builder $query
	 * @return void
	 */
	private function bulkDelete(Builder $query): void
	{
		$query->with(['file'])
				->cursor()
				->each(function (User $user): void {
					DB::transaction(function () use ($user) {
						$this->purgeUser($user);
					});
				});
	}

	/**
	 * Summary of purgeUser
	 * @param User $user
	 * @return void
	 */
	public function purgeUser(User $user): void
	{
		DB::transaction(function () use ($user) {
			// Load relations to avoid lazy loading issues
			$user->loadMissing([
				'file',
				'otp',
				'roles'
			]);

			//  Delete OTP codes
			$user->otp()->delete();

			// Delete profile file if exists
			if ($user->file) {
				$pathConfig = FilePathConstants::getPath('profile');
				$this->unlink($pathConfig['path'], $user->file);
			}
			// Detach all roles (Spatie)
			$user->syncRoles([]);

			DB::statement('SET FOREIGN_KEY_CHECKS=0;');

			$user->delete();

			DB::statement('SET FOREIGN_KEY_CHECKS=1;');
		});
	}

	/**
	 * Summary of getAdvanceFilter
	 * @return array[]
	 */
	public function getAdvanceFilterOptions(): array
	{
		return [
			[
				'key'   => 'is_kyc_verified',
				'label' => translate('KYC Verified'),
				'type'  => InputEnum::BOOLEAN->value,
			],

			...$this->getCommonFilters()
		];
	}
}

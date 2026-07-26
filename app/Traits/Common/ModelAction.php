<?php

namespace App\Traits\Common;

use App\Enums\Common\Status;
use App\Enums\Settings\BulkActionType;
use App\Enums\Settings\InputEnum;
use App\Enums\Settings\SettingKey;
use App\Models\File;
use App\Models\User;
use App\Models\VerificationCode as ModelsVerificationCode;
use App\Traits\Common\Fileable as CommonFileable;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule as ValidationRule;
use Illuminate\Validation\Rules\Password;
use Spatie\Permission\Models\Role;

/**
 * Trait ModelAction
 *
 * Provides common actions for Eloquent models including:
 * - Status changes
 * - Bulk actions (update, delete, restore)
 * - File and OTP handling
 * - Relational data unlinking
 */
trait ModelAction
{
	use CommonFileable;

	/**
	 * Change the status of a single model record.
	 *
	 * @param array $request Request data containing the new status value
	 * @param array $actionData Configuration data: model, column, filters, etc.
	 * @return bool True if successful, false otherwise
	 */
	private function changeStatus(array $request, array $actionData): bool
	{
		try {
			$data = Arr::get($actionData, 'model')::where(Arr::get($actionData, 'filterable_attributes', []))
							->when(
							    Arr::get($actionData, 'recycle', false),
							    fn (Builder $q): Builder => $q->withTrashed()
							)
							->firstOrFail();

			$data->{Arr::get($actionData, 'column', 'status')} = Arr::get($request, 'value');
			$data->save();

			return true;
		} catch (\Exception $ex) {
			return false;
		}
	}

	/**
	 * Perform bulk actions on multiple model records.
	 *
	 * Supported actions: STATUS update, RESTORE, FORCE_DELETE, default DELETE.
	 *
	 * @param Request $request Request containing 'type', 'ids', 'value'
	 * @param array $actionData Configuration data: model, query, relations, etc.
	 * @return bool Always true (returns after processing)
	 */
	private function handleBulkAction(Request $request, array $actionData): bool
	{
		$action  = $request->input('action');
		$bulkIds = $request->input('ids');

		$modelQuery = Arr::get($actionData, 'query', null);
		$model      = $modelQuery ?? Arr::get($actionData, 'model')::whereIn('id', $bulkIds);

		switch ($action) {
			case BulkActionType::STATUS->value:
				$model->recycle()
					->lazyById(100)
					->each->update([BulkActionType::STATUS->value => $request->input('value')]);
				break;

			default:
				$model->when(
				    in_array($action, [BulkActionType::RESTORE->value, BulkActionType::PERMANENT_DELETE->value]),
				    fn (Builder $q): Builder => $q->onlyTrashed()
				)
					->withCount(Arr::get($actionData, 'with_count', []))
					->with(Arr::get($actionData, 'with', []))
					->cursor()
					->each(function (Model $record) use ($action, $actionData): void {
						switch ($action) {
							case BulkActionType::RESTORE->value:
								$record->restore();
								break;
							case BulkActionType::PERMANENT_DELETE->value:
								$this->handleForceDelete($record, $actionData);
								break;
							default:
								$this->handleDefaultDelete($record, $actionData);
								break;
						}
					});
				break;
		}

		return true;
	}

	/**
	 * Validate the bulk action request.
	 *
	 * Ensures required fields exist and are valid according to the model table.
	 *
	 * @param Request $request
	 * @param Model $model
	 * @throws \Illuminate\Validation\ValidationException
	 */
	public function validateBulkActonRequest(Request $request, Model $model): void
	{
		$tableName = $model->getTable();

		$request->validate([
			'bulk_ids'   => ['required', 'array'],
			'bulk_ids.*' => ['required', 'exists:' . $tableName . ',id'],
			'action'     => ['required', ValidationRule::in(BulkActionType::toArray())],
			'value'      => [
				ValidationRule::requiredIf(fn (): bool => $request->get('type') === BulkActionType::STATUS->value),
				function (string $attribute, mixed $value, $fail) use ($request) {
					if ($request->get('type') === BulkActionType::STATUS->value && !in_array($value, Status::getValues())) {
						$fail("The {$attribute} is invalid.");
					}
				},
			]
		]);
	}

	/**
	 * Handle force delete of a record, including unlinking files and relations.
	 *
	 * @param mixed $record
	 * @param array $actionData
	 */
	private function handleForceDelete(mixed $record, array $actionData): void
	{
		$this->unlinkData($record, $actionData);
		$record->forceDelete();
	}

	/**
	 * Unlink files and delete related data for a record.
	 *
	 * @param Model $record
	 * @param array $modelData
	 */
	private function unlinkData(Model $record, array $modelData): void
	{
		$fileTypes = collect(Arr::get($modelData, 'file_unlink', []));
		$relations = collect(Arr::get($modelData, 'with', []));

		// Unlink files
		$fileTypes->each(
		    fn (string $path, string $type): bool => $record->file()->where('type', $type)->each(
		        fn (File $file): bool => $this->unlink(location: $path, file: $file)
		    )
		);

		// Delete relational data (excluding files)
		$relations->filter(fn (string $relation): bool => $relation !== 'file')
				   ->each(fn (string $relation) => $record->{$relation}()->delete());
	}

	/**
	 * Handle default delete action for a record.
	 *
	 * Only deletes the record if related counts are zero.
	 *
	 * @param Model $record
	 * @param array $actionData
	 */
	private function handleDefaultDelete(Model $record, array $actionData): void
	{
		$counts = array_map(
		    fn (string $relation): bool => $record->{$relation . '_count'} > 0,
		    Arr::get($actionData, 'with_count', [])
		);

		if (!in_array(true, $counts, true)) {
			$record->delete();
		}
	}

	/**
	 * Summary of bulkStatusChange
	 * @param Builder $query
	 * @param Status $status
	 * @param string $col
	 * @return void
	 */
	private function bulkStatusChange(Builder $query, Status $status, string $col = 'status'): void
	{
		$query->lazyById(100)
						->each
						->update([$col => $status]);
	}

	/**
	 * Summary of bulkRestore
	 * @param Builder $query
	 * @return void
	 */
	private function bulkRestore(Builder $query): void
	{
		$query->onlyTrashed()->lazyById(100)
						->each
						->restore();
	}

	/**
	 * Save a single file for a model.
	 *
	 * @param Model $model
	 * @param array|null $response File response data
	 * @param string|null $type File type
	 * @return bool|File Returns the saved File or false if invalid
	 */
	private function saveFile(Model $model, ?array $response = null, ?string $type = null): mixed
	{
		if (is_array($response) && Arr::has($response, 'status')) {
			$file = new File([
				'display_name' => Arr::get($response, 'display_name'),
				'name'         => Arr::get($response, 'name', 'default'),
				'disk'         => Arr::get($response, 'disk', 'local'),
				'type'         => $type,
				'size'         => Arr::get($response, 'size', ''),
				'extension'    => Arr::get($response, 'extension', ''),
			]);

			$model->file()->save($file);
			return $file;
		}

		return false;
	}

	/**
	 * Save multiple files for a model.
	 *
	 * @param Model $model
	 * @param array $responses Array of file response data
	 * @param string|null $type File type
	 * @return bool Always true
	 */
	private function saveFiles(Model $model, array $responses = []): bool
	{
		$files = collect($responses)->map(
		    fn (array $response): File => new File([
				'display_name' => Arr::get($response, 'display_name'),
				'name'         => Arr::get($response, 'name', 'default'),
				'disk'         => Arr::get($response, 'disk', 'local'),
				'type'         => Arr::get($response, 'type'),
				'size'         => Arr::get($response, 'size', ''),
				'extension'    => Arr::get($response, 'extension', ''),
			])
		);

		if (!$files->isEmpty()) {
			$model->files()->saveMany($files);
		}

		return true;
	}

	/**
	 * Save an OTP for a model.
	 *
	 * Optionally deletes existing OTPs of the same type before saving.
	 *
	 * @param Model $sendTo
	 * @param string $template OTP template name
	 * @param bool $delete Whether to delete existing OTPs of this type
	 * @return ModelsVerificationCode
	 */
	private function saveOTP(Model $receiverModel, string $template, bool $delete = false): ModelsVerificationCode
	{
		$type = strtolower($template);

		if ($delete) {
			$receiverModel->otp()->where('type', $type)->delete();
		}

		$code = generateOTP();

		$expiredTimeInSecond = is_numeric(
		    $value = site_settings(SettingKey::OTP_EXPIRY_SECONDS->value, 200)
		) ? (int) $value : 200;

		$otp             = new ModelsVerificationCode();
		$otp->otp        = $code;
		$otp->type       = $type;
		$otp->expired_at = Carbon::now()->addSeconds($expiredTimeInSecond);

		$receiverModel->otp()->save($otp);

		return $otp;
	}

	/**
	 * Authorize bulk action based on action type
	 */
	protected function authorizeBulkAction(string $action, string $model): void
	{
		match ($action) {
			BulkActionType::ACTIVE->value,
			BulkActionType::INACTIVE->value         => $this->authorize('update', $model),
			BulkActionType::DELETE->value           => $this->authorize('delete', $model),
			BulkActionType::PERMANENT_DELETE->value => $this->authorize('forceDelete', $model),
			BulkActionType::RESTORE->value          => $this->authorize('restore', $model),
			default                                 => throw new \Exception('Invalid action'),
		};
	}

	/**
	 * Summary of getPasswordRules
	 * @param int $minlen
	 * @return array<Password|string>
	 */
	protected function getPasswordRules(int $minlen, bool $isConfirmed = true): array
	{
		$strongPasswordEnabled = site_settings(SettingKey::STRONG_PASSWORD->value) === Status::ACTIVE->value;

		$passwordRule = Password::min($minlen);

		if ($strongPasswordEnabled) {
			$passwordRule = $passwordRule
									->letters()
									->mixedCase()
									->numbers()
									->symbols()
									->uncompromised();
		}

		$rules = ['required', 'string', $passwordRule];

		if ($isConfirmed) {
			$rules[] = 'confirmed';
		}

		return $rules;
	}

	/**
	 * Summary of getCommonPasswordRules
	 * @return array<Password|string>
	 */
	protected function getCommonPasswordRules(): array
	{
		$strongPasswordEnabled = site_settings(SettingKey::STRONG_PASSWORD->value) === Status::ACTIVE->value;

		$minlen       = site_settings(SettingKey::MINIMUM_PASSWORD_LENGTH->value);
		$passwordRule = Password::min($minlen);

		if ($strongPasswordEnabled) {
			$passwordRule = $passwordRule
									->letters()
									->mixedCase()
									->numbers()
									->symbols()
									->uncompromised();
		}

		$rules = ['string', $passwordRule];

		return $rules;
	}

	/**
	 * Summary of getCommonFilters
	 * @return array<array|array{key: string, label: string, type: string>}
	 */
	protected function getCommonFilters(): array
	{
		return [
			[
				'key'     => 'status',
				'label'   => translate('Status'),
				'type'    => InputEnum::SELECT->value,
				'options' => [
					['value' => '',         'label' => translate('All Status')],
					...Status::options(),
				],
			],

			[
				'key'   => 'date_range',
				'label' => translate('Date'),
				'type'  => InputEnum::DATERANGE->value,
			]
		];
	}

	/**
	 * Apply stored filters to request for Filterable trait compatibility
	 * This runs in a separate queue process, so it won't affect web requests
	 */
	protected function applyFiltersToRequest(array $filters = []): void
	{
		if (!empty($filters)) {
			request()->merge($filters);
		}
	}

	/**
	 * Summary of verifyOtp
	 * @param User $user
	 * @param int|string $otpCode
	 * @throws Exception
	 * @return bool
	 */
	protected function verifyOtp(User $user, int | string $otpCode): bool
	{
		$otp = $user->otp()
						->where('otp', $otpCode)
						->first();

		if (!$otp) {
			throw new Exception('Invalid OTP code');
		}

		if (Carbon::now()->gt($otp->expired_at)) {
			$otp->delete();
			throw new Exception('OTP has expired');
		}

		return true;
	}

	/**
	 * Summary of formatRoleResource
	 * @param Role $resource
	 * @return array{description: mixed, display_name: mixed, guard_name: string|null, id: int|string, is_super_admin: bool, name: string, order_index: mixed, total_permissions: mixed, type: mixed}
	 */
	protected function formatRoleResource(Role $resource): array
	{
		return [
			'id'             => $resource->id,
			'name'           => $resource->name,
			'is_super_admin' => (bool) $resource->is_super_admin,
			'order_index'    => $resource->order_index,
			'type'           => $resource->type
		];
	}
}

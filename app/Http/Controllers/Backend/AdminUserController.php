<?php

namespace App\Http\Controllers\Backend;

use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\AdminUser\BulkUserRequest;
use App\Http\Requests\Backend\AdminUser\SaveUserRequest;
use App\Http\Requests\Backend\AdminUser\UpdateUser2FARequest;
use App\Http\Requests\Backend\AdminUser\UpdateUserStatusRequest;
use App\Http\Resources\Backend\Role\RoleResource;
use App\Http\Resources\Backend\User\UserResource;
use App\Http\Services\Backend\AdminUser\AdminUserService;
use App\Http\Services\Backend\RoleService;
use App\Models\User;
use App\Traits\Common\ModelAction;
use App\Traits\Common\ModelProperty;
use Exception;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class AdminUserController extends Controller
{
	use ModelAction, ModelProperty;

	protected array $modelProperty ;

	/**
	 * Constructor to inject services and apply middleware
	 */
	public function __construct(
	    protected AdminUserService $service,
	    protected RoleService $roleService
	) {
		$this->modelProperty = $this->getCommonProperty(
		    resourcePagePrefix :'AdminUsers',
		    routePrefix: 'backend.admin-users'
		);

		$this->authorizeResource(User::class);
	}

	/**
	 * Display a listing of users
	 */
	public function index(): Response
	{
		$users = formatResourceResponse(
		    $this->service->getAllUsers(),
		    UserResource::class
		);
		return AppResponse::asSuccess()
					->withComponent($this->modelProperty['pagePrefix'] . 'Index', [
						'title'                => translate('Admin Users'),
						'data'                 => $users,
						'stats'                => $this->service->getUserStats(),
						'modelProperty'        => $this->modelProperty,
						'advanceFilterOptions' => $this->service->getAdvanceFilterOptions()
					])->build();
	}

	/**
	 * Show form for creating a new user
	 */
	public function create(): Response
	{
		return AppResponse::asSuccess()
					->withComponent($this->modelProperty['pagePrefix'] . 'Save', [
						'modelProperty' => $this->modelProperty,
						'title'         => translate('Create Admin User'),
						'roles'         => formatResourceResponse(
						    $this->roleService->getActiveRoles(),
						    RoleResource::class
						),
					])->build();
	}

	/**
	 * Store a newly created user
	 */
	public function store(SaveUserRequest $request): RedirectResponse
	{
		$this->service->saveUser($request);
		return AppResponse::asSuccess()
									->withMessage('User created successfully.')
									->build();
	}

	/**
	 * Show form for editing a user
	 */
	public function edit(User $adminUser): Response
	{
		$user = User::with([
					'file',
					'roles',
				])
				->withNonSuperAdminRoles()
				->admin()
				->findOrFail($adminUser->id);

		return AppResponse::asSuccess()
					->withComponent($this->modelProperty['pagePrefix'] . 'Save', [
						'title'         => translate('Update User'),
						'modelProperty' => $this->modelProperty,
						'item'          => formatResourceResponse($user, UserResource::class),
					])->build();
	}

	/**
	 * Update a user's information
	 */
	public function update(SaveUserRequest $request, User $adminUser): RedirectResponse
	{
		$this->service->saveUser($request, $adminUser->id);

		return AppResponse::asSuccess()
									->withMessage('User updated successfully.')
									->build();
	}

	/**
	 * Delete a user
	 */
	public function destroy(User $adminUser): RedirectResponse
	{
		try {
			$this->service->deleteUser($adminUser->uuid);

			return AppResponse::asSuccess()
								->withMessage('User deleted successfully.')
								->build();
		} catch (\Exception $e) {
			return AppResponse::asError()
								->withMessage($e->getMessage())
								->build();
		}
	}

	/**
	 * Summary of forceDestroy
	 * @param string $uuid
	 * @return RedirectResponse
	 */
	public function forceDestroy(string $uuid): RedirectResponse
	{
		$this->authorize('forceDelete', User::class);

		try {
			$this->service->deleteUser($uuid);

			return AppResponse::asSuccess()
									->withMessage('User parmanently deleted.')
									->build();
		} catch (\Exception $e) {
			return AppResponse::asError()
									->withMessage($e->getMessage())
									->build();
		}
	}

	/**
	 * Update user status
	 */
	public function updateStatus(UpdateUserStatusRequest $request): RedirectResponse
	{
		$this->authorize('update', User::class);

		try {
			//SUPERADMIN CHECK
			$user = User::withNonSuperAdminRoles()
						->admin()
						->where('id', $request->input('id'))
						->first();

			if (!$user) {
				throw new Exception('Invalid request');
			}

			abortIfAuthUser($user);

			$this->changeStatus(
			    request    : $request->except('_token'),
			    actionData : [
					'model'                 => new User(),
					'filterable_attributes' => ['id' => $request->input('id')],
				]
			);

			return AppResponse::asSuccess()
									->withMessage('User status updated successfully.')
									->build();
		} catch (\Exception $ex) {
			return AppResponse::asError()
									->withMessage($ex->getMessage())
									->build();
		}
	}

	/**
	 * Perform bulk actions on users
	 */
	public function bulkAction(BulkUserRequest $request): RedirectResponse
	{
		$action = $request->input('action');
		$ids    = $request->input('ids');

		$this->authorizeBulkAction($action, User::class);

		try {
			$this->service->handleBulkAction($ids, $action);

			return AppResponse::asSuccess()
									->withMessage('Bulk action performed successfully.')
									->build();
		} catch (\Exception $e) {
			return AppResponse::asError()
									->withMessage($e->getMessage())
									->build();
		}
	}

	/**
	 * Update 2FA status for a user
	 */
	public function update2FA(UpdateUser2FARequest $request): RedirectResponse
	{
		$this->authorize('update', User::class);

		try {
			$user = User::withNonSuperAdminRoles()
							->admin()
							->findOrFail($request->input('user_id'));

			abortIfAuthUser($user);

			$enabled = (bool) $request->input('two_factor_enabled');

			$user->two_factor_enabled = $enabled;

			if (!$enabled) {
				$user->google2fa_secret        = null;
				$user->recovery_codes          = null;
				$user->two_factor_confirmed_at = null;
			}

			$user->save();

			return AppResponse::asSuccess()
										->withMessage('2FA status updated successfully.')
										->build();
		} catch (\Exception $e) {
			return AppResponse::asError()
					   ->withMessage($e->getMessage())
					   ->build();
		}
	}
}

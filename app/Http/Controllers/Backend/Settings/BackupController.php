<?php
namespace App\Http\Controllers\Backend\Settings;

use Inertia\Response;
use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;
use App\Http\Services\Backend\Settings\BackupService;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BackupController extends Controller
{
	use ModelProperty;

	/**
	 * Summary of __construct
	 * @param BackupService $backupService
	 */
	protected array $modelProperty ;

	public function __construct(protected BackupService $backupService)
	{
		$this->modelProperty = $this->getCommonProperty(
			resourcePagePrefix :'Backup',
			routePrefix: 'backend.backups'
		);
	}

	/**
	 * Display backup management page
	 */
	public function index(): Response
	{
		$this->authorize('view', 'backup');

		return AppResponse::asSuccess()
				->withComponent($this->modelProperty['pagePrefix'] . 'Index', [
					'title'        => translate('Database Backup Management'),
					'backups'      => $this->backupService->getAllBackups(),
					'storageInfo'  => $this->backupService->getStorageInfo(),
					'modelProperty'=> $this->modelProperty,
				])->build();
	}

	/**
	 * Create a new database backup
	 */
	public function createBackup(): RedirectResponse
	{
		$this->authorize('create', 'backup');

		try {
			$result = $this->backupService->createDatabaseBackup();

			return $this->handleResponse($result);
		} catch (\Exception $e) {
			return AppResponse::asError()
							->withMessage($e->getMessage())
							->build();
		}
	}

	/**
	 * Summary of deleteBackup
	 * @param int|string $backupId
	 * @return RedirectResponse
	 */
	public function deleteBackup(int | string $backupId): RedirectResponse
	{
		$this->authorize('delete', 'backup');

		try {
			$result = $this->backupService->deleteBackup($backupId);

			return $this->handleResponse($result);
		} catch (\Exception $e) {
			return AppResponse::asError()
					->withMessage($e->getMessage())
					->build();
		}
	}

	/**
	 * Delete all backups
	 */
	public function deleteAllBackups(): RedirectResponse
	{
		$this->authorize('delete', 'backup');

		try {
			$result = $this->backupService->deleteAllBackups();

			return $this->handleResponse($result);
		} catch (\Exception $e) {
			return AppResponse::asError()
						->withMessage($e->getMessage())
						->build();
		}
	}

	/**
	 * Download a backup file
	 */
	public function downloadBackup($backupId): BinaryFileResponse|RedirectResponse
	{
		$this->authorize('download', 'backup');

		try {
			$result = $this->backupService->getBackupPath($backupId);

			if ($result['status'] && file_exists($result['path'])) {
				return response()->download($result['path']);
			}

			return $this->handleResponse($result);
		} catch (\Exception $e) {
			return AppResponse::asError()
						->withMessage($e->getMessage())
						->build();
		}
	}
}

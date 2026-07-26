<?php

namespace App\Http\Controllers\Backend;

use App\Enums\Workflow\WorkflowAssignmentType;
use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\Response;

class PermissionController extends Controller
{
	use ModelProperty;

	/**
	 * Summary of store
	 * @param Request $request
	 * @return JsonResponse
	 */
	public function store(Request $request): JsonResponse
	{
		$user = $request->user();

		return AppResponse::asSuccess()
								->withData([
								])
								->build();
	}
}

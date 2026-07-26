<?php

namespace App\Http\Controllers\Backend\NotificationTemplate;

use App\Constants\GlobalConfig as ConstantsGlobalConfig;
use App\Enums\Settings\SettingKey;
use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\NotificationTemplate\NotificationTemplateRequest;
use App\Http\Resources\Backend\NotificationTemplate\NotificationTemplateResource;
use App\Http\Services\Backend\NotificationTemplate\NotificationTemplateService;
use App\Models\NotificationTemplate;
use App\Traits\Common\ModelAction;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;
use Inertia\Response as InertiaResponse;

class NotificationTemplateController extends Controller
{
	use ModelAction , ModelProperty;
	protected array $modelProperty;

	/**
	 * Constructor to inject services and apply middleware
	 */
	public function __construct(
	    protected NotificationTemplateService $service,
	) {
		$this->modelProperty = $this->getCommonProperty(
		    resourcePagePrefix : 'NotificationTemplate',
		    routePrefix        : 'backend.notification-templates'
		);

		$this->authorizeResource(NotificationTemplate::class);
	}

	/**
	 * Summary of index
	 * @return \Inertia\Response
	 */
	public function index(): InertiaResponse
	{
		$data = formatResourceResponse(
		    $this->service->getTemplates(),
		    NotificationTemplateResource::class
		);

		return AppResponse::asSuccess()
					->withComponent($this->modelProperty['pagePrefix'] . 'Index', [
						'title'         => translate('Notification Templates'),
						'data'          => $data,
						'stats'         => $this->service->getStats(),
						'modelProperty' => $this->modelProperty,
					])->build();
	}

	/**
	 * Summary of globalTemplate
	 * @return \Inertia\Response
	 */
	public function globalTemplate(): InertiaResponse
	{
		$this->authorize('view', NotificationTemplate::class);

		return AppResponse::asSuccess()
					->withComponent($this->modelProperty['pagePrefix'] . 'Global', [
						'title'                  => translate('Global Templates'),
						'default_mail_template'  => site_settings(SettingKey::DEFAULT_MAIL_TEMPLATE->value),
						'default_push_template'  => site_settings(SettingKey::DEFAULT_PUSH_TEMPLATE->value),
						'default_template_codes' => ConstantsGlobalConfig::DEFAULT_TEMPLATE_CODE,
						'modelProperty'          => $this->modelProperty
					])->build();
	}

	/**
	 * Summary of edit
	 * @param NotificationTemplate $notificationTemplate
	 * @return \Inertia\Response
	 */
	public function edit(NotificationTemplate $notificationTemplate): InertiaResponse
	{
		return AppResponse::asSuccess()
					->withComponent($this->modelProperty['pagePrefix'] . 'Save', [
						'title'         => translate('Update Notification Templates'),
						'item'          => new NotificationTemplateResource($notificationTemplate),
						'modelProperty' => $this->modelProperty
					])->build();
	}

	/**
	 * Summary of update
	 * @param NotificationTemplateRequest $request
	 * @param NotificationTemplate $notificationTemplate
	 * @return RedirectResponse
	 */
	public function update(NotificationTemplateRequest $request, NotificationTemplate $notificationTemplate): RedirectResponse
	{
		$this->service->save($request, $notificationTemplate);

		return AppResponse::asSuccess()
							->withMessage('Template saved successfully.')
							->build();
	}
}

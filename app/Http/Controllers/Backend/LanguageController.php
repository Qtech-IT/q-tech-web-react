<?php

namespace App\Http\Controllers\Backend;

use App\Constants\GlobalConfig;
use App\Enums\System\CacheKey;
use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\LanguageSaveRequest;
use App\Http\Requests\Backend\UpdateLanguageStatus;
use App\Http\Resources\Backend\LanguageResource;
use App\Http\Services\Backend\LanguageService;
use App\Models\Language;
use App\Traits\Common\ModelAction;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;

class LanguageController extends Controller
{
    use ModelAction , ModelProperty;

    protected array $modelProperty;

    /**
     * Constructor to inject services and apply middleware
     */
    public function __construct(
        protected LanguageService $service
    )
    {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix : 'Languages',
            routePrefix        : 'backend.languages'
        );

        $this->authorizeResource(Language::class);
    }

    /**
     * Summary of index
     * @return Response
     */
    public function index(): Response
    {
        $data = formatResourceResponse(
            $this->service->getLanguages(),
            LanguageResource::class
        );

        return AppResponse::asSuccess()
                    ->withComponent($this->modelProperty['pagePrefix'] . 'Index', [
                            'title'         => translate('Languages'),
                            'data'          => $data,
                            'langCodes'     => GlobalConfig::POPULAR_LANG_CODES,
                            'modelProperty' => $this->modelProperty,
                    ])->build();
    }

    /**
     * Summary of store
     * @param LanguageSaveRequest $request
     * @return RedirectResponse
     */
    public function store(LanguageSaveRequest $request): RedirectResponse
    {
        $this->service->save($request);

        Cache::forget(CacheKey::SITE_LANGUAGES->value);

        return AppResponse::asSuccess()
                            ->withMessage('Language saved successfully')
                            ->build();
    }

    /**
     * Summary of destroy
     * @param int|string $id
     * @return RedirectResponse
     */
    public function destroy(int | string $id): RedirectResponse
    {
        $this->service->destroy(id: $id);

        Cache::forget(CacheKey::SITE_LANGUAGES->value);

        return AppResponse::asSuccess()
                            ->withMessage('Language deleted successfully')
                            ->build();
    }

    /**
     * Summary of updateStatus
     * @param UpdateLanguageStatus $request
     * @return RedirectResponse
     */
    public function updateStatus(UpdateLanguageStatus $request): RedirectResponse
    {
        $this->authorize('update', Language::class);

        $this->changeStatus(request: $request->except(keys: '_token'), actionData: [
            'model'                 => new Language(),
            'filterable_attributes' => ['id' => $request->input('id')],
        ]);

        Cache::forget(CacheKey::SITE_LANGUAGES->value);

        return AppResponse::asSuccess()
                            ->withMessage('Language status updated successfully')
                            ->build();
    }

    /**
     * Summary of getTranslation
     * @param string $code
     * @throws \Exception
     * @return \Inertia\Response
     */
    public function getTranslation(string $code): Response
    {
        $this->authorize('view', Language::class);

        $language = Language::where('code', $code)
                            ->firstOrFail();

        $filePath = base_path('resources/lang/' . $language->code . '/messages.php');

        if (!file_exists($filePath)) {
            throw new \Exception(translate('Translation file for the selected language was not found.'));
        }

        return AppResponse::asSuccess()
                ->withComponent($this->modelProperty['pagePrefix'] . 'Translate', [
                        'title'           => translate('Language Translations'),
                        'language'        => formatResourceResponse($language, LanguageResource::class),
                        'translationData' => include($filePath),
                        'modelProperty'   => $this->modelProperty
        ])->build();
    }

    /**
     * Summary of translate
     * @param \Illuminate\Http\Request $request
     * @return RedirectResponse
     */
    public function translate(Request $request): RedirectResponse
    {
        $this->authorize('translate', Language::class);

        $request->validate([
            'code'       => 'required',
            'key_values' => 'required|array'
        ]);

        $this->service->translate($request);

        return AppResponse::asSuccess()
                            ->withMessage('Language translated successfully')
                            ->build();
    }

    /**
     * Summary of makeDefault
     * @param \Illuminate\Http\Request $request
     * @return RedirectResponse
     */
    public function makeDefault(Request $request): RedirectResponse{
        $this->authorize('update', Language::class);

        $request->validate([
            'id' => 'required|exists:languages,id',
        ]);

        $this->service->makeDefault($request);

        return AppResponse::asSuccess()
                            ->withMessage('Language set as default successfully')
                            ->build();
    }
}

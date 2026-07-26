<?php

namespace App\Http\Controllers\Backend\Settings;

use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Services\Backend\Settings\CacheService;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\Support\Facades\Artisan;
use Inertia\Response;

class CacheController extends Controller
{

    use ModelProperty;
    protected array $modelProperty;

    public function __construct(protected CacheService $cacheService)
    {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix :'Cache',
			routePrefix: 'backend.cache'
		);
    }


    /**
     * Summary of index
     * @return \Inertia\Response
     */
    public function index():Response
    {
        $this->authorize('view', 'cache');

        $cacheInfo = $this->cacheService->getCacheInformation();

        return AppResponse::asSuccess()
                    ->withComponent($this->modelProperty['pagePrefix'].'Index', [
                        'title'         => translate('Cache Configuration'),
                        'cacheInfo'     => $cacheInfo,
                        'modelProperty' => $this->modelProperty,
                    ])->build();
    }

    /**
     * Summary of clearSpecificCache
     * @param string $type
     * @return RedirectResponse
     */
    public function clearSpecificCache(string $type): RedirectResponse
    {
        $this->authorize('clear', 'cache');

        try {
            
            $result = $this->cacheService->clearCacheByType($type);

            return AppResponse::asSuccess()
                            ->withMessage("Successfully cleared {$type} cache.")
                            ->build();


        } catch (\Exception $e) {
            return AppResponse::asError()
                                ->withMessage($e->getMessage())
                                ->build();

        }
    }


    /**
     * Summary of clearAllCache
     * @return RedirectResponse
     */
    public function clearAllCache(): RedirectResponse
    {
        $this->authorize('clear', 'cache');
        
        try {
            // Clear all types of cache
            Artisan::call('cache:clear');
            Artisan::call('route:clear');
            Artisan::call('config:clear');
            Artisan::call('view:clear');
            optimize_clear();

            // If using OPcache
            if (function_exists('opcache_reset')) {
                opcache_reset();
            }

            return AppResponse::asSuccess()
                                ->withMessage('Successfully cleared all caches.')
                                ->build();


        } catch (\Exception $e) {

              return AppResponse::asError()
                                ->withMessage($e->getMessage())
                                ->build();
        }
    }



}

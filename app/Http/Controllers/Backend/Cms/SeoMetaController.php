<?php

namespace App\Http\Controllers\Backend\Cms;

use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Cms\SeoMetaFetchRequest;
use App\Http\Requests\Backend\Cms\SeoMetaSaveRequest;
use App\Http\Resources\Backend\Cms\SeoMetaResource;
use App\Http\Services\Backend\Cms\SeoService;
use App\Models\SeoMeta;
use App\Traits\Common\ModelProperty;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

/**
 * The shared SEO panel, addressed by morph owner rather than by SeoMeta id.
 *
 * `seo_meta` is a polymorphic side table — one row per (owner, locale) — so the
 * editor never navigates to an SEO record directly. It opens a page or a block
 * and the panel fetches and saves against that owner.
 *
 * `manage-seo` is a distinct permission because it is frequently a different
 * person from the one writing the content (§14).
 */
class SeoMetaController extends Controller
{
    use ModelProperty;

    protected array $modelProperty;

    /**
     * Constructor to inject services and apply middleware
     */
    public function __construct(
        protected SeoService $service
    ) {
        $this->modelProperty = $this->getCommonProperty(
            resourcePagePrefix: 'SeoMeta',
            routePrefix: 'backend.seo-meta'
        );

        // Deliberately NOT authorizeResource(): this controller exposes no
        // resource routes and no {seoMeta} route parameter, so the generated
        // `can:view,seoMeta` middleware would resolve against a route binding
        // that does not exist. Both actions authorize explicitly below.
    }

    /**
     * The stored SEO row for an owner, or null when it has never been
     * customised — the public render falls back through SeoService::resolve().
     */
    public function show(SeoMetaFetchRequest $request): JsonResponse|RedirectResponse
    {
        $this->authorize('view', SeoMeta::class);

        $owner = $this->service->resolveOwner(
            $request->validated('seoable_type'),
            $request->validated('seoable_id')
        );

        $seo = $this->service->forOwner($owner, $request->validated('locale'));

        return AppResponse::asSuccess()
            ->withData(formatResourceResponse($seo, SeoMetaResource::class))
            ->withMessage(translate('SEO settings loaded successfully'))
            ->build();
    }

    /**
     * Create or update the SEO row for an owner.
     *
     * updateOrCreate on (seoable_type, seoable_id, locale) is why there is no
     * separate update() — a concurrent double-save hits the unique index rather
     * than producing two competing rows.
     */
    public function store(SeoMetaSaveRequest $request): RedirectResponse
    {
        $this->authorize('manageSeo', SeoMeta::class);

        $owner = $this->service->resolveOwner(
            $request->validated('seoable_type'),
            $request->validated('seoable_id')
        );

        $this->service->save($request, $owner, $request->validated('locale'));

        return AppResponse::asSuccess()
            ->withMessage(translate('SEO settings saved successfully'))
            ->build();
    }
}

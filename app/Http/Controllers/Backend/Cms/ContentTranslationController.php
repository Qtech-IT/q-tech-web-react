<?php

namespace App\Http\Controllers\Backend\Cms;

use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Cms\ContentTranslationRequest;
use App\Http\Services\Cms\ContentTranslationService;
use App\Models\Block;
use App\Models\Cta;
use App\Models\Media;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\SectionBlock;

/**
 * Writes the non-routable translation overlay (schema doc §8.2).
 *
 * One controller for every owner type because they share a request shape, a
 * permission (`page.translate` — editing a non-default locale is one
 * capability, mirroring `language.translate`) and a service. Each method binds
 * its owner by uuid and hands off; the service owns validation and cache
 * invalidation.
 */
class ContentTranslationController extends Controller
{
    public function __construct(
        private readonly ContentTranslationService $service,
    ) {}

    public function section(ContentTranslationRequest $request, PageSection $page_section): mixed
    {
        $this->authorize('translate', Page::class);

        $this->service->saveSection($page_section, $request->locale(), $request->translations());

        return $this->ok();
    }

    public function block(ContentTranslationRequest $request, SectionBlock $section_block): mixed
    {
        $this->authorize('translate', Page::class);

        $this->service->saveBlock($section_block, $request->locale(), $request->translations());

        return $this->ok();
    }

    public function menuItem(ContentTranslationRequest $request, MenuItem $menu_item): mixed
    {
        $this->authorize('translate', Page::class);

        $this->service->saveMenuItem($menu_item, $request->locale(), $request->translations());

        return $this->ok();
    }

    public function cta(ContentTranslationRequest $request, Cta $cta): mixed
    {
        $this->authorize('translate', Page::class);

        $this->service->saveCta($cta, $request->locale(), $request->translations());

        return $this->ok();
    }

    public function media(ContentTranslationRequest $request, Media $media): mixed
    {
        $this->authorize('translate', Page::class);

        $this->service->saveMedia($media, $request->locale(), $request->translations());

        return $this->ok();
    }

    public function globalBlock(ContentTranslationRequest $request, Block $block): mixed
    {
        $this->authorize('translate', Page::class);

        $this->service->saveGlobalBlock($block, $request->locale(), $request->translations());

        return $this->ok();
    }

    private function ok(): mixed
    {
        return AppResponse::asSuccess()
            ->withMessage(translate('Translation saved'))
            ->build();
    }
}

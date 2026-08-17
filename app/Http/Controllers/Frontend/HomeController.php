<?php

namespace App\Http\Controllers\Frontend;

use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Services\Frontend\PageRenderService;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        protected PageRenderService $render,
    ) {}

    /**
     * The public homepage.
     *
     * Renders whatever page is flagged `is_homepage`, through the section
     * registry. No hardcoded content and no hardcoded section order — an editor
     * reordering sections in the page builder changes what this returns.
     *
     * A fresh install has no homepage yet, which is not an error: the shell
     * still renders (header, navigation, footer) with an empty section list, so
     * the site is navigable before any content exists.
     */
    public function index(): Response
    {
        $page = $this->render->homepage();

        return AppResponse::asSuccess()
            ->withComponent('Public/Home', [
                'title' => $page?->title ?? translate('Home'),
                ...($page ? $this->render->cachedPayload($page) : [
                    'page' => null,
                    'sections' => [],
                    'sectionTypes' => [],
                    'seo' => [],
                ]),
            ])->build();
    }
}

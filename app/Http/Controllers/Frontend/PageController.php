<?php

namespace App\Http\Controllers\Frontend;

use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use App\Http\Services\Backend\Cms\RedirectService;
use App\Http\Services\Frontend\PageRenderService;
use App\Models\Redirect;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Every public URL that is not the homepage.
 *
 * ONE controller for the whole site, not one per content type. A service page,
 * a technology page and a privacy policy differ only in which sections an
 * editor put on them — they share a URL space, a publishing workflow, a SEO
 * record and a redirect table, so giving each its own route and controller
 * would be three copies of this file that can drift apart on the one thing
 * that must never differ: how a URL resolves.
 *
 * Adding `/technologies/laravel` after this exists is authoring, not coding.
 */
class PageController extends Controller
{
    public function __construct(
        protected PageRenderService $render,
        protected RedirectService $redirects,
    ) {}

    /**
     * Resolve one path, in three steps.
     *
     * The order matters. A live page must win over a stale redirect — an
     * editor who renames a page away and later creates a new one at the old
     * URL expects the new page, not a bounce to wherever the old one went.
     *
     * The path comes from the request rather than a route parameter because
     * this is registered as a fallback — see the note in routes/web.php for
     * why it is a fallback and not a catch-all.
     */
    public function __invoke(Request $request): mixed
    {
        $path = $this->render->normalizePath($request->path());

        /*
         * A URL under a reserved prefix that got this far is a missing ADMIN or
         * system route, not a missing page. Handing it the public 404 shell
         * would render the marketing header and footer over a broken admin
         * link; `abort()` lets the application's own handler answer, which is
         * what did so before this route existed.
         */
        if ($this->isReserved($path)) {
            abort(Response::HTTP_NOT_FOUND);
        }

        $page = $this->render->byPath($path);

        if ($page !== null) {
            return AppResponse::asSuccess()
                ->withComponent('Public/Page', [
                    'title' => $page->title,
                    ...$this->render->cachedPayload($page),
                ])->build();
        }

        $redirect = $this->redirects->resolve($path, (int) config('cms.site_id'));

        if ($redirect instanceof Redirect) {
            return $this->follow($redirect);
        }

        return $this->notFound();
    }

    /**
     * Is this path owned by the application rather than by the CMS?
     *
     * Reuses `cms.reserved_path_prefixes` — the same list `PageSaveRequest`
     * validates new slugs against — so the set of addresses an editor cannot
     * claim and the set this controller refuses to answer for are one list,
     * not two that drift.
     */
    protected function isReserved(string $path): bool
    {
        $first = explode('/', trim($path, '/'))[0] ?? '';

        return $first !== '' && in_array(
            $first,
            (array) config('cms.reserved_path_prefixes'),
            true
        );
    }

    /**
     * Follow a matched redirect.
     *
     * The query string is carried over when the rule says to, because the
     * campaign parameters on an emailed link are the whole reason a marketing
     * team notices the link was renamed at all.
     */
    protected function follow(Redirect $redirect): RedirectResponse
    {
        $this->redirects->recordHit($redirect);

        $target = $redirect->to_path;

        if ($redirect->preserve_query && filled(request()->getQueryString())) {
            $target .= (str_contains($target, '?') ? '&' : '?').request()->getQueryString();
        }

        return redirect()->to($target, $redirect->status_code);
    }

    /**
     * The 404.
     *
     * Rendered from a `system` page at `/404` when an editor has authored one,
     * so the copy, the artwork and the "here is where to go instead" links are
     * all editable like any other page. When it is absent the shell still
     * renders — header, navigation and footer — with a translated line and no
     * sections, which is the correct state for a fresh install rather than a
     * crash.
     *
     * Always a real 404 status. A soft 404 (missing page, 200 response) gets
     * indexed as a real page by crawlers and disappears from error monitoring.
     */
    protected function notFound(): mixed
    {
        $page = $this->render->notFoundPage();

        return AppResponse::asSuccess()
            ->withHttpCode(Response::HTTP_NOT_FOUND)
            ->withComponent('Public/NotFound', [
                'title' => $page?->title ?? translate('Page Not Found'),
                ...($page ? $this->render->cachedPayload($page) : [
                    'page' => null,
                    'sections' => [],
                    'sectionTypes' => [],
                    'seo' => [],
                    'breadcrumbs' => [],
                ]),
            ])->build();
    }
}

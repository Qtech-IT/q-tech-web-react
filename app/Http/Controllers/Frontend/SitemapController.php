<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Services\Frontend\SitemapService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * `/sitemap.xml`.
 *
 * Not an `AppResponse` — that builder only emits Inertia or JSON. XML goes back
 * as a plain response; all assembly lives in `SitemapService`.
 */
class SitemapController extends Controller
{
    public function __invoke(Request $request, SitemapService $sitemap): Response
    {
        abort_unless($sitemap->sitemapEnabled(), Response::HTTP_NOT_FOUND);

        return response(
            $sitemap->xml($request->query('part') ? (string) $request->query('part') : null),
            Response::HTTP_OK,
            ['Content-Type' => 'application/xml; charset=UTF-8'],
        );
    }
}

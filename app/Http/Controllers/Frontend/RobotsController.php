<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Services\Frontend\SitemapService;
use Symfony\Component\HttpFoundation\Response;

/**
 * `/robots.txt`.
 *
 * Generated, not a static file: the rules follow `reserved_path_prefixes`, the
 * environment (a non-production copy disallows everything), and the admin's
 * `robots_txt_extra` setting. See `SitemapService::robotsTxt()`.
 */
class RobotsController extends Controller
{
    public function __invoke(SitemapService $sitemap): Response
    {
        return response(
            $sitemap->robotsTxt(),
            Response::HTTP_OK,
            ['Content-Type' => 'text/plain; charset=UTF-8'],
        );
    }
}

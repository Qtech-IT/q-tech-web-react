<?php

namespace App\Http\Controllers\Frontend;

use App\Facades\AppResponse;
use App\Http\Controllers\Controller;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Public homepage shell.
     *
     * Intentionally prop-less: the CMS content model does not exist yet and
     * the page components must survive missing data.
     */
    public function index(): Response
    {
        return AppResponse::asSuccess()
            ->withComponent('Public/Home', [
                'title' => translate('Home'),
            ])->build();
    }
}

<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Http\Services\Backend\DashboardService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Constructor to inject services.
     */
    public function __construct(
        protected DashboardService $service
    ) {}

    /**
     * The admin landing page: headline CMS metrics and a recent-activity list.
     */
    public function index(): Response
    {
        $this->authorize('view', 'dashboard');

        return Inertia::render('Backend/Dashboard/Index', [
            'stats' => $this->service->stats(),
            'recentPages' => $this->service->recentPages(),
        ]);
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckArea
{
    public function handle(Request $request, Closure $next, $area)
    {
        if ($request->route('area') !== $area) {
            // abort(404);
            throw new \Exception('This area is not allowed');
        }

        return $next($request);
    }
}

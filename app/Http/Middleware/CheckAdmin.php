<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckAdmin
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $user = auth_user();
            if(!$user->is_admin){
                return redirect()->route('frontend.home')->with('error', 'You do not have permission to access this page.');
            }
        } catch (\Throwable $th) {
            //throw $th;
        }

        return $next($request);
    }
}

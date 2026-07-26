<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * If the user is already authenticated, redirect them to the appropriate
     * dashboard based on their guard. Otherwise, continue with the request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string ...$guards  Optional list of guards to check
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        // If no guards are provided, use the default (null)
        $guards = empty($guards) ? [null] : $guards;

        // Loop through each guard and check authentication
        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $user = Auth::guard($guard)->user();

                if ($user->is_admin) {
                    return redirect()->route('backend.dashboard');
                }

                return redirect()->route('frontend.home'); // replace with your frontend route
            }
        }

        // If not authenticated, continue with the request
        return $next($request);
    }
}

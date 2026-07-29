<?php

use App\Constants\GlobalConfig;
use App\Http\Helpers\ExceptionHelper;
use App\Http\Middleware\Authenticate;
use App\Http\Middleware\LanguageMiddleware;
use App\Http\Middleware\RedirectIfAuthenticated;
use App\Http\Middleware\Sanitization;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))

    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware(['web'])
                ->prefix('backend')
                ->as('backend.')
                ->group(base_path('routes/backend.php'));
        }
    )

    ->withMiddleware(function (Middleware $middleware): void {
        // The theme cookie is stamped server side and read/written by JS before
        // first paint, so it must stay readable (unencrypted, not httpOnly).
        $middleware->encryptCookies(except: [
            GlobalConfig::THEME_COOKIE_NAME,
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            LanguageMiddleware::class,
        ]);

        $middleware->alias([
            'sanitization' => Sanitization::class,
            'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
            'auth' => Authenticate::class,
            'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
            'auth.session' => \Illuminate\Session\Middleware\AuthenticateSession::class,
            'cache.headers' => \Illuminate\Http\Middleware\SetCacheHeaders::class,
            'can' => \Illuminate\Auth\Middleware\Authorize::class,
            'guest' => RedirectIfAuthenticated::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Handle Inertia exception responses
        $exceptions->respond(function (
            $response,
            \Throwable $exception,
            \Illuminate\Http\Request $request
        ): mixed {
            if (
                $exception instanceof \Illuminate\View\ViewException && str_contains($exception->getMessage(), 'Vite manifest not found')
            ) {
                return response()->view('errors.vite-missing', [
                    'message' => translate('Vite manifest not found. Please run `npm run dev` or `npm run build` to generate assets.'),
                ], 500);
            }

            if (
                $exception instanceof \Illuminate\Validation\ValidationException
                 || $exception instanceof \Illuminate\Auth\AuthenticationException) {
                return $response;
            }

            return ExceptionHelper::handleInertiaException($response, $exception, $request);
        });

        // Handle unauthenticated users
        $exceptions->renderable(function (
            AuthenticationException $exception,
            \Illuminate\Http\Request $request
        ) {
            return ExceptionHelper::handleUnauthenticated($exception, $request);
        });
    })->create();

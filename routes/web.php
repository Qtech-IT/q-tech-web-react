<?php

use App\Http\Controllers\Frontend\ContactController;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\LocaleController;
use App\Http\Controllers\Frontend\PageController;
use App\Http\Controllers\Frontend\SubscriptionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
|
| Backend routes live in routes/backend.php (prefixed with /backend).
|
*/

Route::middleware(['sanitization'])->group(function (): void {
    Route::get('/', [HomeController::class, 'index'])->name('home');

    /*
     * Newsletter signup.
     *
     * Throttled because it is the only unauthenticated WRITE on the public
     * site: without a limit it is a free way to fill a table, and `email:dns`
     * makes every attempt cost a DNS lookup. Six per minute per IP is well
     * above what a person needs and well below what a script wants.
     */
    Route::post('subscribe', [SubscriptionController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('subscribe');

    /*
     * Contact form. Like `subscribe` it is an unauthenticated write, so it is
     * throttled. The limit counts failed attempts too (validation errors, a
     * mistyped captcha-style honeypot), so it has to leave room for a person
     * who fixes a field and resubmits a few times — 15/min per IP does that
     * while still being far below what a script wants. The destination inbox is
     * resolved server-side from the section, never from the request body.
     */
    Route::post('contact', [ContactController::class, 'store'])
        ->middleware('throttle:15,1')
        ->name('contact.store');

    /*
     * Public language switch. POST — see `LocaleController::update()`; a GET
     * here would be followed by every crawler and prefetcher there is.
     */
    Route::post('locale/{code}', [LocaleController::class, 'update'])
        ->middleware('throttle:20,1')
        ->name('locale.update');

    /*
     * Every other public URL: the whole CMS page tree behind one route.
     *
     * `Route::fallback()`, NOT `Route::get('/{path}')->where('path', '.*')`.
     *
     * A catch-all is a normal route, and Laravel matches routes in
     * REGISTRATION order. This file is loaded before the `then` callback in
     * bootstrap/app.php registers routes/backend.php, so a catch-all here
     * matches `/backend/login` first and shadows the entire admin panel — which
     * is exactly what it did before this comment existed.
     *
     * The obvious patch is a negative-lookahead constraint listing the prefixes
     * to avoid. It is the wrong fix twice over: `->where()` is keyed by
     * parameter name, so chaining several calls silently keeps only the LAST
     * one, and even done correctly the list has to be updated by hand every
     * time the application grows a route prefix — a shadowed admin discovered
     * in production.
     *
     * A fallback carries the semantics we actually want — "render a CMS page
     * when nothing else claimed this URL" — is matched only after every real
     * route has been given its chance whatever the registration order, and is
     * GET-only by definition.
     *
     * One route for the whole content tree rather than one per content type:
     * pages, services, technologies and legal pages all live in `pages` and
     * resolve through the same unique index. See `PageController`.
     */

    Route::fallback(PageController::class)->name('page');
});

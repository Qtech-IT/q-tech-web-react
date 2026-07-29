<?php

use App\Http\Controllers\Frontend\HomeController;
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
});

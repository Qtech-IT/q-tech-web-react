<?php

use App\Http\Controllers\Auth\AuthenticateController;
use App\Http\Controllers\Auth\PasswordResetController;
use Illuminate\Support\Facades\Route;

/**
 * ======================================
 * GUEST ADMIN ROUTES
 * ======================================
 */
Route::middleware(['guest:web'])
    ->group(function () {
        // Login routes
        Route::controller(AuthenticateController::class)->group(function () {
            Route::get('login', 'login')->name('login');
            Route::post('authenticate', 'authenticate')->name('authenticate');
			Route::get('2fa-verification', 'show2faForm')->name('2fa.verification.form');
			Route::post('2fa-verification', 'verify2FA')->name('2fa.verification.submit');
        });

        // Password reset routes
        Route::controller(PasswordResetController::class)
            ->prefix('password')
            ->name('password.')
            ->group(function () {
                Route::get('forgot', 'showRequestForm')->name('request.form');
                Route::post('forgot', 'sendOtp')->name('request.send');
                Route::get('verify', 'showOtpForm')->name('verify.form');
                Route::post('verify', 'verifyOtp')->name('verify.submit');
                Route::get('reset', 'showResetPasswordForm')->name('reset.form');
                Route::post('reset', 'updatePassword')->name('reset.submit');
            });
    });

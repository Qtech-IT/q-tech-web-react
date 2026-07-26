<?php

namespace App\Http\Helpers;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ExceptionHelper
{
    /**
     * Error page mappings
     */
    protected static array $errorPages = [
        404 => 'Errors/404',
        403 => 'Errors/403',
        500 => 'Errors/500',
        503 => 'Errors/503',
        419 => 'Errors/419',
        429 => 'Errors/429',
    ];

    /**
     * Default error messages
     */
    protected static array $defaultMessages = [
        400 => 'Bad Request',
        401 => 'Unauthorized',
        403 => 'Access Forbidden',
        404 => 'Page Not Found',
        419 => 'Page Expired',
        429 => 'Too Many Requests',
        500 => 'Internal Server Error',
        503 => 'Service Unavailable',
    ];

    /**
     * Handle Inertia exception response
     */
    public static function handleInertiaException(
        \Symfony\Component\HttpFoundation\Response $response,
        \Throwable $exception,
        Request $request
    ) {
        // Get status code
        $status = self::getStatusCode($response, $exception);

        // Get exception message
        $message = $exception->getMessage();

        // Get error page component
        $errorPage = self::getErrorPage($status);

        // Render the error page
        return Inertia::render($errorPage, [
            'status'         => $status,
            'message'        => $message ?: self::getDefaultMessage($status),
            'originalStatus' => $response->getStatusCode(),
        ])->toResponse($request)->setStatusCode($status);
    }

    /**
     * Get status code from response or exception
     */
    public static function getStatusCode(
        \Symfony\Component\HttpFoundation\Response $response,
        \Throwable $exception
    ): int {
        $status = $response->getStatusCode();

        // If status is 0 or invalid, determine from exception type
        if ($status === 0 || $status < 100 || $status > 599) {
            $status = self::getStatusCodeFromException($exception);
        }

        return $status;
    }

    /**
     * Get status code from exception type
     */
    public static function getStatusCodeFromException(\Throwable $exception): int
    {
        return match (true) {
            $exception instanceof HttpException             => $exception->getStatusCode(),
            $exception instanceof ModelNotFoundException    => 404,
            $exception instanceof AccessDeniedHttpException => 403,
            $exception instanceof AuthenticationException   => 401,
            $exception instanceof ValidationException       => 422,
            default                                         => self::getStatusCodeFromExceptionCode($exception->getCode()),
        };
    }

    /**
     * Get valid HTTP status code from exception code
     */
    protected static function getStatusCodeFromExceptionCode(int $code): int
    {
        // If code is 0 or not a valid HTTP status code, return 500
        if ($code === 0 || $code < 100 || $code > 599) {
            return 500;
        }

        return $code;
    }

    /**
     * Get error page component for status code
     */
    public static function getErrorPage(int $status): string
    {
        // Check if we have a custom error page for this status
        if (isset(self::$errorPages[$status])) {
            return self::$errorPages[$status];
        }

        // For server errors, use 500 page
        if ($status >= 500 || $status === 0) {
            return 'Errors/500';
        }

        // For client errors, use 404 page
        if ($status >= 400) {
            return 'Errors/404';
        }

        // Default to 500 error page
        return 'Errors/500';
    }

    /**
     * Get default message for status code
     */
    public static function getDefaultMessage(int $status): string
    {
        return translate(self::$defaultMessages[$status] ?? 'An error occurred');
    }

    /**
     * Handle unauthenticated user
     */
    public static function handleUnauthenticated(
        AuthenticationException $exception,
        Request $request
    ) {
        // For JSON requests
        if ($request->expectsJson()) {
            return response()->json(['message' => $exception->getMessage()], 401);
        }

        if(!isAdminRoute()) {
            return redirect()->guest(route('login'));
        }
        // Redirect to login
        return redirect()->guest(route('backend.login'));
    }

    /**
     * Add custom error page mapping
     */
    public static function addErrorPage(int $status, string $component): void
    {
        self::$errorPages[$status] = $component;
    }

    /**
     * Add custom default message
     */
    public static function addDefaultMessage(int $status, string $message): void
    {
        self::$defaultMessages[$status] = $message;
    }

    /**
     * Get all error page mappings
     */
    public static function getErrorPages(): array
    {
        return self::$errorPages;
    }

    /**
     * Get all default messages
     */
    public static function getDefaultMessages(): array
    {
        return self::$defaultMessages;
    }
}

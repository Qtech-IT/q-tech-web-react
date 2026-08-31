<?php

namespace App\Builders;

use Inertia\Inertia;
use Illuminate\Support\Arr;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\Collection;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Class AppResponseBuilder
 *
 * A unified response builder for API and Inertia responses.
 * Supports success/error responses, data formatting, pagination metadata,
 * appending extra props, and rendering Inertia components.
 */
class AppResponseBuilder
{
	private int $code;
	private ?string $message;

	private bool $success;
	private array $httpHeaders     = [];
	private mixed $data            = null;
	private array $response        = [];
	private array $appends         = [];
	private ?string $component     = null;
	private array $additionalProps = [];
	private array $routeParams     = [];
	private ?string $redirectRoute = null;

	public function __construct(bool $success = true, int $code = Response::HTTP_OK, ? string $message = null)
	{
		$this->success = $success;
		$this->code    = $code;
		$this->message = $message;
	}

	/**
	 * Mark response as success
	 */
	public static function asSuccess(?int $code = null): static
	{
		return new static(true, $code ?? Response::HTTP_OK);
	}

	/**
	 * Create a response from a given status and optional message.
	 *
	 * @param bool $status Indicates success (true) or error (false)
	 * @param string|null $message Optional message
	 * @param int|null $code Optional HTTP code
	 * @return static
	 */
	public static function fromStatus(bool $status = true, ?string $message = null, ?int $code = null): static
	{
		return new static(
			$status,
			$code ?? ($status ? Response::HTTP_OK : Response::HTTP_BAD_REQUEST),
			$message);
	}

	/**
	 * Set redirect route if needed
	 */
	public function withRedirect(?string $route = null, array $routeParams = []): self
	{
		$this->redirectRoute = $route;
		$this->routeParams   = $routeParams;
		return $this;
	}

	public function withJson(): self
	{
		request()->headers->set('Content-Type', 'application/json');
		request()->headers->set('Accept', 'application/json');
		$this->httpHeaders['Content-Type'] = 'application/json';
		return $this;
	}

	/**
	 * Mark response as error
	 */
	public static function asError(?int $code = null): static
	{
		return new static(false, $code ?? Response::HTTP_BAD_REQUEST, trans('Error'));
	}

	/**
	 * Set message
	 */
	public function withMessage(string $message, array $replace = [], ?string $locale = null): self
	{
		$this->message = translate($message);
		return $this;
	}

	/**
	 * Set HTTP headers
	 */
	public function withHttpHeaders(?array $headers): self
	{
		$this->httpHeaders = $headers ?? [];
		return $this;
	}

	/**
	 * Set HTTP code
	 */
	public function withHttpCode(int $code): self
	{
		$this->code = $code;
		return $this;
	}

	/**
	 * Attach data to response
	 */
	public function withData(mixed $resource, mixed $resourceNamespace = null): self
	{
		$data = [];

		if (is_array($resource)) {
			foreach ($resource as $key => $res) {
				$resNamespace = $resourceNamespace[$key] ?? null;
				$data[$key]   = $this->formatResource($res, $resNamespace);
				if ($res instanceof LengthAwarePaginator) {
					$this->appendPaginationMeta($res, "{$key}_pagination_meta");
				}
			}
		} else {
			$data = $this->formatResource($resource, $resourceNamespace);
			if ($resource instanceof LengthAwarePaginator) {
				$this->appendPaginationMeta($resource, 'pagination_meta');
			}
		}

		$this->data = $data;
		return $this;
	}

	/**
	 * Format a resource using a namespace (Resource class)
	 */
	private function formatResource(mixed $resource, mixed $resourceNamespace): mixed
	{
		if ($resourceNamespace) {
			if ($resource instanceof LengthAwarePaginator || $resource instanceof Collection) {
				return $resourceNamespace::collection($resource)->resolve();
			}
			return $resourceNamespace::make($resource);
		}
		return $resource instanceof LengthAwarePaginator ? $resource->items() : $resource;
	}

	/**
	 * Append pagination meta to response for any paginator type
	 */
	private function appendPaginationMeta(mixed $resource, string $key): void
	{
		$query = request()->query();
		$meta  = [];

		if ($resource instanceof LengthAwarePaginator) {
			$currentPage = $resource->currentPage();
			$lastPage    = $resource->lastPage();

			$meta = [
				'total'         => $resource->total(),
				'per_page'      => $resource->perPage(),
				'current_page'  => $currentPage,
				'last_page'     => $lastPage,
				'from'          => $resource->firstItem(),
				'to'            => $resource->lastItem(),
				'prev_page_url' => $resource->previousPageUrl(),
				'next_page_url' => $resource->nextPageUrl(),
				'prev_page'     => $currentPage > 1 ? $currentPage - 1 : null,
				'next_page'     => $currentPage < $lastPage ? $currentPage + 1 : null,
				'path'          => $resource->path(),
				'query'         => $query,
			];
		} elseif ($resource instanceof \Illuminate\Pagination\Paginator || $resource instanceof \Illuminate\Pagination\CursorPaginator) {
			$meta = [
				'per_page'    => $resource->perPage(),
				'next_cursor' => method_exists($resource, 'nextCursor') ? $resource->nextCursor()?->encode() : null,
				'prev_cursor' => method_exists($resource, 'previousCursor') ? $resource->previousCursor()?->encode() : null,
				'path'        => $resource->path(),
				'query'       => $query,
			];
		}

		$this->append($key, $meta);
	}

	/**
	 * Append arbitrary data
	 */
	public function append(mixed $key = null, mixed $value = null, ?array $data = null): self
	{
		if (!$key) {
			if ($data) {
				$this->appends = $data;
			}
		} else {
			$this->appends[$key] = $value;
		}

		return $this;
	}

	/**
	 * Conditional execution
	 */
	public function when(bool $condition, callable $callback): mixed
	{
		return $condition ? $callback($this) : $this;
	}

	/**
	 * Set Inertia component and additional props
	 */
	public function withComponent(string $component, ?array $additionalProps = []): self
	{
		$this->component       = $component;
		$this->additionalProps = $additionalProps ?? [];
		return $this;
	}

	/**
	 * Build the response (JSON or Inertia)
	 */
	public function build(): mixed
	{
		return request()->is('api/*') || request()->wantsJson() || request()->expectsJson()
							? $this->buildJsonResponse()
							: $this->buildInertiaResponse();
	}

	/**
	 * Build JSON response
	 */
	private function buildJsonResponse(): JsonResponse
	{
		$this->response = array_merge([
			'success' => $this->success,
			'code'    => $this->code,
			'message' => $this->message,
		], $this->data ? ['data' => $this->data] : [], $this->appends);

		return response()->json($this->response, $this->code, $this->httpHeaders);
	}

	/**
	 * Build Inertia response
	 */
	private function buildInertiaResponse(): mixed
	{
		$props = array_merge(
			['success' => $this->success],
			$this->data ? ['data' => $this->data] : [],
			$this->appends,
			$this->additionalProps
		);

		if ($this->component) {
			$page = Inertia::render($this->component, $props);

			/*
			 * An Inertia page normally goes back as a Responsable and Laravel
			 * converts it, which is why the status code was silently dropped here
			 * for so long — every admin screen is a 200, so nothing noticed.
			 *
			 * A public error page is the case that breaks: a 404 rendered with a
			 * 200 status is a soft 404, which crawlers index as a real page and
			 * which makes a genuinely missing URL invisible in error monitoring.
			 *
			 * Converted eagerly ONLY for a non-200, so every existing caller keeps
			 * returning the exact same object it did before.
			 */
			if ($this->code !== Response::HTTP_OK) {
				return $page->toResponse(request())->setStatusCode($this->code);
			}

			return $page;
		}

		$flashKey = $this->success ? 'success' : 'error';

		$redirect = $this->redirectRoute
							? redirect()->route($this->redirectRoute, $this->routeParams)
							: redirect()->back();

		$redirect->with($flashKey, $this->message);

		if (!empty($this->data)) {
			$redirect->with('flash_data', $this->data);
		}

		return $redirect->withInput(!$this->success ? [] : null);
	}

	/**
	 * Shortcut for error responses
	 */
	public function error(mixed $data = null, ?string $message = null, int $code = Response::HTTP_BAD_REQUEST, array $appends = []): mixed
	{
		if ($appends && !Arr::isAssoc($appends)) {
			return self::error(['error' => trans('Appends must be an associative array')], null, Response::HTTP_FORBIDDEN);
		}

		return (new static(false, $code, $message ?? trans('Error')))
			->when($data, fn ($b) => $b->withData($data))
			->when($code, fn ($b) => $b->withHttpCode($code))
			->when($message, fn ($b) => $b->withMessage($message))
			->when($appends, fn ($b) => collect($appends)->reduce(fn ($r, $v, $k) => $r->append($k, $v), $b))
			->build();
	}

	/**
	 * Shortcut for success responses
	 */
	public function success(mixed $resource = null, ?string $message = null, int $code = Response::HTTP_OK, mixed $resourceNamespace = null, array $appends = []): mixed
	{
		if ($appends && !Arr::isAssoc($appends)) {
			return self::error(['error' => trans('Appends must be an associative array')], null, Response::HTTP_FORBIDDEN);
		}

		return (new static(true, $code, $message))
					->when($resource, fn ($b) => $b->withData($resource, $resourceNamespace))
					->when($code, fn ($b) => $b->withHttpCode($code))
					->when($message, fn ($b) => $b->withMessage($message))
					->when($appends, fn ($b) => collect($appends)->reduce(fn ($r, $v, $k) => $r->append($k, $v), $b))
					->build();
	}
}

import axios from 'axios';

/**
 * Read-side access to the CMS backend.
 *
 * Every write goes through Inertia (`useForm` / `router`), because a write is
 * a page transition and the flash message, validation errors and prop refresh
 * all come with it for free. Reads are different: a media picker opened inside
 * the section editor must NOT navigate the page it is editing away, so it
 * fetches instead.
 *
 * Two fetch shapes exist, because the backend has two:
 *
 *   - `fetchData()` — for controller actions built with
 *     `AppResponse::withData()`. `AppResponseBuilder::build()` branches on
 *     `wantsJson()`, so an `Accept: application/json` header turns those into
 *     `{ success, code, message, data }` with no backend change. This is the
 *     right call for `seo-meta.show` and `media.usage`.
 *
 *   - `fetchPageProps()` — for controller actions built with
 *     `withComponent()`. `buildJsonResponse()` drops `additionalProps`
 *     entirely, so the JSON branch returns no data for those. Asking Inertia
 *     for the page object instead is the only way to read a list like
 *     `media.index` without a dedicated endpoint.
 *
 * The second shape is a workaround, not a pattern to spread: a real JSON
 * index endpoint for media and CTAs would be better, and is flagged as such.
 */

/** The envelope `AppResponseBuilder::buildJsonResponse()` emits. */
export interface CmsJsonEnvelope<T> {
  success: boolean;
  code: number;
  message: string | null;
  data?: T;
}

/** Thrown for any non-2xx, so callers have one thing to catch. */
export class CmsRequestError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'CmsRequestError';
    this.status = status;
  }
}

/**
 * GET an `AppResponse::withData()` action as JSON.
 *
 * `signal` is required in practice, not optional politeness — the pickers
 * fetch on open and the panels fetch on locale change, and an unaborted
 * in-flight response will happily overwrite fresher state.
 */
export async function fetchData<T>(
  url: string,
  options: { params?: Record<string, unknown>; signal?: AbortSignal } = {}
): Promise<T | null> {
  try {
    const response = await axios.get<CmsJsonEnvelope<T>>(url, {
      params: options.params ?? {},
      headers: { Accept: 'application/json' },
      ...(options.signal ? { signal: options.signal } : {}),
    });

    return response.data?.data ?? null;
  } catch (error) {
    throw toRequestError(error);
  }
}

/**
 * The asset version of the page currently loaded in this tab.
 *
 * Inertia publishes it in two places and neither is guaranteed on its own:
 * `history.state.page` exists only after a client-side navigation, and the
 * `data-page` attribute is only authoritative on the very first load. Reading
 * history first and falling back to the attribute covers both.
 *
 * Returning `''` when neither is present is deliberate — that is exactly what
 * this function used to be hard-coded to send, so a browser where neither
 * source exists is no worse off than before.
 */
function currentInertiaVersion(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const fromHistory = (window.history.state as { page?: { version?: unknown } } | null)
    ?.page?.version;

  if (fromHistory !== undefined && fromHistory !== null) {
    return String(fromHistory);
  }

  const raw = document.getElementById('app')?.getAttribute('data-page');

  if (raw) {
    try {
      return String((JSON.parse(raw) as { version?: unknown }).version ?? '');
    } catch {
      // A malformed data-page is not this function's problem to report.
    }
  }

  return '';
}

/**
 * GET an Inertia page and return its props, without navigating.
 *
 * `X-Inertia-Version` MUST match the server's asset version or Inertia answers
 * **409 Conflict** by design, to force a hard reload onto the new assets.
 *
 * This used to default to `''`, and every caller relied on that default — so
 * the header never matched a real Vite manifest hash and every request through
 * this function 409'd the moment the app was rebuilt. It surfaced as
 * "Request failed with status code 409" inside the media picker, which looks
 * like a broken endpoint rather than a protocol handshake.
 *
 * Defaulting to the live version means a caller cannot forget it.
 */
export async function fetchPageProps<T>(
  url: string,
  options: {
    version?: string | number | null;
    params?: Record<string, unknown>;
    signal?: AbortSignal;
  } = {}
): Promise<T | null> {
  try {
    const response = await axios.get<{ props?: T }>(url, {
      params: options.params ?? {},
      headers: {
        Accept: 'text/html, application/xhtml+xml',
        'X-Inertia': 'true',
        'X-Inertia-Version': String(options.version ?? currentInertiaVersion()),
      },
      ...(options.signal ? { signal: options.signal } : {}),
    });

    return response.data?.props ?? null;
  } catch (error) {
    throw toRequestError(error);
  }
}

/** Normalise an axios failure into something with a status and a message. */
function toRequestError(error: unknown): CmsRequestError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;

    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message;

    return new CmsRequestError(message, status);
  }

  return new CmsRequestError(
    error instanceof Error ? error.message : 'Request failed',
    0
  );
}

/** True when a rejection is just an aborted request, not a real failure. */
export function isAbort(error: unknown): boolean {
  return (
    axios.isCancel(error) ||
    (error instanceof Error && error.name === 'CanceledError') ||
    (error instanceof Error && error.name === 'AbortError')
  );
}

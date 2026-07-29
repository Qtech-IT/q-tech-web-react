import { usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchData, fetchPageProps, isAbort } from '@/Services/CmsApiService';

/** The three states every remote read in the CMS admin has to render. */
export interface CmsAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

interface UseCmsResourceOptions {
  /** Skip the request entirely — e.g. a picker that has not been opened yet. */
  enabled?: boolean;
  params?: Record<string, unknown>;
}

/**
 * Read a `withData()` action (`seo-meta.show`, `media.usage`) into async state.
 *
 * Every in-flight request is aborted when the inputs change or the component
 * unmounts, so a slow response can never land on top of a newer one — the
 * classic way a picker ends up showing the previous folder's contents.
 */
export function useCmsResource<T>(
  url: string | null,
  options: UseCmsResourceOptions = {}
): CmsAsyncState<T> {
  const { enabled = true, params } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState<number>(0);

  const paramsKey = JSON.stringify(params ?? {});

  useEffect(() => {
    if (!url || !enabled) {
      return;
    }

    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchData<T>(url, {
      params: JSON.parse(paramsKey) as Record<string, unknown>,
      signal: controller.signal,
    })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((cause: unknown) => {
        if (isAbort(cause)) {
          return;
        }

        setError(cause instanceof Error ? cause.message : 'Request failed');
        setLoading(false);
      });

    return () => controller.abort();
  }, [url, enabled, paramsKey, nonce]);

  const reload = useCallback(() => setNonce((value) => value + 1), []);

  return { data, loading, error, reload };
}

/**
 * Read an Inertia page's props without navigating — the only way to list media
 * or CTAs from inside another screen, since those index actions build their
 * payload with `withComponent()` and the JSON branch drops it.
 */
export function useCmsPageProps<T>(
  url: string | null,
  options: UseCmsResourceOptions = {}
): CmsAsyncState<T> {
  const { enabled = true, params } = options;

  const { version } = usePage();
  const versionRef = useRef(version);
  versionRef.current = version;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState<number>(0);

  const paramsKey = JSON.stringify(params ?? {});

  useEffect(() => {
    if (!url || !enabled) {
      return;
    }

    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchPageProps<T>(url, {
      version: versionRef.current,
      params: JSON.parse(paramsKey) as Record<string, unknown>,
      signal: controller.signal,
    })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((cause: unknown) => {
        if (isAbort(cause)) {
          return;
        }

        setError(cause instanceof Error ? cause.message : 'Request failed');
        setLoading(false);
      });

    return () => controller.abort();
  }, [url, enabled, paramsKey, nonce]);

  const reload = useCallback(() => setNonce((value) => value + 1), []);

  return { data, loading, error, reload };
}

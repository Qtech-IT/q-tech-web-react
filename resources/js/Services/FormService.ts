import { router } from '@inertiajs/react';
import type { Page } from '@inertiajs/core';

export type FormErrors = Record<string, any>;

export interface FormConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: any;
  onStart?: () => void;
  onSuccess?: (page: Page) => void;
  onError?: (errors: FormErrors) => void;
  redirectTo?: string | null;
  preserveState?: boolean;
  preserveScroll?: boolean;
}

class FormService {
  submit(config: FormConfig): Promise<Page> {
    const {
      method = 'POST',
      url,
      data = {},
      onStart,
      onSuccess,
      onError,
      preserveState = true,
      preserveScroll = true,
    } = config;

    return new Promise<Page>((resolve, reject) => {
      /*
       * `router.visit(url, { method, data, ...callbacks })` rather than
       * `router[method](url, data, options)`.
       *
       * Inertia's per-verb helpers do NOT share one signature: `post`, `put`
       * and `patch` take `(url, data, options)`, but `delete` takes
       * `(url, options)` — there is no data argument. Calling it positionally
       * meant `data` was consumed AS the options object and the real options
       * became an ignored third argument, so `onSuccess`/`onError` never fired
       * on any DELETE. Every delete confirmation dialog in the app stayed open
       * with its spinner running while the row was, in fact, deleted.
       *
       * `visit` accepts `method` and `data` together for every verb, so one
       * call site cannot drift from a per-verb signature again.
       */
      router.visit(url, {
        method: method.toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete',
        data,
        preserveState,
        preserveScroll,
        onStart: () => onStart?.(),
        onSuccess: (page: Page) => {
          onSuccess?.(page);
          resolve(page);
        },
        onError: (errors: FormErrors) => {
          onError?.(errors);
          reject(errors);
        },
      } as any);
    });
  }

  post(url: string, data?: any, options?: Partial<FormConfig>) {
    return this.submit({ method: 'POST', url, data, ...options });
  }

  put(url: string, data?: any, options?: Partial<FormConfig>) {
    return this.submit({ method: 'PUT', url, data, ...options });
  }

  patch(url: string, data?: any, options?: Partial<FormConfig>) {
    return this.submit({ method: 'PATCH', url, data, ...options });
  }

  delete(url: string, data?: any, options?: Partial<FormConfig>) {
    return this.submit({ method: 'DELETE', url, data, ...options });
  }
}

const formService = new FormService();
export default formService;

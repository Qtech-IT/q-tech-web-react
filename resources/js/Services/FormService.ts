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
      // cast to any to bypass TS strict type
      (router as any)[method.toLowerCase()](
        url,
        data,
        {
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
        } as any
      );
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

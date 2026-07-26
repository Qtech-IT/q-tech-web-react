import { useState } from 'react';
import formService from '@/Services/FormService';
import type { Page } from '@inertiajs/core';
import type { FormErrors, FormConfig } from '@/Services/FormService';

export function useForm<T = any>() {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const submit = (config: FormConfig & { data?: T }) => {
    setLoading(true);
    setErrors({});

    return formService.submit({
      ...config,
      onStart: () => {
        setLoading(true);
        config.onStart?.();
      },
      onSuccess: (page: Page) => {
        setLoading(false);
        setErrors({});
        config.onSuccess?.(page);
      },
      onError: (errors: FormErrors) => {
        setLoading(false);
        setErrors(errors);
        config.onError?.(errors);
      },
    });
  };

  return {
    loading,
    errors,
    submit,
    setErrors,
  };
}

import { useState, useRef, useCallback } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StepValidateResponse {
  success:      boolean;
  stepCode?:    string;
  message?:     string;
  user_uuid?:   string;
  is_completed?: boolean;
  is_skipped?:   boolean;
  errors?:      Record<string, string[]>;
}

interface UseStepValidatorOptions<T extends FieldValues> {
  /** Route pattern — must include {stepCode} placeholder */
  validateRoute: (stepCode: string) => string;
  skipRoute:     (stepCode: string) => string;
  form:          UseFormReturn<T>;
  /** Called with user_uuid returned from the first step so subsequent steps attach correctly */
  onUserUuidResolved?: (uuid: string) => void;
}

interface StepValidatorReturn {
  /** Validate a dynamic step. Returns true when the server accepted it. */
  validateStep: (stepCode: string, payload: Record<string, any>) => Promise<boolean>;
  /** Mark a skippable step as skipped. Returns true on success. */
  skipStep:     (stepCode: string) => Promise<boolean>;
  isValidating: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useStepValidator
 *
 * Handles the per-step HTTP call to the backend validate endpoint:
 *
 *   POST /distribution-hubs/{hub}/users/steps/{stepCode}/validate
 *
 * On success it threads the returned `user_uuid` into all subsequent requests
 * so each step response is attached to the same (possibly temporary) user row.
 *
 * On 422 it maps the server error messages back onto the react-hook-form
 * fields so they appear under the correct inputs.
 *
 * Usage:
 *   const { validateStep, skipStep, isValidating } = useStepValidator({
 *     validateRoute: (code) => route('backend.distribution-hubs.users.steps.validate', { distributionHub: hubUuid, stepCode: code }),
 *     skipRoute:     (code) => route('backend.distribution-hubs.users.steps.skip',     { distributionHub: hubUuid, stepCode: code }),
 *     form,
 *     onUserUuidResolved: (uuid) => setUserUuid(uuid),
 *   });
 */
export function useStepValidator<T extends FieldValues>({
  validateRoute,
  skipRoute,
  form,
  onUserUuidResolved,
}: UseStepValidatorOptions<T>): StepValidatorReturn {

  const [isValidating, setIsValidating] = useState(false);

  // Persisted across renders — the UUID of the placeholder user row
  const userUuidRef = useRef<string | null>(null);

  // ── Internal fetch helper ──────────────────────────────────────────────────

  const callEndpoint = useCallback(async (
    url:     string,
    payload: Record<string, any>
  ): Promise<StepValidateResponse> => {
    const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
      ?.content ?? '';

    const res = await fetch(url, {
      method:  'POST',
      headers: {
        'Content-Type':     'application/json',
        'Accept':           'application/json',
        'X-CSRF-TOKEN':     csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    return json as StepValidateResponse;
  }, []);

  // ── Surface server errors back onto form fields ────────────────────────────

  const applyServerErrors = useCallback((errors: Record<string, string[]>) => {
    Object.entries(errors).forEach(([field, messages]) => {
      const message : any = Array.isArray(messages) ? messages[0] : messages;

      // Dynamic step fields are submitted under step_data.{fieldName}
      // The server returns them as plain field names — map them back.
      form.setError(`step_data.${field}` as any, {
        type:    'server',
        message: message,
      });
    });
  }, [form]);

  // ── Public: validateStep ───────────────────────────────────────────────────

  const validateStep = useCallback(async (
    stepCode: string,
    payload:  Record<string, any>
  ): Promise<boolean> => {
    setIsValidating(true);

    // Clear any stale server errors on this step's fields before re-validating
    form.clearErrors();

    try {
      const response = await callEndpoint(validateRoute(stepCode), {
        step_data: payload,
        user_uuid: userUuidRef.current,
        step_code: stepCode,
      });

      if (response.success) {
        // Thread the user UUID into all subsequent requests
        if (response.user_uuid && !userUuidRef.current) {
          userUuidRef.current = response.user_uuid;
          onUserUuidResolved?.(response.user_uuid);
        }
        return true;
      }

      // 422 path — map field errors back to the form
      if (response.errors) {
        applyServerErrors(response.errors);
      }

      return false;

    } catch (err) {
      console.error('[useStepValidator] Network error:', err);
      return false;

    } finally {
      setIsValidating(false);
    }
  }, [callEndpoint, validateRoute, form, applyServerErrors, onUserUuidResolved]);

  // ── Public: skipStep ──────────────────────────────────────────────────────

  const skipStep = useCallback(async (stepCode: string): Promise<boolean> => {
    setIsValidating(true);

    try {
      const response = await callEndpoint(skipRoute(stepCode), {
        skip:      true,
        user_uuid: userUuidRef.current,
        step_code: stepCode,
      });

      if (response.success && response.user_uuid && !userUuidRef.current) {
        userUuidRef.current = response.user_uuid;
        onUserUuidResolved?.(response.user_uuid);
      }

      return response.success;

    } catch (err) {
      console.error('[useStepValidator] Skip error:', err);
      return false;

    } finally {
      setIsValidating(false);
    }
  }, [callEndpoint, skipRoute, onUserUuidResolved]);

  return { validateStep, skipStep, isValidating };
}
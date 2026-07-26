import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import type { PageProps as InertiaPageProps } from "@inertiajs/core"; 
import { showToast, showValidationErrors } from "@/Lib/toast";

interface FlashMessages {
  success?: string;
  error?: string;
  warning?: string;
  info?: string;
}

interface CustomPageProps extends InertiaPageProps {
  flash?: FlashMessages;
  errors?: Record<string, string>;
}

interface ToastReturnType {
  success: (msg: string) => void;
  error: (msg: string) => void;
  loading: (msg: string) => void;
  promise: (...args: any[]) => any;
  custom: (msg: string, options?: any) => void;
  dismiss: (id?: string) => void;
  dismissAll: () => void;
}

export function useToast(): ToastReturnType {
  const { flash, errors } = usePage<CustomPageProps>().props;

  useEffect(() => {
    if (flash?.success) showToast.success(flash.success);
    if (flash?.error) showToast.error(flash.error);

    if (flash?.warning) {
      showToast.custom(flash.warning, {
        icon: "⚠️",
        style: { background: "#f59e0b", color: "#fff" },
      });
    }

    if (flash?.info) {
      showToast.custom(flash.info, {
        icon: "ℹ️",
        style: { background: "#3b82f6", color: "#fff" },
      });
    }

    if (errors && Object.keys(errors).length > 0) {
      showValidationErrors(errors);
    }
  }, [flash, errors]);

  return {
    success: showToast.success,
    error: showToast.error,
    loading: showToast.loading,
    promise: showToast.promise,
    custom: showToast.custom,
    dismiss: showToast.dismiss,
    dismissAll: showToast.dismissAll,
  };
}

import { useState, useEffect, createContext } from "react";
import { router, usePage } from "@inertiajs/react";
import { jsx } from "react/jsx-runtime";
import toast, { Toaster } from "react-hot-toast";
class FormService {
  /**
   * Submit form with loading state and optional redirect
   * @param {Object} config - Form configuration
   */
  submit(config) {
    const {
      method = "POST",
      url,
      data = {},
      onStart = null,
      onSuccess = null,
      onError = null,
      redirectTo = null,
      preserveState = true,
      preserveScroll = true
      // 👈 added default
    } = config;
    return new Promise((resolve, reject) => {
      router[method.toLowerCase()](url, data, {
        preserveState,
        preserveScroll,
        onStart: () => {
          onStart?.();
        },
        onSuccess: (page) => {
          onSuccess?.(page);
          resolve(page);
        },
        onError: (errors) => {
          onError?.(errors);
          reject(errors);
        }
      });
    });
  }
  post(url, data, options = {}) {
    return this.submit({ method: "POST", url, data, ...options });
  }
  put(url, data, options = {}) {
    return this.submit({ method: "PUT", url, data, ...options });
  }
  patch(url, data, options = {}) {
    return this.submit({ method: "PATCH", url, data, ...options });
  }
  delete(url, data = {}, options = {}) {
    return this.submit({ method: "DELETE", url, data, ...options });
  }
}
const formService = new FormService();
function useForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const submit = (config) => {
    setLoading(true);
    setErrors({});
    return formService.submit({
      ...config,
      onStart: () => {
        setLoading(true);
        config.onStart?.();
      },
      onSuccess: (page) => {
        setLoading(false);
        setErrors({});
        config.onSuccess?.(page);
      },
      onError: (errors2) => {
        setLoading(false);
        setErrors(errors2);
        config.onError?.(errors2);
      }
    });
  };
  return {
    loading,
    errors,
    submit,
    setErrors
  };
}
const showToast = {
  success: (message) => {
    toast.success(message);
  },
  error: (message) => {
    toast.error(message);
  },
  loading: (message) => {
    return toast.loading(message, {
      style: {
        borderRadius: "10px",
        background: "#3b82f6",
        color: "#fff"
      }
    });
  },
  promise: (promise, messages) => {
    return toast.promise(promise, messages, {
      style: {
        minWidth: "250px"
      },
      success: {
        duration: 3e3,
        icon: "🎉"
      },
      error: {
        duration: 5e3,
        icon: "💥"
      },
      loading: {
        icon: "⏳"
      }
    });
  },
  custom: (message, options = {}) => {
    toast(message, {
      icon: "🔔",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff"
      },
      ...options
    });
  },
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
  dismissAll: () => {
    toast.dismiss();
  }
};
const showValidationErrors = (errors) => {
  Object.keys(errors).forEach((key) => {
    if (Array.isArray(errors[key])) {
      errors[key].forEach((error) => {
        showToast.error(error);
      });
    } else {
      showToast.error(errors[key]);
    }
  });
};
function useToast() {
  const { flash, errors } = usePage().props;
  useEffect(() => {
    if (flash?.success) {
      showToast.success(flash.success);
    }
    if (flash?.error) {
      showToast.error(flash.error);
    }
    if (flash?.warning) {
      showToast.custom(flash.warning, {
        icon: "⚠️",
        style: {
          background: "#f59e0b",
          color: "#fff"
        }
      });
    }
    if (flash?.info) {
      showToast.custom(flash.info, {
        icon: "ℹ️",
        style: {
          background: "#3b82f6",
          color: "#fff"
        }
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
    dismissAll: showToast.dismissAll
  };
}
const ToastContext = createContext();
function ToastProvider({ children }) {
  const toast2 = useToast();
  return /* @__PURE__ */ jsx(ToastContext.Provider, { value: toast2, children });
}
function HotToaster({ position = "top-right" }) {
  return /* @__PURE__ */ jsx(
    Toaster,
    {
      position,
      toastOptions: {
        duration: 4e3,
        style: {
          background: "#363636",
          color: "#fff"
        },
        success: {
          duration: 3e3,
          iconTheme: {
            primary: "#10b981",
            secondary: "#fff"
          }
        },
        error: {
          duration: 5e3,
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff"
          }
        },
        loading: {
          iconTheme: {
            primary: "#3b82f6",
            secondary: "#fff"
          }
        }
      }
    }
  );
}
export {
  HotToaster as H,
  ToastProvider as T,
  useForm as u
};

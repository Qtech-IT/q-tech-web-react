import { toast as reactHotToast } from "react-hot-toast";

interface PromiseMessages {
    loading: string;
    success: string;
    error: string;
}

interface ToastOptions {
    icon?: string;
    style?: React.CSSProperties;
    duration?: number;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    [key: string]: any;
}

interface ValidationErrors {
    [key: string]: string | string[];
}

/**
 * A stable id derived from the message text.
 *
 * react-hot-toast treats a repeated `id` as an UPDATE rather than a new toast.
 * Flash-driven toasts need that: a successful action redirects with a flash
 * message, and any partial reload that follows (the CMS builder reloads after
 * every mutation) re-delivers the same `flash` prop, so the effect fires again
 * and the user sees the same message stacked twice. Keying by content collapses
 * those into one.
 */
const idFor = (kind: string, message: string): string => `${kind}:${message}`;

export const showToast = {
    success: (message: string): string => {
        return reactHotToast.success(message, { id: idFor('success', message) });
    },

    error: (message: string): string => {
        return reactHotToast.error(message, { id: idFor('error', message) });
    },

    loading: (message: string): string => {
        return reactHotToast.loading(message, {
            style: {
                borderRadius: '10px',
                background: '#3b82f6',
                color: '#fff',
            },
        });
    },

    promise: <T,>(
        promise: Promise<T>,
        messages: PromiseMessages
    ): Promise<T> => {
        return reactHotToast.promise(promise, messages, {
            style: {
                minWidth: '250px',
            },
            success: {
                duration: 3000,
                icon: '🎉',
            },
            error: {
                duration: 5000,
                icon: '💥',
            },
            loading: {
                icon: '⏳',
            },
        });
    },

    custom: (message: string, options: ToastOptions = {}): string => {
        return reactHotToast(message, {
            icon: '🔔',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
            ...options,
        });
    },

    dismiss: (toastId?: string): void => {
        reactHotToast.dismiss(toastId);
    },

    dismissAll: (): void => {
        reactHotToast.dismiss();
    }
};

// Show validation errors
export const showValidationErrors = (errors: ValidationErrors): void => {
    Object.keys(errors).forEach(key => {
        const error:any = errors[key];
        if (Array.isArray(error)) {
            error.forEach((errorMessage: string) => {
                showToast.error(errorMessage);
            });
        } else {
            showToast.error(error);
        }
    });
};
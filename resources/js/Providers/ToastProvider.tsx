import { useToast } from '@/Hooks/useToast';
import { createContext } from 'react';

const ToastContext = createContext<any>(null);

export function ToastProvider({ children }: any) {
    const toast = useToast();

    return (
        <ToastContext.Provider value={toast}>
            {children}
        </ToastContext.Provider>
    );
}

import { Toaster } from "react-hot-toast";
import type { ToastPosition } from "react-hot-toast";
interface HotToasterProps {
  position?: ToastPosition;
}

export function HotToaster({ position = 'top-right' }: HotToasterProps) {
  return (
    <Toaster
      position={position}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
        loading: {
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}

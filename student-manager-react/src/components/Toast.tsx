import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

let toastId = 0;
const listeners: Set<(toast: ToastMessage) => void> = new Set();

export const showToast = (message: string, type: ToastType = 'success') => {
  const id = `toast-${toastId++}`;
  const toast: ToastMessage = { id, message, type };
  listeners.forEach(listener => listener(toast));
};

export default function Toast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect((): (() => void) => {
    const handleToast = (toast: ToastMessage) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 3000);
    };

    listeners.add(handleToast);
    return () => listeners.delete(handleToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`animate-slideIn flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm pointer-events-auto cursor-pointer
            ${
              toast.type === 'success'
                ? 'bg-emerald-500/90 text-white'
                : toast.type === 'error'
                  ? 'bg-red-500/90 text-white'
                  : 'bg-blue-500/90 text-white'
            }`}
          onClick={() => removeToast(toast.id)}
        >
          {toast.type === 'success' && <CheckCircle size={20} />}
          {toast.type === 'error' && <XCircle size={20} />}
          {toast.type === 'info' && <AlertCircle size={20} />}
          <span className="font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

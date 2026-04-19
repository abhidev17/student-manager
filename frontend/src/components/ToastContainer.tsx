import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import type { Toast } from '../types';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  const getIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      success: <CheckCircle size={20} />,
      error: <AlertCircle size={20} />,
      info: <Info size={20} />,
    };
    return iconMap[type];
  };

  const getColorClass = (type: string) => {
    const colorMap: Record<string, string> = {
      success: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-200',
      error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
      info: 'bg-sky-50 border-sky-200 text-sky-800 dark:bg-sky-900/20 dark:border-sky-800 dark:text-sky-200',
    };
    return colorMap[type];
  };

  const getIconColorClass = (type: string) => {
    const colorMap: Record<string, string> = {
      success: 'text-emerald-600 dark:text-emerald-400',
      error: 'text-red-600 dark:text-red-400',
      info: 'text-sky-600 dark:text-sky-400',
    };
    return colorMap[type];
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-lg border animate-slideUp ${getColorClass(toast.type)}`}
        >
          <div className={getIconColorClass(toast.type)}>{getIcon(toast.type)}</div>
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => onRemove(toast.id)}
            className="p-1 hover:opacity-70 transition"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

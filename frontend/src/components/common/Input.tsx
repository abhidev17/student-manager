import type { InputHTMLAttributes, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = ({
  label,
  error,
  helper,
  icon,
  fullWidth = true,
  className = '',
  ...props
}: InputProps) => {
  const hasError = !!error;
  const baseClass = `px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-300 bg-red-50 focus:ring-red-200'
      : 'border-slate-300 bg-white dark:bg-slate-900 dark:border-slate-700 focus:ring-sky-200'
  }`;
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={widthClass}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && <div className="absolute left-3 top-2.5 text-slate-400">{icon}</div>}
        <input
          {...props}
          className={`${baseClass} ${icon ? 'pl-10' : ''} ${className}`}
        />
      </div>

      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-red-600 text-xs">
          <AlertCircle size={14} />
          {error}
        </p>
      )}

      {helper && !error && (
        <p className="mt-1 text-xs text-slate-500">{helper}</p>
      )}
    </div>
  );
};

export default Input;

import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  clickable?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'premium' | 'elevated';
}

export const Card = ({ children, className = '', clickable = false, onClick, variant = 'default' }: CardProps) => {
  const variantClasses = {
    default: 'bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700',
    premium: 'bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-200',
    elevated: 'bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-100 dark:border-slate-700',
  };

  const interactiveClass = clickable ? 'hover:shadow-md hover:scale-[1.01] cursor-pointer' : '';
  
  return (
    <div
      onClick={onClick}
      className={`transition-all duration-200 ${variantClasses[variant]} ${interactiveClass} ${className}`}
    >
      {children}
    </div>
  );
};

interface ChipProps {
  label: string;
  onRemove?: () => void;
  isActive?: boolean;
  onClick?: () => void;
}

export const Chip = ({ label, onRemove, isActive = false, onClick }: ChipProps) => {
  const activeClass = isActive
    ? 'bg-sky-500 text-white'
    : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-300';

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeClass}`}
    >
      {label}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:opacity-70"
        >
          ×
        </button>
      )}
    </button>
  );
};

interface DividerProps {
  variant?: 'horizontal' | 'vertical';
}

export const Divider = ({ variant = 'horizontal' }: DividerProps) => {
  return variant === 'horizontal' ? (
    <div className="h-px bg-slate-200 dark:bg-slate-700" />
  ) : (
    <div className="w-px h-full bg-slate-200 dark:bg-slate-700" />
  );
};

export default { Card, Chip, Divider };

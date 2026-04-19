import type { ReactNode } from 'react';
import { Card } from './common/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  animate?: boolean;
  variant?: 'blue' | 'emerald' | 'purple' | 'amber';
}

const iconBgVariants = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
};

export const StatsCard = ({
  title,
  value,
  icon,
  subtitle,
  trend,
  animate = true,
  variant = 'blue',
}: StatsCardProps) => {
  return (
    <Card variant="default" className={`p-5 flex flex-col h-full border-slate-200 dark:border-slate-700 ${animate ? 'animate-slideUp' : ''}`}>
      {/* Icon */}
      <div className={`flex-shrink-0 w-10 h-10 p-2 rounded-lg ${iconBgVariants[variant]} mb-4`}>
        {icon}
      </div>

      {/* Title */}
      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
        {title}
      </p>

      {/* Value section */}
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-semibold text-slate-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-md ${
                trend.direction === 'up'
                  ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30'
                  : 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30'
              }`}
            >
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
            </span>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-3 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;

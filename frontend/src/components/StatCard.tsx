import { classNames } from '../styles/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
}

export const StatCard = ({ title, value, subtitle }: StatCardProps) => {
  return (
    <div className={classNames.statCard}>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{title}</p>
      </div>

      <div>
        <h2 className="text-3xl font-semibold leading-tight">{value}</h2>
        <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>
      </div>
    </div>
  );
};

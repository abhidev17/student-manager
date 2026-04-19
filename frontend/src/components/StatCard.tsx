import { classNames } from '../styles/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
}

export const StatCard = ({ title, value, subtitle }: StatCardProps) => {
  return (
    <div className={classNames.statCard}>
      {/* Label */}
      <div className="flex-shrink-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{title}</p>
      </div>

      {/* Value Section */}
      <div className="flex-1 flex flex-col justify-end">
        <h2 className="text-4xl font-bold leading-none text-white mb-2">{value}</h2>
        <p className="text-xs text-gray-400 line-clamp-2">{subtitle}</p>
      </div>
    </div>
  );
};

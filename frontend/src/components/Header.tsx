import { Plus, Download } from 'lucide-react';
import Button from './common/Button';

interface HeaderProps {
  onAddStudent: () => void;
  onExport?: () => void;
  title: string;
  subtitle?: string;
}

export const Header = ({ onAddStudent, onExport, title, subtitle }: HeaderProps) => {
  return (
    <div className="mb-8">
      {/* Title section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="primary"
          size="md"
          icon={<Plus size={16} />}
          onClick={onAddStudent}
        >
          Add Student
        </Button>

        {onExport && (
          <Button
            variant="secondary"
            size="md"
            icon={<Download size={16} />}
            onClick={onExport}
          >
            Export CSV
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;

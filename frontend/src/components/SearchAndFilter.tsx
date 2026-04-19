import { Search, X } from 'lucide-react';
import { Chip } from './common/Card';
import Input from './common/Input';
import { Card } from './common/Card';

interface SearchAndFilterProps {
  onSearchChange: (term: string) => void;
  onCourseChange: (course: string | null) => void;
  onAgeGroupChange: (ageGroup: 'all' | 'under-20' | '20-25' | '25-plus' | null) => void;
  searchTerm: string;
  selectedCourse: string | null;
  selectedAgeGroup: 'all' | 'under-20' | '20-25' | '25-plus' | null;
  availableCourses: string[];
}

const AGE_GROUPS = [
  { id: 'all', label: 'All Ages' },
  { id: 'under-20', label: 'Under 20' },
  { id: '20-25', label: '20–25' },
  { id: '25-plus', label: '25+' },
];

export const SearchAndFilter = ({
  onSearchChange,
  onCourseChange,
  onAgeGroupChange,
  searchTerm,
  selectedCourse,
  selectedAgeGroup,
  availableCourses,
}: SearchAndFilterProps) => {
  const hasActiveFilters = searchTerm || selectedCourse || selectedAgeGroup !== 'all';

  return (
    <Card variant="premium" className="p-6 mb-8">
      <div className="space-y-6">
        
        {/* Search Input */}
        <div>
          <Input
            type="text"
            placeholder="Search by name or course..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Search size={18} />}
            fullWidth
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Course Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Filter by Course
            </label>
            <div className="flex gap-2 flex-wrap">
              <Chip
                label="All Courses"
                isActive={!selectedCourse}
                onClick={() => onCourseChange(null)}
              />
              {availableCourses.map((course) => (
                <Chip
                  key={course}
                  label={course}
                  isActive={selectedCourse === course}
                  onClick={() => onCourseChange(selectedCourse === course ? null : course)}
                />
              ))}
            </div>
          </div>

          {/* Age Group Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Filter by Age Group
            </label>
            <div className="flex gap-2 flex-wrap">
              {AGE_GROUPS.map((group) => (
                <Chip
                  key={group.id}
                  label={group.label}
                  isActive={selectedAgeGroup === (group.id as any)}
                  onClick={() =>
                    onAgeGroupChange(selectedAgeGroup === group.id ? 'all' : (group.id as any))
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              onSearchChange('');
              onCourseChange(null);
              onAgeGroupChange('all');
            }}
            className="text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-2 px-4 py-2 bg-sky-50 dark:bg-sky-900/20 rounded-lg transition-colors"
          >
            <X size={16} />
            Clear all filters
          </button>
        )}
      </div>
    </Card>
  );
};

export default SearchAndFilter;

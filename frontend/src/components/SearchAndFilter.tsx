import { Search, X } from 'lucide-react';
import Input from './common/Input';

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
    <div className="bg-white/[0.03] backdrop-blur-[8px] border border-white/8 rounded-xl p-7">
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

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Course Filter */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Course
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onCourseChange(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  !selectedCourse
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/8 text-gray-300 hover:bg-white/12'
                }`}
              >
                All
              </button>
              {availableCourses.map((course) => (
                <button
                  key={course}
                  onClick={() => onCourseChange(selectedCourse === course ? null : course)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedCourse === course
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/8 text-gray-300 hover:bg-white/12'
                  }`}
                >
                  {course.length > 15 ? course.substring(0, 12) + '...' : course}
                </button>
              ))}
            </div>
          </div>

          {/* Age Group Filter */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Age Group
            </p>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map((group) => (
                <button
                  key={group.id}
                  onClick={() =>
                    onAgeGroupChange(selectedAgeGroup === group.id ? 'all' : (group.id as any))
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedAgeGroup === group.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/8 text-gray-300 hover:bg-white/12'
                  }`}
                >
                  {group.label}
                </button>
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
            className="text-xs font-medium text-gray-400 hover:text-gray-300 flex items-center gap-2 px-3 py-1.5 transition-colors"
          >
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;

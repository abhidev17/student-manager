import { useMemo, useState } from 'react';
import { Download, Plus } from 'lucide-react';
import SearchAndFilter from '../components/SearchAndFilter';
import StudentTable from '../components/StudentTable';
import { exportToCSV } from '../utils/formatters';
import type { Student } from '../types';

interface StudentsProps {
  students: Student[];
  loading?: boolean;
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
}

export const Students = ({
  students,
  loading = false,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
}: StudentsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<'all' | 'under-20' | '20-25' | '25-plus' | null>('all');

  // Get unique courses for filter
  const availableCourses = useMemo(() => {
    const courses = new Set(students.map(s => s.course));
    return Array.from(courses).sort();
  }, [students]);

  const handleExport = () => {
    const dataToExport = students.map(s => ({
      Name: s.name,
      Age: s.age,
      Course: s.course,
      GPA: s.gpa ?? '—',
      Status: 'Enrolled',
    }));

    exportToCSV(dataToExport, 'students');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 dark:from-slate-950 to-slate-100 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
            <div className="max-w-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">Students</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white mb-2">
                Student Registry
              </h1>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {students.length} enrolled student{students.length !== 1 ? 's' : ''} • Search, filter, and manage records
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onAddStudent}
                className="group px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
              >
                <Plus size={18} className="group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Add Student</span>
                <span className="sm:hidden">Add</span>
              </button>
              <button
                onClick={handleExport}
                className="group px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95"
              >
                <Download size={18} className="group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCourse={selectedCourse}
            onCourseChange={setSelectedCourse}
            selectedAgeGroup={selectedAgeGroup}
            onAgeGroupChange={setSelectedAgeGroup}
            availableCourses={availableCourses}
          />
        </div>

        {/* Student Table Section */}
        <StudentTable
          students={students}
          loading={loading}
          searchTerm={searchTerm}
          selectedCourse={selectedCourse}
          selectedAgeGroup={selectedAgeGroup}
          onEdit={onEditStudent}
          onDelete={onDeleteStudent}
        />

      </div>
    </div>
  );
};

export default Students;

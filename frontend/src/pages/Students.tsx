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
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <div className="pb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Students</p>
          <h1 className="text-3xl font-bold text-white mb-1">Student Registry</h1>
          <p className="text-sm text-gray-400">
            {students.length} enrolled student{students.length !== 1 ? 's' : ''} • Manage your student records
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={onAddStudent}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium transition-all duration-200 hover:scale-[1.01] hover:shadow-lg active:scale-95 flex items-center gap-2"
          >
            <Plus size={16} />
            Add Student
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-lg bg-white/8 text-white text-sm font-medium transition-all duration-200 hover:scale-[1.01] hover:bg-white/12 active:scale-95 flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCourse={selectedCourse}
        onCourseChange={setSelectedCourse}
        selectedAgeGroup={selectedAgeGroup}
        onAgeGroupChange={setSelectedAgeGroup}
        availableCourses={availableCourses}
      />

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
  );
};

export default Students;

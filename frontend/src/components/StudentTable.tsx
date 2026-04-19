import { useMemo, useState } from 'react';
import { Edit2, Trash2, ChevronDown } from 'lucide-react';
import Badge from './common/Badge';
import { formatGPA, getInitials, getAvatarColor } from '../utils/formatters';
import type { Student } from '../types';

interface SortConfig {
  key: keyof Student;
  direction: 'asc' | 'desc';
}

interface StudentTableProps {
  students: Student[];
  loading?: boolean;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  searchTerm?: string;
  selectedCourse?: string | null;
  selectedAgeGroup?: 'all' | 'under-20' | '20-25' | '25-plus' | null;
}

export const StudentTable = ({
  students,
  loading = false,
  onEdit,
  onDelete,
  searchTerm = '',
  selectedCourse,
  selectedAgeGroup,
}: StudentTableProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'name',
    direction: 'asc',
  });

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
          student.name.toLowerCase().includes(search) ||
          student.course.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      // Course filter
      if (selectedCourse && selectedCourse !== 'all') {
        if (student.course !== selectedCourse) return false;
      }

      // Age group filter
      if (selectedAgeGroup) {
        const age = student.age;
        const matchesAge =
          (selectedAgeGroup === 'under-20' && age < 20) ||
          (selectedAgeGroup === '20-25' && age >= 20 && age <= 25) ||
          (selectedAgeGroup === '25-plus' && age > 25);
        if (!matchesAge) return false;
      }

      return true;
    });
  }, [students, searchTerm, selectedCourse, selectedAgeGroup]);

  // Sort students
  const sortedStudents = useMemo(() => {
    const sorted = [...filteredStudents].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === undefined || bValue === undefined) return 0;

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue);
      }

      return sortConfig.direction === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return sorted;
  }, [filteredStudents, sortConfig]);

  const handleSort = (key: keyof Student) => {
    setSortConfig(prev => ({
      key,
      direction:
        prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  if (loading) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-[8px] border border-white/8 rounded-xl p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (sortedStudents.length === 0) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-[8px] border border-white/8 rounded-xl p-12">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-white/5 mb-6">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3m6 0c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3M6 12c1.657 0 3-1.343 3-3S7.657 6 6 6s-3 1.343-3 3 1.343 3 3 3m0 6c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3m12 0c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3m-6 0c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {filteredStudents.length === 0 && searchTerm
              ? 'No matches found'
              : 'No students yet'}
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            {filteredStudents.length === 0 && searchTerm
              ? 'Try adjusting your search or filters'
              : 'Add your first student to get started'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-[8px] border border-white/8 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                >
                  Student
                  <ChevronDown size={16} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('age')}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                >
                  Age
                  <ChevronDown size={16} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('course')}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                >
                  Course
                  <ChevronDown size={16} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('gpa')}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                >
                  GPA
                  <ChevronDown size={16} />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {sortedStudents.map((student) => {
              const gpaFormatted = formatGPA(student.gpa);
              return (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${getAvatarColor(
                          student.name
                        )}`}
                      >
                        {getInitials(student.name)}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {student.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {student.age}
                  </td>
                  <td className="px-6 py-4">
                    <Badge label={student.course} variant="info" size="sm" />
                  </td>
                  <td className={`px-6 py-4 font-semibold ${gpaFormatted.color}`}>
                    {gpaFormatted.value}
                  </td>
                  <td className="px-6 py-4">
                    <Badge label="Enrolled" variant="success" size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(student)}
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        title="Edit student"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(student)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                        title="Delete student"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;

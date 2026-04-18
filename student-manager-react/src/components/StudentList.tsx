import { useState, useMemo } from "react";
import { Search, Users } from "lucide-react";
import type { Student } from "../types";
import StudentCard from "./StudentCard";

interface Props {
  students: Student[];
  onDelete: (id: number) => void;
  onEdit: (student: Student) => void;
}

export default function StudentList({ students, onDelete, onEdit }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = useMemo(() => {
    return students.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.age.toString().includes(searchTerm)
    );
  }, [students, searchTerm]);

  const isEmpty = students.length === 0;
  const isFiltered = filteredStudents.length === 0 && !isEmpty;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name, course, or age..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition"
        />
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium text-slate-300">
            {filteredStudents.length} of {students.length} students
          </span>
        </div>
      </div>

      {/* Empty State */}
      {isEmpty && (
        <div className="py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No students yet</h3>
          <p className="text-slate-400 mb-6">Add your first student using the form to get started</p>
        </div>
      )}

      {/* No Results State */}
      {isFiltered && (
        <div className="py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No students found</h3>
          <p className="text-slate-400">Try adjusting your search terms</p>
        </div>
      )}

      {/* Students Grid */}
      {!isEmpty && (
        <div className="grid grid-cols-1 gap-4 auto-rows-max">
          {filteredStudents.map(s => (
            <StudentCard
              key={s.id}
              student={s}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
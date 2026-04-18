import { Trash2, Edit2 } from "lucide-react";
import type { Student } from "../types";

interface Props {
  student: Student;
  onDelete: (id: number) => void;
  onEdit: (student: Student) => void;
}

export default function StudentCard({ student, onDelete, onEdit }: Props) {
  return (
    <div className="p-5 rounded-lg bg-gradient-to-br from-slate-700/50 to-slate-800/30 border border-slate-600/50 hover:border-slate-500 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
            {student.name}
          </h3>
          <p className="text-sm text-slate-400 mt-1">ID: {student.id}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(student)}
            className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-all duration-200 transform hover:scale-110"
            title="Edit student"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(student.id)}
            className="p-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 transform hover:scale-110"
            title="Delete student"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
          <span className="text-sm font-medium text-slate-400">Age</span>
          <span className="text-lg font-semibold text-blue-400">{student.age} years</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
          <span className="text-sm font-medium text-slate-400">Course</span>
          <span className="text-lg font-semibold text-indigo-400">{student.course}</span>
        </div>
      </div>
    </div>
  );
}
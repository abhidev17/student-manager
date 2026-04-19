import { useState } from "react";
import { Trash2, Edit2, User, BookmarkIcon } from "lucide-react";
import type { Student } from "../types";
import ConfirmModal from "./ConfirmModal";

interface Props {
  student: Student;
  onDelete: (id: number) => Promise<void>;
  onEdit: (student: Student) => void;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
}

export default function StudentCard({
  student,
  onDelete,
  onEdit,
  isSelected,
  onToggleSelect
}: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(student.id);
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className={`group card-lift relative p-6 rounded-2xl glass-panel transition-all duration-300 hover:border-sky-200 hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)] ${
        isSelected ? "ring-2 ring-sky-300/70" : ""
      }`}>
        {/* Accent gradient on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-100/0 to-indigo-100/0 group-hover:from-sky-100/65 group-hover:to-indigo-100/55 transition-all duration-300 pointer-events-none"></div>

        <button
          type="button"
          onClick={() => onToggleSelect(student.id)}
          className={`absolute top-3 right-3 z-10 h-5 w-5 rounded-md border transition ${
            isSelected
              ? "bg-sky-500 border-sky-500"
              : "bg-white/90 border-slate-300 hover:border-sky-400"
          }`}
          aria-label="Select student"
          title="Select student"
        >
          {isSelected && <span className="block h-1.5 w-1.5 rounded-sm bg-white mx-auto" />}
        </button>

        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-5 pr-7 gap-3 min-w-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-sky-700" />
                <h3 className="font-display text-base sm:text-lg font-semibold text-slate-900 transition truncate">
                  {student.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <p className="text-xs text-slate-500 font-medium">ID: {student.id}</p>
                <span className="hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 whitespace-nowrap">
                  Enrolled
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(student)}
                className="p-2.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 hover:bg-sky-100 transition-all duration-200 transform hover:scale-105 active:scale-95"
                title="Edit student"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-2.5 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-all duration-200 transform hover:scale-105 active:scale-95"
                title="Delete student"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white border border-slate-100 transition">
              <p className="text-xs font-medium text-slate-500 mb-1">Age</p>
              <p className="font-display text-lg sm:text-xl font-semibold text-slate-900">{student.age}</p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-100 transition">
              <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                <BookmarkIcon size={12} /> Course
              </p>
              <p className="font-display text-lg sm:text-xl font-semibold text-indigo-700 truncate">{student.course}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Student"
        message={`Are you sure you want to delete ${student.name}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={isDeleting}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
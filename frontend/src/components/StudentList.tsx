import { useState, useMemo, useEffect } from "react";
import { Search, Users, X, PlusCircle, SlidersHorizontal, Trash2, CheckSquare } from "lucide-react";
import type { Student } from "../types";
import StudentCard from "./StudentCard";
import ConfirmModal from "./ConfirmModal";

interface Props {
  students: Student[];
  onDelete: (id: number) => Promise<void>;
  onEdit: (student: Student) => void;
  onQuickAdd: () => void;
}

export default function StudentList({ students, onDelete, onEdit, onQuickAdd }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCourse, setActiveCourse] = useState("all");
  const [activeAgeBand, setActiveAgeBand] = useState<"all" | "under-20" | "20-30" | "30+">("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    setSelectedIds(prev => prev.filter(id => students.some(student => student.id === id)));
  }, [students]);

  const courseOptions = useMemo(() => {
    const courseCounts = students.reduce<Record<string, number>>((acc, student) => {
      acc[student.course] = (acc[student.course] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(courseCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([course]) => course);
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter(s =>
      (s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.age.toString().includes(searchTerm)) &&
      (activeCourse === "all" || s.course === activeCourse) &&
      (activeAgeBand === "all" ||
        (activeAgeBand === "under-20" && s.age < 20) ||
        (activeAgeBand === "20-30" && s.age >= 20 && s.age <= 30) ||
        (activeAgeBand === "30+" && s.age > 30))
    );
  }, [students, searchTerm, activeCourse, activeAgeBand]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllVisible = () => {
    const visibleIds = filteredStudents.map(student => student.id);
    const areAllSelected = visibleIds.every(id => selectedIds.includes(id));

    if (areAllSelected) {
      setSelectedIds(prev => prev.filter(id => !visibleIds.includes(id)));
      return;
    }

    setSelectedIds(prev => Array.from(new Set([...prev, ...visibleIds])));
  };

  const handleBulkDeleteRequest = () => {
    if (selectedIds.length === 0) return;
    setShowBulkDeleteConfirm(true);
  };

  const handleConfirmBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      await Promise.allSettled(selectedIds.map(id => onDelete(id)));
      setSelectedIds([]);
      setShowBulkDeleteConfirm(false);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const isEmpty = students.length === 0;
  const isFiltered = filteredStudents.length === 0 && !isEmpty;
  const allVisibleSelected =
    filteredStudents.length > 0 && filteredStudents.every(student => selectedIds.includes(student.id));

  return (
    <div className="space-y-6 min-w-0">
      <div className="glass-panel rounded-2xl p-5">
        <h2 className="font-display text-xl font-semibold text-slate-900">Student Directory</h2>
        <p className="text-sm text-slate-600 mt-1">Search, review, and manage your student records.</p>
      </div>

      {/* Command Bar */}
      <div className="glass-panel rounded-2xl p-4 space-y-4 min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600">
            <SlidersHorizontal className="w-4 h-4" />
            <p className="text-sm font-semibold">Quick Actions</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full lg:w-auto">
            <button
              onClick={onQuickAdd}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-sky-200 bg-sky-50 text-sky-700 text-xs sm:text-sm font-semibold hover:bg-sky-100 transition whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              Quick Add
            </button>
            <button
              onClick={toggleSelectAllVisible}
              disabled={filteredStudents.length === 0}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition disabled:opacity-50 whitespace-nowrap"
            >
              <CheckSquare className="w-4 h-4" />
              {allVisibleSelected ? "Unselect All" : "Select All"}
            </button>
            <button
              onClick={handleBulkDeleteRequest}
              disabled={selectedIds.length === 0}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs sm:text-sm font-semibold hover:bg-red-100 transition disabled:opacity-50 whitespace-nowrap"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedIds.length})
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Course</span>
          <button
            onClick={() => setActiveCourse("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
              activeCourse === "all"
                ? "bg-sky-50 border-sky-200 text-sky-700"
                : "bg-white border-slate-200 text-slate-600"
            }`}
          >
            All
          </button>
          {courseOptions.map(course => (
            <button
              key={course}
              onClick={() => setActiveCourse(course)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border max-w-[11rem] truncate ${
                activeCourse === course
                  ? "bg-sky-50 border-sky-200 text-sky-700"
                  : "bg-white border-slate-200 text-slate-600"
              }`}
            >
              {course}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Age</span>
          {[
            { value: "all", label: "All" },
            { value: "under-20", label: "< 20" },
            { value: "20-30", label: "20-30" },
            { value: "30+", label: "30+" }
          ].map(item => (
            <button
              key={item.value}
              onClick={() => setActiveAgeBand(item.value as "all" | "under-20" | "20-30" | "30+")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                activeAgeBand === item.value
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                  : "bg-white border-slate-200 text-slate-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group glass-panel rounded-2xl p-3">
        <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none group-focus-within:text-sky-600 transition" />
        <input
          type="text"
          placeholder="Search by name, course, or age..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-12 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20 transition"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-7 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Results Counter and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl glass-panel min-w-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-100 border border-sky-200">
            <Users className="w-5 h-5 text-sky-700" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">Students found</p>
            <p className="font-display text-xl sm:text-2xl font-semibold text-slate-900">
              {filteredStudents.length} of {students.length}
            </p>
          </div>
        </div>
        {searchTerm && (
          <div className="text-sm text-slate-500 max-w-full sm:max-w-[16rem] truncate">
            Filtered by: <span className="text-sky-700 font-semibold">"{searchTerm}"</span>
          </div>
        )}
      </div>

      {/* Empty State */}
      {isEmpty && (
        <div className="glass-panel rounded-2xl py-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sky-50 border border-sky-100 mb-4">
            <Users className="w-10 h-10 text-sky-700" />
          </div>
          <h3 className="font-display text-2xl font-semibold text-slate-900 mb-2">No Students Yet</h3>
          <p className="text-slate-600 mb-6">Get started by adding your first student using the form</p>
          <div className="inline-block px-6 py-2 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 text-sm font-semibold">
            Add a student to get started
          </div>
        </div>
      )}

      {/* No Results State */}
      {isFiltered && (
        <div className="glass-panel rounded-2xl py-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 border border-slate-200 mb-4">
            <Search className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="font-display text-2xl font-semibold text-slate-900 mb-2">No Students Found</h3>
          <p className="text-slate-600">Try adjusting your search term: "<span className="text-sky-700">{searchTerm}</span>"</p>
        </div>
      )}

      {/* Students Grid */}
      {!isEmpty && filteredStudents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          {filteredStudents.map((s, index) => (
            <div key={s.id} className="animate-slideUp" style={{ animationDelay: `${index * 50}ms` }}>
              <StudentCard
                student={s}
                onDelete={onDelete}
                onEdit={onEdit}
                isSelected={selectedIds.includes(s.id)}
                onToggleSelect={toggleSelect}
              />
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={showBulkDeleteConfirm}
        title="Delete Selected Students"
        message={`Are you sure you want to delete ${selectedIds.length} selected students? This action cannot be undone.`}
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setShowBulkDeleteConfirm(false)}
        isLoading={isBulkDeleting}
        confirmText="Delete All"
        cancelText="Cancel"
      />
    </div>
  );
}
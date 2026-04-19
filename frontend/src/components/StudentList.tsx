import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search, Users, X, PlusCircle, SlidersHorizontal,
  Trash2, CheckSquare, Download, ChevronUp, ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import type { Student } from "../types";
import ConfirmModal from "./ConfirmModal";

interface Props {
  students: Student[];
  onDelete: (id: number) => Promise<void>;
  onEdit: (student: Student) => void;
  onQuickAdd: () => void;
}

type SortKey = "name" | "age" | "course" | "gpa";
type SortDir = "asc" | "desc";
type AgeBand = "all" | "under-20" | "20-25" | "25+";

const AVATAR_COLORS = [
  ["#DBEAFE", "#1D4ED8"], // blue
  ["#D1FAE5", "#065F46"], // emerald
  ["#FEF3C7", "#92400E"], // amber
  ["#EDE9FE", "#5B21B6"], // violet
  ["#FCE7F3", "#9D174D"], // pink
  ["#CFFAFE", "#0E7490"], // cyan
];

function getAvatarColors(name: string) {
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[hash];
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function gpaColor(gpa: number | undefined): string {
  if (gpa === undefined) return "text-slate-400";
  if (gpa >= 3.5) return "text-emerald-700";
  if (gpa >= 2.5) return "text-amber-700";
  return "text-red-600";
}

function exportToCSV(students: Student[]) {
  const header = "ID,Name,Age,Course,GPA\n";
  const rows = students
    .map((s) => `${s.id},"${s.name}",${s.age},"${s.course}",${s.gpa ?? ""}`)
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "students.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function StudentList({ students, onDelete, onEdit, onQuickAdd }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCourse, setActiveCourse] = useState("all");
  const [activeAgeBand, setActiveAgeBand] = useState<AgeBand>("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    setSelectedIds((prev) => {
      const ids = new Set(students.map((s) => s.id));
      return new Set([...prev].filter((id) => ids.has(id)));
    });
  }, [students]);

  const courseOptions = useMemo(() => {
    const counts = students.reduce<Record<string, number>>((acc, s) => {
      acc[s.course] = (acc[s.course] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([c]) => c);
  }, [students]);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return students
      .filter(
        (s) =>
          (!q ||
            s.name.toLowerCase().includes(q) ||
            s.course.toLowerCase().includes(q) ||
            s.age.toString().includes(q)) &&
          (activeCourse === "all" || s.course === activeCourse) &&
          (activeAgeBand === "all" ||
            (activeAgeBand === "under-20" && s.age < 20) ||
            (activeAgeBand === "20-25" && s.age >= 20 && s.age <= 25) ||
            (activeAgeBand === "25+" && s.age > 25))
      )
      .sort((a, b) => {
        if (!sortKey) return 0;
        let va: string | number = a[sortKey] ?? 0;
        let vb: string | number = b[sortKey] ?? 0;
        if (typeof va === "string") { va = va.toLowerCase(); vb = (vb as string).toLowerCase(); }
        return sortDir === "asc" ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
      });
  }, [students, searchTerm, activeCourse, activeAgeBand, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />
    ) : (
      <ChevronsUpDown size={13} className="opacity-40" />
    );

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = () => {
    const visibleIds = filtered.map((s) => s.id);
    const allSel = visibleIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSel) visibleIds.forEach((id) => next.delete(id));
      else visibleIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      await Promise.allSettled([...selectedIds].map((id) => onDelete(id)));
      setSelectedIds(new Set());
      setShowBulkDeleteConfirm(false);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((s) => selectedIds.has(s.id));

  const avgGpa = useMemo(() => {
    const withGpa = filtered.filter((s) => s.gpa !== undefined);
    if (!withGpa.length) return null;
    return (withGpa.reduce((a, s) => a + (s.gpa ?? 0), 0) / withGpa.length).toFixed(2);
  }, [filtered]);

  const chipBase = "px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer";
  const chipActive = (color: "sky" | "indigo") =>
    color === "sky"
      ? "bg-sky-50 border-sky-200 text-sky-700"
      : "bg-indigo-50 border-indigo-200 text-indigo-700";
  const chipInactive = "bg-white border-slate-200 text-slate-600 hover:bg-slate-50";

  const thBtn = (label: string, k: SortKey) => (
    <button
      onClick={() => toggleSort(k)}
      className="flex items-center gap-1 font-semibold hover:text-sky-700 transition group"
    >
      {label}
      <SortIcon k={k} />
    </button>
  );

  return (
    <div className="space-y-5 min-w-0">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-slate-900">Student Directory</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {students.length} enrolled · {courseOptions.length} courses
            {avgGpa ? ` · avg GPA ${avgGpa}` : ""}
          </p>
        </div>
        <button
          onClick={() => exportToCSV(filtered)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
          title="Export visible students to CSV"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Actions + Filters */}
      <div className="glass-panel rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <SlidersHorizontal size={14} />
            <span className="text-xs font-semibold uppercase tracking-wide">Filters & Actions</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={onQuickAdd}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-sky-200 bg-sky-50 text-sky-700 text-xs font-semibold hover:bg-sky-100 transition"
            >
              <PlusCircle size={13} /> Quick add
            </button>
            <button
              onClick={toggleSelectAll}
              disabled={filtered.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition disabled:opacity-40"
            >
              <CheckSquare size={13} /> {allVisibleSelected ? "Deselect all" : "Select all"}
            </button>
            <button
              onClick={() => selectedIds.size > 0 && setShowBulkDeleteConfirm(true)}
              disabled={selectedIds.size === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition disabled:opacity-40"
            >
              <Trash2 size={13} /> Delete ({selectedIds.size})
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Course</span>
          {[{ val: "all", label: "All" }, ...courseOptions.map((c) => ({ val: c, label: c }))].map(
            ({ val, label }) => (
              <button
                key={val}
                onClick={() => setActiveCourse(val)}
                className={`${chipBase} ${activeCourse === val ? chipActive("sky") : chipInactive}`}
              >
                {label}
              </button>
            )
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Age</span>
          {(["all", "under-20", "20-25", "25+"] as AgeBand[]).map((v) => (
            <button
              key={v}
              onClick={() => setActiveAgeBand(v)}
              className={`${chipBase} ${activeAgeBand === v ? chipActive("indigo") : chipInactive}`}
            >
              {v === "all" ? "All" : v === "under-20" ? "Under 20" : v}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative glass-panel rounded-2xl p-2.5">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name, course, or age…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Count bar */}
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl glass-panel">
        <div className="p-1.5 rounded-lg bg-sky-100 border border-sky-200">
          <Users size={16} className="text-sky-700" />
        </div>
        <span className="text-sm font-medium text-slate-500">
          Showing <span className="text-slate-900 font-semibold">{filtered.length}</span> of{" "}
          <span className="text-slate-900 font-semibold">{students.length}</span> students
        </span>
        {searchTerm && (
          <span className="ml-auto text-xs text-slate-500 truncate max-w-[200px]">
            for &ldquo;<span className="text-sky-700 font-semibold">{searchTerm}</span>&rdquo;
          </span>
        )}
      </div>

      {/* Empty state */}
      {students.length === 0 && (
        <div className="glass-panel rounded-2xl py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-50 border border-sky-100 mb-4">
            <Users className="w-8 h-8 text-sky-600" />
          </div>
          <h3 className="font-display text-xl font-semibold text-slate-900 mb-2">No students yet</h3>
          <p className="text-sm text-slate-500">Use the form to add your first student.</p>
        </div>
      )}

      {/* No results */}
      {students.length > 0 && filtered.length === 0 && (
        <div className="glass-panel rounded-2xl py-12 text-center">
          <Search className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold text-slate-900 mb-1">No matches</h3>
          <p className="text-sm text-slate-500">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="w-10 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                      className="accent-sky-600 w-3.5 h-3.5 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {thBtn("Student", "name")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {thBtn("Age", "age")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {thBtn("Course", "course")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {thBtn("GPA", "gpa")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const [bgColor, textColor] = getAvatarColors(s.name);
                  return (
                    <tr
                      key={s.id}
                      className={`border-b border-slate-100 last:border-0 transition ${
                        selectedIds.has(s.id)
                          ? "bg-sky-50"
                          : "hover:bg-slate-50/70"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(s.id)}
                          onChange={() => toggleSelect(s.id)}
                          className="accent-sky-600 w-3.5 h-3.5 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                            style={{ backgroundColor: bgColor, color: textColor }}
                          >
                            {initials(s.name)}
                          </div>
                          <span className="font-medium text-slate-800 truncate max-w-[140px]">
                            {s.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{s.age}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100 truncate max-w-[140px]">
                          {s.course}
                        </span>
                      </td>
                      <td className={`px-4 py-3 font-semibold tabular-nums ${gpaColor(s.gpa)}`}>
                        {s.gpa !== undefined ? s.gpa.toFixed(2) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                          Enrolled
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEdit(s)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-sky-50 text-sky-700 border border-sky-100 hover:bg-sky-100 transition"
                          >
                            Edit
                          </button>
                          <DeleteButton student={s} onDelete={onDelete} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showBulkDeleteConfirm}
        title="Delete selected students"
        message={`Delete ${selectedIds.size} selected student${selectedIds.size !== 1 ? "s" : ""}? This cannot be undone.`}
        onConfirm={handleBulkDelete}
        onCancel={() => setShowBulkDeleteConfirm(false)}
        isLoading={isBulkDeleting}
        confirmText="Delete all"
        cancelText="Cancel"
      />
    </div>
  );
}

function DeleteButton({
  student,
  onDelete,
}: {
  student: Student;
  onDelete: (id: number) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    try { await onDelete(student.id); setOpen(false); }
    finally { setLoading(false); }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition"
      >
        Delete
      </button>
      <ConfirmModal
        isOpen={open}
        title="Delete student"
        message={`Remove ${student.name}? This cannot be undone.`}
        onConfirm={confirm}
        onCancel={() => setOpen(false)}
        isLoading={loading}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
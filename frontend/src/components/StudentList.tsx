import { useMemo, useState } from "react";
import {
  Search,
  Users,
  X,
  PlusCircle,
  SlidersHorizontal,
  Download,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Edit2,
  Trash2,
} from "lucide-react";
import type { Student } from "../types";

interface Props {
  students: Student[];
  onDelete: (id: number) => Promise<void>;
  onEdit: (student: Student) => void;
  onQuickAdd: () => void;
}

type SortKey = "name" | "age" | "course" | "gpa";
type SortDir = "asc" | "desc";

function DeleteButton({
  student,
  onDelete,
}: {
  student: Student;
  onDelete: (id: number) => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
        title={`Delete ${student.name}`}
      >
        <Trash2 size={15} />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await onDelete(student.id);
          } finally {
            setBusy(false);
            setConfirming(false);
          }
        }}
        className="px-2 py-1 text-[11px] rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60"
      >
        {busy ? "..." : "Sure"}
      </button>
      <button
        disabled={busy}
        onClick={() => setConfirming(false)}
        className="px-2 py-1 text-[11px] rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
      >
        No
      </button>
    </div>
  );
}

export default function StudentList({ students, onDelete, onEdit, onQuickAdd }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCourse, setActiveCourse] = useState("all");
  const [activeAgeBand, setActiveAgeBand] = useState<"all" | "under-20" | "20-30" | "30+">("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const courseOptions = useMemo(() => {
    const courseCounts = students.reduce<Record<string, number>>((acc, student) => {
      acc[student.course] = (acc[student.course] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(courseCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([course]) => course);
  }, [students]);

  const filteredStudents = useMemo(() => {
    const filtered = students.filter(
      (s) =>
        (s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.age.toString().includes(searchTerm) ||
          (s.gpa ?? "").toString().includes(searchTerm)) &&
        (activeCourse === "all" || s.course === activeCourse) &&
        (activeAgeBand === "all" ||
          (activeAgeBand === "under-20" && s.age < 20) ||
          (activeAgeBand === "20-30" && s.age >= 20 && s.age <= 30) ||
          (activeAgeBand === "30+" && s.age > 30))
    );

    const sorted = [...filtered].sort((a, b) => {
      const getVal = (student: Student) => {
        if (sortKey === "gpa") return student.gpa ?? -1;
        return student[sortKey];
      };

      const av = getVal(a);
      const bv = getVal(b);

      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }

      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

    return sorted;
  }, [students, searchTerm, activeCourse, activeAgeBand, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const exportCSV = () => {
    if (!filteredStudents.length) return;

    const rows = [
      ["ID", "Name", "Age", "Course", "GPA"],
      ...filteredStudents.map((s) => [
        s.id,
        `"${s.name.replace(/"/g, '""')}"`,
        s.age,
        `"${s.course.replace(/"/g, '""')}"`,
        s.gpa ?? "",
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "students-export.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  const isEmpty = students.length === 0;
  const isFiltered = filteredStudents.length === 0 && !isEmpty;

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown size={13} className="text-slate-300" />;
    return sortDir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
  };

  return (
    <div className="space-y-5 min-w-0">
      <div className="glass-panel rounded-2xl p-5">
        <h2 className="font-display text-xl font-semibold text-slate-900">Student Directory</h2>
        <p className="text-sm text-slate-600 mt-1">
          Search, sort, and manage your student records efficiently.
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-4 space-y-4 min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600">
            <SlidersHorizontal className="w-4 h-4" />
            <p className="text-sm font-semibold">Quick Actions</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full lg:w-auto">
            <button
              onClick={onQuickAdd}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-sky-200 bg-sky-50 text-sky-700 text-xs sm:text-sm font-semibold hover:bg-sky-100 transition"
            >
              <PlusCircle className="w-4 h-4" />
              Quick Add
            </button>

            <button
              onClick={exportCSV}
              disabled={!filteredStudents.length}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-semibold hover:bg-emerald-100 transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>

            <div className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-600 font-medium text-center">
              Showing <span className="font-semibold text-slate-900">{filteredStudents.length}</span>
            </div>
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
          {courseOptions.map((course) => (
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
            { value: "30+", label: "30+" },
          ].map((item) => (
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

      <div className="relative group glass-panel rounded-2xl p-3">
        <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none group-focus-within:text-sky-600 transition" />
        <input
          type="text"
          placeholder="Search by name, course, age, or GPA..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

      {isEmpty && (
        <div className="glass-panel rounded-2xl py-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sky-50 border border-sky-100 mb-4">
            <Users className="w-10 h-10 text-sky-700" />
          </div>
          <h3 className="font-display text-2xl font-semibold text-slate-900 mb-2">No Students Yet</h3>
          <p className="text-slate-600 mb-6">Get started by adding your first student using the form</p>
        </div>
      )}

      {isFiltered && (
        <div className="glass-panel rounded-2xl py-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 border border-slate-200 mb-4">
            <Search className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="font-display text-2xl font-semibold text-slate-900 mb-2">No Students Found</h3>
          <p className="text-slate-600">Try adjusting your filters.</p>
        </div>
      )}

      {!isEmpty && filteredStudents.length > 0 && (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr>
                  {["name", "age", "course", "gpa"].map((key) => (
                    <th key={key} className="px-4 py-3 text-left font-semibold text-slate-600 uppercase text-xs tracking-wide">
                      <button
                        onClick={() => handleSort(key as SortKey)}
                        className="inline-flex items-center gap-1 hover:text-slate-900"
                      >
                        {key.toUpperCase()}
                        {sortIcon(key as SortKey)}
                      </button>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-semibold text-slate-600 uppercase text-xs tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-slate-100 hover:bg-sky-50/30 transition">
                    <td className="px-4 py-3 font-medium text-slate-900">{student.name}</td>
                    <td className="px-4 py-3 text-slate-700">{student.age}</td>
                    <td className="px-4 py-3 text-slate-700 max-w-[220px] truncate">{student.course}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {student.gpa !== undefined ? student.gpa.toFixed(2) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(student)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition"
                          title={`Edit ${student.name}`}
                        >
                          <Edit2 size={15} />
                        </button>

                        <DeleteButton student={student} onDelete={onDelete} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

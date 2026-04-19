import { useState, useEffect, useMemo } from "react";
import {
  BookOpen, Sparkles, Users, GraduationCap, Sun, Moon,
  LayoutDashboard, Search, Settings, ArrowRight, Palette,
  Calendar, BarChart3, Database, Clock3, TrendingUp, Award,
} from "lucide-react";
import type { Student } from "./types";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import StatsPanel from "./components/StatsPanel";
import Toast, { showToast } from "./components/Toast";
import LoadingSpinner from "./components/LoadingSpinner";
import Footer from "./components/Footer";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editing, setEditing] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    localStorage.getItem("dashboard-theme") === "dark" ? "dark" : "light"
  );
  const [activeSection, setActiveSection] = useState<"overview" | "students" | "settings">("overview");

  /* ── derived stats ─────────────────────────────────────────── */
  const totalStudents = students.length;

  const averageAge = useMemo(
    () =>
      students.length
        ? Math.round(students.reduce((s, st) => s + st.age, 0) / students.length)
        : 0,
    [students]
  );

  const coursesCount = useMemo(
    () => new Set(students.map((s) => s.course.toLowerCase())).size,
    [students]
  );

  const avgGpa = useMemo(() => {
    const withGpa = students.filter((s) => s.gpa !== undefined);
    return withGpa.length
      ? (withGpa.reduce((a, s) => a + (s.gpa ?? 0), 0) / withGpa.length).toFixed(2)
      : null;
  }, [students]);

  const topStudent = useMemo(() => {
    const withGpa = students.filter((s) => s.gpa !== undefined);
    return withGpa.length
      ? withGpa.reduce((best, s) => ((s.gpa ?? 0) > (best.gpa ?? 0) ? s : best))
      : null;
  }, [students]);

  const courseBreakdown = useMemo(
    () =>
      Object.entries(
        students.reduce<Record<string, number>>((acc, s) => {
          acc[s.course] = (acc[s.course] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1]),
    [students]
  );

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });

  /* ── theme persistence ─────────────────────────────────────── */
  useEffect(() => {
    localStorage.setItem("dashboard-theme", theme);
  }, [theme]);

  /* ── data fetching ─────────────────────────────────────────── */
  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/students`);
      if (!res.ok) throw new Error();
      setStudents(await res.json());
    } catch {
      showToast("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ── mutations ─────────────────────────────────────────────── */
  const addOrUpdate = async (student: Student) => {
    const isEditing = students.some((s) => s.id === student.id);
    try {
      const res = await fetch(
        `${API}/api/students${isEditing ? `/${student.id}` : ""}`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(student),
        }
      );
      if (!res.ok) throw new Error();
      const saved: Student = await res.json();
      setStudents((prev) =>
        isEditing ? prev.map((s) => (s.id === saved.id ? saved : s)) : [...prev, saved]
      );
      showToast(isEditing ? "Student updated" : "Student added", "success");
      setEditing(null);
    } catch {
      showToast(isEditing ? "Failed to update student" : "Failed to add student", "error");
    }
  };

  const deleteStudent = async (id: number) => {
    try {
      const res = await fetch(`${API}/api/students/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setStudents((prev) => prev.filter((s) => s.id !== id));
      showToast("Student deleted", "success");
    } catch {
      showToast("Failed to delete student", "error");
    }
  };

  /* ── helpers ───────────────────────────────────────────────── */
  const navLabel = { overview: "Overview", students: "Students", settings: "Settings" }[activeSection];

  const navBtn = (
    section: typeof activeSection,
    icon: React.ReactNode,
    label: string
  ) => (
    <button
      onClick={() => setActiveSection(section)}
      className={`dashboard-nav-item w-full text-left px-3 py-2.5 rounded-xl font-semibold flex items-center gap-2 ${
        activeSection === section
          ? "dashboard-nav-item-active"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  /* ── stat card helper ──────────────────────────────────────── */
  const StatCard = ({
    label, value, sub, icon, delay, accent,
  }: {
    label: string; value: string | number; sub: string;
    icon: React.ReactNode; delay: number;
    accent: "sky" | "blue" | "indigo" | "emerald" | "amber";
  }) => {
    const accents: Record<string, string> = {
      sky:     "bg-sky-50 border-sky-100 text-sky-600",
      blue:    "bg-blue-50 border-blue-100 text-blue-600",
      indigo:  "bg-indigo-50 border-indigo-100 text-indigo-600",
      emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
      amber:   "bg-amber-50 border-amber-100 text-amber-600",
    };
    return (
      <div
        className="glass-panel rounded-2xl p-5 animate-slideUp"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <div className={`h-8 w-8 rounded-lg border flex items-center justify-center ${accents[accent]}`}>
            {icon}
          </div>
        </div>
        <p className="font-display text-3xl font-semibold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500 mt-1">{sub}</p>
      </div>
    );
  };

  /* ── render ────────────────────────────────────────────────── */
  return (
    <div className={`dashboard-shell min-h-screen flex flex-col ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-160px] right-[-120px] h-[360px] w-[360px] rounded-full bg-gradient-to-br from-cyan-200/60 to-sky-300/50 blur-3xl" />
        <div className="absolute bottom-[-220px] left-[-120px] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-indigo-200/60 to-purple-200/45 blur-3xl" />
      </div>

      {/* ── Header ── */}
      <header className="dashboard-header sticky top-0 z-40 border-b border-white/70 bg-white/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="p-3 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-[0_10px_30px_rgba(14,116,244,0.32)]">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 truncate">
                  Student Manager
                </h1>
                <p className="text-slate-600 text-xs sm:text-sm mt-1 truncate">
                  Dashboard · {navLabel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200/80">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-600">{currentDate}</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">Live API</span>
              </div>
              <button
                onClick={() => setTheme((p) => (p === "light" ? "dark" : "light"))}
                className="h-10 px-2.5 sm:px-3 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 sm:gap-2"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span className="text-sm font-semibold">{theme === "light" ? "Dark" : "Light"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-6">

          {/* ── Sidebar nav ── */}
          <aside className="glass-panel rounded-2xl p-4 h-fit lg:sticky lg:top-24 animate-slideUp">
            <div className="mb-4 px-2">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500 font-semibold">Workspace</p>
              <p className="text-sm text-slate-600 mt-1">Switch sections below.</p>
            </div>
            <nav className="space-y-1.5">
              {navBtn("overview",  <LayoutDashboard className="w-4 h-4" />, "Overview")}
              {navBtn("students",  <Search className="w-4 h-4" />, "Students")}
              {navBtn("settings",  <Settings className="w-4 h-4" />, "Settings")}
            </nav>

            {/* Snapshot */}
            <div className="mt-5 p-3 rounded-xl bg-white/70 border border-slate-200/70 space-y-2">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500 font-semibold">Snapshot</p>
              {[
                ["Records",  totalStudents],
                ["Courses",  coursesCount],
                ["Avg GPA",  avgGpa ?? "—"],
                ["Avg Age",  averageAge || "—"],
              ].map(([k, v]) => (
                <div key={k as string} className="flex items-center justify-between text-sm text-slate-600">
                  <span>{k}</span>
                  <span className="font-semibold text-slate-900">{v}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Content area ── */}
          <div className="space-y-7 min-w-0">

            {/* ── Top stat cards — always visible ── */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total students" value={totalStudents} sub="Enrolled records"
                icon={<Users className="w-4 h-4" />} delay={30} accent="sky" />
              <StatCard label="Avg age" value={averageAge || "—"} sub="Mean across all"
                icon={<GraduationCap className="w-4 h-4" />} delay={80} accent="blue" />
              <StatCard label="Courses" value={coursesCount} sub="Unique programs"
                icon={<BookOpen className="w-4 h-4" />} delay={130} accent="indigo" />
              <StatCard label="Avg GPA" value={avgGpa ?? "—"} sub={topStudent ? `Top: ${topStudent.name}` : "No GPA data yet"}
                icon={<TrendingUp className="w-4 h-4" />} delay={180} accent="emerald" />
            </section>

            {/* ─── OVERVIEW ─── */}
            {activeSection === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp" style={{ animationDelay: "120ms" }}>

                {/* Welcome card */}
                <div className="glass-panel rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-semibold text-slate-900">Welcome back</h2>
                    <div className="h-9 w-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-sky-700" />
                    </div>
                  </div>
                  <p className="text-slate-600 leading-7 mb-6">
                    Track enrollment, manage student records, and monitor academic performance — all in one place.
                  </p>
                  <button
                    onClick={() => setActiveSection("students")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white font-semibold text-sm hover:from-sky-700 hover:to-blue-800 transition active:scale-95"
                  >
                    Manage students <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Health check */}
                <div className="glass-panel rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-semibold text-slate-900">Quick health check</h2>
                    <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                      <Database className="w-4 h-4 text-indigo-700" />
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-center justify-between">
                      <span>API connection</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-200/70 text-emerald-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Live
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Total records</span>
                      <span className="font-semibold text-slate-900">{totalStudents}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Distinct courses</span>
                      <span className="font-semibold text-slate-900">{coursesCount}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Average GPA</span>
                      <span className="font-semibold text-slate-900">{avgGpa ?? "—"}</span>
                    </li>
                    {topStudent && (
                      <li className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Top student</span>
                        <span className="font-semibold text-slate-900 truncate max-w-[140px]">{topStudent.name}</span>
                      </li>
                    )}
                    <li className="flex items-center justify-between">
                      <span className="flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" /> Updated</span>
                      <span className="font-semibold text-slate-900">{currentDate}</span>
                    </li>
                  </ul>
                </div>

                {/* Enrollment by course */}
                <div className="glass-panel rounded-2xl p-6 md:col-span-2">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display text-xl font-semibold text-slate-900">Enrollment by course</h2>
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Top {Math.min(courseBreakdown.length, 6)} courses
                    </span>
                  </div>

                  {courseBreakdown.length === 0 ? (
                    <p className="text-sm text-slate-500">No course data yet. Add students to populate this chart.</p>
                  ) : (
                    <div className="space-y-3.5">
                      {courseBreakdown.slice(0, 6).map(([course, count], i) => {
                        const max = courseBreakdown[0][1] || 1;
                        const pct = Math.max(8, Math.round((count / max) * 100));
                        const barColors = [
                          "from-sky-500 to-blue-600",
                          "from-indigo-500 to-violet-600",
                          "from-emerald-500 to-teal-600",
                          "from-amber-400 to-orange-500",
                          "from-rose-400 to-pink-600",
                          "from-cyan-400 to-sky-500",
                        ];
                        return (
                          <div key={course} className="space-y-1.5 min-w-0">
                            <div className="flex items-center justify-between gap-3 text-sm min-w-0">
                              <span className="font-medium text-slate-700 truncate">{course}</span>
                              <span className="flex items-center gap-2 shrink-0">
                                <span className="font-semibold text-slate-900">{count}</span>
                                <span className="text-slate-400 text-xs">
                                  {Math.round((count / totalStudents) * 100)}%
                                </span>
                              </span>
                            </div>
                            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${barColors[i % barColors.length]} transition-all duration-500`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── STUDENTS ─── */}
            {activeSection === "students" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 animate-slideUp" style={{ animationDelay: "60ms" }}>
                <div className="lg:col-span-1 space-y-5">
                  <StudentForm
                    addOrUpdate={addOrUpdate}
                    editing={editing}
                    onCancelEdit={() => setEditing(null)}
                  />
                  <StatsPanel students={students} />
                </div>

                <div className="lg:col-span-2">
                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    <StudentList
                      students={students}
                      onDelete={deleteStudent}
                      onEdit={(s) => {
                        setEditing(s);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      onQuickAdd={() => {
                        setEditing(null);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* ─── SETTINGS ─── */}
            {activeSection === "settings" && (
              <div className="space-y-6 animate-slideUp" style={{ animationDelay: "120ms" }}>
                {/* Appearance */}
                <div className="glass-panel rounded-2xl p-7">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100">
                      <Palette className="w-5 h-5 text-sky-700" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-semibold text-slate-900">Appearance</h2>
                      <p className="text-sm text-slate-600">Choose your preferred colour mode.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(["light", "dark"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          theme === t
                            ? "border-sky-300 bg-sky-50 shadow-[0_10px_24px_rgba(14,116,244,0.12)]"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {t === "light" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                          <p className="font-semibold text-slate-900 capitalize">{t} theme</p>
                          {theme === t && (
                            <span className="ml-auto text-xs font-semibold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">Active</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">
                          {t === "light" ? "Bright, clean glass-panel interface." : "Low-light mode, easy on the eyes."}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Data settings */}
                <div className="glass-panel rounded-2xl p-7">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
                      <Database className="w-5 h-5 text-indigo-700" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-semibold text-slate-900">Data</h2>
                      <p className="text-sm text-slate-600">API endpoint and refresh controls.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">API endpoint</p>
                        <p className="text-xs text-slate-500 mt-0.5 font-mono truncate max-w-[260px]">
                          {API || "http://localhost:3000"}/api/students
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live
                      </span>
                    </div>
                    <button
                      onClick={fetchStudents}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition active:scale-95"
                    >
                      <TrendingUp className="w-4 h-4" /> Refresh data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="app-footer">
        <Footer />
      </div>

      <Toast />
    </div>
  );
}
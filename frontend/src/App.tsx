import { useState, useEffect } from "react";
import { BookOpen, Sparkles, Users, GraduationCap, Sun, Moon, LayoutDashboard, Search, Settings, ArrowRight, Palette, Calendar, BarChart3, Database, Clock3 } from "lucide-react";
import type { Student } from "./types";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import Toast, { showToast } from "./components/Toast";
import LoadingSpinner from "./components/LoadingSpinner";
import Footer from "./components/Footer";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editing, setEditing] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("dashboard-theme");
    return savedTheme === "dark" ? "dark" : "light";
  });
  const [activeSection, setActiveSection] = useState<"overview" | "students" | "settings">("overview");

  const averageAge =
    students.length > 0
      ? Math.round(students.reduce((sum, student) => sum + student.age, 0) / students.length)
      : 0;
  const coursesCount = new Set(students.map(student => student.course.toLowerCase())).size;
  const courseBreakdown = Object.entries(
    students.reduce<Record<string, number>>((acc, student) => {
      acc[student.course] = (acc[student.course] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  useEffect(() => {
    localStorage.setItem("dashboard-theme", theme);
  }, [theme]);

  // Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/students`);
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      showToast("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  const addOrUpdate = async (student: Student) => {
    try {
      const isEditing = student.id && students.some(s => s.id === student.id);

      if (isEditing) {
        // Update existing student
        const res = await fetch(`${API}/api/students/${student.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(student)
        });

        if (!res.ok) throw new Error("Failed to update student");
        const updatedStudent = await res.json();

        setStudents(prev =>
          prev.map(s => (s.id === student.id ? updatedStudent : s))
        );
        showToast("Student updated successfully", "success");
      } else {
        // Add new student
        const res = await fetch(`${API}/api/students`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(student)
        });

        if (!res.ok) throw new Error("Failed to add student");
        const newStudent = await res.json();

        setStudents(prev => [...prev, newStudent]);
        showToast("Student added successfully", "success");
      }

      setEditing(null);
    } catch (error) {
      console.error("Error saving student:", error);
      showToast(
        editing ? "Failed to update student" : "Failed to add student",
        "error"
      );
    }
  };

  const deleteStudent = async (id: number) => {
    try {
      const res = await fetch(`${API}/api/students/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Failed to delete student");

      setStudents(prev => prev.filter(s => s.id !== id));
      showToast("Student deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting student:", error);
      showToast("Failed to delete student", "error");
    }
  };

  const activeSectionLabel =
    activeSection === "overview"
      ? "Overview"
      : activeSection === "students"
        ? "Students"
        : "Settings";

  return (
    <div className={`dashboard-shell min-h-screen flex flex-col ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-160px] right-[-120px] h-[360px] w-[360px] rounded-full bg-gradient-to-br from-cyan-200/60 to-sky-300/50 blur-3xl" />
        <div className="absolute bottom-[-220px] left-[-120px] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-indigo-200/60 to-purple-200/45 blur-3xl" />
      </div>

      {/* Header */}
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
                <p className="text-slate-600 text-xs sm:text-sm mt-1 truncate">Stripe-inspired dashboard • {activeSectionLabel}</p>
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
                onClick={() => setTheme(prev => (prev === "light" ? "dark" : "light"))}
                className="h-10 px-2.5 sm:px-3 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span className="text-sm font-semibold">{theme === "light" ? "Dark" : "Light"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-6">
          <aside className="dashboard-sidebar glass-panel rounded-2xl p-4 h-fit lg:sticky lg:top-24 animate-slideUp">
            <div className="mb-4 px-2">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500 font-semibold">Workspace</p>
              <p className="text-sm text-slate-600 mt-1">Switch sections and adjust your dashboard view.</p>
            </div>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection("overview")}
                className={`dashboard-nav-item w-full text-left px-3 py-2.5 rounded-xl font-semibold flex items-center gap-2 ${
                  activeSection === "overview"
                    ? "dashboard-nav-item-active"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Overview
              </button>
              <button
                onClick={() => setActiveSection("students")}
                className={`dashboard-nav-item w-full text-left px-3 py-2.5 rounded-xl font-semibold flex items-center gap-2 ${
                  activeSection === "students"
                    ? "dashboard-nav-item-active"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Search className="w-4 h-4" />
                Students
              </button>
              <button
                onClick={() => setActiveSection("settings")}
                className={`dashboard-nav-item w-full text-left px-3 py-2.5 rounded-xl font-semibold flex items-center gap-2 ${
                  activeSection === "settings"
                    ? "dashboard-nav-item-active"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </nav>

            <div className="mt-6 p-3 rounded-xl bg-white/70 border border-slate-200/70">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500 font-semibold mb-2">Snapshot</p>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Records</span>
                <span className="font-semibold text-slate-900">{students.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600 mt-1.5">
                <span>Courses</span>
                <span className="font-semibold text-slate-900">{coursesCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600 mt-1.5">
                <span>Last refresh</span>
                <span className="font-semibold text-slate-900">Now</span>
              </div>
            </div>
          </aside>

          <div className="space-y-7">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="glass-panel rounded-2xl p-5 animate-slideUp" style={{ animationDelay: "30ms" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-slate-600">Total Students</p>
                  <div className="h-8 w-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center">
                    <Users className="w-4 h-4 text-sky-600" />
                  </div>
                </div>
                <p className="font-display text-3xl font-semibold text-slate-900">{students.length}</p>
                <p className="text-sm text-slate-500 mt-1">Active records in your dashboard</p>
              </div>
              <div className="glass-panel rounded-2xl p-5 animate-slideUp" style={{ animationDelay: "90ms" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-slate-600">Average Age</p>
                  <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="font-display text-3xl font-semibold text-slate-900">{averageAge}</p>
                <p className="text-sm text-slate-500 mt-1">Mean age across all students</p>
              </div>
              <div className="glass-panel rounded-2xl p-5 animate-slideUp" style={{ animationDelay: "150ms" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-slate-600">Courses</p>
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                  </div>
                </div>
                <p className="font-display text-3xl font-semibold text-slate-900">{coursesCount}</p>
                <p className="text-sm text-slate-500 mt-1">Distinct programs represented</p>
              </div>
            </section>

            {activeSection === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp" style={{ animationDelay: "120ms" }}>
                <div className="glass-panel rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-semibold text-slate-900">Welcome back</h2>
                    <div className="h-9 w-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-sky-700" />
                    </div>
                  </div>
                  <p className="text-slate-600 leading-7 mb-6">
                    Use this dashboard to track enrollment, keep student records fresh, and maintain clean course data.
                  </p>
                  <button
                    onClick={() => setActiveSection("students")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white font-semibold hover:from-sky-700 hover:to-blue-800"
                  >
                    Manage Students
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="glass-panel rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-semibold text-slate-900">Quick health check</h2>
                    <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                      <Database className="w-4 h-4 text-indigo-700" />
                    </div>
                  </div>
                  <ul className="space-y-3 text-slate-600">
                    <li className="flex items-center justify-between">
                      <span>API connection</span>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-200/70 text-emerald-700">Live</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Total records</span>
                      <span className="font-semibold text-slate-900">{students.length}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Distinct courses</span>
                      <span className="font-semibold text-slate-900">{coursesCount}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5"><Clock3 className="w-3.5 h-3.5" /> Updated</span>
                      <span className="font-semibold text-slate-900">{currentDate}</span>
                    </li>
                  </ul>
                </div>

                <div className="glass-panel rounded-2xl p-6 md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-semibold text-slate-900">Enrollment by Course</h2>
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Top courses</span>
                  </div>

                  {courseBreakdown.length === 0 ? (
                    <p className="text-sm text-slate-500">No course data yet. Add students to populate this chart.</p>
                  ) : (
                    <div className="space-y-3">
                      {courseBreakdown.slice(0, 5).map(([course, count]) => {
                        const maxCount = courseBreakdown[0][1] || 1;
                        const width = Math.max(8, Math.round((count / maxCount) * 100));

                        return (
                          <div key={course} className="space-y-1.5 min-w-0">
                            <div className="flex items-center justify-between gap-3 text-sm min-w-0">
                              <span className="font-medium text-slate-700 truncate">{course}</span>
                              <span className="font-semibold text-slate-900">{count}</span>
                            </div>
                            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-600"
                                style={{ width: `${width}%` }}
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

            {activeSection === "students" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 animate-slideUp" style={{ animationDelay: "60ms" }}>
                {/* Form Section */}
                <div className="lg:col-span-1">
                  <StudentForm addOrUpdate={addOrUpdate} editing={editing} />
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    <StudentList
                      students={students}
                      onDelete={deleteStudent}
                      onEdit={setEditing}
                      onQuickAdd={() => {
                        setEditing(null);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            {activeSection === "settings" && (
              <div className="glass-panel rounded-2xl p-7 animate-slideUp" style={{ animationDelay: "120ms" }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100">
                    <Palette className="w-5 h-5 text-sky-700" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-slate-900">Appearance</h2>
                    <p className="text-sm text-slate-600">Customize your dashboard experience.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      theme === "light"
                        ? "border-sky-300 bg-sky-50 shadow-[0_10px_24px_rgba(14,116,244,0.12)]"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <p className="font-semibold text-slate-900">Light Theme</p>
                    <p className="text-sm text-slate-600 mt-1">Bright, clean Stripe-like interface.</p>
                  </button>

                  <button
                    onClick={() => setTheme("dark")}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      theme === "dark"
                        ? "border-sky-300 bg-sky-50 shadow-[0_10px_24px_rgba(14,116,244,0.12)]"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <p className="font-semibold text-slate-900">Dark Theme</p>
                    <p className="text-sm text-slate-600 mt-1">Low-light mode with glass panels.</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="app-footer">
        <Footer />
      </div>

      {/* Toast Container */}
      <Toast />
    </div>
  );
}
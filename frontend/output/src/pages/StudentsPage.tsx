import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, BookOpen, TrendingUp, UserPlus, RefreshCw } from "lucide-react";
import { useStudents } from "../hooks/useStudents";
import StatCard from "../components/StatCard";
import StudentCard from "../components/StudentCard";
import AddStudentModal from "../components/AddStudentModal";
import SearchBar from "../components/SearchBar";
import FilterChips, { type AgeBand } from "../components/FilterChips";
import EmptyState from "../components/EmptyState";
import LoadingGrid from "../components/LoadingGrid";
import CourseBar from "../components/CourseBar";
import type { Student } from "../types";

export default function StudentsPage() {
  const { students, loading, stats, addStudent, updateStudent, deleteStudent, fetchStudents } = useStudents();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [search, setSearch] = useState("");
  const [activeCourse, setActiveCourse] = useState("all");
  const [activeAge, setActiveAge] = useState<AgeBand>("all");

  /* ── Derived filter data ─────────────────── */
  const courseList = useMemo(
    () => [...new Set(students.map((s) => s.course))].sort(),
    [students]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter((s) => {
      const matchQ =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q);
      const matchC = activeCourse === "all" || s.course === activeCourse;
      const matchA =
        activeAge === "all" ||
        (activeAge === "under-20" && s.age < 20) ||
        (activeAge === "20-25"   && s.age >= 20 && s.age <= 25) ||
        (activeAge === "25+"     && s.age > 25);
      return matchQ && matchC && matchA;
    });
  }, [students, search, activeCourse, activeAge]);

  /* ── Modal helpers ───────────────────────── */
  const openAdd = () => { setEditingStudent(null); setModalOpen(true); };

  const handleSubmit = async (data: Omit<Student, "id">) => {
    if (editingStudent) {
      await updateStudent(editingStudent.id, data);
    } else {
      await addStudent(data);
    }
  };

  const isFiltered =
    search !== "" || activeCourse !== "all" || activeAge !== "all";

  return (
    <div className="min-h-screen bg-[#080b10] text-white">
      {/* ── Background ─────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[300px] bg-violet-600/5 rounded-full blur-[80px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* ── Hero Header ────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/25
                flex items-center justify-center
                shadow-[0_0_20px_rgba(99,102,241,0.25)]">
                <BookOpen size={18} className="text-blue-400" />
              </div>
              <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">
                Student Manager
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-none mb-3">
              <span className="text-white">Students</span>
            </h1>
            <p className="text-zinc-500 text-base max-w-md leading-relaxed">
              Manage your student roster. Add, search, and track academic progress in one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchStudents}
              disabled={loading}
              className="w-10 h-10 rounded-xl flex items-center justify-center
                bg-white/[0.04] border border-white/10
                text-zinc-500 hover:text-zinc-300 hover:border-white/20
                transition-all disabled:opacity-40"
              aria-label="Refresh"
            >
              <motion.div
                animate={loading ? { rotate: 360 } : { rotate: 0 }}
                transition={loading ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
              >
                <RefreshCw size={15} />
              </motion.div>
            </button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openAdd}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                shadow-[0_0_28px_rgba(99,102,241,0.4)]
                hover:shadow-[0_0_40px_rgba(99,102,241,0.55)]
                transition-shadow"
            >
              <UserPlus size={15} />
              Add student
            </motion.button>
          </div>
        </motion.header>

        {/* ── Stat Cards ─────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            index={0}
            icon={<Users size={18} />}
            label="Total Students"
            value={stats.total}
            sub="Enrolled in system"
            iconBg="bg-blue-500/10 border-blue-500/20 text-blue-400"
            glowColor="hover:shadow-blue-500/10"
          />
          <StatCard
            index={1}
            icon={<TrendingUp size={18} />}
            label="Average GPA"
            value={stats.avgGpa !== null ? stats.avgGpa.toFixed(2) : "—"}
            sub={stats.avgGpa !== null ? "Across all students" : "No GPA data yet"}
            iconBg="bg-violet-500/10 border-violet-500/20 text-violet-400"
            glowColor="hover:shadow-violet-500/10"
          />
          <StatCard
            index={2}
            icon={<BookOpen size={18} />}
            label="Courses"
            value={stats.courses}
            sub="Unique programs"
            iconBg="bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            glowColor="hover:shadow-emerald-500/10"
          />
        </section>

        {/* ── Course Distribution ─────────────────── */}
        {stats.courseBreakdown.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="rounded-2xl bg-white/[0.03] border border-white/8 backdrop-blur-sm p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold text-base">Course distribution</h2>
              <span className="text-zinc-600 text-xs">{stats.total} students</span>
            </div>
            <CourseBar breakdown={stats.courseBreakdown} total={stats.total} />
          </motion.section>
        )}

        {/* ── Search + Filters ───────────────────── */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <SearchBar value={search} onChange={setSearch} />
          {courseList.length > 0 && (
            <FilterChips
              courses={courseList}
              activeCourse={activeCourse}
              activeAge={activeAge}
              onCourseChange={setActiveCourse}
              onAgeChange={setActiveAge}
            />
          )}

          {/* Result count */}
          <div className="flex items-center justify-between">
            <p className="text-zinc-600 text-sm">
              {isFiltered ? (
                <>
                  <span className="text-white font-medium">{filtered.length}</span>
                  {" "}of{" "}
                  <span className="text-white font-medium">{students.length}</span>
                  {" "}students
                </>
              ) : (
                <><span className="text-white font-medium">{students.length}</span> students</>
              )}
            </p>
            {isFiltered && (
              <button
                onClick={() => { setSearch(""); setActiveCourse("all"); setActiveAge("all"); }}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2"
              >
                Clear filters
              </button>
            )}
          </div>
        </motion.section>

        {/* ── Student Grid ───────────────────────── */}
        <section>
          {loading ? (
            <LoadingGrid />
          ) : filtered.length === 0 ? (
            <EmptyState filtered={isFiltered} onAdd={openAdd} />
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((student, i) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onDelete={deleteStudent}
                    index={i}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </div>

      {/* ── Modal ──────────────────────────────── */}
      <AddStudentModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingStudent(null); }}
        onSubmit={handleSubmit}
        editingStudent={editingStudent}
      />
    </div>
  );
}

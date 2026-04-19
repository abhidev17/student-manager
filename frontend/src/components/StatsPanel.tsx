import { useMemo } from "react";
import { TrendingUp, Users, BookOpen, Award } from "lucide-react";
import type { Student } from "../types";

interface Props {
  students: Student[];
}

const BAR_COLORS = [
  "bg-sky-500",
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
];

export default function StatsPanel({ students }: Props) {
  const stats = useMemo(() => {
    if (!students.length) return null;

    const withGpa = students.filter((s) => s.gpa !== undefined);
    const avgGpa = withGpa.length
      ? (withGpa.reduce((a, s) => a + (s.gpa ?? 0), 0) / withGpa.length).toFixed(2)
      : null;

    const topGpa = withGpa.length
      ? withGpa.reduce((best, s) => ((s.gpa ?? 0) > (best.gpa ?? 0) ? s : best))
      : null;

    const courseCounts = students.reduce<Record<string, number>>((acc, s) => {
      acc[s.course] = (acc[s.course] || 0) + 1;
      return acc;
    }, {});

    const sortedCourses = Object.entries(courseCounts)
      .sort((a, b) => b[1] - a[1]);

    const maxCount = sortedCourses[0]?.[1] ?? 1;

    const avgAge = (students.reduce((a, s) => a + s.age, 0) / students.length).toFixed(1);

    return { avgGpa, topGpa, sortedCourses, maxCount, avgAge };
  }, [students]);

  if (!students.length) return null;

  const metricCard = (icon: React.ReactNode, label: string, value: string, sub?: string) => (
    <div className="p-3 rounded-xl bg-white border border-slate-100">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="text-slate-400">{icon}</div>
        <span className="text-xs text-slate-500 font-medium">{label}</span>
      </div>
      <p className="font-display text-lg font-semibold text-slate-900 leading-none">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1 truncate">{sub}</p>}
    </div>
  );

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-5">
      <h3 className="font-display text-sm font-semibold text-slate-700 uppercase tracking-wide">
        Overview
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {metricCard(<Users size={14} />, "Total", String(students.length), "students enrolled")}
        {stats?.avgGpa
          ? metricCard(<TrendingUp size={14} />, "Avg GPA", stats.avgGpa, "across all students")
          : metricCard(<TrendingUp size={14} />, "Avg GPA", "—", "no GPA data yet")}
        {metricCard(<BookOpen size={14} />, "Courses", String(stats?.sortedCourses.length ?? 0), "unique courses")}
        {metricCard(
          <Award size={14} />,
          "Top GPA",
          stats?.topGpa?.gpa?.toFixed(2) ?? "—",
          stats?.topGpa?.name
        )}
      </div>

      {/* Course distribution */}
      {stats && stats.sortedCourses.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Course distribution
          </p>
          <div className="space-y-2.5">
            {stats.sortedCourses.slice(0, 5).map(([course, count], i) => (
              <div key={course}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 truncate max-w-[160px]">{course}</span>
                  <span className="text-slate-400 ml-2 flex-shrink-0">
                    {count} · {Math.round((count / students.length) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]} transition-all duration-500`}
                    style={{ width: `${Math.round((count / stats.maxCount) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Age distribution hint */}
      {stats && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs text-slate-500">
            Average age: <span className="font-semibold text-slate-700">{stats.avgAge} yrs</span>
          </p>
        </div>
      )}
    </div>
  );
}
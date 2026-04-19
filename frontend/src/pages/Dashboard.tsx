import { motion } from 'framer-motion';
import CourseDistribution from '../components/CourseDistribution';
import { StatCard } from '../components/StatCard';
import { Button } from '../components/Button';
import { GlassCard } from '../components/GlassCard';
import { calculateAverageGPA } from '../utils/formatters';
import type { Student } from '../types';

interface DashboardProps {
  students: Student[];
  onAddStudent: () => void;
  onOpenImport?: () => void;
  onOpenReport?: () => void;
}

export const Dashboard = ({
  students,
  onAddStudent,
  onOpenImport,
  onOpenReport,
}: DashboardProps) => {
  const stats = {
    total: students.length,
    avgGpa: calculateAverageGPA(students),
    coursesCount: new Set(students.map((s) => s.course)).size,
  };

  const highestGpa =
    students.length > 0
      ? Math.max(...students.filter((s) => s.gpa).map((s) => s.gpa || 0)).toFixed(2)
      : '—';

  const lowestGpa =
    students.length > 0
      ? Math.min(...students.filter((s) => s.gpa).map((s) => s.gpa || 4)).toFixed(2)
      : '—';

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-sm text-gray-400">Overview of your student records</p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onAddStudent}>+ Add Student</Button>
          {onOpenImport && (
            <Button onClick={onOpenImport} variant="secondary">
              Import
            </Button>
          )}
          {onOpenReport && (
            <Button onClick={onOpenReport} variant="secondary">
              Reports
            </Button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: 'Total Students',
            value: stats.total,
            subtitle: '+12%',
          },
          {
            title: 'Average GPA',
            value: stats.avgGpa.toFixed(2),
            subtitle: 'Across all students',
          },
          {
            title: 'Total Courses',
            value: stats.coursesCount,
            subtitle: 'Unique courses',
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <StatCard title={stat.title} value={stat.value} subtitle={stat.subtitle} />
          </motion.div>
        ))}
      </div>

      {/* Quick Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <GlassCard>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-semibold text-white">Academic Overview</h3>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="border-l border-white/10 pl-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">With GPA Records</p>
              <p className="text-3xl font-bold text-white">{students.filter((s) => s.gpa !== undefined).length}</p>
            </div>
            <div className="border-l border-white/10 pl-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Highest GPA</p>
              <p className="text-3xl font-bold text-emerald-400">{highestGpa}</p>
            </div>
            <div className="border-l border-white/10 pl-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Lowest GPA</p>
              <p className="text-3xl font-bold text-orange-400">{lowestGpa}</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Course Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <CourseDistribution students={students} />
      </motion.div>
    </div>
  );
};

export default Dashboard;

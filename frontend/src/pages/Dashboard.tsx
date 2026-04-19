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
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

        <div className="flex gap-3">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mb-10">
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
        className="mb-10"
      >
        <GlassCard>
          <h3 className="text-lg font-semibold mb-6">Quick Stats</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Students with GPA</span>
              <span className="font-semibold">
                {students.filter((s) => s.gpa !== undefined).length}
              </span>
            </div>
            <div className="flex justify-between text-green-400">
              <span>Highest GPA</span>
              <span className="font-semibold">{highestGpa}</span>
            </div>
            <div className="flex justify-between text-red-400">
              <span>Lowest GPA</span>
              <span className="font-semibold">{lowestGpa}</span>
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

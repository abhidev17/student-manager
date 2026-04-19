import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import CourseDistribution from '../components/CourseDistribution';
import { StatCard } from '../components/StatCard';
import { GlassCard } from '../components/GlassCard';
import { calculateAverageGPA } from '../utils/formatters';
import type { Student } from '../types';

interface AnalyticsProps {
  students: Student[];
}

export const Analytics = ({ students }: AnalyticsProps) => {
  const ageDistribution = {
    'under-20': students.filter((s) => s.age < 20).length,
    '20-25': students.filter((s) => s.age >= 20 && s.age <= 25).length,
    '25-plus': students.filter((s) => s.age > 25).length,
  };

  const studentsWithGPA = students.filter((s) => s.gpa !== undefined);
  const gpaStats = {
    average: calculateAverageGPA(students),
    highest:
      studentsWithGPA.length > 0
        ? Math.max(...studentsWithGPA.map((s) => s.gpa || 0))
        : 0,
    lowest:
      studentsWithGPA.length > 0
        ? Math.min(...studentsWithGPA.map((s) => s.gpa || 4))
        : 0,
    highPerformers: students.filter((s) => (s.gpa || 0) >= 3.5).length,
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="pb-2">
        <h1 className="text-3xl font-bold text-white mb-1">Analytics</h1>
        <p className="text-sm text-gray-400">Performance metrics and insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: 'Average GPA',
            value: gpaStats.average.toFixed(2),
            subtitle: 'Mean across students',
          },
          {
            title: 'High Performers',
            value: gpaStats.highPerformers,
            subtitle: 'GPA ≥ 3.5',
          },
          {
            title: 'Total Students',
            value: students.length,
            subtitle: 'Enrolled',
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

      {/* Age Distribution & GPA Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <GlassCard>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Age Distribution</h3>
              <p className="text-xs text-gray-500 mt-1">Student demographics by age group</p>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={Object.entries(ageDistribution).map(([group, count]) => ({
                  name:
                    group === 'under-20' ? 'Under 20' : group === '20-25' ? '20–25' : '25+',
                  value: count,
                }))}
              >
                <XAxis dataKey="name" stroke="#aaa" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* GPA Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <GlassCard>
            <div className="mb-7">
              <h3 className="text-lg font-semibold text-white">GPA Statistics</h3>
              <p className="text-xs text-gray-500 mt-1">Performance summary</p>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Highest GPA</p>
                <p className="text-3xl font-bold text-emerald-400">{gpaStats.highest.toFixed(2)}</p>
              </div>
              <div className="border-t border-white/8 pt-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Average GPA</p>
                <p className="text-3xl font-bold text-blue-400">{gpaStats.average.toFixed(2)}</p>
              </div>
              <div className="border-t border-white/8 pt-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Lowest GPA</p>
                <p className="text-3xl font-bold text-orange-400">{gpaStats.lowest.toFixed(2)}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Course Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <CourseDistribution students={students} />
      </motion.div>
    </div>
  );
};

export default Analytics;

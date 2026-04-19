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
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mb-10">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Age Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <GlassCard>
            <h3 className="text-lg font-medium mb-6">Age Distribution</h3>

            <ResponsiveContainer width="100%" height={200}>
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
            <h3 className="text-lg font-medium mb-6">GPA Statistics</h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Highest GPA</span>
                <span className="text-green-400 font-semibold text-lg">
                  {gpaStats.highest.toFixed(2)}
                </span>
              </div>
              <div className="h-px bg-white/10"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Average GPA</span>
                <span className="text-blue-400 font-semibold text-lg">
                  {gpaStats.average.toFixed(2)}
                </span>
              </div>
              <div className="h-px bg-white/10"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Lowest GPA</span>
                <span className="text-red-400 font-semibold text-lg">
                  {gpaStats.lowest.toFixed(2)}
                </span>
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

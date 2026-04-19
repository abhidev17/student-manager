import { useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { GlassCard } from './GlassCard';
import type { Student } from '../types';

interface CourseDistributionProps {
  students: Student[];
}

export const CourseDistribution = ({ students }: CourseDistributionProps) => {
  const chartData = useMemo(() => {
    if (students.length === 0) return [];

    const counts: Record<string, number> = {};
    students.forEach(student => {
      counts[student.course] = (counts[student.course] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([course, count]) => ({
        name: course.substring(0, 12),
        value: count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [students]);

  if (chartData.length === 0) {
    return (
      <GlassCard>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">Course Distribution</h3>
          <p className="text-xs text-gray-500 mt-1">Enrollment breakdown by course</p>
        </div>
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/5 mb-4">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm font-medium">No data available</p>
          <p className="text-gray-500 text-xs mt-1">Add students to see distribution</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="mb-7">
        <h3 className="text-lg font-semibold text-white">Course Distribution</h3>
        <p className="text-xs text-gray-500 mt-1">Students enrolled per course</p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" stroke="#aaa" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#fff' }}
          />
          <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
};

export default CourseDistribution;

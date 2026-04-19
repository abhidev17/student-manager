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
        <h3 className="text-lg font-semibold mb-4">Course Distribution</h3>
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No data available</p>
          <p className="text-gray-500 text-xs mt-1">Add students to see distribution</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <h3 className="text-lg font-medium mb-6">Course Distribution</h3>

      <ResponsiveContainer width="100%" height={250}>
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

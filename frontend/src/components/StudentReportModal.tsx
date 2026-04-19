import { BarChart3, TrendingUp, Download, X } from 'lucide-react';
import { BulkOperationsService } from '../services/bulk-operations';
import type { Student } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
}

export default function StudentReportModal({ isOpen, onClose, students }: Props) {
  const report = BulkOperationsService.generateReport(students);

  const handleExportJSON = () => {
    BulkOperationsService.exportReportToJSON(students, 'students-report');
  };

  const handleExportCSV = () => {
    BulkOperationsService.exportToCSV(students, 'students-export');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-white" />
            <h2 className="text-lg font-bold text-white">Student Report & Analytics</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">Total Students</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{report.totalStudents}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Average GPA</p>
              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{report.averageGPA.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-1">Highest GPA</p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{report.highestGPA?.gpa?.toFixed(2) || '—'}</p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-rose-200 dark:border-rose-800">
              <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-1">Lowest GPA</p>
              <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">{report.lowestGPA?.gpa?.toFixed(2) || '—'}</p>
            </div>
          </div>

          {/* Detailed Reports */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Course Distribution */}
            <div className="bg-slate-50 dark:bg-slate-900/30 rounded-lg p-5 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-500" />
                Course Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(report.courseDistribution).map(([course, count]) => (
                  <div key={course}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{course}</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{count}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-sky-500 to-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(count / report.totalStudents) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Age Distribution */}
            <div className="bg-slate-50 dark:bg-slate-900/30 rounded-lg p-5 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Age Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(report.ageDistribution).map(([age, count]) => (
                  <div key={age}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{age}</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{count}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full"
                        style={{
                          width: `${(count / report.totalStudents) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GPA Distribution */}
          {Object.keys(report.gpaDistribution).length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-900/30 rounded-lg p-5 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                GPA Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(report.gpaDistribution)
                  .sort((a, b) => b[0].localeCompare(a[0]))
                  .map(([gpa, count]) => (
                    <div key={gpa}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{gpa}</span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{count}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full"
                          style={{
                            width: `${(count / report.totalStudents) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Top Student */}
          {report.highestGPA && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-5 border border-amber-200 dark:border-amber-800">
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">🏆 Top Performer</p>
              <p className="text-lg font-bold text-amber-900 dark:text-amber-100">
                {report.highestGPA.name}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                {report.highestGPA.course} • GPA {report.highestGPA.gpa?.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex gap-3 justify-end border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300 flex items-center gap-2"
          >
            <Download size={16} />
            Export JSON
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300 flex items-center gap-2"
          >
            <Download size={16} />
            Export CSV
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

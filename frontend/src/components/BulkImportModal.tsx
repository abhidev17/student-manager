import { useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { BulkOperationsService } from '../services/bulk-operations';
import type { Student } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImport: (students: Omit<Student, 'id'>[]) => Promise<void>;
  isLoading?: boolean;
}

export default function BulkImportModal({ isOpen, onClose, onImport, isLoading = false }: Props) {
  const [csvText, setCSVText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Omit<Student, 'id'>[] | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setCSVText(text);
        const parsed = BulkOperationsService.parseCSV(text);
        setPreview(parsed);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse CSV');
        setPreview(null);
      }
    };
    reader.readAsText(file);
  };

  const handleTextChange = (text: string) => {
    setCSVText(text);
    if (text.trim().length === 0) {
      setPreview(null);
      setError(null);
      return;
    }

    try {
      const parsed = BulkOperationsService.parseCSV(text);
      setPreview(parsed);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid CSV format');
      setPreview(null);
    }
  };

  const handleImport = async () => {
    if (!preview || preview.length === 0) {
      setError('No valid students to import');
      return;
    }

    try {
      await onImport(preview);
      setCSVText('');
      setPreview(null);
      setError(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Upload className="w-5 h-5 text-white" />
            <h2 className="text-lg font-bold text-white">Bulk Import Students</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* CSV Format Instructions */}
          <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg p-4">
            <p className="text-sm font-semibold text-sky-900 dark:text-sky-200 mb-2">CSV Format Required:</p>
            <code className="text-xs bg-white dark:bg-slate-900 p-2 rounded block text-slate-700 dark:text-slate-300 overflow-x-auto">
              name,age,course,gpa{'\n'}
              Priya Sharma,21,Data Science,3.9{'\n'}
              Arjun Kumar,22,Engineering,3.5
            </code>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Upload CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="w-full"
              disabled={isLoading}
            />
          </div>

          {/* Text Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Or Paste CSV Text
            </label>
            <textarea
              value={csvText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={`name,age,course,gpa\nJohn Doe,20,Computer Science,3.8\nJane Smith,21,Data Science,3.9`}
              className="w-full h-40 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Preview */}
          {preview && preview.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  {preview.length} student{preview.length !== 1 ? 's' : ''} ready to import
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg overflow-auto max-h-48">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">Age</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">Course</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">GPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((student, idx) => (
                      <tr key={idx} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <td className="px-4 py-2 text-slate-900 dark:text-white">{student.name}</td>
                        <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{student.age}</td>
                        <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{student.course}</td>
                        <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{student.gpa ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex gap-3 justify-end border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!preview || preview.length === 0 || isLoading}
            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'Importing...' : `Import ${preview?.length || 0} Students`}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import Button from './common/Button';
import Input from './common/Input';
import { Card } from './common/Card';
import type { Student } from '../types';

interface StudentModalProps {
  isOpen: boolean;
  editingStudent: Student | null;
  onClose: () => void;
  onSubmit: (student: Omit<Student, 'id'>) => Promise<void>;
  isLoading?: boolean;
}

const COURSES = [
  'Computer Science',
  'Data Science',
  'Design',
  'Business',
  'Physics',
  'Mathematics',
  'Engineering',
  'Psychology',
  'Economics',
  'Biology',
];

const MIN_AGE = 16;
const MAX_AGE = 60;
const MAX_NAME = 50;

export const StudentModal = ({
  isOpen,
  editingStudent,
  onClose,
  onSubmit,
  isLoading = false,
}: StudentModalProps) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [course, setCourse] = useState('');
  const [customCourse, setCustomCourse] = useState('');
  const [gpa, setGpa] = useState<number | ''>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isCustomCourse = course === '__custom__';
  const effectiveCourse = isCustomCourse ? customCourse : course;

  // Populate form when editing
  useEffect(() => {
    if (editingStudent) {
      setName(editingStudent.name);
      setAge(editingStudent.age);
      setGpa(editingStudent.gpa ?? '');
      const isKnown = COURSES.includes(editingStudent.course);
      if (isKnown) {
        setCourse(editingStudent.course);
        setCustomCourse('');
      } else {
        setCourse('__custom__');
        setCustomCourse(editingStudent.course);
      }
    } else {
      resetForm();
    }
    setErrors({});
  }, [editingStudent, isOpen]);

  const resetForm = () => {
    setName('');
    setAge('');
    setCourse('');
    setCustomCourse('');
    setGpa('');
  };

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = 'Name is required';
    } else if (name.trim().length > MAX_NAME) {
      errs.name = `Max ${MAX_NAME} characters`;
    }

    if (age === '' || Number(age) < MIN_AGE || Number(age) > MAX_AGE) {
      errs.age = `Age must be ${MIN_AGE}-${MAX_AGE}`;
    }

    if (!effectiveCourse.trim()) {
      errs.course = 'Course is required';
    }

    if (gpa !== '' && (Number(gpa) < 0 || Number(gpa) > 4)) {
      errs.gpa = 'GPA must be 0.0-4.0';
    }

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        age: Number(age),
        course: effectiveCourse.trim(),
        gpa: gpa !== '' ? Number(gpa) : undefined,
      });
      resetForm();
      onClose();
    } catch (err) {
      // Error handled by parent
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-scaleIn">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                  {editingStudent ? 'Edit Student' : 'Add Student'}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {editingStudent ? 'Update student information' : 'Add a new student to the system'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value.slice(0, MAX_NAME));
                  setErrors(p => ({ ...p, name: '' }));
                }}
                placeholder="e.g. John Doe"
                error={errors.name}
                helper={`${name.length}/${MAX_NAME}`}
                disabled={isLoading}
              />

              <Input
                label="Age"
                type="number"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value === '' ? '' : Number(e.target.value));
                  setErrors(p => ({ ...p, age: '' }));
                }}
                placeholder={`${MIN_AGE}-${MAX_AGE}`}
                error={errors.age}
                disabled={isLoading}
              />

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Course
                </label>
                <select
                  value={course}
                  onChange={(e) => {
                    setCourse(e.target.value);
                    setErrors(p => ({ ...p, course: '' }));
                  }}
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-sky-200 focus:outline-none disabled:opacity-50"
                >
                  <option value="">Select a course...</option>
                  {COURSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="__custom__">Other (type below)</option>
                </select>
                {errors.course && (
                  <p className="mt-1 flex items-center gap-1 text-red-600 text-xs">
                    <AlertCircle size={14} />
                    {errors.course}
                  </p>
                )}
              </div>

              {isCustomCourse && (
                <Input
                  label="Custom Course Name"
                  type="text"
                  value={customCourse}
                  onChange={(e) => {
                    setCustomCourse(e.target.value);
                    setErrors(p => ({ ...p, course: '' }));
                  }}
                  placeholder="Enter course name"
                  disabled={isLoading}
                />
              )}

              <Input
                label="GPA (Optional)"
                type="number"
                value={gpa}
                onChange={(e) => {
                  setGpa(e.target.value === '' ? '' : Number(e.target.value));
                  setErrors(p => ({ ...p, gpa: '' }));
                }}
                placeholder="0.0 - 4.0"
                error={errors.gpa}
                disabled={isLoading}
                min={0}
                max={4}
                step={0.01}
              />

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isLoading}
                >
                  {editingStudent ? 'Save Changes' : 'Add Student'}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </>
  );
};

export default StudentModal;

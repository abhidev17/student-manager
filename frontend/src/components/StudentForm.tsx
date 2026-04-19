import { useState, useEffect } from "react";
import { Plus, Edit2, Loader, AlertCircle } from "lucide-react";
import type { Student } from "../types";
import validationLimits from "../constants/validationLimits.json";

interface Props {
  addOrUpdate: (student: Student) => Promise<void>;
  editing: Student | null;
}

const MAX_NAME_LENGTH = validationLimits.maxNameLength;
const MAX_COURSE_LENGTH = validationLimits.maxCourseLength;
const MIN_AGE = validationLimits.minAge;
const MAX_AGE = validationLimits.maxAge;

export default function StudentForm({ addOrUpdate, editing }: Props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(0);
  const [course, setCourse] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setAge(editing.age);
      setCourse(editing.course);
    } else {
      clearForm();
    }
  }, [editing]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (name.trim().length > MAX_NAME_LENGTH) {
      newErrors.name = `Name must be ${MAX_NAME_LENGTH} characters or fewer`;
    }
    if (age < MIN_AGE || age > MAX_AGE) {
      newErrors.age = `Age must be between ${MIN_AGE} and ${MAX_AGE}`;
    }
    if (!course.trim()) newErrors.course = "Course is required";
    if (course.trim().length > MAX_COURSE_LENGTH) {
      newErrors.course = `Course must be ${MAX_COURSE_LENGTH} characters or fewer`;
    }
    return newErrors;
  };

  const clearForm = () => {
    setName("");
    setAge(0);
    setCourse("");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await addOrUpdate({
        id: editing ? editing.id : Date.now(),
        name: name.trim(),
        age,
        course: course.trim()
      });

      clearForm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sticky top-24 glass-panel p-7 rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-7">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-[0_8px_20px_rgba(14,116,244,0.35)]">
          {editing ? <Edit2 className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold text-slate-900 leading-tight">
            {editing ? "Edit Student" : "Add Student"}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {editing ? "Update the student details and save changes." : "Create a new student profile in seconds."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => {
              setName(e.target.value.slice(0, MAX_NAME_LENGTH));
              setErrors(prev => ({ ...prev, name: "" }));
            }}
            placeholder="John Doe"
            maxLength={MAX_NAME_LENGTH}
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-xl bg-white/75 border transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ${
              errors.name
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/25"
                : "border-slate-200 focus:border-sky-400 focus:ring-sky-400/25"
            } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          {errors.name && (
            <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
              <AlertCircle size={14} />
              {errors.name}
            </div>
          )}
          <p className="mt-1 text-xs text-slate-500 text-right">{name.length}/{MAX_NAME_LENGTH}</p>
        </div>

        {/* Age Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Age
          </label>
          <input
            type="number"
            value={age}
            onChange={e => {
              setAge(Number(e.target.value));
              setErrors(prev => ({ ...prev, age: "" }));
            }}
            placeholder="25"
            min={MIN_AGE}
            max={MAX_AGE}
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-xl bg-white/75 border transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ${
              errors.age
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/25"
                : "border-slate-200 focus:border-sky-400 focus:ring-sky-400/25"
            } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          {errors.age && (
            <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
              <AlertCircle size={14} />
              {errors.age}
            </div>
          )}
        </div>

        {/* Course Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Course
          </label>
          <input
            type="text"
            value={course}
            onChange={e => {
              setCourse(e.target.value.slice(0, MAX_COURSE_LENGTH));
              setErrors(prev => ({ ...prev, course: "" }));
            }}
            placeholder="Computer Science"
            maxLength={MAX_COURSE_LENGTH}
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-xl bg-white/75 border transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ${
              errors.course
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/25"
                : "border-slate-200 focus:border-sky-400 focus:ring-sky-400/25"
            } text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          {errors.course && (
            <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
              <AlertCircle size={14} />
              {errors.course}
            </div>
          )}
          <p className="mt-1 text-xs text-slate-500 text-right">{course.length}/{MAX_COURSE_LENGTH}</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 px-4 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white font-semibold hover:from-sky-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-sky-400/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-[0_12px_26px_rgba(14,116,244,0.28)]"
        >
          {isLoading ? (
            <>
              <Loader size={18} className="animate-spin" />
              <span>{editing ? "Updating..." : "Adding..."}</span>
            </>
          ) : editing ? (
            <>
              <Edit2 size={18} />
              <span>Update Student</span>
            </>
          ) : (
            <>
              <Plus size={18} />
              <span>Add Student</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
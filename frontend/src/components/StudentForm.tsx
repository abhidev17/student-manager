import { useState, useEffect } from "react";
import { Plus, Edit2, Loader } from "lucide-react";
import type { Student } from "../types";

interface Props {
  addOrUpdate: (student: Student) => Promise<void>;
  editing: Student | null;
}

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
    }
  }, [editing]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (age < 1 || age > 120) newErrors.age = "Age must be between 1 and 120";
    if (!course.trim()) newErrors.course = "Course is required";
    return newErrors;
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

      setName("");
      setAge(0);
      setCourse("");
      setErrors({});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sticky top-24 p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600/50 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        {editing ? (
          <>
            <Edit2 className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Edit Student</h2>
          </>
        ) : (
          <>
            <Plus className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Add Student</h2>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => {
              setName(e.target.value);
              setErrors(prev => ({ ...prev, name: "" }));
            }}
            placeholder="Enter student name"
            disabled={isLoading}
            className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border ${
              errors.name ? "border-red-500" : "border-slate-600"
            } text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Age Input */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Age
          </label>
          <input
            type="number"
            value={age}
            onChange={e => {
              setAge(Number(e.target.value));
              setErrors(prev => ({ ...prev, age: "" }));
            }}
            placeholder="Enter age"
            min="1"
            max="120"
            disabled={isLoading}
            className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border ${
              errors.age ? "border-red-500" : "border-slate-600"
            } text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
        </div>

        {/* Course Input */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Course
          </label>
          <input
            type="text"
            value={course}
            onChange={e => {
              setCourse(e.target.value);
              setErrors(prev => ({ ...prev, course: "" }));
            }}
            placeholder="Enter course name"
            disabled={isLoading}
            className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border ${
              errors.course ? "border-red-500" : "border-slate-600"
            } text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          {errors.course && <p className="text-red-400 text-sm mt-1">{errors.course}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <>
              <Loader size={18} className="animate-spin" />
              {editing ? "Updating..." : "Adding..."}
            </>
          ) : editing ? (
            <>
              <Edit2 size={18} />
              Update Student
            </>
          ) : (
            <>
              <Plus size={18} />
              Add Student
            </>
          )}
        </button>
      </form>
    </div>
  );
}
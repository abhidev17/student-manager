import { useState, useEffect } from "react";
import { Plus, Edit2, Loader, AlertCircle, X } from "lucide-react";
import type { Student } from "../types";

const COURSES = [
  "Computer Science",
  "Data Science",
  "Design",
  "Business",
  "Physics",
  "Mathematics",
  "Engineering",
  "Psychology",
  "Economics",
  "Biology",
];

interface Props {
  addOrUpdate: (student: Student) => Promise<void>;
  editing: Student | null;
  onCancelEdit: () => void;
}

const MAX_NAME = 50;
const MAX_COURSE = 60;
const MIN_AGE = 16;
const MAX_AGE = 60;

export default function StudentForm({ addOrUpdate, editing, onCancelEdit }: Props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [course, setCourse] = useState("");
  const [customCourse, setCustomCourse] = useState("");
  const [gpa, setGpa] = useState<number | "">("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const isCustomCourse = course === "__custom__";
  const effectiveCourse = isCustomCourse ? customCourse : course;

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setAge(editing.age);
      setGpa(editing.gpa ?? "");
      const isKnown = COURSES.includes(editing.course);
      if (isKnown) {
        setCourse(editing.course);
        setCustomCourse("");
      } else {
        setCourse("__custom__");
        setCustomCourse(editing.course);
      }
    } else {
      clearForm();
    }
  }, [editing]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    else if (name.trim().length > MAX_NAME) e.name = `Max ${MAX_NAME} characters`;
    if (age === "" || Number(age) < MIN_AGE || Number(age) > MAX_AGE)
      e.age = `Age must be ${MIN_AGE}-${MAX_AGE}`;
    if (!effectiveCourse.trim()) e.course = "Course is required";
    else if (effectiveCourse.trim().length > MAX_COURSE) e.course = `Max ${MAX_COURSE} characters`;
    if (gpa !== "" && (Number(gpa) < 0 || Number(gpa) > 4))
      e.gpa = "GPA must be 0.0-4.0";
    return e;
  };

  const clearForm = () => {
    setName(""); setAge(""); setCourse(""); setCustomCourse(""); setGpa(""); setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsLoading(true);
    try {
      await addOrUpdate({
        id: editing ? editing.id : Date.now(),
        name: name.trim(),
        age: Number(age),
        course: effectiveCourse.trim(),
        gpa: gpa !== "" ? Number(gpa) : undefined,
      });
      clearForm();
    } finally {
      setIsLoading(false);
    }
  };

  const field = (
    label: string,
    key: string,
    input: React.ReactNode,
    hint?: string
  ) => (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {input}
      {errors[key] && (
        <p className="mt-1.5 flex items-center gap-1 text-red-600 text-xs">
          <AlertCircle size={12} /> {errors[key]}
        </p>
      )}
      {hint && !errors[key] && (
        <p className="mt-1 text-xs text-slate-400 text-right">{hint}</p>
      )}
    </div>
  );

  const inputCls = (key: string) =>
    `w-full px-3 py-2.5 rounded-xl bg-white border text-sm text-slate-900 placeholder-slate-400
     focus:outline-none focus:ring-2 transition disabled:opacity-50 ${
       errors[key]
         ? "border-red-300 focus:border-red-400 focus:ring-red-100"
         : "border-slate-200 focus:border-sky-400 focus:ring-sky-100"
     }`;

  return (
    <div className="sticky top-24">
      <div className="glass-panel rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl shadow-md ${
                editing
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                  : "bg-gradient-to-br from-sky-500 to-blue-600"
              }`}
            >
              {editing ? (
                <Edit2 className="w-4 h-4 text-white" />
              ) : (
                <Plus className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900 leading-tight">
                {editing ? "Edit student" : "Add student"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {editing ? "Update record below" : "Fill in the details below"}
              </p>
            </div>
          </div>
          {editing && (
            <button
              onClick={onCancelEdit}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              title="Cancel editing"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {field(
            "Full name",
            "name",
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value.slice(0, MAX_NAME));
                setErrors((p) => ({ ...p, name: "" }));
              }}
              placeholder="e.g. Priya Nair"
              disabled={isLoading}
              className={inputCls("name")}
            />,
            `${name.length}/${MAX_NAME}`
          )}

          {field(
            "Age",
            "age",
            <input
              type="number"
              value={age}
              onChange={(e) => {
                setAge(e.target.value === "" ? "" : Number(e.target.value));
                setErrors((p) => ({ ...p, age: "" }));
              }}
              placeholder={`${MIN_AGE}-${MAX_AGE}`}
              min={MIN_AGE}
              max={MAX_AGE}
              disabled={isLoading}
              className={inputCls("age")}
            />
          )}

          {field(
            "Course",
            "course",
            <div className="space-y-2">
              <select
                value={course}
                onChange={(e) => {
                  setCourse(e.target.value);
                  setErrors((p) => ({ ...p, course: "" }));
                }}
                disabled={isLoading}
                className={inputCls("course")}
              >
                <option value="">Select a course...</option>
                {COURSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="__custom__">Other (type below)</option>
              </select>
              {isCustomCourse && (
                <input
                  type="text"
                  value={customCourse}
                  onChange={(e) => {
                    setCustomCourse(e.target.value.slice(0, MAX_COURSE));
                    setErrors((p) => ({ ...p, course: "" }));
                  }}
                  placeholder="Enter course name"
                  disabled={isLoading}
                  className={inputCls("course")}
                />
              )}
            </div>
          )}

          {field(
            "GPA (optional)",
            "gpa",
            <input
              type="number"
              value={gpa}
              onChange={(e) => {
                setGpa(e.target.value === "" ? "" : Number(e.target.value));
                setErrors((p) => ({ ...p, gpa: "" }));
              }}
              placeholder="0.0 - 4.0"
              min={0}
              max={4}
              step={0.01}
              disabled={isLoading}
              className={inputCls("gpa")}
            />
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-2 px-4 py-3 rounded-xl text-white font-semibold text-sm
              focus:outline-none focus:ring-4 transition-all flex items-center justify-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-95 ${
                editing
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:ring-emerald-200"
                  : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 focus:ring-sky-200"
              }`}
          >
            {isLoading ? (
              <><Loader size={16} className="animate-spin" /> {editing ? "Saving..." : "Adding..."}</>
            ) : editing ? (
              <><Edit2 size={16} /> Save changes</>
            ) : (
              <><Plus size={16} /> Add student</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

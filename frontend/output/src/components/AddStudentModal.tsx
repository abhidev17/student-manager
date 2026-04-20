import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Loader2, AlertCircle } from "lucide-react";
import type { Student, FormErrors } from "../types";

const COURSES = [
  "Computer Science",
  "Data Science",
  "Design",
  "Business",
  "Mathematics",
  "Physics",
  "Engineering",
  "Psychology",
  "Economics",
  "Biology",
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Student, "id">) => Promise<void>;
  editingStudent?: Student | null;
}

const empty = { name: "", age: "", course: "", gpa: "" };

export default function AddStudentModal({ open, onClose, onSubmit, editingStudent }: Props) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Sync form when editing
  useEffect(() => {
    if (editingStudent) {
      setForm({
        name: editingStudent.name,
        age: String(editingStudent.age),
        course: editingStudent.course,
        gpa: editingStudent.gpa !== undefined ? String(editingStudent.gpa) : "",
      });
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [editingStudent, open]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required";
    else if (form.name.trim().length > 60) e.name = "Max 60 characters";

    const age = Number(form.age);
    if (!form.age) e.age = "Age is required";
    else if (isNaN(age) || age < 16 || age > 60) e.age = "Age must be 16–60";

    if (!form.course) e.course = "Please select a course";

    if (form.gpa !== "") {
      const gpa = Number(form.gpa);
      if (isNaN(gpa) || gpa < 0 || gpa > 4) e.gpa = "GPA must be 0.0–4.0";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        age: Number(form.age),
        course: form.course,
        gpa: form.gpa !== "" ? Number(form.gpa) : undefined,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const field = (
    id: keyof typeof form,
    label: string,
    node: React.ReactNode,
    hint?: string
  ) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest">
        {label}
        {hint && <span className="normal-case font-normal ml-1.5 text-zinc-600">{hint}</span>}
      </label>
      {node}
      {errors[id] && (
        <p className="flex items-center gap-1 text-xs text-red-400">
          <AlertCircle size={11} /> {errors[id]}
        </p>
      )}
    </div>
  );

  const inputCls = (key: keyof FormErrors) => `
    w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white
    placeholder:text-zinc-600 outline-none transition-all
    focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50
    ${errors[key]
      ? "border-red-500/40 bg-red-500/5"
      : "border-white/10 hover:border-white/20"
    }
  `;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit   ={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.7)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/8">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                    <UserPlus size={17} className="text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-base leading-tight">
                      {editingStudent ? "Edit Student" : "Add New Student"}
                    </h2>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      {editingStudent ? "Update the student record" : "Fill in the details below"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500
                    hover:text-zinc-300 hover:bg-white/8 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                {field(
                  "name",
                  "Full Name",
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setErrors((p) => ({ ...p, name: undefined })); }}
                    placeholder="e.g. Arjun Menon"
                    className={inputCls("name")}
                    disabled={submitting}
                  />
                )}

                <div className="grid grid-cols-2 gap-3">
                  {field(
                    "age",
                    "Age",
                    <input
                      id="age"
                      type="number"
                      value={form.age}
                      onChange={(e) => { setForm((p) => ({ ...p, age: e.target.value })); setErrors((p) => ({ ...p, age: undefined })); }}
                      placeholder="16–60"
                      min={16} max={60}
                      className={inputCls("age")}
                      disabled={submitting}
                    />
                  )}
                  {field(
                    "gpa",
                    "GPA",
                    <input
                      id="gpa"
                      type="number"
                      value={form.gpa}
                      onChange={(e) => { setForm((p) => ({ ...p, gpa: e.target.value })); setErrors((p) => ({ ...p, gpa: undefined })); }}
                      placeholder="0.0–4.0"
                      min={0} max={4} step={0.01}
                      className={inputCls("gpa")}
                      disabled={submitting}
                    />,
                    "(optional)"
                  )}
                </div>

                {field(
                  "course",
                  "Course",
                  <select
                    id="course"
                    value={form.course}
                    onChange={(e) => { setForm((p) => ({ ...p, course: e.target.value })); setErrors((p) => ({ ...p, course: undefined })); }}
                    className={`${inputCls("course")} appearance-none cursor-pointer`}
                    disabled={submitting}
                  >
                    <option value="" disabled>Select a course…</option>
                    {COURSES.map((c) => (
                      <option key={c} value={c} className="bg-zinc-900">{c}</option>
                    ))}
                  </select>
                )}

                {/* Footer */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={submitting}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-400
                      hover:bg-white/5 hover:text-zinc-200 transition-all text-sm font-medium
                      disabled:opacity-40"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white
                      bg-gradient-to-r from-blue-600 to-indigo-600
                      hover:from-blue-500 hover:to-indigo-500
                      shadow-[0_0_24px_rgba(99,102,241,0.35)]
                      hover:shadow-[0_0_32px_rgba(99,102,241,0.5)]
                      transition-all flex items-center justify-center gap-2
                      disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <><Loader2 size={15} className="animate-spin" /> Saving…</>
                    ) : editingStudent ? "Save Changes" : "Add Student"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

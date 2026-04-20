import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, BookOpen, Star } from "lucide-react";
import type { Student } from "../types";
import ConfirmDialog from "./ConfirmDialog";

/* ── avatar helpers ───────────────────────────── */
const PALETTES: [string, string][] = [
  ["#1e3a5f", "#60a5fa"],
  ["#1a3d2a", "#4ade80"],
  ["#3b1a5f", "#c084fc"],
  ["#3d1a1a", "#f87171"],
  ["#1a3340", "#38bdf8"],
  ["#2d2a10", "#facc15"],
  ["#1f2d1a", "#a3e635"],
  ["#2d1a2d", "#e879f9"],
];

function avatarColors(name: string): [string, string] {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % PALETTES.length;
  return PALETTES[h];
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase();
}

function gpaStyle(gpa: number | undefined): { text: string; dot: string } {
  if (gpa === undefined) return { text: "text-zinc-500", dot: "bg-zinc-700" };
  if (gpa >= 3.5) return { text: "text-emerald-400", dot: "bg-emerald-500" };
  if (gpa >= 2.5) return { text: "text-amber-400",   dot: "bg-amber-500"   };
  return            { text: "text-red-400",           dot: "bg-red-500"     };
}

/* ── component ────────────────────────────────── */
interface Props {
  student: Student;
  onDelete: (id: number) => Promise<void>;
  index?: number;
}

export default function StudentCard({ student, onDelete, index = 0 }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [bgColor, textColor] = avatarColors(student.name);
  const gpa = gpaStyle(student.gpa);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(student.id);
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0  }}
        exit   ={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: index * 0.04, type: "spring", stiffness: 260, damping: 22 }}
        whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 25 } }}
        className="group relative rounded-2xl bg-white/[0.04] border border-white/10
          backdrop-blur-sm p-5 overflow-hidden
          hover:border-white/20 hover:bg-white/[0.07]
          hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]
          transition-all duration-300 cursor-default"
      >
        {/* Glow blob */}
        <div
          className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundColor: textColor }}
        />

        {/* Top row: avatar + delete */}
        <div className="flex items-start justify-between mb-4">
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold select-none"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            {initials(student.name)}
          </motion.div>

          <button
            onClick={() => setConfirmOpen(true)}
            className="w-8 h-8 rounded-xl flex items-center justify-center
              text-zinc-600 hover:text-red-400 hover:bg-red-500/10
              opacity-0 group-hover:opacity-100
              transition-all duration-200"
            aria-label="Delete student"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Name */}
        <h3 className="text-white font-semibold text-base leading-tight truncate mb-1">
          {student.name}
        </h3>
        <p className="text-zinc-500 text-xs mb-4">Age {student.age}</p>

        {/* Divider */}
        <div className="border-t border-white/8 mb-4" />

        {/* Course + GPA */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <BookOpen size={12} className="text-zinc-600 shrink-0" />
            <span className="text-zinc-400 text-xs truncate">{student.course}</span>
          </div>

          {student.gpa !== undefined && (
            <div className={`flex items-center gap-1 shrink-0 ${gpa.text}`}>
              <Star size={11} className="fill-current" />
              <span className="text-xs font-semibold">{student.gpa.toFixed(1)}</span>
            </div>
          )}
        </div>
      </motion.div>

      <ConfirmDialog
        open={confirmOpen}
        title="Remove student?"
        description={`${student.name} will be permanently deleted from the system.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
    </>
  );
}

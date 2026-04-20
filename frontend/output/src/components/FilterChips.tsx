import { motion } from "framer-motion";

type AgeBand = "all" | "under-20" | "20-25" | "25+";

interface Props {
  courses: string[];
  activeCourse: string;
  activeAge: AgeBand;
  onCourseChange: (c: string) => void;
  onAgeChange: (a: AgeBand) => void;
}

const AGE_BANDS: { val: AgeBand; label: string }[] = [
  { val: "all",      label: "All ages" },
  { val: "under-20", label: "< 20"     },
  { val: "20-25",    label: "20–25"    },
  { val: "25+",      label: "25+"      },
];

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all
        ${active
          ? "bg-blue-500/20 border-blue-500/40 text-blue-300 shadow-[0_0_14px_rgba(99,102,241,0.25)]"
          : "bg-white/[0.04] border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300"
        }
      `}
    >
      {label}
    </motion.button>
  );
}

export default function FilterChips({
  courses,
  activeCourse,
  activeAge,
  onCourseChange,
  onAgeChange,
}: Props) {
  return (
    <div className="space-y-3">
      {/* Course filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-zinc-600 font-semibold uppercase tracking-widest mr-1">Course</span>
        <Chip label="All" active={activeCourse === "all"} onClick={() => onCourseChange("all")} />
        {courses.slice(0, 5).map((c) => (
          <Chip key={c} label={c} active={activeCourse === c} onClick={() => onCourseChange(c)} />
        ))}
      </div>

      {/* Age filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-zinc-600 font-semibold uppercase tracking-widest mr-1">Age</span>
        {AGE_BANDS.map((b) => (
          <Chip key={b.val} label={b.label} active={activeAge === b.val} onClick={() => onAgeChange(b.val)} />
        ))}
      </div>
    </div>
  );
}

export type { AgeBand };

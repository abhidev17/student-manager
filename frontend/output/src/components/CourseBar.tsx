import { motion } from "framer-motion";

interface Props {
  breakdown: [string, number][];
  total: number;
}

const COLORS = [
  "from-blue-500 to-indigo-500",
  "from-violet-500 to-purple-500",
  "from-emerald-500 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-cyan-400 to-sky-500",
];

export default function CourseBar({ breakdown, total }: Props) {
  if (!breakdown.length) return null;
  const max = breakdown[0][1];

  return (
    <div className="space-y-3">
      {breakdown.slice(0, 6).map(([course, count], i) => {
        const pct = Math.round((count / max) * 100);
        const share = Math.round((count / total) * 100);
        return (
          <div key={course}>
            <div className="flex items-center justify-between mb-1.5 gap-2">
              <span className="text-zinc-400 text-xs truncate">{course}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-zinc-600 text-xs">{share}%</span>
                <span className="text-white text-xs font-semibold">{count}</span>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: i * 0.07, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                className={`h-full rounded-full bg-gradient-to-r ${COLORS[i % COLORS.length]}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

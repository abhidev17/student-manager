import { motion } from "framer-motion";

interface Props {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  glowColor: string;   // Tailwind shadow class e.g. "shadow-blue-500/20"
  iconBg: string;      // Tailwind bg e.g. "bg-blue-500/10 border-blue-500/20 text-blue-400"
  index?: number;
}

export default function StatCard({ icon, label, value, sub, glowColor, iconBg, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 260, damping: 22 }}
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/[0.04] border border-white/10
        backdrop-blur-sm p-6
        hover:border-white/20 hover:bg-white/[0.06]
        transition-all duration-300 group
        hover:shadow-xl ${glowColor}
      `}
    >
      {/* Subtle inner glow */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/[0.02] blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>

      <p className="text-zinc-400 text-sm font-medium mb-1">{label}</p>
      <p className="text-white text-3xl font-bold tracking-tight leading-none">
        {value}
      </p>
      {sub && <p className="text-zinc-600 text-xs mt-2">{sub}</p>}
    </motion.div>
  );
}

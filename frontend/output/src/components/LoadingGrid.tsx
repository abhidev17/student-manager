import { motion } from "framer-motion";

function SkeletonCard({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="rounded-2xl bg-white/[0.03] border border-white/8 p-5 space-y-3 overflow-hidden"
    >
      {/* Avatar row */}
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-2xl bg-white/8 animate-pulse" />
      </div>
      {/* Name */}
      <div className="space-y-2 pt-1">
        <div className="h-3.5 w-3/4 rounded-full bg-white/8 animate-pulse" />
        <div className="h-2.5 w-1/3 rounded-full bg-white/5 animate-pulse" />
      </div>
      {/* Divider */}
      <div className="border-t border-white/8" />
      {/* Footer */}
      <div className="flex justify-between">
        <div className="h-2.5 w-2/5 rounded-full bg-white/8 animate-pulse" />
        <div className="h-2.5 w-1/6 rounded-full bg-white/8 animate-pulse" />
      </div>
    </motion.div>
  );
}

export default function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} delay={i * 0.05} />
      ))}
    </div>
  );
}

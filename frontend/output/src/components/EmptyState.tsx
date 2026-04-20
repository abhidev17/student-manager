import { motion } from "framer-motion";
import { UserPlus, GraduationCap } from "lucide-react";

interface Props {
  filtered?: boolean;
  onAdd: () => void;
}

export default function EmptyState({ filtered = false, onAdd }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/10
          flex items-center justify-center
          shadow-[0_0_60px_rgba(99,102,241,0.12)]">
          <GraduationCap size={32} className="text-zinc-500" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute inset-0 rounded-3xl border border-indigo-500/20 pointer-events-none"
        />
      </div>

      <h3 className="text-white font-semibold text-xl mb-2">
        {filtered ? "No matches found" : "No students yet"}
      </h3>
      <p className="text-zinc-500 text-sm max-w-xs leading-relaxed mb-8">
        {filtered
          ? "Try adjusting your search or filter criteria to find what you're looking for."
          : "Start building your student roster. Add your first student to get started."}
      </p>

      {!filtered && (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
            bg-gradient-to-r from-blue-600 to-indigo-600 text-white
            shadow-[0_0_24px_rgba(99,102,241,0.4)]
            hover:shadow-[0_0_36px_rgba(99,102,241,0.55)]
            transition-shadow"
        >
          <UserPlus size={15} />
          Add your first student
        </motion.button>
      )}
    </motion.div>
  );
}

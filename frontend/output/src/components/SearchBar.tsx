import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search students…" }: Props) {
  return (
    <div className="relative group">
      <Search
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500
          group-focus-within:text-blue-400 transition-colors pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border border-white/10
          text-sm text-white placeholder:text-zinc-600
          focus:outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20
          hover:border-white/20 transition-all"
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1   }}
            exit   ={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.12 }}
            onClick={() => onChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500
              hover:text-zinc-300 transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

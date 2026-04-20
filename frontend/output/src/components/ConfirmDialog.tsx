import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  loading = false,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit   ={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle size={22} className="text-red-400" />
                </div>
              </div>

              <h3 className="text-center text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-center text-zinc-400 text-sm leading-relaxed mb-6">{description}</p>

              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-zinc-300
                    hover:bg-white/5 transition-colors text-sm font-medium
                    disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/90 hover:bg-red-500
                    text-white text-sm font-semibold transition-colors
                    flex items-center justify-center gap-2
                    disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

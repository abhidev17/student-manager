import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";
import type { ToastVariant } from "../types";

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

type Listener = (item: ToastItem) => void;
const listeners = new Set<Listener>();
let counter = 0;

function emit(message: string, variant: ToastVariant) {
  const item: ToastItem = { id: `t-${counter++}`, message, variant };
  listeners.forEach((fn) => fn(item));
}

export const toast = {
  success: (msg: string) => emit(msg, "success"),
  error:   (msg: string) => emit(msg, "error"),
  info:    (msg: string) => emit(msg, "info"),
};

const ICONS = {
  success: <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />,
  error:   <XCircle      size={15} className="text-red-400 shrink-0" />,
  info:    <AlertCircle  size={15} className="text-blue-400 shrink-0" />,
};

const GLOW = {
  success: "shadow-[0_0_20px_rgba(52,211,153,0.15)]",
  error:   "shadow-[0_0_20px_rgba(248,113,113,0.15)]",
  info:    "shadow-[0_0_20px_rgba(96,165,250,0.15)]",
};

export default function Toast() {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handler: Listener = (item) => {
      setItems((prev) => [...prev, item]);
      setTimeout(() => remove(item.id), 3800);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, [remove]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {items.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit   ={{ opacity: 0, x: 40, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl
              bg-zinc-900/95 border border-white/10 backdrop-blur-xl
              text-sm text-zinc-100 font-medium min-w-[260px] max-w-[360px]
              ${GLOW[t.variant]}
            `}
          >
            {ICONS[t.variant]}
            <span className="flex-1 leading-snug">{t.message}</span>
            <button
              onClick={() => remove(t.id)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors ml-1"
              aria-label="Dismiss"
            >
              <X size={13} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

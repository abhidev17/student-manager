import { AlertCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-panel rounded-2xl shadow-2xl max-w-sm w-full animate-slideIn">
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-50 border border-red-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="font-display text-xl font-semibold text-slate-900 text-center mb-2">{title}</h2>

          {/* Message */}
          <p className="text-slate-600 text-center mb-6">{message}</p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-white text-slate-700 border border-slate-200 font-medium hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

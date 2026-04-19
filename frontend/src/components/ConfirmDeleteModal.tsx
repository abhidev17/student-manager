import { AlertTriangle } from 'lucide-react';
import Button from './common/Button';
import { Card } from './common/Card';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  itemName: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal = ({
  isOpen,
  itemName,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm animate-scaleIn">
          <div className="p-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-600 dark:text-red-400" size={32} />
              </div>
            </div>

            {/* Content */}
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white text-center mb-2">
              Delete {itemName}?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
              This action cannot be undone. The record will be permanently removed from the system.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={onConfirm}
                isLoading={isLoading}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ConfirmDeleteModal;

import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useStore } from '@/store/StoreContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, dismissToast } = useStore();

  useEffect(() => {
    // toasts auto-dismiss via timeout in context
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg animate-slide-up min-w-[280px] max-w-[400px]"
        >
          {toast.type === 'success' && <CheckCircle2 size={20} className="text-green-500 shrink-0" />}
          {toast.type === 'error' && <AlertCircle size={20} className="text-red-500 shrink-0" />}
          {toast.type === 'info' && <Info size={20} className="text-blue-500 shrink-0" />}
          <span className="text-sm text-gray-800 flex-1">{toast.message}</span>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

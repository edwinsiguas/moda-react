import { useToast } from '../context/ToastContext';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const CONFIG = {
  success: {
    Icon:        CheckCircle2,
    border:      'border-l-green-500',
    bg:          'bg-green-50',
    text:        'text-green-800',
    bar:         'bg-green-500',
    iconColor:   'text-green-500',
  },
  error: {
    Icon:        XCircle,
    border:      'border-l-red-500',
    bg:          'bg-red-50',
    text:        'text-red-800',
    bar:         'bg-red-500',
    iconColor:   'text-red-500',
  },
  warning: {
    Icon:        AlertTriangle,
    border:      'border-l-amber-500',
    bg:          'bg-amber-50',
    text:        'text-amber-800',
    bar:         'bg-amber-500',
    iconColor:   'text-amber-500',
  },
  info: {
    Icon:        Info,
    border:      'border-l-primary',
    bg:          'bg-primary/5',
    text:        'text-primary',
    bar:         'bg-primary',
    iconColor:   'text-primary',
  },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const c = CONFIG[toast.type] || CONFIG.info;
        const { Icon } = c;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto relative overflow-hidden border-l-4 rounded-2xl shadow-2xl shadow-black/15 ${c.border} ${c.bg} animate-slide-in-right`}
          >
            <div className={`flex items-start gap-3 px-4 py-3.5 ${c.text}`}>
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${c.iconColor}`} strokeWidth={2} />
              <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="h-0.5 w-full">
              <div className={`h-full ${c.bar} toast-progress`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

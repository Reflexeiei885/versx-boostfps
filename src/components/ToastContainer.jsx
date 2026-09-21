import React from 'react';
import { CircleCheck, CircleX, Info, TriangleAlert, X } from 'lucide-react';
import { useStore } from '../store/useStore';

const TOAST_THEMES = {
  success: {
    icon: CircleCheck,
    color: "text-glow-green",
    bg: "bg-glow-green/10",
    border: "border-glow-green/30"
  },
  error: {
    icon: CircleX,
    color: "text-glow-red",
    bg: "bg-glow-red/10",
    border: "border-glow-red/30"
  },
  info: {
    icon: Info,
    color: "text-glow-blue",
    bg: "bg-glow-blue/10",
    border: "border-glow-blue/30"
  },
  warning: {
    icon: TriangleAlert,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/30"
  }
};

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 w-80 pointer-events-none">
      {toasts.map((toast) => {
        const theme = TOAST_THEMES[toast.type] || TOAST_THEMES.info;
        const IconComponent = theme.icon;

        return (
          <div
            key={toast.id}
            className={`glass-strong rounded-xl border ${theme.border} p-4 animate-slide-in-right pointer-events-auto shadow-lg`}
          >
            <div className="flex items-start gap-3">
              <IconComponent className={`w-5 h-5 ${theme.color} shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                {toast.title && (
                  <p className="text-sm font-medium text-white">{toast.title}</p>
                )}
                {toast.message && (
                  <p className="text-xs text-accent/80 mt-1">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-accent/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

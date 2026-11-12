'use client';

import React from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useUIStore } from '@/store';

export const ToastContainer: React.FC = () => {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-brand-dark bg-white text-neutral-900';
        let IconComponent = Info;
        let iconColor = 'text-brand-dark';

        if (toast.type === 'success') {
          borderClass = 'border-green-600 bg-white text-neutral-900';
          IconComponent = CheckCircle;
          iconColor = 'text-green-600';
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-500 bg-white text-neutral-900';
          IconComponent = AlertTriangle;
          iconColor = 'text-amber-500';
        } else if (toast.type === 'error') {
          borderClass = 'border-red-600 bg-white text-neutral-900';
          IconComponent = AlertCircle;
          iconColor = 'text-red-600';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border-l-4 p-4 shadow-xl border border-neutral-200 animate-in slide-in-from-bottom-2 duration-200 ${borderClass}`}
          >
            <div className="flex items-center gap-3">
              <IconComponent className={`h-5 w-5 flex-shrink-0 ${iconColor}`} />
              <p className="text-xs font-semibold leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-neutral-700 p-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};


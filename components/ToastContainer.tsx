'use client';

import React from 'react';
import { usePgriStore } from '@/lib/store';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = usePgriStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
              isSuccess
                ? 'bg-emerald-950/90 text-white border-emerald-700/60'
                : isError
                ? 'bg-teal-950/90 text-white border-teal-700/60'
                : isWarning
                ? 'bg-amber-950/90 text-white border-amber-700/60'
                : 'bg-slate-900/90 text-white border-slate-700/60'
            }`}
          >
            {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />}
            {isWarning && <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />}
            {!isSuccess && !isError && !isWarning && (
              <Info className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 text-sm font-medium leading-snug">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors shrink-0 p-0.5"
              aria-label="Tutup notifikasi"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

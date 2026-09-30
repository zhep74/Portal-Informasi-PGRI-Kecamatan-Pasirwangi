'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title: string;
  itemName?: string;
  itemType?: string;
  description?: string;
  confirmButtonText?: string;
  onConfirm: () => void;
  onClose: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  title,
  itemName,
  itemType = 'Data',
  description = 'Tindakan ini permanen. Data yang dihapus akan segera dihapus dari penyimpanan Supabase dan sistem portal.',
  confirmButtonText = 'Ya, Hapus Data',
  onConfirm,
  onClose,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              if (!isDeleting) onClose();
            }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden z-10"
            role="dialog"
            aria-modal="true"
          >
            {/* Header Bar with subtle danger accent */}
            <div className="h-2 bg-gradient-to-r from-rose-500 via-red-500 to-amber-500" />

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 text-center space-y-4">
              {/* Animated Danger Icon */}
              <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner relative">
                <Trash2 className="w-8 h-8 text-rose-600 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                  !
                </span>
              </div>

              {/* Title & Badge */}
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800">
                  Konfirmasi Hapus {itemType}
                </span>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {title}
                </h3>
              </div>

              {/* Item Details Box */}
              {itemName && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                  <div className="text-[11px] uppercase font-bold text-slate-400">
                    Item yang akan dihapus:
                  </div>
                  <div className="text-sm font-bold text-slate-800 mt-0.5 line-clamp-2 break-words">
                    {itemName}
                  </div>
                </div>
              )}

              {/* Warning description */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-left text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isDeleting}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isDeleting ? 'Menghapus...' : confirmButtonText}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

'use client';

import React, { useState } from 'react';
import { usePgriStore } from '@/lib/store';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

export function AdminPasswordTab() {
  const { changeAdminPassword, resetAdminPassword, siteSettings, showToast } = usePgriStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [lastChangedTime, setLastChangedTime] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: 'Belum diisi', color: 'bg-slate-200 text-slate-500', width: 'w-0' };
    if (pass.length < 6) return { label: 'Terlalu Pendek (< 6)', color: 'bg-rose-500 text-rose-700', width: 'w-1/4' };
    
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { label: 'Cukup', color: 'bg-amber-500 text-amber-700', width: 'w-2/4' };
    if (score === 2) return { label: 'Kuat', color: 'bg-teal-500 text-teal-700', width: 'w-3/4' };
    return { label: 'Sangat Kuat', color: 'bg-emerald-500 text-emerald-700', width: 'w-full' };
  };

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      showToast('Masukkan kata sandi saat ini!', 'warning');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      showToast('Kata sandi baru minimal 6 karakter!', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Konfirmasi kata sandi baru tidak cocok!', 'error');
      return;
    }

    if (currentPassword === newPassword) {
      showToast('Kata sandi baru tidak boleh sama dengan kata sandi saat ini!', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = changeAdminPassword(currentPassword, newPassword);
      if (res.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        const now = new Date();
        const timeStr = `${now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })} pukul ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;
        setLastChangedTime(timeStr);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCustomPasswordActive = !!siteSettings.adminPassword;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 uppercase tracking-wider mb-2">
            <KeyRound className="h-3.5 w-3.5 text-amber-600" />
            <span>Keamanan Akses Dashboard</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pengaturan Ganti Kata Sandi Admin
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ubah kata sandi login panel pengurus PGRI Pasirwangi untuk menjaga keamanan data dan aset organisasi.
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="text-left text-xs">
              <div className="font-bold text-slate-900">
                {isCustomPasswordActive ? 'Sandi Kustom Aktif' : 'Sandi Standar Aktif'}
              </div>
              <div className="text-[11px] text-slate-500">
                {isCustomPasswordActive ? 'Dilindungi sandi pilihan Anda' : 'Default (pgri2026)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {lastChangedTime && (
        <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-900 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sm block">Kata sandi berhasil diperbarui!</span>
            <p className="mt-0.5 text-emerald-800">
              Perubahan telah tersimpan secara permanen pada {lastChangedTime}. Gunakan kata sandi baru ini pada saat login berikutnya.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Kata Sandi Saat Ini / Lama <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  placeholder="Masukkan kata sandi aktif..."
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  title={showCurrent ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Jika belum pernah diubah, gunakan kata sandi bawaan: <code className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded font-mono">pgri2026</code>
              </p>
            </div>

            {/* New Password Field */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800">
                Kata Sandi Baru <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Ketik minimal 6 karakter..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  title={showNew ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength bar */}
              {newPassword && (
                <div className="space-y-1 pt-1">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all duration-300 ${strength.width}`} />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Tingkat Kekuatan:</span>
                    <span className="font-bold">{strength.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Ulangi / Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="Ketik ulang kata sandi baru..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all font-medium ${
                    confirmPassword && confirmPassword !== newPassword
                      ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                      : 'border-slate-200 focus:ring-emerald-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  title={showConfirm ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Konfirmasi kata sandi tidak cocok</span>
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              {isCustomPasswordActive ? (
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer"
                  title="Kembalikan kata sandi ke bawaan awal"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset ke Default</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={isSubmitting || (!!confirmPassword && confirmPassword !== newPassword)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <KeyRound className="h-4 w-4" />
                <span>{isSubmitting ? 'Menyimpan Sandi...' : 'Perbarui Kata Sandi'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Info & Security Tips Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card: Petunjuk Keamanan */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white space-y-3 shadow-md">
            <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
              <Sparkles className="h-4 w-4" />
              <span>Tips Keamanan Kata Sandi</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Kata sandi ini melindungi hak akses admin untuk mengubah data profil, warta, pengurus, berkas pendaftar, dan integrasi database Supabase.
            </p>
            <ul className="space-y-2 text-xs text-slate-300 pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Gunakan minimal 8 karakter dengan kombinasi angka dan huruf.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Hindari menggunakan tanggal lahir atau nomor telepon yang mudah ditebak.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Bagikan kata sandi hanya kepada jajaran pimpinan pengurus yang berwenang.</span>
              </li>
            </ul>
          </div>

          {/* Card: Fallback Info */}
          <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <Info className="h-4 w-4 text-amber-600" />
              <span>Catatan Pemulihan Kata Sandi</span>
            </div>
            <p className="leading-relaxed">
              Jika sewaktu-waktu pengurus lupa kata sandi kustom yang telah dibuat, sistem tetap mengenali kata sandi darurat pengurus cabang (<strong>pgri2026</strong>) atau Anda dapat meresetnya melalui tombol <strong>Reset ke Default</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Verifikasi Reset Kata Sandi */}
      <DeleteConfirmationModal
        isOpen={isResetModalOpen}
        title="Reset Kata Sandi Admin ke Standar?"
        itemName="Kata sandi kustom yang saat ini aktif"
        itemType="Kata Sandi"
        description="Kata sandi kustom akan dihapus dan dikembalikan ke kata sandi bawaan awal PGRI Pasirwangi (pgri2026)."
        confirmButtonText="Ya, Reset Sandi"
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={() => {
          resetAdminPassword();
          setIsResetModalOpen(false);
        }}
      />
    </div>
  );
}

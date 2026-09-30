'use client';

import React, { useState } from 'react';
import { usePgriStore } from '@/lib/store';
import {
  User,
  Lock,
  Mail,
  UserCheck,
  LogOut,
  X,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Shield,
  KeyRound,
  ArrowRight,
} from 'lucide-react';

export function MemberAuthModal() {
  const {
    isMemberAuthModalOpen,
    closeMemberAuthModal,
    memberAuthDefaultTab,
    supabaseUser,
    loginMemberWithSupabase,
    registerMemberWithSupabase,
    logoutMemberWithSupabase,
    pendaftaranList,
    showToast,
  } = usePgriStore();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(memberAuthDefaultTab || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync tab with default if opened with a specific mode
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (memberAuthDefaultTab) {
        setActiveTab(memberAuthDefaultTab);
      }
      setErrorMessage(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [memberAuthDefaultTab, isMemberAuthModalOpen]);

  if (!isMemberAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await loginMemberWithSupabase(email.trim(), password);
      if (result.success) {
        setEmail('');
        setPassword('');
        closeMemberAuthModal();
      } else {
        setErrorMessage(result.error || 'Email atau kata sandi tidak cocok.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak sama.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerMemberWithSupabase(email.trim(), password, fullName.trim());
      if (result.success) {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
        setActiveTab('login');
      } else {
        setErrorMessage(result.error || 'Gagal membuat akun.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Find member's registration details if any
  const memberRegistration = supabaseUser
    ? pendaftaranList.find(
        (p) => p.email && p.email.toLowerCase() === supabaseUser.email?.toLowerCase()
      )
    : null;

  const isAdmin = supabaseUser?.email?.toLowerCase() === 'asepakon74@gmail.com';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <UserCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {supabaseUser ? 'Profil Akun Guru' : 'Portal Keanggotaan'}
              </h3>
              <p className="text-xs text-emerald-200">
                {supabaseUser ? 'SIM PGRI Cabang Pasirwangi' : 'Masuk atau Daftar Akun Anggota'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeMemberAuthModal}
            className="p-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {supabaseUser ? (
            /* Logged In View */
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                  {(supabaseUser.user_metadata?.full_name || supabaseUser.email || 'U')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm truncate">
                      {supabaseUser.user_metadata?.full_name || 'Anggota Guru'}
                    </h4>
                    {isAdmin && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{supabaseUser.email}</p>
                </div>
              </div>

              {/* Status Pendaftaran Anggota PGRI */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    Status Berkas Keanggotaan
                  </span>
                  {memberRegistration ? (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        memberRegistration.status === 'Diterima'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : memberRegistration.status === 'Diverifikasi'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : memberRegistration.status === 'Ditolak'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {memberRegistration.status === 'Diterima' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {memberRegistration.status}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                      Belum Terdaftar
                    </span>
                  )}
                </div>

                {memberRegistration ? (
                  <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">No. Registrasi:</span>
                      <span className="font-semibold text-slate-800">{memberRegistration.nomorPendaftaran}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Instansi / Sekolah:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                        {memberRegistration.instansi || memberRegistration.jabatan || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tanggal Daftar:</span>
                      <span className="text-slate-700">{memberRegistration.tanggalDaftar}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">
                      Akun Anda belum terhubung dengan formulir pendaftaran anggota PGRI Pasirwangi.
                    </p>
                    <a
                      href="#pendaftaran-pgri"
                      onClick={closeMemberAuthModal}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      <span>Isi Formulir Pendaftaran Sekarang</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={logoutMemberWithSupabase}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-slate-500" />
                  <span>Keluar dari Akun</span>
                </button>
              </div>
            </div>
          ) : (
            /* Auth Form (Login / Register) */
            <div className="space-y-4">
              {/* Tab Selector */}
              <div className="flex p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'login'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Masuk Akun
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'register'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Daftar Akun Baru
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{errorMessage}</p>
                </div>
              )}

              {activeTab === 'login' ? (
                /* Login Form */
                <form onSubmit={handleLogin} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contoh: guru@sekolah.sch.id"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Kata Sandi
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Masuk ke Akun</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Nama Lengkap & Gelar
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="contoh: Ahmad Sanusi, S.Pd."
                        className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Alamat Email Aktif
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contoh: guru@sekolah.sch.id"
                        className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Kata Sandi (Min. 6 Karakter)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Ulangi Kata Sandi
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
                  >
                    {isLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>Daftarkan Akun Baru</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

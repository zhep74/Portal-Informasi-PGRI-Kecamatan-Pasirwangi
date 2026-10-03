'use client';

import React, { useState } from 'react';
import { usePgriStore } from '@/lib/store';
import {
  Shield,
  LayoutDashboard,
  Building,
  History,
  Compass,
  Users2,
  Briefcase,
  CalendarDays,
  Newspaper,
  Trophy,
  Film,
  Calendar,
  HeartHandshake,
  FileEdit,
  MessageSquareQuote,
  Share2,
  Database,
  Lock,
  LogOut,
  X,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Save,
  RotateCcw,
  Download,
  Upload,
  AlertTriangle,
  Eye,
  Camera,
  Cloud,
  RefreshCw,
  Copy,
  ExternalLink,
  KeyRound,
} from 'lucide-react';
import { SUPABASE_COMPLETE_SQL, SUPABASE_URL } from '@/lib/supabase';
import { KetuaFotoUploader } from './admin/KetuaFotoUploader';
import { LogoBrandingSettings } from './admin/LogoBrandingSettings';
import { AdminPengurusTab } from './admin/AdminPengurusTab';
import { AdminSejarahTab } from './admin/AdminSejarahTab';
import { AdminVisiMisiTab } from './admin/AdminVisiMisiTab';
import { AdminKegiatanTab } from './admin/AdminKegiatanTab';
import { AdminBeritaTab } from './admin/AdminBeritaTab';
import { AdminPrestasiTab } from './admin/AdminPrestasiTab';
import { AdminGaleriTab } from './admin/AdminGaleriTab';
import { AdminKalenderTab } from './admin/AdminKalenderTab';
import { AdminLayananTab } from './admin/AdminLayananTab';
import { AdminPasswordTab } from './admin/AdminPasswordTab';
import { DeleteConfirmationModal } from './admin/DeleteConfirmationModal';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminDashboardModal({ isOpen, onClose }: AdminDashboardModalProps) {
  const store = usePgriStore();
  const {
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    profile,
    updateProfile,
    updateStatistik,
    sejarahList,
    addSejarah,
    deleteSejarah,
    visiMisi,
    updateVisiMisi,
    pengurusList,
    addPengurus,
    deletePengurus,
    programKerjaList,
    addProgramKerja,
    updateProgramKerja,
    deleteProgramKerja,
    kegiatanList,
    addKegiatan,
    deleteKegiatan,
    beritaList,
    addBerita,
    deleteBerita,
    prestasiList,
    addPrestasi,
    deletePrestasi,
    galeriList,
    addGaleri,
    deleteGaleri,
    kalenderList,
    addKalender,
    deleteKalender,
    layananList,
    addLayanan,
    deleteLayanan,
    pendaftaranList,
    updatePendaftaranStatus,
    deletePendaftaran,
    aspirasiList,
    updateAspirasiStatus,
    deleteAspirasi,
    socialMedia,
    updateSocialMedia,
    siteSettings,
    updateSiteSettings,
    resetToDefaults,
    exportDataJSON,
    importDataJSON,
    showToast,
    adminUser,
    supabaseStatus,
    isSyncingSupabase,
    checkSupabaseStatus,
    syncAllToSupabase,
    loginMemberWithSupabase,
  } = store;

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [copiedSql, setCopiedSql] = useState(false);

  // Global Delete Verification Modal State
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    itemName: string;
    itemType: string;
    description?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    itemName: '',
    itemType: '',
    onConfirm: () => {},
  });

  const requestDelete = (config: {
    title: string;
    itemName: string;
    itemType: string;
    description?: string;
    onConfirm: () => void;
  }) => {
    setDeleteConfirmState({
      isOpen: true,
      ...config,
    });
  };

  // Form states for adding items
  const [newProgram, setNewProgram] = useState({
    nama: '',
    deskripsi: '',
    bidang: 'Profesi & Litbang',
    target: 'Guru se-Kecamatan',
    waktuPelaksanaan: '2026',
    tahun: '2026',
    status: 'Direncanakan' as const,
    penanggungJawab: '',
    progressPercent: 0,
  });

  const [newBerita, setNewBerita] = useState({
    judul: '',
    ringkasan: '',
    isi: '',
    kategori: 'Organisasi' as const,
    tanggal: new Date().toISOString().split('T')[0],
    penulis: 'Humas PGRI',
    fotoUrl: '/images/hero_pgri.jpg',
  });

  const [newKegiatan, setNewKegiatan] = useState({
    nama: '',
    tanggal: '10 Mei 2026',
    waktu: '08:00 - 14:00 WIB',
    lokasi: 'Aula PGRI Pasirwangi',
    deskripsi: '',
    pesertaCount: 100,
    fotoUtama: '/images/hero_pgri.jpg',
    galeriDokumentasi: [] as string[],
  });

  const [newKalender, setNewKalender] = useState({
    judul: '',
    tanggal: '2026-05-15',
    jamMulai: '08:30',
    jamSelesai: '12:00',
    lokasi: 'Sekretariat Cabang',
    penanggungJawab: '',
    deskripsi: '',
    kategori: 'Rapat' as const,
    status: 'Akan Datang' as const,
  });

  const [newPrestasi, setNewPrestasi] = useState({
    namaPrestasi: '',
    tahun: '2026',
    penerima: '',
    kategori: 'Guru' as const,
    tingkat: 'Kabupaten' as const,
    fotoPiagam: '/images/hero_pgri.jpg',
    deskripsi: '',
  });

  const [newGaleri, setNewGaleri] = useState({
    tipe: 'foto' as const,
    judul: '',
    deskripsi: '',
    url: '/images/hero_pgri.jpg',
    kategori: 'Kegiatan',
    tahun: '2026',
  });

  // Response text for selected aspirasi
  const [selectedAspId, setSelectedAspId] = useState<string | null>(null);
  const [adminResponseText, setAdminResponseText] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(passwordInput);
    setPasswordInput('');
  };

  const navMenuItems = [
    { key: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
    { key: 'profil', label: 'Kelola Profil & Statistik', icon: Building },
    { key: 'sejarah', label: 'Kelola Sejarah', icon: History },
    { key: 'visi-misi', label: 'Kelola Visi & Misi', icon: Compass },
    { key: 'pengurus', label: 'Kelola Pengurus', icon: Users2 },
    { key: 'program', label: 'Kelola Program Kerja', icon: Briefcase },
    { key: 'kegiatan', label: 'Kelola Kegiatan', icon: CalendarDays },
    { key: 'berita', label: 'Kelola Berita', icon: Newspaper },
    { key: 'prestasi', label: 'Kelola Prestasi', icon: Trophy },
    { key: 'galeri', label: 'Kelola Galeri', icon: Film },
    { key: 'kalender', label: 'Kelola Kalender', icon: Calendar },
    { key: 'layanan', label: 'Kelola Layanan', icon: HeartHandshake },
    { key: 'pendaftaran', label: 'Pendaftaran Masuk', icon: FileEdit, badge: pendaftaranList.filter(p => p.status === 'Baru').length },
    { key: 'aspirasi', label: 'Aspirasi Anggota', icon: MessageSquareQuote, badge: aspirasiList.filter(a => a.status === 'Diterima').length },
    { key: 'medsos', label: 'Media Sosial & Kontak', icon: Share2 },
    { key: 'password', label: 'Pengaturan Kata Sandi', icon: KeyRound },
    { key: 'supabase', label: 'Database Supabase', icon: Database, badge: supabaseStatus.connected ? 'Aktif' : 'Atur' },
    { key: 'backup', label: 'Cadangan & Pemulihan', icon: Database },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-6xl w-full h-[94vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Modal Topbar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Dashboard Pengurus PGRI Pasirwangi
              </h2>
              <p className="text-[11px] text-slate-400">
                Sistem Manajemen Informasi & Pelayanan Digital
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdminLoggedIn && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => syncAllToSupabase()}
                  disabled={isSyncingSupabase}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/60 rounded-xl transition-all shadow-sm disabled:opacity-50"
                  title="Sinkronkan seluruh data saat ini ke Database Supabase"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">
                    {isSyncingSupabase ? 'Menyinkronkan...' : 'Sinkron Supabase'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('password')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer ${
                    activeTab === 'password'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                      : 'text-amber-300 hover:text-white bg-amber-950/60 hover:bg-amber-900 border border-amber-700/60'
                  }`}
                  title="Menu Pengaturan Ganti Kata Sandi Admin"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Ganti Password</span>
                </button>

                {adminUser && (
                  <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="max-w-[140px] truncate">{adminUser.email}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={logoutAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 rounded-xl transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!isAdminLoggedIn ? (
          /* Login Screen */
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 max-w-md w-full shadow-lg text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Masuk Dashboard Admin
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Akses panel pengelolaan data PGRI Pasirwangi untuk memperbarui data di Database Supabase secara permanen.
              </p>

              <div className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4 text-left">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Kata Sandi Pengurus
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Masukkan sandi..."
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Masuk ke Panel Pengurus
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          /* Logged-In Admin Panel Layout */
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-slate-200 bg-slate-50 p-3 overflow-y-auto shrink-0 hidden md:block">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
                Modul Pengelolaan
              </div>
              <nav className="space-y-1">
                {navMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActiveTab(item.key)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge !== null && item.badge !== 0 && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            isActive ? 'bg-white text-emerald-700' : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Mobile Tab Selector */}
            <div className="md:hidden p-2 border-b border-slate-200 bg-slate-50 w-full shrink-0">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2"
              >
                {navMenuItems.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-white">
              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Ringkasan Statistik Portal
                    </h3>
                    <p className="text-xs text-slate-500">
                      Informasi umum database PGRI Cabang Kecamatan Pasirwangi.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <div className="text-xs text-emerald-600 font-semibold">Total Anggota</div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">
                        {profile.statistik.jumlahAnggota}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
                      <div className="text-xs text-sky-600 font-semibold">Total Pengurus</div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">
                        {pengurusList.length}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <div className="text-xs text-emerald-600 font-semibold">Program Kerja</div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">
                        {programKerjaList.length}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                      <div className="text-xs text-purple-600 font-semibold">Dokumentasi Kegiatan</div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">
                        {kegiatanList.length}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                      <div className="text-xs text-amber-600 font-semibold">Warta Berita</div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">
                        {beritaList.length}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                      <div className="text-xs text-blue-600 font-semibold">Penghargaan</div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">
                        {prestasiList.length}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100">
                      <div className="text-xs text-teal-600 font-semibold">Pendaftar Baru</div>
                      <div className="text-2xl font-bold text-teal-700 mt-1">
                        {pendaftaranList.filter((p) => p.status === 'Baru').length}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                      <div className="text-xs text-orange-600 font-semibold">Aspirasi Baru</div>
                      <div className="text-2xl font-bold text-orange-700 mt-1">
                        {aspirasiList.filter((a) => a.status === 'Diterima').length}
                      </div>
                    </div>
                  </div>

                  {/* Cloud Database Integration Status Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-50 border border-emerald-500/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                          <Database className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">
                              Database Supabase Cloud Aktif
                            </h4>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              {supabaseStatus.connected ? 'Tersambung' : 'Siap'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 max-w-xl">
                            Seluruh data tersimpan secara terpusat di Database PostgreSQL Supabase. Setiap perubahan yang Anda simpan akan langsung disinkronkan secara permanen untuk seluruh pengunjung dan pengurus.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => syncAllToSupabase()}
                        disabled={isSyncingSupabase}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-4 h-4 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
                        <span>{isSyncingSupabase ? 'Menyinkronkan...' : 'Sinkronkan ke Supabase'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Keamanan & Pengaturan Kata Sandi Quick Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-50 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Pengaturan Kata Sandi & Akses Keamanan Pengurus
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 max-w-xl">
                          Tingkatkan keamanan akun pengurus dengan memperbarui kata sandi secara berkala. Perubahan kata sandi langsung aktif dan dapat diatur atau dikembalikan kapan saja.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('password')}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Buka Pengaturan Sandi</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Profil & Statistik */}
              {activeTab === 'profil' && (
                <div className="space-y-6">
                  {/* Pengaturan Logo Aplikasi & Logo Title URL */}
                  <LogoBrandingSettings />

                  <div className="border-t border-slate-200 pt-5 flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Data Identitas Kantor & Sekretariat
                      </h3>
                      <p className="text-xs text-slate-500">
                        Perbarui informasi nama organisasi, alamat, kontak resmi, dan tahun berdiri.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Nama Organisasi</label>
                      <input
                        type="text"
                        value={profile.nama}
                        onChange={(e) => updateProfile({ nama: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Tingkat Organisasi</label>
                      <input
                        type="text"
                        value={profile.tingkat}
                        onChange={(e) => updateProfile({ tingkat: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Alamat Sekretariat</label>
                      <input
                        type="text"
                        value={profile.alamatSekretariat}
                        onChange={(e) => updateProfile({ alamatSekretariat: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Email Resmi</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => updateProfile({ email: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Nomor Kontak / WA</label>
                      <input
                        type="text"
                        value={profile.nomorKontak}
                        onChange={(e) => updateProfile({ nomorKontak: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Tahun Berdiri</label>
                      <input
                        type="text"
                        value={profile.tahunBerdiri}
                        onChange={(e) => updateProfile({ tahunBerdiri: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="text-sm font-bold text-slate-900 mb-3">Statistik Cards</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <label className="text-slate-500 block mb-1">Jumlah Anggota</label>
                        <input
                          type="number"
                          value={profile.statistik.jumlahAnggota}
                          onChange={(e) =>
                            updateStatistik({ jumlahAnggota: parseInt(e.target.value) || 0 })
                          }
                          className="w-full px-3 py-2 border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block mb-1">Jumlah Sekolah</label>
                        <input
                          type="number"
                          value={profile.statistik.jumlahSekolah}
                          onChange={(e) =>
                            updateStatistik({ jumlahSekolah: parseInt(e.target.value) || 0 })
                          }
                          className="w-full px-3 py-2 border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block mb-1">Jumlah Ranting</label>
                        <input
                          type="number"
                          value={profile.statistik.jumlahRanting}
                          onChange={(e) =>
                            updateStatistik({ jumlahRanting: parseInt(e.target.value) || 0 })
                          }
                          className="w-full px-3 py-2 border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block mb-1">Program Terlaksana</label>
                        <input
                          type="number"
                          value={profile.statistik.programTerlaksana}
                          onChange={(e) =>
                            updateStatistik({ programTerlaksana: parseInt(e.target.value) || 0 })
                          }
                          className="w-full px-3 py-2 border rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4 space-y-4">
                    {/* Dedicated Ketua PGRI Photo Manager */}
                    <KetuaFotoUploader />

                    <h4 className="text-sm font-bold text-slate-900 mb-2">Teks Sambutan & Identitas Ketua</h4>
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-500 block mb-1">Nama Lengkap & Gelar</label>
                          <input
                            type="text"
                            value={profile.sambutanKetua.nama}
                            onChange={(e) =>
                              updateProfile({
                                sambutanKetua: { ...profile.sambutanKetua, nama: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 border rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 block mb-1">NIP Ketua</label>
                          <input
                            type="text"
                            value={profile.sambutanKetua.nip}
                            onChange={(e) =>
                              updateProfile({
                                sambutanKetua: { ...profile.sambutanKetua, nip: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 border rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-500 block mb-1">Jabatan Resmi</label>
                          <input
                            type="text"
                            value={profile.sambutanKetua.jabatan}
                            onChange={(e) =>
                              updateProfile({
                                sambutanKetua: { ...profile.sambutanKetua, jabatan: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 border rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 block mb-1">Periode Masa Bakti</label>
                          <input
                            type="text"
                            value={profile.sambutanKetua.periode}
                            onChange={(e) =>
                              updateProfile({
                                sambutanKetua: { ...profile.sambutanKetua, periode: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 border rounded-xl"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-500 block mb-1">Isi Teks Sambutan</label>
                        <textarea
                          rows={4}
                          value={profile.sambutanKetua.pesan}
                          onChange={(e) =>
                            updateProfile({
                              sambutanKetua: { ...profile.sambutanKetua, pesan: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Sejarah */}
              {activeTab === 'sejarah' && <AdminSejarahTab />}

              {/* Tab: Visi & Misi */}
              {activeTab === 'visi-misi' && <AdminVisiMisiTab />}

              {/* Tab: Pengurus */}
              {activeTab === 'pengurus' && <AdminPengurusTab />}

              {/* Tab: Program Kerja */}
              {activeTab === 'program' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900">Kelola Program Kerja</h3>

                  {/* Add Program Form */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <div className="font-bold text-slate-900">Tambah Program Baru:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Nama Program"
                        value={newProgram.nama}
                        onChange={(e) => setNewProgram({ ...newProgram, nama: e.target.value })}
                        className="px-3 py-2 bg-white border rounded-xl"
                      />
                      <input
                        type="text"
                        placeholder="Penanggung Jawab"
                        value={newProgram.penanggungJawab}
                        onChange={(e) =>
                          setNewProgram({ ...newProgram, penanggungJawab: e.target.value })
                        }
                        className="px-3 py-2 bg-white border rounded-xl"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Deskripsi Program..."
                      value={newProgram.deskripsi}
                      onChange={(e) => setNewProgram({ ...newProgram, deskripsi: e.target.value })}
                      className="w-full px-3 py-2 bg-white border rounded-xl"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (!newProgram.nama) return;
                          addProgramKerja(newProgram);
                          setNewProgram({
                            nama: '',
                            deskripsi: '',
                            bidang: 'Profesi & Litbang',
                            target: 'Guru se-Kecamatan',
                            waktuPelaksanaan: '2026',
                            tahun: '2026',
                            status: 'Direncanakan',
                            penanggungJawab: '',
                            progressPercent: 0,
                          });
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center gap-1.5"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Simpan Program</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {programKerjaList.map((prg) => (
                      <div
                        key={prg.id}
                        className="p-3.5 border rounded-xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{prg.nama}</div>
                          <div className="text-slate-500">
                            {prg.bidang} · Status: <strong>{prg.status}</strong> ({prg.progressPercent}%)
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateProgramKerja(prg.id, {
                                status:
                                  prg.status === 'Selesai'
                                    ? 'Sedang Berjalan'
                                    : prg.status === 'Sedang Berjalan'
                                    ? 'Selesai'
                                    : 'Sedang Berjalan',
                                progressPercent: prg.status === 'Sedang Berjalan' ? 100 : 50,
                              })
                            }
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold"
                          >
                            Ubah Status
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              requestDelete({
                                title: 'Hapus Program Kerja?',
                                itemName: `${prg.nama} (${prg.bidang})`,
                                itemType: 'Program Kerja',
                                description:
                                  'Program kerja ini akan dihapus dari rencana operasional dan basis data Supabase.',
                                onConfirm: () => {
                                  deleteProgramKerja(prg.id);
                                  setDeleteConfirmState((prev) => ({ ...prev, isOpen: false }));
                                },
                              })
                            }
                            className="px-2.5 py-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/80 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                            title="Hapus Program Kerja"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Kegiatan */}
              {activeTab === 'kegiatan' && <AdminKegiatanTab />}

              {/* Tab: Berita */}
              {activeTab === 'berita' && <AdminBeritaTab />}

              {/* Tab: Prestasi */}
              {activeTab === 'prestasi' && <AdminPrestasiTab />}

              {/* Tab: Galeri */}
              {activeTab === 'galeri' && <AdminGaleriTab />}

              {/* Tab: Kalender */}
              {activeTab === 'kalender' && <AdminKalenderTab />}

              {/* Tab: Layanan */}
              {activeTab === 'layanan' && <AdminLayananTab />}

              {/* Tab: Pendaftaran Masuk */}
              {activeTab === 'pendaftaran' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Kelola Berkas Pendaftaran PGRI
                    </h3>
                    <p className="text-xs text-slate-500">
                      Verifikasi pendaftaran anggota baru atau pemutakhiran KTA Digital.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {pendaftaranList.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50 text-xs space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                          <div>
                            <span className="font-mono text-slate-400 text-[11px] block">
                              {p.nomorPendaftaran}
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              {p.namaLengkap}
                            </span>
                            <span className="text-slate-500 ml-2">({p.statusKepegawaian})</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                                p.status === 'Diterima'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.status === 'Diverifikasi'
                                  ? 'bg-sky-100 text-sky-800'
                                  : p.status === 'Ditolak'
                                  ? 'bg-teal-100 text-teal-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {p.status}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                requestDelete({
                                  title: 'Hapus Berkas Pendaftaran?',
                                  itemName: `${p.nomorPendaftaran} - ${p.namaLengkap} (${p.instansi})`,
                                  itemType: 'Pendaftaran',
                                  description:
                                    'Berkas pendaftaran anggota ini akan dihapus permanen dari antrean dan basis data Supabase.',
                                  onConfirm: () => {
                                    deletePendaftaran(p.id);
                                    setDeleteConfirmState((prev) => ({ ...prev, isOpen: false }));
                                  },
                                })
                              }
                              className="px-2.5 py-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/80 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-2xs shrink-0"
                              title="Hapus berkas pendaftaran"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
                          <div>
                            <span className="text-slate-400 block">NIK / NIP:</span>
                            <span className="font-mono">{p.nikNip}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Unit Kerja:</span>
                            <span className="font-semibold">{p.instansi}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">WhatsApp:</span>
                            <a
                              href={`https://wa.me/${p.noWhatsApp.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 font-semibold hover:underline"
                            >
                              {p.noWhatsApp}
                            </a>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Tanggal Daftar:</span>
                            <span>{p.tanggalDaftar}</span>
                          </div>
                        </div>

                        {/* Status Change Buttons */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                          <div className="text-slate-500 text-[11px]">
                            Catatan: {p.catatanAdmin || '-'}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                updatePendaftaranStatus(
                                  p.id,
                                  'Diverifikasi',
                                  'Berkas sedang dalam tahap verifikasi keaktifan dapodik.'
                                )
                              }
                              className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg font-semibold"
                            >
                              Verifikasi
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updatePendaftaranStatus(
                                  p.id,
                                  'Diterima',
                                  'Selamat! Data Anda telah diterima & KTA Digital diterbitkan.'
                                )
                              }
                              className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-semibold"
                            >
                              Terima (Terbitkan KTA)
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updatePendaftaranStatus(
                                  p.id,
                                  'Ditolak',
                                  'Mohon maaf, berkas belum sesuai kriteria keaktifan pendidik.'
                                )
                              }
                              className="px-2.5 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg font-semibold"
                            >
                              Tolak
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Aspirasi Masuk */}
              {activeTab === 'aspirasi' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Kelola Aspirasi & Pengaduan Anggota
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tanggapi suara guru dan perbarui status tindak lanjut tiket aspirasi.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {aspirasiList.map((asp) => (
                      <div
                        key={asp.id}
                        className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50 text-xs space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <div>
                            <span className="font-mono text-slate-400 text-[11px] block">
                              {asp.tiketId} · {asp.tanggal}
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              {asp.judul}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                                asp.status === 'Selesai'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : asp.status === 'Diproses'
                                  ? 'bg-sky-100 text-sky-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {asp.status}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                requestDelete({
                                  title: 'Hapus Tiket Aspirasi?',
                                  itemName: `${asp.tiketId} - ${asp.judul}`,
                                  itemType: 'Aspirasi',
                                  description:
                                    'Data aspirasi/masukan guru ini akan dihapus permanen dari sistem dan basis data Supabase.',
                                  onConfirm: () => {
                                    deleteAspirasi(asp.id);
                                    setDeleteConfirmState((prev) => ({ ...prev, isOpen: false }));
                                  },
                                })
                              }
                              className="px-2.5 py-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/80 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-2xs shrink-0"
                              title="Hapus aspirasi"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>

                        <div className="text-slate-600">
                          <span className="text-slate-400">Pengirim:</span>{' '}
                          <strong>{asp.isAnonim ? 'Anonim (Dirahasiakan)' : asp.nama}</strong>{' '}
                          · Instansi: {asp.instansi} · Kategori: {asp.kategori}
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                          {asp.isi}
                        </div>

                        <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-2">
                          <div className="font-semibold text-emerald-900">Tanggapan Pengurus:</div>
                          <p className="text-slate-700">
                            {asp.responAdmin || 'Belum ada tanggapan resmi.'}
                          </p>
                        </div>

                        {/* Fast Response Box */}
                        {selectedAspId === asp.id ? (
                          <div className="space-y-2 pt-2">
                            <textarea
                              rows={2}
                              placeholder="Tuliskan respon resmi pengurus..."
                              value={adminResponseText}
                              onChange={(e) => setAdminResponseText(e.target.value)}
                              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedAspId(null)}
                                className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg"
                              >
                                Batal
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  updateAspirasiStatus(asp.id, 'Diproses', adminResponseText);
                                  setSelectedAspId(null);
                                  setAdminResponseText('');
                                }}
                                className="px-3 py-1 bg-sky-600 text-white rounded-lg font-semibold"
                              >
                                Proses
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  updateAspirasiStatus(asp.id, 'Selesai', adminResponseText);
                                  setSelectedAspId(null);
                                  setAdminResponseText('');
                                }}
                                className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-semibold"
                              >
                                Selesai
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedAspId(asp.id);
                                setAdminResponseText(asp.responAdmin || '');
                              }}
                              className="px-3 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-semibold"
                            >
                              Beri / Ubah Tanggapan Resmi
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Media Sosial */}
              {activeTab === 'medsos' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    Pengaturan Tautan Media Sosial
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tautan yang dikosongkan tidak akan dimunculkan di halaman publik.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-semibold block mb-1">Facebook URL</label>
                      <input
                        type="url"
                        value={socialMedia.facebook}
                        onChange={(e) => updateSocialMedia({ facebook: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Instagram URL</label>
                      <input
                        type="url"
                        value={socialMedia.instagram}
                        onChange={(e) => updateSocialMedia({ instagram: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">YouTube URL</label>
                      <input
                        type="url"
                        value={socialMedia.youtube}
                        onChange={(e) => updateSocialMedia({ youtube: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">TikTok URL</label>
                      <input
                        type="url"
                        value={socialMedia.tiktok}
                        onChange={(e) => updateSocialMedia({ tiktok: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">WhatsApp Saluran / Grup</label>
                      <input
                        type="url"
                        value={socialMedia.whatsapp}
                        onChange={(e) => updateSocialMedia({ whatsapp: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Telegram Grup</label>
                      <input
                        type="url"
                        value={socialMedia.telegram}
                        onChange={(e) => updateSocialMedia({ telegram: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Database Supabase */}
              {activeTab === 'supabase' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Database className="w-5 h-5 text-emerald-600" />
                        <span>Integrasi Database Supabase</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Kelola sinkronisasi data dan basis data PostgreSQL Supabase untuk Portal PGRI Pasirwangi.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={checkSupabaseStatus}
                        disabled={supabaseStatus.checking}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${supabaseStatus.checking ? 'animate-spin' : ''}`} />
                        <span>{supabaseStatus.checking ? 'Memeriksa...' : 'Uji Koneksi'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={syncAllToSupabase}
                        disabled={isSyncingSupabase}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
                        <span>{isSyncingSupabase ? 'Menyinkronkan...' : 'Sinkronkan Semua Data'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Kredensial & Status Koneksi Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
                      <div>
                        <div className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">
                          Proyek Supabase Terhubung
                        </div>
                        <div className="text-base font-bold text-white mt-0.5">
                          Portal SIM PGRI Cabang Kecamatan Pasirwangi
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            supabaseStatus.connected
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              supabaseStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                            }`}
                          ></span>
                          {supabaseStatus.connected ? 'Server Terhubung' : 'Terputus'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Project ID</span>
                        <span className="font-mono text-emerald-300 font-medium">vokxvtbijnubrzbdazxs</span>
                      </div>
                      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Status Tabel Database</span>
                        <span
                          className={`font-semibold ${
                            (supabaseStatus.totalTablesReady ?? 0) > 0 ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {supabaseStatus.totalTablesReady ?? (supabaseStatus.connected ? 14 : 0)} / 14 Tabel Siap
                        </span>
                      </div>
                      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Mode Sinkronisasi</span>
                        <span className="font-semibold text-emerald-400">
                          Otomatis Realtime (CRUD)
                        </span>
                      </div>
                    </div>

                    {/* Rincian 14 Tabel Menu Sidebar */}
                    <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80">
                      <div className="text-[11px] font-bold text-slate-300 mb-2 uppercase tracking-wide">
                        Status Tabel untuk Seluruh Menu Admin:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        {[
                          { name: 'pgri_profil', label: 'Profil & Statistik' },
                          { name: 'pgri_sejarah', label: 'Sejarah' },
                          { name: 'pgri_visi_misi', label: 'Visi & Misi' },
                          { name: 'pgri_pengurus', label: 'Pengurus' },
                          { name: 'pgri_program_kerja', label: 'Program Kerja' },
                          { name: 'pgri_kegiatan', label: 'Kegiatan' },
                          { name: 'pgri_berita', label: 'Berita' },
                          { name: 'pgri_prestasi', label: 'Prestasi' },
                          { name: 'pgri_galeri', label: 'Galeri' },
                          { name: 'pgri_kalender', label: 'Kalender' },
                          { name: 'pgri_layanan', label: 'Layanan' },
                          { name: 'pgri_aspirasi', label: 'Aspirasi' },
                          { name: 'pgri_pendaftaran', label: 'Pendaftaran' },
                          { name: 'pgri_store', label: 'Cadangan Store' },
                        ].map((tbl) => {
                          const isReady = supabaseStatus.tableDetails?.[tbl.name] ?? supabaseStatus.connected;
                          return (
                            <div
                              key={tbl.name}
                              className="flex items-center justify-between p-1.5 px-2 rounded-lg bg-slate-900/60 border border-slate-700/60"
                            >
                              <span className="text-slate-300 truncate" title={tbl.name}>
                                {tbl.label}
                              </span>
                              <span
                                className={`text-[10px] font-bold ml-1 ${
                                  isReady ? 'text-emerald-400' : 'text-amber-400'
                                }`}
                              >
                                {isReady ? '✓' : '...'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
                      <strong>Status:</strong> {supabaseStatus.message}
                    </div>
                  </div>

                  {/* Panduan & Skrip SQL Supabase */}
                  <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          Skrip Pembuatan Tabel Basis Data Supabase
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Jalankan skrip SQL ini di SQL Editor Supabase untuk membuat tabel basis data pendaftar & data portal PGRI.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(SUPABASE_COMPLETE_SQL);
                            setCopiedSql(true);
                            showToast('Skrip SQL berhasil disalin ke clipboard!', 'success');
                            setTimeout(() => setCopiedSql(false), 3000);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedSql ? 'Tersalin ✓' : 'Salin Skrip SQL'}</span>
                        </button>

                        <a
                          href="https://supabase.com/dashboard/project/vokxvtbijnubrzbdazxs/sql/new"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shadow-xs"
                        >
                          <span>Buka SQL Editor Supabase</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    <div className="relative">
                      <pre className="p-4 bg-slate-900 text-emerald-300 rounded-xl text-xs font-mono overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
                        {SUPABASE_COMPLETE_SQL}
                      </pre>
                    </div>

                    <div className="text-xs text-emerald-900 space-y-1 bg-white/80 p-3.5 rounded-xl border border-emerald-200">
                      <div className="font-bold">Langkah Cepat Aktivasi di Supabase:</div>
                      <ol className="list-decimal list-inside space-y-1 text-slate-700 pl-1">
                        <li>
                          Klik tombol <strong>Salin Skrip SQL</strong> di atas.
                        </li>
                        <li>
                          Klik <strong>Buka SQL Editor Supabase</strong> untuk membuka dashboard proyek Supabase Anda.
                        </li>
                        <li>
                          Tempelkan (<em>paste</em>) kode SQL ke editor, lalu klik tombol hijau <strong>RUN</strong> di Supabase.
                        </li>
                        <li>
                          Kembali ke halaman ini dan klik tombol <strong>Uji Koneksi</strong> lalu <strong>Sinkronkan Semua Data</strong>.
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Backup & Restore */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Cadangan & Pemulihan Data
                    </h3>
                    <p className="text-xs text-slate-500">
                      Ekspor data ke format JSON untuk backup cadangan atau impor data dari berkas eksternal.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl border border-emerald-300 bg-emerald-50/60 sm:col-span-2 space-y-3">
                      <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
                        <Database className="w-5 h-5 text-emerald-600" />
                        <span>Sinkronisasi Penuh ke Database Supabase</span>
                      </div>
                      <p className="text-xs text-emerald-800">
                        Unggah dan simpan seluruh data profil, pengurus, sejarah, berita, program kerja, kegiatan, kalender, dan layanan saat ini ke database PostgreSQL Supabase. Semua pengguna di berbagai perangkat akan langsung melihat data ini.
                      </p>
                      <button
                        type="button"
                        onClick={() => syncAllToSupabase()}
                        disabled={isSyncingSupabase}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <RefreshCw className={`h-4 w-4 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
                        <span>{isSyncingSupabase ? 'Menyinkronkan...' : 'Sinkronkan Semua Data ke Supabase'}</span>
                      </button>
                    </div>

                    <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                      <div className="font-bold text-slate-900 text-sm">Unduh Cadangan JSON</div>
                      <p className="text-xs text-slate-600">
                        Simpan seluruh konfigurasi, berita, pendaftar, dan aspirasi ke berkas .json di komputer/HP Anda.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const json = exportDataJSON();
                          const blob = new Blob([json], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `backup-pgri-pasirwangi-${new Date().toISOString().split('T')[0]}.json`;
                          a.click();
                          showToast('Berkas cadangan berhasil diunduh!', 'success');
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
                      >
                        <Download className="h-4 w-4" />
                        <span>Unduh Berkas JSON</span>
                      </button>
                    </div>

                    <div className="p-5 rounded-2xl border border-teal-200 bg-teal-50/50 space-y-3">
                      <div className="font-bold text-teal-900 text-sm">Reset ke Standar Awal</div>
                      <p className="text-xs text-teal-700">
                        Kembalikan semua data ke setelan default awal PGRI Pasirwangi.
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          requestDelete({
                            title: 'Kembalikan ke Standar Awal?',
                            itemName: 'Seluruh data konfigurasi & konten portal',
                            itemType: 'Sistem',
                            description:
                              'Semua perubahan data lokal akan dikembalikan ke data standar bawaan awal PGRI Pasirwangi.',
                            onConfirm: () => {
                              resetToDefaults();
                              setDeleteConfirmState((prev) => ({ ...prev, isOpen: false }));
                            },
                          })
                        }
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Kembalikan Standar Awal</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Pengaturan Ganti Kata Sandi Admin */}
              {activeTab === 'password' && (
                <AdminPasswordTab />
              )}
            </main>
          </div>
        )}
      </div>

      {/* MODAL VERIFIKASI HAPUS UMUM PANEL ADMIN */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmState.isOpen}
        title={deleteConfirmState.title}
        itemName={deleteConfirmState.itemName}
        itemType={deleteConfirmState.itemType}
        description={deleteConfirmState.description}
        onClose={() => setDeleteConfirmState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={deleteConfirmState.onConfirm}
      />
    </div>
  );
}

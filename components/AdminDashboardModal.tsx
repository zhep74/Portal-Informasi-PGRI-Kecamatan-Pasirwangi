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
} from 'lucide-react';
import { KetuaFotoUploader } from './admin/KetuaFotoUploader';
import { LogoBrandingSettings } from './admin/LogoBrandingSettings';
import { AdminPengurusTab } from './admin/AdminPengurusTab';
import { AdminSejarahTab } from './admin/AdminSejarahTab';
import { AdminVisiMisiTab } from './admin/AdminVisiMisiTab';
import { AdminKegiatanTab } from './admin/AdminKegiatanTab';
import { AdminPrestasiTab } from './admin/AdminPrestasiTab';
import { AdminGaleriTab } from './admin/AdminGaleriTab';
import { AdminKalenderTab } from './admin/AdminKalenderTab';
import { AdminLayananTab } from './admin/AdminLayananTab';

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
    isSyncingCloud,
    syncAllToFirestore,
    loginAdminWithGoogle,
  } = store;

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<string>('overview');

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
                  onClick={() => syncAllToFirestore()}
                  disabled={isSyncingCloud}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/60 rounded-xl transition-all shadow-sm disabled:opacity-50"
                  title="Sinkronkan semua data saat ini ke Cloud Firestore"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">
                    {isSyncingCloud ? 'Menyinkronkan...' : 'Sinkron ke Cloud'}
                  </span>
                </button>

                {adminUser ? (
                  <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="max-w-[140px] truncate">{adminUser.email}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => loginAdminWithGoogle()}
                    className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-[11px] text-amber-300 font-medium transition-colors"
                  >
                    <span>Hubungkan Google</span>
                  </button>
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
                Akses panel pengelolaan data PGRI Pasirwangi untuk memperbarui data di Cloud Firestore secara permanen.
              </p>

              <div className="space-y-4">
                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={() => loginAdminWithGoogle()}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 border border-slate-700 hover:shadow-lg cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Masuk dengan Google (Akun Pengurus)</span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span className="text-[11px] text-slate-400 font-medium">atau masuk dengan sandi</span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

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
                      {Boolean(item.badge && item.badge > 0) && (
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
                          <Cloud className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">
                              Database Cloud Firestore Aktif
                            </h4>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Tersambung
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 max-w-xl">
                            Seluruh data tersimpan secara terpusat di Google Cloud Firestore. Setiap perubahan yang Anda simpan akan langsung terlihat oleh semua pengunjung dan pengguna di perangkat apa pun secara permanen (tidak akan kembali ke bawaan sistem).
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => syncAllToFirestore()}
                        disabled={isSyncingCloud}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-4 h-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                        <span>{isSyncingCloud ? 'Menyinkronkan...' : 'Sinkronkan Data ke Cloud'}</span>
                      </button>
                    </div>
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
                            onClick={() => deleteProgramKerja(prg.id)}
                            className="p-1 text-teal-600 hover:bg-teal-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
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
              {activeTab === 'berita' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900">Kelola Warta & Berita</h3>

                  {/* Add Berita Form */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <div className="font-bold text-slate-900">Terbitkan Berita Baru:</div>
                    <input
                      type="text"
                      placeholder="Judul Berita"
                      value={newBerita.judul}
                      onChange={(e) => setNewBerita({ ...newBerita, judul: e.target.value })}
                      className="w-full px-3 py-2 bg-white border rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="Ringkasan Singkat"
                      value={newBerita.ringkasan}
                      onChange={(e) => setNewBerita({ ...newBerita, ringkasan: e.target.value })}
                      className="w-full px-3 py-2 bg-white border rounded-xl"
                    />
                    <textarea
                      rows={4}
                      placeholder="Isi Lengkap Berita..."
                      value={newBerita.isi}
                      onChange={(e) => setNewBerita({ ...newBerita, isi: e.target.value })}
                      className="w-full px-3 py-2 bg-white border rounded-xl"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (!newBerita.judul) return;
                          addBerita(newBerita);
                          setNewBerita({
                            judul: '',
                            ringkasan: '',
                            isi: '',
                            kategori: 'Organisasi',
                            tanggal: new Date().toISOString().split('T')[0],
                            penulis: 'Humas PGRI',
                            fotoUrl: '/images/hero_pgri.jpg',
                          });
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center gap-1.5"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Terbitkan Berita</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {beritaList.map((b) => (
                      <div
                        key={b.id}
                        className="p-3 border rounded-xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{b.judul}</div>
                          <div className="text-slate-400">
                            {b.kategori} · {b.tanggal} · Dibaca: {b.dibacaCount}x
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteBerita(b.id)}
                          className="p-1 text-teal-600 hover:bg-teal-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                              onClick={() => deletePendaftaran(p.id)}
                              className="p-1 text-slate-400 hover:text-teal-600 rounded"
                              title="Hapus berkas"
                            >
                              <Trash2 className="h-4 w-4" />
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
                              onClick={() => deleteAspirasi(asp.id)}
                              className="p-1 text-slate-400 hover:text-teal-600 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
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
                        <Cloud className="w-5 h-5 text-emerald-600" />
                        <span>Sinkronisasi Penuh ke Cloud Firestore</span>
                      </div>
                      <p className="text-xs text-emerald-800">
                        Unggah dan tetapkan seluruh data profil, pengurus, sejarah, berita, program kerja, kegiatan, kalender, dan layanan saat ini ke database Cloud Firestore. Semua pengguna di berbagai perangkat akan langsung melihat data ini.
                      </p>
                      <button
                        type="button"
                        onClick={() => syncAllToFirestore()}
                        disabled={isSyncingCloud}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <RefreshCw className={`h-4 w-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                        <span>{isSyncingCloud ? 'Menyinkronkan...' : 'Sinkronkan Semua Data ke Cloud Firestore'}</span>
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
                        onClick={() => {
                          if (confirm('Apakah Anda yakin ingin mengembalikan seluruh data ke standar awal?')) {
                            resetToDefaults();
                          }
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Kembalikan Standar Awal</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}

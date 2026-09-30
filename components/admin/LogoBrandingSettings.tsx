'use client';

import React, { useState, useRef } from 'react';
import { usePgriStore } from '@/lib/store';
import { PgriLogo, PgriSvgEmblem } from '@/components/PgriLogo';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import {
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Sliders,
  Globe,
  Image as ImageIcon,
  Sparkles,
  Monitor,
  Info,
  RotateCcw,
  Trash2,
} from 'lucide-react';

export function LogoBrandingSettings() {
  const { profile, updateProfile, showToast } = usePgriStore();

  const [activeLogoTab, setActiveLogoTab] = useState<'app' | 'favicon'>('app');
  const [logoInputUrl, setLogoInputUrl] = useState(profile.logoUrl || '');
  const [faviconInputUrl, setFaviconInputUrl] = useState(profile.faviconUrl || '');
  const [browserTitleInput, setBrowserTitleInput] = useState(
    profile.browserTitle || 'PGRI Kecamatan Pasirwangi | Portal Informasi Digital'
  );
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    title: string;
    itemName: string;
    itemType: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    itemName: '',
    itemType: '',
    description: '',
    onConfirm: () => {},
  });

  const appLogoFileRef = useRef<HTMLInputElement>(null);
  const faviconFileRef = useRef<HTMLInputElement>(null);

  // Handle App Logo File Upload (PNG/SVG/JPG/WebP)
  const handleAppLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Mohon pilih file gambar yang valid (PNG, SVG, JPG, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 5 MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setLogoInputUrl(dataUrl);
        updateProfile({ logoUrl: dataUrl });
        showToast('Logo aplikasi berhasil diperbarui dari perangkat!', 'success');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle Favicon File Upload (.ico, .png, .svg)
  const handleFaviconFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.name.endsWith('.ico')) {
      showToast('Mohon pilih file icon atau gambar (ICO, PNG, SVG)', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('Ukuran file favicon maksimal 2 MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFaviconInputUrl(dataUrl);
        updateProfile({ faviconUrl: dataUrl });
        showToast('Logo Title URL (Favicon) berhasil diperbarui!', 'success');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Apply custom URL for App Logo
  const handleApplyLogoUrl = () => {
    if (!logoInputUrl.trim()) {
      handleResetAppLogo();
      return;
    }
    updateProfile({ logoUrl: logoInputUrl.trim() });
    showToast('Tautan logo aplikasi berhasil diterapkan', 'success');
  };

  // Apply custom URL for Favicon
  const handleApplyFaviconUrl = () => {
    if (!faviconInputUrl.trim()) {
      handleResetFavicon();
      return;
    }
    updateProfile({ faviconUrl: faviconInputUrl.trim() });
    showToast('Tautan logo Title URL (Favicon) berhasil diterapkan', 'success');
  };

  // Sync Title / Tab Title
  const handleSaveBrowserTitle = () => {
    updateProfile({ browserTitle: browserTitleInput.trim() });
    if (typeof window !== 'undefined') {
      document.title = browserTitleInput.trim();
    }
    showToast('Judul tab browser (Title URL) berhasil diperbarui', 'success');
  };

  // Reset to default SVG Logo
  const handleResetAppLogo = () => {
    setLogoInputUrl('');
    updateProfile({ logoUrl: '' });
    showToast('Logo aplikasi dikembalikan ke Lambang Resmi PGRI (Default)', 'info');
  };

  // Reset to default Favicon
  const handleResetFavicon = () => {
    setFaviconInputUrl('');
    updateProfile({ faviconUrl: '' });
    showToast('Logo Title URL dikembalikan ke Favicon PGRI default', 'info');
  };

  // One-click: Match Favicon with App Logo
  const handleSyncFaviconWithAppLogo = () => {
    const currentAppLogo = profile.logoUrl || logoInputUrl;
    if (!currentAppLogo) {
      handleResetFavicon();
      showToast('Favicon diselaraskan dengan Lambang Resmi PGRI bawaan', 'info');
      return;
    }
    setFaviconInputUrl(currentAppLogo);
    updateProfile({ faviconUrl: currentAppLogo });
    showToast('Logo Title URL (Favicon) berhasil disamakan dengan Logo Aplikasi!', 'success');
  };

  const isCustomAppLogo = Boolean(profile.logoUrl);
  const isCustomFavicon = Boolean(profile.faviconUrl);

  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 border border-slate-200/90 rounded-2xl p-5 md:p-6 shadow-sm space-y-6">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-bold text-slate-900">
                Pengaturan Logo Aplikasi & Logo Title URL
              </h4>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">
                Branding & Identitas
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ganti lambang aplikasi utama untuk tampilan portal publik, serta logo favicon yang tampil di tab browser dan bilah URL.
            </p>
          </div>
        </div>

        {/* Tab Switcher: App Logo vs Favicon */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200/80">
          <button
            type="button"
            onClick={() => setActiveLogoTab('app')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeLogoTab === 'app'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Logo Aplikasi</span>
            {isCustomAppLogo && (
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveLogoTab('favicon')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeLogoTab === 'favicon'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Logo Title URL (Favicon)</span>
            {isCustomFavicon && (
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            )}
          </button>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={appLogoFileRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        className="hidden"
        onChange={handleAppLogoFileUpload}
      />
      <input
        ref={faviconFileRef}
        type="file"
        accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml,image/webp"
        className="hidden"
        onChange={handleFaviconFileUpload}
      />

      {/* TAB 1: LOGO APLIKASI UTAMA */}
      {activeLogoTab === 'app' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column Left: Live Realistic Preview Box */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Monitor className="h-3.5 w-3.5 text-slate-500" />
                Pratinjau Nyata Logo
              </span>
              <div className="flex items-center gap-1 text-[11px] bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPreviewTheme('light')}
                  className={`px-2 py-0.5 rounded font-medium transition-all ${
                    previewTheme === 'light'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Navbar (Terang)
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTheme('dark')}
                  className={`px-2 py-0.5 rounded font-medium transition-all ${
                    previewTheme === 'dark'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Footer (Gelap)
                </button>
              </div>
            </div>

            {/* Preview Box */}
            <div
              className={`rounded-2xl p-4 transition-all duration-200 border ${
                previewTheme === 'light'
                  ? 'bg-white border-slate-200 shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-white shadow-md'
              }`}
            >
              {/* Simulated Navigation Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100/20">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 flex items-center justify-center shrink-0">
                    <PgriLogo className="h-10 w-10 drop-shadow-sm" size={40} />
                  </div>
                  <div>
                    <div
                      className={`text-xs font-extrabold tracking-tight leading-tight ${
                        previewTheme === 'light' ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {profile.nama || 'PGRI Pasirwangi'}
                    </div>
                    <div
                      className={`text-[9px] font-medium uppercase tracking-wider ${
                        previewTheme === 'light' ? 'text-slate-500' : 'text-emerald-400'
                      }`}
                    >
                      {profile.tingkat || 'Cabang Pasirwangi Garut'}
                    </div>
                  </div>
                </div>

                <div
                  className={`hidden sm:flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md ${
                    previewTheme === 'light'
                      ? 'bg-slate-50 text-slate-600'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <span>Beranda</span>
                  <span>•</span>
                  <span>Profil</span>
                  <span>•</span>
                  <span>Layanan</span>
                </div>
              </div>

              {/* Emblem Details & Scale Badge */}
              <div className="pt-3 flex items-center justify-between text-[11px]">
                <span
                  className={
                    previewTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
                  }
                >
                  Status Lambang:
                </span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                    isCustomAppLogo
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {isCustomAppLogo ? 'Logo Kustom Aktif' : 'Lambang Default PGRI'}
                </span>
              </div>
            </div>

            {/* Hint Notice */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
              <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                Logo ini akan otomatis menggantikan lambang pada <strong>Header Navbar</strong>,{' '}
                <strong>Footer</strong>, dan seluruh kartu profil portal publik.
              </span>
            </div>
          </div>

          {/* Column Right: Actions & Settings */}
          <div className="lg:col-span-7 space-y-4">
            {/* Action 1: Upload from device */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Upload className="h-3.5 w-3.5 text-emerald-600" />
                    Opsi 1: Unggah Gambar Logo dari Perangkat
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Pilih file gambar logo baru langsung dari galeri HP atau laptop Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => appLogoFileRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Pilih File Logo (PNG / SVG / JPG)</span>
                </button>

                {isCustomAppLogo && (
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirm({
                        isOpen: true,
                        title: 'Hapus Logo Kustom Aplikasi?',
                        itemName: 'Logo aplikasi kustom saat ini',
                        itemType: 'Logo',
                        description:
                          'Logo kustom akan dihapus dan dikembalikan ke Lambang Vektor Resmi PGRI bawaan.',
                        onConfirm: () => {
                          handleResetAppLogo();
                          setDeleteConfirm((prev) => ({ ...prev, isOpen: false }));
                        },
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    title="Hapus logo kustom dan kembali ke lambang vektor asli"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-rose-600" />
                    <span>Kembali ke Lambang Asli</span>
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-400">
                Format disarankan: <strong>PNG transparan</strong> atau <strong>SVG</strong> resolusi tinggi, rasio aspek 1:1 (persegi/lingkaran), minimal 128×128 pixel.
              </p>
            </div>

            {/* Action 2: Input URL */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-2xs">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <LinkIcon className="h-3.5 w-3.5 text-blue-600" />
                Opsi 2: Tempel Link / URL Gambar Logo
              </h5>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://domain.com/logo-pgri.png atau /images/..."
                  value={logoInputUrl}
                  onChange={(e) => setLogoInputUrl(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={handleApplyLogoUrl}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer"
                >
                  Terapkan
                </button>
              </div>
            </div>

            {/* Action 3: Quick Preset Selection */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 text-xs space-y-2">
              <span className="font-semibold text-slate-700 block text-[11px]">
                Preset Lambang Cepat:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleResetAppLogo}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                    !profile.logoUrl
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <PgriSvgEmblem className="h-4 w-4" size={16} />
                  <span>Lambang Resmi PGRI (SVG Bawaan)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const heroLogo = '/images/hero_pgri.jpg';
                    setLogoInputUrl(heroLogo);
                    updateProfile({ logoUrl: heroLogo });
                    showToast('Logo diatur ke Banner Lambang Resmi', 'success');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition-all"
                >
                  <ImageIcon className="h-3.5 w-3.5 text-amber-600" />
                  <span>Banner Lambang Resmi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LOGO TITLE URL (FAVICON & TAB BROWSER ICON) */}
      {activeLogoTab === 'favicon' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column Left: Browser Tab Window Mockup */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              Simulasi Tampilan Tab Browser
            </span>

            {/* Realistic Browser Window Frame */}
            <div className="rounded-2xl border border-slate-300 bg-slate-200 shadow-md overflow-hidden text-xs">
              {/* Browser Window Bar */}
              <div className="bg-slate-300 px-3 py-2 flex items-center gap-1.5 border-b border-slate-300/80">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400 inline-block" />

                {/* Browser Tab */}
                <div className="ml-2 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-t-lg border-t border-x border-slate-300 text-slate-800 text-[11px] max-w-[210px] truncate shadow-xs">
                  {/* The Favicon Icon */}
                  <div className="h-4 w-4 shrink-0 flex items-center justify-center">
                    {profile.faviconUrl ? (
                      <img
                        src={profile.faviconUrl}
                        alt="Favicon"
                        className="h-4 w-4 object-contain rounded-xs"
                      />
                    ) : profile.logoUrl ? (
                      <img
                        src={profile.logoUrl}
                        alt="Favicon"
                        className="h-4 w-4 object-contain rounded-xs"
                      />
                    ) : (
                      <PgriSvgEmblem className="h-4 w-4" size={16} />
                    )}
                  </div>
                  <span className="truncate font-medium text-[10px]">
                    {browserTitleInput || 'PGRI Pasirwangi'}
                  </span>
                  <span className="text-slate-400 hover:text-slate-600 text-[10px] ml-auto">
                    ×
                  </span>
                </div>
              </div>

              {/* URL Address Bar */}
              <div className="bg-slate-100 p-2.5 border-b border-slate-200 flex items-center gap-2">
                <div className="flex-1 bg-white rounded-lg px-2.5 py-1 text-[11px] text-slate-600 border border-slate-300 flex items-center gap-1.5 shadow-2xs">
                  <span className="text-emerald-600 text-[10px] font-bold">🔒</span>
                  <div className="h-3.5 w-3.5 shrink-0 flex items-center justify-center">
                    {profile.faviconUrl ? (
                      <img
                        src={profile.faviconUrl}
                        alt="URL Icon"
                        className="h-3.5 w-3.5 object-contain"
                      />
                    ) : profile.logoUrl ? (
                      <img
                        src={profile.logoUrl}
                        alt="URL Icon"
                        className="h-3.5 w-3.5 object-contain"
                      />
                    ) : (
                      <PgriSvgEmblem className="h-3.5 w-3.5" size={14} />
                    )}
                  </div>
                  <span className="text-slate-900 font-medium">https://</span>
                  <span className="text-slate-700">pgri-pasirwangi.or.id</span>
                </div>
              </div>

              {/* Multi-Size Favicon Preview */}
              <div className="bg-white p-3.5 space-y-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Ukuran Resolusi Ikon Title URL:
                </span>
                <div className="flex items-center gap-4 text-[10px] text-slate-600">
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-4 w-4 border border-slate-200 rounded p-0.5 flex items-center justify-center bg-slate-50">
                      {profile.faviconUrl || profile.logoUrl ? (
                        <img
                          src={profile.faviconUrl || profile.logoUrl}
                          alt="16px"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <PgriSvgEmblem className="h-3 w-3" size={12} />
                      )}
                    </div>
                    <span>16×16px (Tab)</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="h-8 w-8 border border-slate-200 rounded p-0.5 flex items-center justify-center bg-slate-50">
                      {profile.faviconUrl || profile.logoUrl ? (
                        <img
                          src={profile.faviconUrl || profile.logoUrl}
                          alt="32px"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <PgriSvgEmblem className="h-6 w-6" size={24} />
                      )}
                    </div>
                    <span>32×32px (URL Bar)</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 border border-slate-200 rounded p-0.5 flex items-center justify-center bg-slate-50">
                      {profile.faviconUrl || profile.logoUrl ? (
                        <img
                          src={profile.faviconUrl || profile.logoUrl}
                          alt="48px"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <PgriSvgEmblem className="h-10 w-10" size={40} />
                      )}
                    </div>
                    <span>48×48px (Touch Icon)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-[11px] text-blue-800 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
              <span>
                Ikon ini langsung diperbarui di bilah tab browser saat Anda menyimpannya melalui elemen link favicon HTML dinamis.
              </span>
            </div>
          </div>

          {/* Column Right: Actions & Settings */}
          <div className="lg:col-span-7 space-y-4">
            {/* Quick 1-Click Sync with App Logo */}
            <div className="bg-gradient-to-r from-emerald-50 to-orange-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                <div>
                  <h6 className="text-xs font-bold text-slate-900">
                    Samakan Cepat dengan Logo Aplikasi
                  </h6>
                  <p className="text-[11px] text-slate-600">
                    Gunakan logo yang sama antara logo utama aplikasi dan logo Title URL tab browser.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSyncFaviconWithAppLogo}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer shadow-xs"
              >
                Samakan (1-Klik)
              </button>
            </div>

            {/* Action 1: Upload Favicon File */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
              <div>
                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Upload className="h-3.5 w-3.5 text-blue-600" />
                  Unggah Berkas Khusus Favicon (.ico / .png / .svg)
                </h5>
                <p className="text-[11px] text-slate-500">
                  Unggah file icon khusus favicon dari komputer atau ponsel Anda.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => faviconFileRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Pilih File Favicon (.ico / .png / .svg)</span>
                </button>

                {isCustomFavicon && (
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirm({
                        isOpen: true,
                        title: 'Hapus Favicon Kustom?',
                        itemName: 'Ikon Title URL / Favicon tab browser saat ini',
                        itemType: 'Favicon',
                        description:
                          'Favicon kustom akan dihapus dan dikembalikan ke Favicon Resmi PGRI bawaan.',
                        onConfirm: () => {
                          handleResetFavicon();
                          setDeleteConfirm((prev) => ({ ...prev, isOpen: false }));
                        },
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-rose-600" />
                    <span>Kembali ke Favicon Bawaan</span>
                  </button>
                )}
              </div>
            </div>

            {/* Action 2: Input URL Favicon */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-2xs">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <LinkIcon className="h-3.5 w-3.5 text-slate-700" />
                Input Link / URL Ikon Favicon
              </h5>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://domain.com/favicon.ico atau /images/..."
                  value={faviconInputUrl}
                  onChange={(e) => setFaviconInputUrl(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={handleApplyFaviconUrl}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer"
                >
                  Terapkan
                </button>
              </div>
            </div>

            {/* Action 3: Browser Window Title Text */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Monitor className="h-3.5 w-3.5 text-indigo-600" />
                  Judul Title URL / Tab Browser Window
                </h5>
                <span className="text-[10px] text-slate-400">Teks title dokumen</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Teks yang muncul tepat di samping logo Title URL pada tab browser pengunjung.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Contoh: PGRI Kecamatan Pasirwangi | Portal Informasi Digital"
                  value={browserTitleInput}
                  onChange={(e) => setBrowserTitleInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={handleSaveBrowserTitle}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer"
                >
                  Simpan Judul
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus / Reset Logo & Favicon */}
      <DeleteConfirmationModal
        isOpen={deleteConfirm.isOpen}
        title={deleteConfirm.title}
        itemName={deleteConfirm.itemName}
        itemType={deleteConfirm.itemType}
        description={deleteConfirm.description}
        confirmButtonText="Ya, Hapus & Kembalikan"
        onClose={() => setDeleteConfirm((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={deleteConfirm.onConfirm}
      />
    </div>
  );
}

'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { usePgriStore } from '@/lib/store';
import { BeritaItem } from '@/lib/types';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { compressImageFile } from '@/lib/imageCompressor';
import {
  Newspaper,
  Plus,
  Trash2,
  Edit3,
  Upload,
  Camera,
  Star,
  Flame,
  CheckCircle2,
  Calendar,
  User,
  Eye,
  Search,
  Sparkles,
  X,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';

export function AdminBeritaTab() {
  const { beritaList, addBerita, updateBerita, deleteBerita, setBeritaUtama, showToast } = usePgriStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BeritaItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    judul: '',
    ringkasan: '',
    isi: '',
    kategori: 'Kegiatan' as BeritaItem['kategori'],
    tanggal: new Date().toISOString().split('T')[0],
    penulis: 'Humas PGRI Pasirwangi',
    fotoUrl: '/images/hero_pgri.jpg',
    featured: false,
  });

  // Active Berita Utama
  const beritaUtama = beritaList.find((b) => b.featured) || beritaList[0];

  // Handle local file selection for foto kegiatan with automatic canvas compression
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Mohon pilih berkas foto/gambar yang valid!', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Ukuran berkas gambar maksimal 10 MB!', 'warning');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      // Compress to max 1280x800 at 0.82 quality to ensure crisp display without blowing storage
      const compressed = await compressImageFile(file, 1280, 800, 0.82);
      setFormData((prev) => ({ ...prev, fotoUrl: compressed }));
      showToast('Foto kegiatan berhasil diunggah & dioptimalkan!', 'success');
    } catch {
      showToast('Gagal memproses berkas gambar!', 'error');
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleStartEdit = (b: BeritaItem) => {
    setEditingId(b.id);
    setFormData({
      judul: b.judul,
      ringkasan: b.ringkasan,
      isi: b.isi,
      kategori: b.kategori,
      tanggal: b.tanggal,
      penulis: b.penulis,
      fotoUrl: b.fotoUrl || '/images/hero_pgri.jpg',
      featured: !!b.featured,
    });
    // Scroll form into view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      judul: '',
      ringkasan: '',
      isi: '',
      kategori: 'Kegiatan',
      tanggal: new Date().toISOString().split('T')[0],
      penulis: 'Humas PGRI Pasirwangi',
      fotoUrl: '/images/hero_pgri.jpg',
      featured: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.judul.trim()) {
      showToast('Judul berita wajib diisi!', 'warning');
      return;
    }

    if (!formData.ringkasan.trim()) {
      showToast('Ringkasan singkat berita wajib diisi!', 'warning');
      return;
    }

    if (editingId) {
      updateBerita(editingId, {
        judul: formData.judul.trim(),
        ringkasan: formData.ringkasan.trim(),
        isi: formData.isi.trim() || formData.ringkasan.trim(),
        kategori: formData.kategori,
        tanggal: formData.tanggal,
        penulis: formData.penulis.trim(),
        fotoUrl: formData.fotoUrl.trim() || '/images/hero_pgri.jpg',
        featured: formData.featured,
      });
      handleCancelEdit();
    } else {
      addBerita({
        judul: formData.judul.trim(),
        ringkasan: formData.ringkasan.trim(),
        isi: formData.isi.trim() || formData.ringkasan.trim(),
        kategori: formData.kategori,
        tanggal: formData.tanggal,
        penulis: formData.penulis.trim(),
        fotoUrl: formData.fotoUrl.trim() || '/images/hero_pgri.jpg',
        featured: formData.featured,
      });
      setFormData({
        judul: '',
        ringkasan: '',
        isi: '',
        kategori: 'Kegiatan',
        tanggal: new Date().toISOString().split('T')[0],
        penulis: 'Humas PGRI Pasirwangi',
        fotoUrl: '/images/hero_pgri.jpg',
        featured: false,
      });
    }
  };

  const filteredBerita = beritaList.filter((b) => {
    const matchCat = filterCategory === 'all' || b.kategori === filterCategory;
    const matchSearch =
      b.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.ringkasan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.penulis.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider mb-2">
            <Newspaper className="h-3.5 w-3.5" />
            <span>Manajemen Berita & Publikasi</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Kelola Warta & Berita Utama Hero
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Terbitkan berita, unggah foto kegiatan, dan atur Berita Utama untuk ditampilkan pada banner Hero landing page.
          </p>
        </div>
      </div>

      {/* HIGHLIGHT: STATUS BERITA UTAMA AKTIF DI HERO LANDINGPAGE */}
      {beritaUtama && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white shadow-xl border border-slate-700/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between relative z-10">
            {/* Left: Thumbnail & Details */}
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center flex-1">
              <div className="relative w-full sm:w-44 h-32 rounded-2xl overflow-hidden border-2 border-emerald-400/50 shadow-md shrink-0 bg-slate-800 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={beritaUtama.fotoUrl || '/images/hero_pgri.jpg'}
                  alt={beritaUtama.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
                  <span>Aktif di Hero</span>
                </div>
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-300" />
                    <span>Berita Utama Hero Saat Ini</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {beritaUtama.kategori} · {beritaUtama.tanggal}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-2">
                  {beritaUtama.judul}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {beritaUtama.ringkasan}
                </p>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium pt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Foto kegiatan dan judul berita ini langsung tampil di banner Hero halaman depan</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Button */}
            <div className="shrink-0 flex sm:flex-col gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleStartEdit(beritaUtama)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Berita Utama Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM INPUT BERITA & UPLOAD FOTO KEGIATAN */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold">
              {editingId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">
                {editingId ? 'Edit Warta Berita & Foto Kegiatan' : 'Input Berita Baru & Foto Kegiatan'}
              </h4>
              <p className="text-xs text-slate-500">
                Lengkapi rincian berita dan tandai jika ingin dijadikan Berita Utama di Hero landing page.
              </p>
            </div>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              Batal Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
          {/* TOGGLE BERITA UTAMA / HERO BANNER */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 via-emerald-50/40 to-slate-50 border-2 border-amber-200/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Star className="w-5 h-5 fill-white" />
              </div>
              <div>
                <label
                  htmlFor="featured-toggle"
                  className="font-bold text-slate-900 text-xs sm:text-sm cursor-pointer block"
                >
                  Jadikan Berita Utama (Tampil di Hero Landingpage)
                </label>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Berita ini beserta foto kegiatannya akan ditampilkan secara istimewa di bagian banner Hero paling atas website.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                id="featured-toggle"
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* UPLOAD FOTO KEGIATAN ROW */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Foto Kegiatan / Dokumentasi Berita <span className="text-rose-500">*</span></span>
              </label>
              <span className="text-[11px] text-slate-500">
                Pilih foto kegiatan dari komputer/HP atau tempelkan tautan URL gambar
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Preview Thumbnail */}
              <div className="sm:col-span-3 flex justify-center sm:justify-start">
                <div className="relative w-full h-32 sm:h-28 rounded-2xl overflow-hidden border-2 border-slate-300/80 bg-slate-200 shadow-xs relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.fotoUrl || '/images/hero_pgri.jpg'}
                    alt="Pratinjau Foto Kegiatan"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-semibold">
                    Pratinjau Foto
                  </div>
                </div>
              </div>

              {/* Upload Controls */}
              <div className="sm:col-span-9 space-y-2.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="URL gambar foto kegiatan..."
                    value={formData.fotoUrl}
                    onChange={(e) => setFormData({ ...formData, fotoUrl: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    disabled={isUploadingPhoto}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer transition-colors"
                  >
                    {isUploadingPhoto ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Mengompres Foto...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload dari HP / Laptop</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Contoh Preset:</span>
                  {[
                    { label: 'Hero PGRI', url: '/images/hero_pgri.jpg' },
                    { label: 'Ketua PGRI', url: '/images/ketua_pgri.jpg' },
                    { label: 'Kegiatan 1', url: 'https://picsum.photos/seed/kegiatan_pgri_1/800/500' },
                    { label: 'Kegiatan 2', url: 'https://picsum.photos/seed/kegiatan_pgri_2/800/500' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, fotoUrl: preset.url })}
                      className="px-2 py-0.5 rounded-md bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 cursor-pointer transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields: Judul & Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8 space-y-1.5">
              <label className="font-bold text-slate-800 text-xs block">
                Judul Warta Berita <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: PGRI Pasirwangi Gelar Workshop Inovasi Pembelajaran Digital..."
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium"
              />
            </div>

            <div className="sm:col-span-4 space-y-1.5">
              <label className="font-bold text-slate-800 text-xs block">
                Kategori Berita <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium cursor-pointer"
              >
                <option value="Kegiatan">Kegiatan</option>
                <option value="Organisasi">Organisasi</option>
                <option value="Pendidikan">Pendidikan</option>
                <option value="Informasi Anggota">Informasi Anggota</option>
                <option value="Prestasi">Prestasi</option>
                <option value="Pengumuman">Pengumuman</option>
              </select>
            </div>
          </div>

          {/* Tanggal & Penulis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 text-xs block">
                Tanggal Publikasi
              </label>
              <input
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 text-xs block">
                Penulis / Redaksi
              </label>
              <input
                type="text"
                placeholder="Contoh: Humas PGRI Pasirwangi"
                value={formData.penulis}
                onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Ringkasan Singkat (Hero Snippet) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-800 text-xs block">
                Ringkasan / Cuplikan Singkat <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">
                Ditampilkan pada kartu Hero dan pratinjau berita
              </span>
            </div>
            <textarea
              rows={2}
              required
              placeholder="Tuliskan 1 - 2 kalimat ringkasan penting dari kegiatan atau informasi berita ini..."
              value={formData.ringkasan}
              onChange={(e) => setFormData({ ...formData, ringkasan: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium"
            />
          </div>

          {/* Isi Lengkap Berita */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 text-xs block">
              Isi Lengkap Berita
            </label>
            <textarea
              rows={5}
              placeholder="Tuliskan isi berita lengkap, kronologi kegiatan, kutipan narasumber, dan informasi penting lainnya..."
              value={formData.isi}
              onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium leading-relaxed"
            />
          </div>

          {/* Submit Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
            <div className="text-[11px] text-slate-500">
              {formData.featured ? (
                <span className="text-amber-700 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>Akan langsung tampil sebagai Berita Utama di Hero Landingpage</span>
                </span>
              ) : (
                <span>Berita akan diterbitkan ke daftar berita warta portal</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                {formData.featured && <Star className="w-4 h-4 fill-amber-300 text-amber-300" />}
                <span>{editingId ? 'Simpan Perubahan Berita' : 'Terbitkan Berita'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* DAFTAR BERITA & KELOLA STATUS HERO */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-bold text-slate-900 text-base">
              Daftar Seluruh Warta Berita ({beritaList.length})
            </h4>
            <p className="text-xs text-slate-500">
              Pilih tombol bintang untuk menetapkan berita tertentu sebagai Berita Utama di banner Hero.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {['all', 'Kegiatan', 'Organisasi', 'Pendidikan', 'Informasi Anggota', 'Prestasi', 'Pengumuman'].map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'Semua Kategori' : cat}
              </button>
            )
          )}
        </div>

        {/* List of News */}
        <div className="divide-y divide-slate-100">
          {filteredBerita.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Tidak ada berita yang cocok dengan pencarian Anda.
            </div>
          ) : (
            filteredBerita.map((item) => (
              <div
                key={item.id}
                className={`py-3.5 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                  item.featured ? 'bg-amber-50/40 -mx-3 px-3 rounded-2xl' : ''
                }`}
              >
                {/* Photo & Info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="relative w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.fotoUrl || '/images/hero_pgri.jpg'}
                      alt={item.judul}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-2xs">
                          <Star className="w-3 h-3 fill-slate-950" />
                          <span>Berita Utama Hero</span>
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                        {item.kategori}
                      </span>
                      <span className="text-[11px] text-slate-400">· {item.tanggal}</span>
                      <span className="text-[11px] text-slate-400 hidden sm:inline">
                        · Penulis: {item.penulis}
                      </span>
                    </div>

                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                      {item.judul}
                    </h5>
                    <p className="text-slate-500 text-xs line-clamp-1">{item.ringkasan}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {/* Set as Berita Utama */}
                  {!item.featured ? (
                    <button
                      type="button"
                      onClick={() => {
                        setBeritaUtama(item.id);
                        showToast(`"${item.judul}" ditetapkan sebagai Berita Utama Hero!`, 'success');
                      }}
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                      title="Pasang berita ini di banner Hero Landingpage"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-600" />
                      <span className="hidden md:inline">Jadikan Berita Utama</span>
                      <span className="md:hidden">Hero</span>
                    </button>
                  ) : (
                    <div className="px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-100/60 rounded-xl border border-amber-300/60 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Aktif di Hero</span>
                    </div>
                  )}

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-emerald-200"
                    title="Edit Berita & Foto Kegiatan"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                    title="Hapus Berita"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Verifikasi Hapus Berita */}
      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        title="Hapus Warta Berita?"
        itemName={deleteTarget ? deleteTarget.judul : ''}
        itemType="Warta Berita"
        description="Berita ini beserta foto kegiatannya akan dihapus permanen dari portal dan basis data Supabase."
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteBerita(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}

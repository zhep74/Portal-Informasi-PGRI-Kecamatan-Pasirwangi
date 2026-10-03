'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { usePgriStore } from '@/lib/store';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import {
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Camera,
  Trash2,
  Crop,
} from 'lucide-react';
import { PrecisionPhotoCropModal } from './PrecisionPhotoCropModal';
import { compressImageFile } from '@/lib/imageCompressor';

interface KetuaFotoUploaderProps {
  compact?: boolean;
}

export function KetuaFotoUploader({ compact = false }: KetuaFotoUploaderProps) {
  const { profile, updateProfile, pengurusList, updatePengurus, showToast } = usePgriStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [syncWithPengurus, setSyncWithPengurus] = useState(true);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const currentFoto = profile.sambutanKetua.fotoUrl || '/images/ketua_pgri.jpg';

  // Apply new photo URL (from file or text)
  const applyFoto = (newUrl: string) => {
    if (!newUrl) return;

    // Update profile sambutanKetua
    updateProfile({
      sambutanKetua: {
        ...profile.sambutanKetua,
        fotoUrl: newUrl,
      },
    });

    // If sync is enabled, also update the Ketua in pengurusList
    if (syncWithPengurus) {
      const ketuaPengurus = pengurusList.find(
        (p) =>
          p.jabatan.toLowerCase().includes('ketua cabang') ||
          p.jabatan.toLowerCase() === 'ketua' ||
          p.id === 'peng-1'
      );
      if (ketuaPengurus) {
        updatePengurus(ketuaPengurus.id, { fotoUrl: newUrl });
      }
    }

    showToast('Foto Ketua PGRI berhasil diperbarui!', 'success');
  };

  // Handle local file selection from PC or Mobile device
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Mohon pilih berkas gambar (JPG, PNG, atau WebP)!', 'error');
      return;
    }

    // Limit file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 10 MB!', 'warning');
      return;
    }

    try {
      const compressed = await compressImageFile(file, 800, 800, 0.88);
      applyFoto(compressed);
    } catch {
      showToast('Gagal memproses berkas gambar!', 'error');
    } finally {
      e.target.value = '';
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) {
      showToast('Masukkan URL gambar yang valid!', 'warning');
      return;
    }
    applyFoto(imageUrlInput.trim());
    setImageUrlInput('');
    setIsUrlMode(false);
  };

  const presetPhotos = [
    { label: 'Foto Resmi Default', url: '/images/ketua_pgri.jpg' },
    { label: 'Hero PGRI', url: '/images/hero_pgri.jpg' },
    { label: 'Potret Pria 1', url: 'https://picsum.photos/seed/ketua_formal_1/500/500' },
    { label: 'Potret Pria 2', url: 'https://picsum.photos/seed/ketua_formal_2/500/500' },
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-50/60 via-white to-slate-50 border-2 border-emerald-200 rounded-3xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4 mb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider mb-1">
            <Camera className="h-3.5 w-3.5" />
            <span>Manajemen Foto Ketua PGRI</span>
          </div>
          <h4 className="text-base font-bold text-slate-900">
            Unggah / Perbarui Foto Ketua PGRI Cabang
          </h4>
          <p className="text-xs text-slate-500">
            Foto ini ditampilkan pada Bagian Sambutan Resmi, Profil Pimpinan, dan Kartu Kepengurusan.
          </p>
        </div>

        <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
          <input
            type="checkbox"
            checked={syncWithPengurus}
            onChange={(e) => setSyncWithPengurus(e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500"
          />
          <span>Sinkronkan ke Struktur Pengurus</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Photo Preview Column (Circular) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
          <div className="relative group">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-emerald-400/40 relative bg-slate-100">
              <Image
                src={currentFoto}
                alt={profile.sambutanKetua.nama}
                fill
                className="object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Quick change hover overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-slate-900/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-2"
              title="Klik untuk memilih foto dari perangkat Anda"
            >
              <Upload className="h-6 w-6 mb-1 text-emerald-400" />
              <span className="text-xs font-semibold">Ganti Foto</span>
              <span className="text-[10px] text-slate-300">Pilih dari HP / Laptop</span>
            </button>
          </div>

          <div className="mt-3 flex flex-col items-center">
            <div className="text-xs font-bold text-slate-900">
              {profile.sambutanKetua.nama}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">
              {profile.sambutanKetua.jabatan}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              NIP: {profile.sambutanKetua.nip || '-'}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsCropModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer shadow-2xs"
                title="Atur Zoom & Posisi agar foto pas presisi di lingkaran"
              >
                <Crop className="h-3.5 w-3.5 text-emerald-700" />
                <span>Atur Presisi Bundar</span>
              </button>

              {currentFoto !== '/images/ketua_pgri.jpg' && (
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer shadow-2xs"
                  title="Hapus foto kustom dan gunakan foto standar"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Reset Bawaan</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action & Upload Options Column */}
        <div className="md:col-span-8 space-y-4">
          {/* Main Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Upload from Device */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex flex-col items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <div className="text-center">
                <div className="font-bold text-sm">Pilih Foto dari Perangkat</div>
                <div className="text-[11px] text-emerald-100">Galeri HP, Kamera, atau Komputer</div>
              </div>
            </button>

            {/* 2. Input Web URL */}
            <button
              type="button"
              onClick={() => setIsUrlMode(!isUrlMode)}
              className={`p-4 rounded-2xl border-2 text-xs flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                isUrlMode
                  ? 'border-slate-800 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isUrlMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <LinkIcon className="h-5 w-5" />
              </div>
              <div className="text-center">
                <div className="font-bold text-sm">Gunakan Link / URL Foto</div>
                <div className={`text-[11px] ${isUrlMode ? 'text-slate-300' : 'text-slate-500'}`}>
                  Tempel tautan gambar dari internet
                </div>
              </div>
            </button>
          </div>

          {/* URL Input Form when opened */}
          {isUrlMode && (
            <form
              onSubmit={handleApplyUrl}
              className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2 animate-in fade-in duration-200"
            >
              <label className="text-xs font-semibold text-slate-700 block">
                Masukkan URL Gambar:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/foto-ketua.jpg atau /images/ketua_pgri.jpg"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs"
                >
                  Terapkan
                </button>
              </div>
            </form>
          )}

          {/* Preset / Sample Portraits */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Atau pilih preset foto profil resmi:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {presetPhotos.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyFoto(preset.url)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                    currentFoto === preset.url
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-5 h-5 rounded-md overflow-hidden relative shrink-0">
                    <Image
                      src={preset.url}
                      alt={preset.label}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span>{preset.label}</span>
                  {currentFoto === preset.url && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Verifikasi Hapus Foto Kustom */}
      <DeleteConfirmationModal
        isOpen={isResetConfirmOpen}
        title="Hapus Foto Kustom Ketua PGRI?"
        itemName="Foto profil ketua cabang saat ini"
        itemType="Foto Profil"
        description="Foto kustom akan dihapus dan dikembalikan ke foto resmi bawaan PGRI Pasirwangi."
        confirmButtonText="Ya, Hapus & Kembalikan"
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          applyFoto('/images/ketua_pgri.jpg');
          setIsResetConfirmOpen(false);
          showToast('Foto dikembalikan ke foto resmi standar PGRI', 'info');
        }}
      />

      {/* Modal Pengaturan Presisi Lingkaran Foto Ketua */}
      <PrecisionPhotoCropModal
        isOpen={isCropModalOpen}
        imageSrc={currentFoto}
        title="Pengaturan Presisi Foto Bundar Ketua PGRI"
        onClose={() => setIsCropModalOpen(false)}
        onSave={(croppedUrl) => {
          applyFoto(croppedUrl);
          showToast('Presisi foto bundar Ketua PGRI berhasil diterapkan!', 'success');
        }}
      />
    </div>
  );
}

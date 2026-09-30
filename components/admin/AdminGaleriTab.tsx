'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { usePgriStore } from '@/lib/store';
import { GaleriItem } from '@/lib/types';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import {
  Film,
  Plus,
  Trash2,
  Edit,
  Save,
  Upload,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  X,
  PlayCircle,
} from 'lucide-react';

export function AdminGaleriTab() {
  const { galeriList, addGaleri, updateGaleri, deleteGaleri, showToast } = usePgriStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GaleriItem | null>(null);

  const [formData, setFormData] = useState({
    tipe: 'foto' as GaleriItem['tipe'],
    judul: '',
    deskripsi: '',
    url: '/images/hero_pgri.jpg',
    youtubeId: '',
    kategori: 'Kegiatan Organisasi',
    tahun: '2026',
  });

  const extractYoutubeId = (url: string): string | undefined => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : undefined;
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Pilih berkas foto yang valid!', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData((prev) => ({ ...prev, url: result }));
        showToast('Foto galeri berhasil diunggah!', 'success');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.judul.trim()) {
      showToast('Judul Galeri wajib diisi!', 'warning');
      return;
    }

    let finalData = { ...formData };
    if (formData.tipe === 'video') {
      const ytId = extractYoutubeId(formData.url);
      if (ytId) {
        finalData.youtubeId = ytId;
      }
    }

    if (editingId) {
      updateGaleri(editingId, finalData);
      setEditingId(null);
      showToast('Item galeri berhasil diperbarui!', 'success');
    } else {
      addGaleri(finalData);
      showToast('Item galeri baru berhasil ditambahkan!', 'success');
    }

    // Reset
    setFormData({
      tipe: 'foto',
      judul: '',
      deskripsi: '',
      url: '/images/hero_pgri.jpg',
      youtubeId: '',
      kategori: 'Kegiatan Organisasi',
      tahun: '2026',
    });
  };

  const startEdit = (item: GaleriItem) => {
    setEditingId(item.id);
    setFormData({
      tipe: item.tipe,
      judul: item.judul,
      deskripsi: item.deskripsi,
      url: item.url,
      youtubeId: item.youtubeId || '',
      kategori: item.kategori,
      tahun: item.tahun,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      tipe: 'foto',
      judul: '',
      deskripsi: '',
      url: '/images/hero_pgri.jpg',
      youtubeId: '',
      kategori: 'Kegiatan Organisasi',
      tahun: '2026',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 uppercase tracking-wider mb-1">
            <Film className="h-3.5 w-3.5" />
            <span>Koleksi Visual</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Kelola Galeri Foto & Dokumentasi Video
          </h3>
          <p className="text-xs text-slate-500">
            Katalog dokumentasi visual potret guru, upacara bendera, dan tayangan YouTube edukasi.
          </p>
        </div>
      </div>

      {/* Form Tambah/Edit */}
      <form
        onSubmit={handleSave}
        className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 shadow-xs"
      >
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            {editingId ? (
              <>
                <Edit className="h-4 w-4 text-amber-600" />
                <span>Edit Galeri</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 text-emerald-600" />
                <span>Tambah Item Galeri Baru</span>
              </>
            )}
          </h4>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" />
              <span>Batal Edit</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tipe Media</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tipe: 'foto' })}
                className={`flex-1 py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 border ${
                  formData.tipe === 'foto'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                <span>Foto</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tipe: 'video' })}
                className={`flex-1 py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 border ${
                  formData.tipe === 'video'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                <Video className="h-3.5 w-3.5" />
                <span>Video YouTube</span>
              </button>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Kategori</label>
            <input
              type="text"
              placeholder="Contoh: Upacara, Rapat, Seminar, Seni"
              value={formData.kategori}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tahun</label>
            <input
              type="text"
              placeholder="2026"
              value={formData.tahun}
              onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <label className="font-semibold text-slate-700 block">
            Judul Dokumentasi <span className="text-emerald-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Semarak Upacara Hari Guru Nasional di Halaman Kecamatan"
            value={formData.judul}
            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-1 text-xs">
          <label className="font-semibold text-slate-700 block">Deskripsi Singkat</label>
          <textarea
            rows={2}
            placeholder="Ceritakan momen yang terekam pada gambar/video..."
            value={formData.deskripsi}
            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
          />
        </div>

        {/* Media Input / Upload */}
        <div className="text-xs space-y-2">
          <label className="font-semibold text-slate-700 block">
            {formData.tipe === 'foto' ? 'File Foto / URL Gambar' : 'Tautan Video YouTube'}
          </label>
          <div className="flex flex-wrap items-center gap-3">
            {formData.tipe === 'foto' ? (
              <>
                <div className="relative w-16 h-12 rounded-xl overflow-hidden border border-slate-300 bg-slate-100 shrink-0">
                  <Image
                    src={formData.url}
                    alt="Preview Galeri"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <input
                  type="text"
                  placeholder="URL Foto..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="flex-1 min-w-[200px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-semibold flex items-center gap-1.5"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Unggah Foto</span>
                </button>
              </>
            ) : (
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200">
          {editingId ? (
            <button
              type="button"
              onClick={() => {
                const item = galeriList.find((g) => g.id === editingId);
                if (item) setDeleteTarget(item);
              }}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Hapus Item Galeri Ini</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold text-xs cursor-pointer"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{editingId ? 'Simpan Perubahan' : 'Tambahkan ke Galeri'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Grid Galeri */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900">
          Daftar Koleksi Galeri ({galeriList.length}):
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {galeriList.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:border-purple-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-slate-100">
                  {item.tipe === 'video' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-3 text-center">
                      <PlayCircle className="h-10 w-10 text-emerald-500 mb-1" />
                      <span className="text-[11px] font-medium text-slate-300">Video YouTube</span>
                    </div>
                  ) : (
                    <Image
                      src={item.url || '/images/hero_pgri.jpg'}
                      alt={item.judul}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-semibold">
                    {item.kategori}
                  </span>
                </div>

                <div className="p-3 text-xs space-y-1">
                  <h5 className="font-bold text-slate-900 line-clamp-1">{item.judul}</h5>
                  <p className="text-slate-500 text-[11px] line-clamp-2">{item.deskripsi}</p>
                </div>
              </div>

              <div className="p-3 pt-0 flex justify-end gap-1.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="px-2 py-1 text-xs text-amber-700 hover:bg-amber-50 rounded-lg font-semibold flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  className="px-2.5 py-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/80 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                  title="Hapus Item Galeri"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL VERIFIKASI HAPUS GALERI */}
      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        title="Hapus Koleksi Galeri?"
        itemName={deleteTarget ? `${deleteTarget.judul} (${deleteTarget.tipe.toUpperCase()})` : ''}
        itemType="Galeri"
        description="Dokumentasi foto/video ini akan dihapus permanen dari galeri publik dan basis data Supabase."
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteGaleri(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}

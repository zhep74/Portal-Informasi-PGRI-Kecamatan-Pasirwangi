'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { usePgriStore } from '@/lib/store';
import { KegiatanItem } from '@/lib/types';
import {
  CalendarDays,
  Plus,
  Trash2,
  Edit,
  Save,
  Upload,
  Clock,
  MapPin,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  X,
} from 'lucide-react';

export function AdminKegiatanTab() {
  const { kegiatanList, addKegiatan, updateKegiatan, deleteKegiatan, showToast } = usePgriStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nama: '',
    tanggal: '15 Mei 2026',
    waktu: '08:00 - 14:00 WIB',
    lokasi: 'Aula PGRI Cabang Pasirwangi',
    deskripsi: '',
    pesertaCount: 100,
    fotoUtama: '/images/hero_pgri.jpg',
    galeriDokumentasi: [] as string[],
  });

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Pilih berkas foto kegiatan yang valid!', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData((prev) => ({ ...prev, fotoUtama: result }));
        showToast('Foto kegiatan berhasil diunggah!', 'success');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama.trim() || !formData.tanggal.trim()) {
      showToast('Nama Kegiatan dan Tanggal wajib diisi!', 'warning');
      return;
    }

    if (editingId) {
      updateKegiatan(editingId, formData);
      setEditingId(null);
      showToast('Data kegiatan berhasil diperbarui!', 'success');
    } else {
      addKegiatan(formData);
      showToast('Kegiatan baru berhasil ditambahkan!', 'success');
    }

    // Reset form
    setFormData({
      nama: '',
      tanggal: '15 Mei 2026',
      waktu: '08:00 - 14:00 WIB',
      lokasi: 'Aula PGRI Cabang Pasirwangi',
      deskripsi: '',
      pesertaCount: 100,
      fotoUtama: '/images/hero_pgri.jpg',
      galeriDokumentasi: [],
    });
  };

  const startEdit = (item: KegiatanItem) => {
    setEditingId(item.id);
    setFormData({
      nama: item.nama,
      tanggal: item.tanggal,
      waktu: item.waktu,
      lokasi: item.lokasi,
      deskripsi: item.deskripsi,
      pesertaCount: item.pesertaCount,
      fotoUtama: item.fotoUtama || '/images/hero_pgri.jpg',
      galeriDokumentasi: item.galeriDokumentasi || [],
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      nama: '',
      tanggal: '15 Mei 2026',
      waktu: '08:00 - 14:00 WIB',
      lokasi: 'Aula PGRI Cabang Pasirwangi',
      deskripsi: '',
      pesertaCount: 100,
      fotoUtama: '/images/hero_pgri.jpg',
      galeriDokumentasi: [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 uppercase tracking-wider mb-1">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Dokumentasi Aksi</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Kelola Dokumentasi Kegiatan PGRI
          </h3>
          <p className="text-xs text-slate-500">
            Kelola agenda kegiatan yang telah terlaksana, foto liputan, dan estimasi peserta.
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
                <span>Edit Kegiatan</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 text-emerald-600" />
                <span>Tambah Kegiatan Baru</span>
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

        <div className="space-y-1 text-xs">
          <label className="font-semibold text-slate-700 block">
            Nama / Judul Kegiatan <span className="text-emerald-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Seminar Pembelajaran Berdiferensiasi Guru SD se-Pasirwangi"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Tanggal Pelaksanaan <span className="text-emerald-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: 15 Mei 2026"
              value={formData.tanggal}
              onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Waktu / Jam</label>
            <input
              type="text"
              placeholder="Contoh: 08:00 - 15:00 WIB"
              value={formData.waktu}
              onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Perkiraan Peserta</label>
            <input
              type="number"
              placeholder="100"
              value={formData.pesertaCount}
              onChange={(e) =>
                setFormData({ ...formData, pesertaCount: parseInt(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        <div className="text-xs space-y-1">
          <label className="font-semibold text-slate-700 block">
            Lokasi Tempat Pelaksanaan
          </label>
          <input
            type="text"
            placeholder="Contoh: Gedung Guru PGRI Pasirwangi / SMPN 1 Pasirwangi"
            value={formData.lokasi}
            onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
          />
        </div>

        <div className="text-xs space-y-1">
          <label className="font-semibold text-slate-700 block">
            Deskripsi & Rangkuman Kegiatan
          </label>
          <textarea
            rows={3}
            placeholder="Rangkuman jalannya acara, pemateri, serta hasil kesepakatan..."
            value={formData.deskripsi}
            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
          />
        </div>

        {/* Foto Dokumentasi */}
        <div className="text-xs space-y-2">
          <label className="font-semibold text-slate-700 block">
            Foto Dokumentasi Utama
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-20 h-14 rounded-xl overflow-hidden border border-slate-300 bg-slate-100 shrink-0">
              <Image
                src={formData.fotoUtama}
                alt="Preview Kegiatan"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <input
              type="text"
              placeholder="Tautan Foto (URL)..."
              value={formData.fotoUtama}
              onChange={(e) => setFormData({ ...formData, fotoUtama: e.target.value })}
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
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold text-xs"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span>{editingId ? 'Simpan Perubahan' : 'Terbitkan Kegiatan'}</span>
          </button>
        </div>
      </form>

      {/* List Kegiatan */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900">
          Daftar Kegiatan ({kegiatanList.length}):
        </h4>

        <div className="space-y-3">
          {kegiatanList.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-all shadow-2xs flex flex-col sm:flex-row gap-4 justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                  <Image
                    src={item.fotoUtama || '/images/hero_pgri.jpg'}
                    alt={item.nama}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <h5 className="font-bold text-sm text-slate-900">{item.nama}</h5>
                  <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <CalendarDays className="h-3 w-3" />
                      {item.tanggal}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.waktu}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {item.lokasi}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Users className="h-3 w-3" />
                      {item.pesertaCount} Peserta
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-2 mt-1">{item.deskripsi}</p>
                </div>
              </div>

              <div className="flex sm:flex-col justify-end items-end gap-1.5 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="px-2.5 py-1 text-xs text-amber-700 hover:bg-amber-50 rounded-lg font-semibold flex items-center gap-1"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Hapus kegiatan "${item.nama}"?`)) {
                      deleteKegiatan(item.id);
                      showToast('Kegiatan berhasil dihapus!', 'info');
                    }
                  }}
                  className="px-2.5 py-1 text-xs text-teal-600 hover:bg-teal-50 rounded-lg font-semibold flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

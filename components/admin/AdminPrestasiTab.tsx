'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { usePgriStore } from '@/lib/store';
import { PrestasiItem } from '@/lib/types';
import {
  Trophy,
  Plus,
  Trash2,
  Edit,
  Save,
  Upload,
  Award,
  Medal,
  CheckCircle2,
  X,
} from 'lucide-react';

export function AdminPrestasiTab() {
  const { prestasiList, addPrestasi, updatePrestasi, deletePrestasi, showToast } = usePgriStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    namaPrestasi: '',
    tahun: '2026',
    penerima: '',
    kategori: 'Guru' as PrestasiItem['kategori'],
    tingkat: 'Kabupaten' as PrestasiItem['tingkat'],
    fotoPiagam: '/images/hero_pgri.jpg',
    deskripsi: '',
  });

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Pilih berkas foto piagam/penghargaan!', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData((prev) => ({ ...prev, fotoPiagam: result }));
        showToast('Foto piagam berhasil dimuat!', 'success');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.namaPrestasi.trim() || !formData.penerima.trim()) {
      showToast('Nama Prestasi dan Penerima wajib diisi!', 'warning');
      return;
    }

    if (editingId) {
      updatePrestasi(editingId, formData);
      setEditingId(null);
      showToast('Prestasi berhasil diperbarui!', 'success');
    } else {
      addPrestasi(formData);
      showToast('Prestasi baru berhasil ditambahkan!', 'success');
    }

    // Reset
    setFormData({
      namaPrestasi: '',
      tahun: '2026',
      penerima: '',
      kategori: 'Guru',
      tingkat: 'Kabupaten',
      fotoPiagam: '/images/hero_pgri.jpg',
      deskripsi: '',
    });
  };

  const startEdit = (item: PrestasiItem) => {
    setEditingId(item.id);
    setFormData({
      namaPrestasi: item.namaPrestasi,
      tahun: item.tahun,
      penerima: item.penerima,
      kategori: item.kategori,
      tingkat: item.tingkat,
      fotoPiagam: item.fotoPiagam || '/images/hero_pgri.jpg',
      deskripsi: item.deskripsi,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      namaPrestasi: '',
      tahun: '2026',
      penerima: '',
      kategori: 'Guru',
      tingkat: 'Kabupaten',
      fotoPiagam: '/images/hero_pgri.jpg',
      deskripsi: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider mb-1">
            <Trophy className="h-3.5 w-3.5" />
            <span>Rekam Jejak Kejuaraan</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Kelola Rekam Prestasi & Penghargaan
          </h3>
          <p className="text-xs text-slate-500">
            Catatan prestasi guru berprestasi, siswa berbakat, sekolah berwawasan, dan penghargaan cabang.
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
                <span>Edit Prestasi</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 text-emerald-600" />
                <span>Tambah Prestasi Baru</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-8">
            <label className="font-semibold text-slate-700 block mb-1">
              Nama Prestasi / Kejuaraan <span className="text-emerald-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Juara I Lomba Guru Inovatif Berdiferensiasi"
              value={formData.namaPrestasi}
              onChange={(e) => setFormData({ ...formData, namaPrestasi: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="font-semibold text-slate-700 block mb-1">Tahun Perolehan</label>
            <input
              type="text"
              placeholder="2026"
              value={formData.tahun}
              onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Nama Penerima / Sekolah <span className="text-emerald-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Nama Guru / Siswa / Tim"
              value={formData.penerima}
              onChange={(e) => setFormData({ ...formData, penerima: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Kategori</label>
            <select
              value={formData.kategori}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  kategori: e.target.value as PrestasiItem['kategori'],
                })
              }
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            >
              <option value="Guru">Guru / Pendidik</option>
              <option value="Siswa">Siswa</option>
              <option value="Organisasi">Organisasi Cabang</option>
              <option value="Sekolah">Sekolah / Instansi</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tingkat</label>
            <select
              value={formData.tingkat}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tingkat: e.target.value as PrestasiItem['tingkat'],
                })
              }
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            >
              <option value="Kecamatan">Kecamatan</option>
              <option value="Kabupaten">Kabupaten</option>
              <option value="Provinsi">Provinsi</option>
              <option value="Nasional">Nasional</option>
            </select>
          </div>
        </div>

        <div className="text-xs space-y-1">
          <label className="font-semibold text-slate-700 block">Keterangan Singkat</label>
          <textarea
            rows={2}
            placeholder="Jelaskan mengenai capaian, karya, atau dampak inovasi..."
            value={formData.deskripsi}
            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
          />
        </div>

        {/* Foto Piagam */}
        <div className="text-xs space-y-2">
          <label className="font-semibold text-slate-700 block">
            Foto Piagam / Trofi / Dokumentasi
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-16 h-14 rounded-xl overflow-hidden border border-slate-300 bg-slate-100 shrink-0">
              <Image
                src={formData.fotoPiagam}
                alt="Preview Piagam"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <input
              type="text"
              placeholder="Tautan Foto / URL Piagam..."
              value={formData.fotoPiagam}
              onChange={(e) => setFormData({ ...formData, fotoPiagam: e.target.value })}
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
            <span>{editingId ? 'Simpan Perubahan' : 'Catat Prestasi'}</span>
          </button>
        </div>
      </form>

      {/* List Prestasi */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900">
          Daftar Prestasi ({prestasiList.length}):
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {prestasiList.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-300 transition-all shadow-2xs flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div className="space-y-1 text-xs flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px]">
                      Tingkat {item.tingkat}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">
                      {item.kategori} · {item.tahun}
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-slate-900">{item.namaPrestasi}</h5>
                  <p className="text-emerald-700 font-semibold text-[11px]">{item.penerima}</p>
                  <p className="text-slate-600 text-[11px] line-clamp-2">{item.deskripsi}</p>
                </div>
              </div>

              <div className="flex justify-end gap-1.5 pt-3 mt-2 border-t border-slate-100">
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
                    if (confirm(`Hapus prestasi "${item.namaPrestasi}"?`)) {
                      deletePrestasi(item.id);
                      showToast('Prestasi berhasil dihapus!', 'info');
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

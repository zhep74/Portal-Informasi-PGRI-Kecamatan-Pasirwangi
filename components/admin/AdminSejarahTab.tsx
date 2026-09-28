'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { usePgriStore } from '@/lib/store';
import { SejarahItem } from '@/lib/types';
import {
  History,
  Plus,
  Trash2,
  Edit,
  Save,
  Upload,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  X,
} from 'lucide-react';

export function AdminSejarahTab() {
  const { sejarahList, addSejarah, updateSejarah, deleteSejarah, showToast } = usePgriStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New item form state
  const [formData, setFormData] = useState({
    tahun: '',
    judul: '',
    ringkasan: '',
    isiLengkap: '',
    gambarUrl: '/images/hero_pgri.jpg',
  });

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Pilih berkas gambar valid!', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData((prev) => ({ ...prev, gambarUrl: result }));
        showToast('Foto berhasil dimuat!', 'success');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tahun.trim() || !formData.judul.trim() || !formData.ringkasan.trim()) {
      showToast('Tahun, Judul, dan Ringkasan wajib diisi!', 'warning');
      return;
    }

    if (editingId) {
      updateSejarah(editingId, formData);
      setEditingId(null);
      showToast('Tonggak sejarah berhasil diperbarui!', 'success');
    } else {
      addSejarah(formData);
      showToast('Tonggak sejarah baru berhasil ditambahkan!', 'success');
    }

    // Reset form
    setFormData({
      tahun: '',
      judul: '',
      ringkasan: '',
      isiLengkap: '',
      gambarUrl: '/images/hero_pgri.jpg',
    });
  };

  const startEdit = (item: SejarahItem) => {
    setEditingId(item.id);
    setFormData({
      tahun: item.tahun,
      judul: item.judul,
      ringkasan: item.ringkasan,
      isiLengkap: item.isiLengkap,
      gambarUrl: item.gambarUrl || '/images/hero_pgri.jpg',
    });
    // Scroll top of tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      tahun: '',
      judul: '',
      ringkasan: '',
      isiLengkap: '',
      gambarUrl: '/images/hero_pgri.jpg',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider mb-1">
            <History className="h-3.5 w-3.5" />
            <span>Manajemen Kilas Balik</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Kelola Sejarah Perjuangan PGRI Pasirwangi
          </h3>
          <p className="text-xs text-slate-500">
            Perbarui data tonggak masa bakti, dokumentasi arsip, dan narasi sejarah organisasi.
          </p>
        </div>
      </div>

      {/* Form: Tambah / Edit */}
      <form
        onSubmit={handleSave}
        className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 shadow-xs"
      >
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            {editingId ? (
              <>
                <Edit className="h-4 w-4 text-amber-600" />
                <span>Edit Tonggak Sejarah</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 text-emerald-600" />
                <span>Tambah Tonggak Sejarah Baru</span>
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
          <div className="sm:col-span-3">
            <label className="font-semibold text-slate-700 block mb-1">
              Tahun / Era <span className="text-emerald-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: 1962 atau 2025 - Sekarang"
              value={formData.tahun}
              onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="sm:col-span-9">
            <label className="font-semibold text-slate-700 block mb-1">
              Judul Peristiwa / Periode <span className="text-emerald-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Perintisan & Pembentukan PGRI Pasirwangi"
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="text-xs space-y-1">
          <label className="font-semibold text-slate-700 block">
            Ringkasan Singkat (Muncul di kartu timeline) <span className="text-emerald-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ringkasan 1-2 kalimat..."
            value={formData.ringkasan}
            onChange={(e) => setFormData({ ...formData, ringkasan: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="text-xs space-y-1">
          <label className="font-semibold text-slate-700 block">
            Isi Narasi Lengkap Sejarah
          </label>
          <textarea
            rows={3}
            placeholder="Tuliskan ulasan detail peristiwa sejarah..."
            value={formData.isiLengkap}
            onChange={(e) => setFormData({ ...formData, isiLengkap: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Gambar URL / Upload */}
        <div className="text-xs space-y-2">
          <label className="font-semibold text-slate-700 block">
            Foto / Arsip Dokumentasi Sejarah
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-300 bg-slate-100 shrink-0">
              <Image
                src={formData.gambarUrl}
                alt="Preview Sejarah"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <input
              type="text"
              placeholder="URL Gambar / Tautan arsip..."
              value={formData.gambarUrl}
              onChange={(e) => setFormData({ ...formData, gambarUrl: e.target.value })}
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
            <span>{editingId ? 'Simpan Perubahan' : 'Tambahkan ke Garis Waktu'}</span>
          </button>
        </div>
      </form>

      {/* List Existing Sejarah */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900">
          Daftar Tonggak Sejarah ({sejarahList.length} Periode):
        </h4>

        <div className="space-y-3">
          {sejarahList.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-all shadow-2xs flex flex-col sm:flex-row gap-4 justify-between"
            >
              <div className="flex items-start gap-3">
                {item.gambarUrl && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                    <Image
                      src={item.gambarUrl}
                      alt={item.judul}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                      {item.tahun}
                    </span>
                    <h5 className="font-bold text-sm text-slate-900">{item.judul}</h5>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{item.ringkasan}</p>
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
                    if (confirm(`Hapus sejarah "${item.judul}"?`)) {
                      deleteSejarah(item.id);
                      showToast('Tonggak sejarah berhasil dihapus!', 'info');
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

'use client';

import React, { useState } from 'react';
import { usePgriStore } from '@/lib/store';
import { LayananItem } from '@/lib/types';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import {
  HeartHandshake,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  X,
  FileCheck,
  Clock,
  UserCheck,
} from 'lucide-react';

export function AdminLayananTab() {
  const { layananList, addLayanan, updateLayanan, deleteLayanan, showToast } = usePgriStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LayananItem | null>(null);

  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    syarat: ['Memiliki NIK & NUPTK / PegID aktif', 'Surat rekomendasi kepala sekolah'],
    ikon: 'Users',
    kontakPic: 'Pengurus Cabang',
    estimasiHari: '1 - 3 Hari Kerja',
  });

  const [newSyaratText, setNewSyaratText] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama.trim() || !formData.deskripsi.trim()) {
      showToast('Nama Layanan dan Deskripsi wajib diisi!', 'warning');
      return;
    }

    if (editingId) {
      updateLayanan(editingId, formData);
      setEditingId(null);
      showToast('Layanan berhasil diperbarui!', 'success');
    } else {
      addLayanan(formData);
      showToast('Layanan baru berhasil ditambahkan!', 'success');
    }

    // Reset
    setFormData({
      nama: '',
      deskripsi: '',
      syarat: ['Memiliki NIK & NUPTK / PegID aktif', 'Surat rekomendasi kepala sekolah'],
      ikon: 'Users',
      kontakPic: 'Pengurus Cabang',
      estimasiHari: '1 - 3 Hari Kerja',
    });
  };

  const startEdit = (item: LayananItem) => {
    setEditingId(item.id);
    setFormData({
      nama: item.nama,
      deskripsi: item.deskripsi,
      syarat: [...item.syarat],
      ikon: item.ikon,
      kontakPic: item.kontakPic,
      estimasiHari: item.estimasiHari,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      nama: '',
      deskripsi: '',
      syarat: ['Memiliki NIK & NUPTK / PegID aktif', 'Surat rekomendasi kepala sekolah'],
      ikon: 'Users',
      kontakPic: 'Pengurus Cabang',
      estimasiHari: '1 - 3 Hari Kerja',
    });
  };

  const addSyarat = () => {
    if (!newSyaratText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      syarat: [...prev.syarat, newSyaratText.trim()],
    }));
    setNewSyaratText('');
  };

  const removeSyarat = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      syarat: prev.syarat.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 uppercase tracking-wider mb-1">
            <HeartHandshake className="h-3.5 w-3.5" />
            <span>Pusat Bantuan & Layanan</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Kelola Layanan Terpadu Anggota PGRI
          </h3>
          <p className="text-xs text-slate-500">
            Konfigurasi daftar layanan keanggotaan, advokasi, bantuan sosial, dan persyaratan berkas.
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
                <span>Edit Layanan</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 text-emerald-600" />
                <span>Tambah Layanan Baru</span>
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
            Nama Layanan <span className="text-emerald-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Bantuan Mediasi & Advokasi Hukum Perlindungan Guru"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="space-y-1 text-xs">
          <label className="font-semibold text-slate-700 block">
            Deskripsi Layanan <span className="text-emerald-500">*</span>
          </label>
          <textarea
            rows={2}
            required
            placeholder="Jelaskan manfaat layanan dan siapa saja yang berhak mengajukan..."
            value={formData.deskripsi}
            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Estimasi Waktu Proses</label>
            <input
              type="text"
              placeholder="Contoh: 1 - 3 Hari Kerja"
              value={formData.estimasiHari}
              onChange={(e) => setFormData({ ...formData, estimasiHari: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Penanggung Jawab / PIC</label>
            <input
              type="text"
              placeholder="Contoh: Bidang Advokasi (Asep Saepuloh)"
              value={formData.kontakPic}
              onChange={(e) => setFormData({ ...formData, kontakPic: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Simbol Ikon</label>
            <select
              value={formData.ikon}
              onChange={(e) => setFormData({ ...formData, ikon: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            >
              <option value="Users">Users (Keanggotaan)</option>
              <option value="Shield">Shield (Advokasi / Hukum)</option>
              <option value="FileText">FileText (Administrasi / SK)</option>
              <option value="BookOpen">BookOpen (Profesi / Pelatihan)</option>
              <option value="HeartHandshake">HeartHandshake (Santunan / Sosial)</option>
            </select>
          </div>
        </div>

        {/* Dynamic Syarat Berkas */}
        <div className="space-y-2 text-xs pt-2 border-t border-slate-200">
          <label className="font-semibold text-slate-700 block">
            Persyaratan Berkas Dokumen:
          </label>
          <div className="space-y-1.5">
            {formData.syarat.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200"
              >
                <FileCheck className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span className="flex-1 text-slate-700 text-xs">{s}</span>
                <button
                  type="button"
                  onClick={() => removeSyarat(idx)}
                  className="text-slate-400 hover:text-teal-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Ketik syarat dokumen tambahan..."
              value={newSyaratText}
              onChange={(e) => setNewSyaratText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSyarat();
                }
              }}
              className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
            />
            <button
              type="button"
              onClick={addSyarat}
              className="px-3 py-2 bg-slate-900 text-white rounded-xl font-semibold flex items-center gap-1 shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Syarat</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200">
          {editingId ? (
            <button
              type="button"
              onClick={() => {
                const item = layananList.find((l) => l.id === editingId);
                if (item) setDeleteTarget(item);
              }}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Hapus Layanan Ini</span>
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
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{editingId ? 'Simpan Perubahan' : 'Terbitkan Layanan'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* List Layanan */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900">
          Daftar Layanan Anggota ({layananList.length}):
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {layananList.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 transition-all shadow-2xs flex flex-col justify-between"
            >
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-sm text-slate-900">{item.nama}</h5>
                  <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-bold text-[10px]">
                    {item.estimasiHari}
                  </span>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed">{item.deskripsi}</p>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Syarat Pengajuan:
                  </span>
                  <ul className="space-y-0.5">
                    {item.syarat.map((s, idx) => (
                      <li key={idx} className="text-slate-600 text-[11px] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-[11px] text-slate-500 pt-1">
                  PIC: <strong className="text-slate-700">{item.kontakPic}</strong>
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
                  onClick={() => setDeleteTarget(item)}
                  className="px-2.5 py-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/80 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                  title="Hapus Layanan"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL VERIFIKASI HAPUS LAYANAN */}
      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        title="Hapus Layanan Organisasi?"
        itemName={deleteTarget ? deleteTarget.nama : ''}
        itemType="Layanan"
        description="Layanan ini akan dihapus permanen dari katalog layanan anggota dan basis data Supabase."
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteLayanan(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}

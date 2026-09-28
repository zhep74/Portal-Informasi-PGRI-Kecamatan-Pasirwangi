'use client';

import React, { useState } from 'react';
import { usePgriStore } from '@/lib/store';
import { KalenderItem } from '@/lib/types';
import {
  Calendar,
  Plus,
  Trash2,
  Edit,
  Save,
  Clock,
  MapPin,
  UserCheck,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';

export function AdminKalenderTab() {
  const { kalenderList, addKalender, updateKalender, deleteKalender, showToast } = usePgriStore();

  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    judul: '',
    tanggal: '2026-05-20',
    jamMulai: '08:30',
    jamSelesai: '12:00',
    lokasi: 'Gedung Guru PGRI Pasirwangi',
    penanggungJawab: 'Cecep Kurnia, S.Pd., M.Si.',
    deskripsi: '',
    kategori: 'Rapat' as KalenderItem['kategori'],
    status: 'Akan Datang' as KalenderItem['status'],
    linkInformasi: '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.judul.trim() || !formData.tanggal.trim()) {
      showToast('Judul Agenda dan Tanggal wajib diisi!', 'warning');
      return;
    }

    if (editingId) {
      updateKalender(editingId, formData);
      setEditingId(null);
      showToast('Agenda kalender berhasil diperbarui!', 'success');
    } else {
      addKalender(formData);
      showToast('Agenda baru berhasil ditambahkan ke kalender!', 'success');
    }

    // Reset
    setFormData({
      judul: '',
      tanggal: '2026-05-20',
      jamMulai: '08:30',
      jamSelesai: '12:00',
      lokasi: 'Gedung Guru PGRI Pasirwangi',
      penanggungJawab: '',
      deskripsi: '',
      kategori: 'Rapat',
      status: 'Akan Datang',
      linkInformasi: '',
    });
  };

  const startEdit = (item: KalenderItem) => {
    setEditingId(item.id);
    setFormData({
      judul: item.judul,
      tanggal: item.tanggal,
      jamMulai: item.jamMulai,
      jamSelesai: item.jamSelesai,
      lokasi: item.lokasi,
      penanggungJawab: item.penanggungJawab,
      deskripsi: item.deskripsi,
      kategori: item.kategori,
      status: item.status,
      linkInformasi: item.linkInformasi || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      judul: '',
      tanggal: '2026-05-20',
      jamMulai: '08:30',
      jamSelesai: '12:00',
      lokasi: 'Gedung Guru PGRI Pasirwangi',
      penanggungJawab: '',
      deskripsi: '',
      kategori: 'Rapat',
      status: 'Akan Datang',
      linkInformasi: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider mb-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Manajemen Jadwal</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Kelola Kalender Agenda & Kegiatan Cabang
          </h3>
          <p className="text-xs text-slate-500">
            Atur jadwal rapat cabang, upacara bendera, sosialisasi, dan pelatihan guru di wilayah Pasirwangi.
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
                <span>Edit Agenda Kalender</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 text-emerald-600" />
                <span>Tambah Agenda Baru</span>
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
            Judul Agenda Kegiatan <span className="text-emerald-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Rapat Koordinasi Persiapan HUT PGRI ke-81 & Hari Guru Nasional"
            value={formData.judul}
            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Tanggal (YYYY-MM-DD) <span className="text-emerald-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.tanggal}
              onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Jam Mulai</label>
            <input
              type="time"
              value={formData.jamMulai}
              onChange={(e) => setFormData({ ...formData, jamMulai: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Jam Selesai</label>
            <input
              type="time"
              value={formData.jamSelesai}
              onChange={(e) => setFormData({ ...formData, jamSelesai: e.target.value })}
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
                  kategori: e.target.value as KalenderItem['kategori'],
                })
              }
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            >
              <option value="Rapat">Rapat Koordinasi</option>
              <option value="Pelatihan">Pelatihan / Workshop</option>
              <option value="Upacara">Upacara / Apel</option>
              <option value="Sosialisasi">Sosialisasi</option>
              <option value="Lomba">Perlombaan / Porseni</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Lokasi Kegiatan</label>
            <input
              type="text"
              placeholder="Contoh: Sekretariat Cabang / Aula SMPN 1 Pasirwangi"
              value={formData.lokasi}
              onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Penanggung Jawab / PIC</label>
            <input
              type="text"
              placeholder="Nama Pengurus PIC"
              value={formData.penanggungJawab}
              onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Status Agenda</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as KalenderItem['status'],
                })
              }
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            >
              <option value="Akan Datang">Akan Datang</option>
              <option value="Sedang Berlangsung">Sedang Berlangsung</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tautan Informasi / Surat Undangan</label>
            <input
              type="url"
              placeholder="https://... (opsional)"
              value={formData.linkInformasi}
              onChange={(e) => setFormData({ ...formData, linkInformasi: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <label className="font-semibold text-slate-700 block">Keterangan / Catatan Agenda</label>
          <textarea
            rows={2}
            placeholder="Agenda pembahasan, pakaian seragam yang dikenakan, perlengkapan yang perlu dibawa..."
            value={formData.deskripsi}
            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
          />
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
            <span>{editingId ? 'Simpan Perubahan' : 'Jadwalkan Agenda'}</span>
          </button>
        </div>
      </form>

      {/* List Agenda */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900">
          Daftar Agenda Kalender ({kalenderList.length}):
        </h4>

        <div className="space-y-2.5">
          {kalenderList.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-all shadow-2xs flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center"
            >
              <div className="space-y-1 text-xs flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px]">
                    {item.tanggal}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                    {item.kategori}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Selesai'
                        ? 'bg-slate-100 text-slate-600'
                        : item.status === 'Sedang Berlangsung'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h5 className="font-bold text-sm text-slate-900">{item.judul}</h5>

                <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.jamMulai} - {item.jamSelesai}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {item.lokasi}
                  </span>
                  {item.penanggungJawab && (
                    <span className="flex items-center gap-1 text-slate-700">
                      <UserCheck className="h-3 w-3" />
                      {item.penanggungJawab}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() =>
                    updateKalender(item.id, {
                      status:
                        item.status === 'Akan Datang'
                          ? 'Sedang Berlangsung'
                          : item.status === 'Sedang Berlangsung'
                          ? 'Selesai'
                          : 'Akan Datang',
                    })
                  }
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Status
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Hapus agenda "${item.judul}"?`)) {
                      deleteKalender(item.id);
                      showToast('Agenda berhasil dihapus!', 'info');
                    }
                  }}
                  className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg"
                  title="Hapus"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

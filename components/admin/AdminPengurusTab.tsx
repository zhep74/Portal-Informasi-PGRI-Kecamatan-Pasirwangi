'use client';

import React, { useState, useRef } from 'react';
import { usePgriStore } from '@/lib/store';
import { PengurusItem } from '@/lib/types';
import { KetuaFotoUploader } from './KetuaFotoUploader';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import * as XLSX from 'xlsx';
import {
  Upload,
  Download,
  FileSpreadsheet,
  FileDown,
  Plus,
  Trash2,
  Edit3,
  Eye,
  X,
  CheckCircle2,
  Camera,
  Search,
  Building2,
  Briefcase,
  User,
  AlertCircle,
  Link as LinkIcon,
  Crop,
  Sliders,
} from 'lucide-react';
import { PrecisionPhotoCropModal } from './PrecisionPhotoCropModal';
import { compressImageFile } from '@/lib/imageCompressor';

export function AdminPengurusTab() {
  const { pengurusList, addPengurus, importPengurusBatch, updatePengurus, deletePengurus, showToast } = usePgriStore();

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Form state for adding new pengurus
  const [newPengurus, setNewPengurus] = useState({
    nama: '',
    jabatan: '',
    kategori: 'bidang' as PengurusItem['kategori'],
    fotoUrl: 'https://picsum.photos/seed/guru/400/400',
    periode: '2025 - 2030',
    unitKerja: 'SDN Pasirwangi',
    nip: '',
    nuptk: '',
    noUrut: 13,
    keteranganSingkat: '',
  });

  // Modal State for Viewing Pengurus
  const [viewingPengurus, setViewingPengurus] = useState<PengurusItem | null>(null);

  // Modal State for Editing Pengurus
  const [editingPengurus, setEditingPengurus] = useState<PengurusItem | null>(null);

  // Modal State for Deleting Pengurus (Verification Modal)
  const [deleteTarget, setDeleteTarget] = useState<PengurusItem | null>(null);

  // Modal State for Precision Photo Cropping & Framing in Circle
  const [cropModal, setCropModal] = useState<{
    isOpen: boolean;
    imageSrc: string;
    title: string;
    onSave: (url: string) => void;
  }>({
    isOpen: false,
    imageSrc: '',
    title: '',
    onSave: () => {},
  });

  // Import Excel State
  const [importPreviewData, setImportPreviewData] = useState<
    Array<{ nama: string; jabatan: string; unitKerja: string }>
  >([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // File input refs
  const importFileInputRef = useRef<HTMLInputElement>(null);
  const newFotoFileRef = useRef<HTMLInputElement>(null);
  const editFotoFileRef = useRef<HTMLInputElement>(null);
  const viewFotoFileRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // EXCEL EXPORT (Only 3 columns: Nama, Jabatan, Unit Kerja)
  // ==========================================
  const handleExportExcel = () => {
    if (pengurusList.length === 0) {
      showToast('Tidak ada data pengurus untuk diekspor', 'warning');
      return;
    }

    // Strictly 3 columns as requested: nama, jabatan, unit kerja
    const exportData = pengurusList.map((p) => ({
      Nama: p.nama,
      Jabatan: p.jabatan,
      'Unit Kerja': p.unitKerja || '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths for readability
    worksheet['!cols'] = [
      { wch: 32 }, // Nama
      { wch: 28 }, // Jabatan
      { wch: 32 }, // Unit Kerja
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Pengurus');

    const fileName = `Data_Pengurus_PGRI_Pasirwangi_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    showToast(`Data pengurus berhasil diekspor ke Excel (${pengurusList.length} orang)`, 'success');
  };

  // ==========================================
  // EXCEL TEMPLATE DOWNLOAD (3 columns)
  // ==========================================
  const handleDownloadTemplateExcel = () => {
    const templateData = [
      {
        Nama: 'H. Ahmad Sobari, S.Pd., M.M.Pd.',
        Jabatan: 'Ketua Cabang',
        'Unit Kerja': 'SMPN 1 Pasirwangi',
      },
      {
        Nama: 'Dra. Hj. Neneng Surtini, M.Pd.',
        Jabatan: 'Wakil Ketua I',
        'Unit Kerja': 'SDN Pasirwangi 2',
      },
      {
        Nama: 'Asep Saepuloh, S.Pd., M.Si.',
        Jabatan: 'Sekretaris',
        'Unit Kerja': 'SMPN 2 Pasirwangi',
      },
      {
        Nama: 'Rina Marlina, S.Pd.SD.',
        Jabatan: 'Bendahara',
        'Unit Kerja': 'SDN Barusari 1',
      },
      {
        Nama: 'Agus Gunawan, S.Pd.',
        Jabatan: 'Ketua Bidang Organisasi & Kaderisasi',
        'Unit Kerja': 'SDN Padaawas 1',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    worksheet['!cols'] = [{ wch: 35 }, { wch: 30 }, { wch: 30 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Pengurus');

    XLSX.writeFile(workbook, 'Template_Import_Pengurus_PGRI.xlsx');
    showToast('Template Excel berhasil diunduh. Kolom: Nama, Jabatan, Unit Kerja', 'success');
  };

  // ==========================================
  // EXCEL IMPORT (Reads Nama, Jabatan, Unit Kerja)
  // ==========================================
  const handleFileImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Parse to JSON array of objects
        const rawJson = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          showToast('Berkas Excel kosong atau format tidak sesuai!', 'error');
          return;
        }

        // Map and extract strictly: Nama, Jabatan, Unit Kerja
        const parsedRows: Array<{ nama: string; jabatan: string; unitKerja: string }> = [];

        rawJson.forEach((row) => {
          // Flexible key lookup to support various case combinations
          const namaVal =
            row['Nama'] ||
            row['nama'] ||
            row['NAMA'] ||
            row['Nama Pengurus'] ||
            row['Nama Lengkap'] ||
            '';
          const jabatanVal =
            row['Jabatan'] || row['jabatan'] || row['JABATAN'] || row['Posisi'] || '';
          const unitKerjaVal =
            row['Unit Kerja'] ||
            row['unitKerja'] ||
            row['UNIT KERJA'] ||
            row['unit_kerja'] ||
            row['Unit kerja'] ||
            row['Sekolah'] ||
            '';

          const nama = String(namaVal).trim();
          const jabatan = String(jabatanVal).trim();
          const unitKerja = String(unitKerjaVal).trim();

          if (nama || jabatan) {
            parsedRows.push({
              nama: nama || 'Tanpa Nama',
              jabatan: jabatan || 'Pengurus',
              unitKerja: unitKerja || 'Pasirwangi',
            });
          }
        });

        if (parsedRows.length === 0) {
          showToast(
            'Tidak ditemukan data pengurus yang valid. Pastikan header kolom adalah: Nama, Jabatan, Unit Kerja',
            'error'
          );
          return;
        }

        setImportPreviewData(parsedRows);
        setIsImportModalOpen(true);
      } catch (err) {
        console.error('Error parsing Excel file:', err);
        showToast('Gagal membaca berkas Excel. Pastikan file berformat .xlsx atau .xls', 'error');
      }
    };

    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const handleConfirmImport = () => {
    if (importPreviewData.length === 0) return;

    const itemsToImport = importPreviewData.map((row, idx) => ({
      nama: row.nama,
      jabatan: row.jabatan,
      kategori: 'bidang' as PengurusItem['kategori'],
      fotoUrl: `https://picsum.photos/seed/pengurus_${Date.now()}_${idx + 1}/400/400`,
      periode: '2025 - 2030',
      unitKerja: row.unitKerja,
      noUrut: pengurusList.length + idx + 1,
      keteranganSingkat: '',
    }));

    importPengurusBatch(itemsToImport);
    setIsImportModalOpen(false);
    setImportPreviewData([]);
  };

  // ==========================================
  // PHOTO UPLOADER HELPER (FileReader to base64)
  // ==========================================
  const handlePhotoFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar (JPG, PNG, WebP)', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 10MB', 'error');
      return;
    }

    try {
      const compressed = await compressImageFile(file, 600, 600, 0.85);
      onSuccess(compressed);
      showToast('Foto pengurus berhasil dipilih & dioptimalkan!', 'success');
    } catch {
      showToast('Gagal memproses gambar pengurus', 'error');
    } finally {
      e.target.value = '';
    }
  };

  // Filtered pengurus list
  const filteredList = pengurusList.filter(
    (p) =>
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.unitKerja && p.unitKerja.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Kelola Pengurus Organisasi</h3>
          <p className="text-xs text-slate-500">
            Total {pengurusList.length} orang pengurus terdaftar dalam struktur kepengurusan.
          </p>
        </div>
      </div>

      {/* Ketua PGRI Photo & Identity Spotlight Card */}
      <KetuaFotoUploader />

      {/* Hidden File Input for Excel Import */}
      <input
        ref={importFileInputRef}
        type="file"
        accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        className="hidden"
        onChange={handleFileImportChange}
      />

      {/* ======================================================== */}
      {/* SECTION: Tambah Pengurus Baru + EXCEL IMPORT / EXPORT / TEMPLATE */}
      {/* ======================================================== */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Tambah Pengurus Baru</h4>
              <p className="text-[11px] text-slate-500">
                Input satu per satu atau impor massal melalui file spreadsheet Excel.
              </p>
            </div>
          </div>

          {/* EXCEL ACTIONS BAR */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Download Template Excel */}
            <button
              type="button"
              onClick={handleDownloadTemplateExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors cursor-pointer border border-slate-200"
              title="Unduh template Excel berisikan kolom: Nama, Jabatan, Unit Kerja"
            >
              <FileDown className="h-3.5 w-3.5 text-blue-600" />
              <span>Template Excel</span>
            </button>

            {/* Import Excel */}
            <button
              type="button"
              onClick={() => importFileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-semibold text-xs transition-colors cursor-pointer border border-emerald-200"
              title="Unggah berkas Excel pengurus (Nama, Jabatan, Unit Kerja)"
            >
              <Upload className="h-3.5 w-3.5 text-emerald-700" />
              <span>Import Excel</span>
            </button>

            {/* Export Excel */}
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer shadow-xs"
              title="Ekspor seluruh pengurus ke file Excel (Nama, Jabatan, Unit Kerja)"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1 text-[11px]">
              Nama Lengkap & Gelar <span className="text-emerald-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Drs. H. Asep Sunandar, M.Pd."
              value={newPengurus.nama}
              onChange={(e) => setNewPengurus({ ...newPengurus, nama: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1 text-[11px]">
              Jabatan Resmi <span className="text-emerald-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Sekretaris Cabang"
              value={newPengurus.jabatan}
              onChange={(e) => setNewPengurus({ ...newPengurus, jabatan: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1 text-[11px]">
              Unit Kerja / Sekolah
            </label>
            <input
              type="text"
              placeholder="Contoh: SDN Pasirwangi 1"
              value={newPengurus.unitKerja}
              onChange={(e) => setNewPengurus({ ...newPengurus, unitKerja: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Photo Upload & Submit Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-1 border-t border-slate-100">
          {/* Photo Input (8 cols) */}
          <div className="sm:col-span-8 flex items-center gap-2.5">
            {/* Avatar circular preview */}
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-emerald-500/40 ring-2 ring-emerald-50/60 bg-slate-100 relative shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={newPengurus.fotoUrl || '/images/hero_pgri.jpg'}
                alt="Foto"
                className="w-full h-full object-cover"
              />
            </div>

            <input
              type="text"
              placeholder="URL Foto pengurus atau pilih berkas..."
              value={newPengurus.fotoUrl}
              onChange={(e) => setNewPengurus({ ...newPengurus, fotoUrl: e.target.value })}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <input
              ref={newFotoFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handlePhotoFileUpload(e, (url) => setNewPengurus((prev) => ({ ...prev, fotoUrl: url })))
              }
            />

            <button
              type="button"
              onClick={() => newFotoFileRef.current?.click()}
              className="cursor-pointer px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors border border-slate-200"
              title="Upload foto dari komputer atau HP"
            >
              <Camera className="h-3.5 w-3.5 text-emerald-700" />
              <span>Upload</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setCropModal({
                  isOpen: true,
                  imageSrc: newPengurus.fotoUrl || '/images/hero_pgri.jpg',
                  title: 'Atur Presisi Lingkaran Foto Pengurus',
                  onSave: (url) => {
                    setNewPengurus((prev) => ({ ...prev, fotoUrl: url }));
                    showToast('Foto presisi lingkaran diterapkan!', 'success');
                  },
                })
              }
              className="cursor-pointer px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors border border-emerald-200 shadow-2xs"
              title="Atur posisi zoom & perataan agar pas presisi di dalam bentuk lingkaran"
            >
              <Crop className="h-3.5 w-3.5 text-emerald-700" />
              <span>Atur Presisi Bundar</span>
            </button>
          </div>

          {/* Submit button (4 cols) */}
          <div className="sm:col-span-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (!newPengurus.nama.trim() || !newPengurus.jabatan.trim()) {
                  showToast('Nama dan Jabatan pengurus wajib diisi!', 'warning');
                  return;
                }
                addPengurus(newPengurus);
                setNewPengurus({
                  nama: '',
                  jabatan: '',
                  kategori: 'bidang',
                  fotoUrl: 'https://picsum.photos/seed/guru/400/400',
                  periode: '2025 - 2030',
                  unitKerja: 'SDN Pasirwangi',
                  nip: '',
                  nuptk: '',
                  noUrut: pengurusList.length + 1,
                  keteranganSingkat: '',
                });
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Simpan Pengurus</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION: TABEL PENGURUS DENGAN AKSI LIHAT, EDIT & HAPUS */}
      {/* ======================================================== */}
      <div className="space-y-3">
        {/* Table Filter / Search & Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="relative flex-1 max-w-sm">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama, jabatan, atau unit kerja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Menampilkan {filteredList.length} dari {pengurusList.length} pengurus
          </span>
        </div>

        {/* Table Container */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-16 text-center">Foto</th>
                  <th className="p-3">Nama Pengurus</th>
                  <th className="p-3">Jabatan</th>
                  <th className="p-3">Unit Kerja / Sekolah</th>
                  <th className="p-3 text-right w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      {searchTerm
                        ? `Tidak ada pengurus yang cocok dengan "${searchTerm}"`
                        : 'Belum ada data pengurus. Tambahkan data atau impor dari Excel.'}
                    </td>
                  </tr>
                ) : (
                  filteredList.map((p, pIdx) => (
                    <tr key={`${p.id}-${pIdx}`} className="hover:bg-slate-50/80 transition-colors">
                      {/* Photo Thumbnail (Circular) */}
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => setViewingPengurus(p)}
                          className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-emerald-500/40 ring-2 ring-emerald-50/60 bg-slate-100 hover:ring-2 hover:ring-emerald-500 transition-all inline-block cursor-pointer shadow-2xs"
                          title="Klik untuk melihat foto lebih besar & atur presisi lingkaran"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.fotoUrl || '/images/hero_pgri.jpg'}
                            alt={p.nama}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      </td>

                      {/* Name */}
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{p.nama}</div>
                        {p.nip && <div className="text-[10px] text-slate-400">NIP: {p.nip}</div>}
                      </td>

                      {/* Jabatan */}
                      <td className="p-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                          {p.jabatan}
                        </span>
                      </td>

                      {/* Unit Kerja */}
                      <td className="p-3 text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{p.unitKerja || '-'}</span>
                        </div>
                      </td>

                      {/* ACTIONS: Lihat, Presisi, Edit, Hapus */}
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* 1. LIHAT (VIEW) */}
                          <button
                            type="button"
                            onClick={() => setViewingPengurus(p)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Lihat Profil & Foto Pengurus"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* 1.5. ATUR PRESISI LINGKARAN */}
                          <button
                            type="button"
                            onClick={() =>
                              setCropModal({
                                isOpen: true,
                                imageSrc: p.fotoUrl || '/images/hero_pgri.jpg',
                                title: `Atur Presisi Foto Bundar: ${p.nama}`,
                                onSave: (url) => {
                                  updatePengurus(p.id, { fotoUrl: url });
                                  showToast(`Presisi foto ${p.nama} berhasil disimpan!`, 'success');
                                },
                              })
                            }
                            className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Atur Zoom & Posisi Foto Lingkaran"
                          >
                            <Crop className="h-4 w-4" />
                          </button>

                          {/* 2. EDIT */}
                          <button
                            type="button"
                            onClick={() => setEditingPengurus({ ...p })}
                            className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Pengurus & Upload Foto"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          {/* 3. HAPUS (DELETE - Menggunakan Modal Verifikasi) */}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(p)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Pengurus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: LIHAT (VIEW) PROFIL & UPLOAD FOTO PENGURUS */}
      {/* ======================================================== */}
      {viewingPengurus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                  <User className="h-4 w-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Detail Profil Pengurus</h4>
              </div>
              <button
                type="button"
                onClick={() => setViewingPengurus(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Big Photo (Circular) & Quick Upload / Precision Buttons */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-emerald-500/40 ring-4 ring-emerald-100/60 bg-slate-100 shadow-xl relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={viewingPengurus.fotoUrl || '/images/hero_pgri.jpg'}
                  alt={viewingPengurus.nama}
                  className="w-full h-full object-cover"
                />

                {/* Hover overlay to change photo or adjust precision */}
                <button
                  type="button"
                  onClick={() =>
                    setCropModal({
                      isOpen: true,
                      imageSrc: viewingPengurus.fotoUrl || '/images/hero_pgri.jpg',
                      title: `Atur Presisi Foto Bundar: ${viewingPengurus.nama}`,
                      onSave: (url) => {
                        updatePengurus(viewingPengurus.id, { fotoUrl: url });
                        setViewingPengurus((prev) => (prev ? { ...prev, fotoUrl: url } : null));
                        showToast('Presisi foto pengurus berhasil disimpan!', 'success');
                      },
                    })
                  }
                  className="absolute inset-0 bg-slate-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-semibold gap-1"
                >
                  <Crop className="h-5 w-5 text-emerald-400" />
                  <span>Atur Presisi Bundar</span>
                </button>
              </div>

              {/* Hidden file input for view modal */}
              <input
                ref={viewFotoFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handlePhotoFileUpload(e, (url) => {
                    updatePengurus(viewingPengurus.id, { fotoUrl: url });
                    setViewingPengurus((prev) => (prev ? { ...prev, fotoUrl: url } : null));
                    showToast('Foto pengurus berhasil diperbarui!', 'success');
                  })
                }
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => viewFotoFileRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
                >
                  <Camera className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Upload Foto</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setCropModal({
                      isOpen: true,
                      imageSrc: viewingPengurus.fotoUrl || '/images/hero_pgri.jpg',
                      title: `Atur Presisi Foto Bundar: ${viewingPengurus.nama}`,
                      onSave: (url) => {
                        updatePengurus(viewingPengurus.id, { fotoUrl: url });
                        setViewingPengurus((prev) => (prev ? { ...prev, fotoUrl: url } : null));
                        showToast('Presisi foto pengurus berhasil disimpan!', 'success');
                      },
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-emerald-200 shadow-2xs"
                  title="Atur Zoom & Posisi agar foto pas di lingkaran"
                >
                  <Crop className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Atur Presisi Lingkaran</span>
                </button>
              </div>
            </div>

            {/* Profile Info Cards */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3 text-xs border border-slate-200/80">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Nama Lengkap
                </span>
                <p className="font-bold text-slate-900 text-sm">{viewingPengurus.nama}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Jabatan
                  </span>
                  <p className="font-semibold text-emerald-700">{viewingPengurus.jabatan}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Unit Kerja
                  </span>
                  <p className="font-medium text-slate-700">{viewingPengurus.unitKerja || '-'}</p>
                </div>
              </div>

              {(viewingPengurus.nip || viewingPengurus.periode) && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 text-[11px]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Masa Bakti
                    </span>
                    <p className="text-slate-600">{viewingPengurus.periode || '2025 - 2030'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      NIP
                    </span>
                    <p className="text-slate-600">{viewingPengurus.nip || '-'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const target = viewingPengurus;
                  setViewingPengurus(null);
                  setDeleteTarget(target);
                }}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-rose-200"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Hapus Pengurus</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewingPengurus(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const target = viewingPengurus;
                    setViewingPengurus(null);
                    setEditingPengurus({ ...target });
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Lengkap</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT PENGURUS & UPLOAD FOTO */}
      {/* ======================================================== */}
      {editingPengurus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                  <Edit3 className="h-4 w-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Edit Data Pengurus & Foto</h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingPengurus(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Photo Section (Circular & Precision Controls) */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-emerald-500/40 ring-2 ring-emerald-100/60 bg-white relative shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editingPengurus.fotoUrl || '/images/hero_pgri.jpg'}
                  alt={editingPengurus.nama}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-700 block">
                    Foto Pengurus (Format Bundar):
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCropModal({
                        isOpen: true,
                        imageSrc: editingPengurus.fotoUrl || '/images/hero_pgri.jpg',
                        title: `Atur Presisi Foto Bundar: ${editingPengurus.nama}`,
                        onSave: (url) => {
                          setEditingPengurus((prev) => (prev ? { ...prev, fotoUrl: url } : null));
                          showToast('Foto presisi bundar diterapkan ke formulir!', 'success');
                        },
                      })
                    }
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Crop className="w-3.5 h-3.5" />
                    <span>Atur Presisi Bundar</span>
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="URL foto..."
                    value={editingPengurus.fotoUrl}
                    onChange={(e) =>
                      setEditingPengurus({ ...editingPengurus, fotoUrl: e.target.value })
                    }
                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    ref={editFotoFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handlePhotoFileUpload(e, (url) =>
                        setEditingPengurus((prev) => (prev ? { ...prev, fotoUrl: url } : null))
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => editFotoFileRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                    title="Pilih foto baru dari file"
                  >
                    <Upload className="h-3 w-3" />
                    <span>Upload</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCropModal({
                        isOpen: true,
                        imageSrc: editingPengurus.fotoUrl || '/images/hero_pgri.jpg',
                        title: `Atur Presisi Foto Bundar: ${editingPengurus.nama}`,
                        onSave: (url) => {
                          setEditingPengurus((prev) => (prev ? { ...prev, fotoUrl: url } : null));
                          showToast('Foto presisi bundar diterapkan ke formulir!', 'success');
                        },
                      })
                    }
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                    title="Atur zoom & geser foto agar pas presisi di dalam lingkaran"
                  >
                    <Crop className="h-3 w-3" />
                    <span>Presisi</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Input Form Fields */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nama Lengkap & Gelar <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  value={editingPengurus.nama}
                  onChange={(e) => setEditingPengurus({ ...editingPengurus, nama: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Jabatan <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingPengurus.jabatan}
                    onChange={(e) =>
                      setEditingPengurus({ ...editingPengurus, jabatan: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Unit Kerja / Sekolah
                  </label>
                  <input
                    type="text"
                    value={editingPengurus.unitKerja}
                    onChange={(e) =>
                      setEditingPengurus({ ...editingPengurus, unitKerja: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NIP (Opsional)</label>
                  <input
                    type="text"
                    value={editingPengurus.nip || ''}
                    onChange={(e) =>
                      setEditingPengurus({ ...editingPengurus, nip: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Masa Bakti</label>
                  <input
                    type="text"
                    value={editingPengurus.periode}
                    onChange={(e) =>
                      setEditingPengurus({ ...editingPengurus, periode: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const target = editingPengurus;
                  setEditingPengurus(null);
                  setDeleteTarget(target);
                }}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-rose-200"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Hapus Pengurus</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPengurus(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!editingPengurus.nama.trim() || !editingPengurus.jabatan.trim()) {
                      showToast('Nama dan Jabatan wajib diisi!', 'warning');
                      return;
                    }
                    updatePengurus(editingPengurus.id, editingPengurus);
                    setEditingPengurus(null);
                    showToast('Perubahan data pengurus berhasil disimpan!', 'success');
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: KONFIRMASI IMPORT EXCEL */}
      {/* ======================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                  <FileSpreadsheet className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Konfirmasi Impor Data Excel</h4>
                  <p className="text-[11px] text-slate-500">
                    Ditemukan {importPreviewData.length} baris data pengurus siap dimasukkan.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Preview Table */}
            <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 w-10 text-center">#</th>
                    <th className="p-2.5">Nama</th>
                    <th className="p-2.5">Jabatan</th>
                    <th className="p-2.5">Unit Kerja</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {importPreviewData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 text-center text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="p-2.5 font-bold text-slate-900">{row.nama}</td>
                      <td className="p-2.5 text-emerald-700 font-medium">{row.jabatan}</td>
                      <td className="p-2.5 text-slate-600">{row.unitKerja}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Data di atas akan ditambahkan ke daftar pengurus saat ini. Anda dapat mengunggah foto
                masing-masing pengurus melalui tombol <strong>Edit</strong> atau <strong>Lihat</strong> pada tabel setelah impor selesai.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Impor {importPreviewData.length} Pengurus Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: VERIFIKASI HAPUS PENGURUS */}
      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        title="Hapus Data Pengurus?"
        itemName={deleteTarget ? `${deleteTarget.nama} (${deleteTarget.jabatan})` : ''}
        itemType="Pengurus"
        description="Data pengurus ini akan dihapus dari daftar kepengurusan cabang dan basis data Supabase."
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deletePengurus(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />

      {/* MODAL 5: PENGATURAN PRESISI FOTO LINGKARAN */}
      <PrecisionPhotoCropModal
        isOpen={cropModal.isOpen}
        imageSrc={cropModal.imageSrc}
        title={cropModal.title}
        onClose={() => setCropModal((prev) => ({ ...prev, isOpen: false }))}
        onSave={cropModal.onSave}
      />
    </div>
  );
}

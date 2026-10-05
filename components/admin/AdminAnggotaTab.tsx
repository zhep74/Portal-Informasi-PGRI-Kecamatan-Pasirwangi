'use client';

import React, { useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import { usePgriStore } from '@/lib/store';
import { AnggotaItem } from '@/lib/types';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { compressImageFile } from '@/lib/imageCompressor';
import { SUPABASE_ANGGOTA_SQL } from '@/lib/supabase';
import { PgriLogo } from '@/components/PgriLogo';
import * as XLSX from 'xlsx';
import {
  Users,
  Plus,
  Upload,
  Download,
  FileSpreadsheet,
  FileCode,
  Search,
  Filter,
  Trash2,
  Edit3,
  Eye,
  X,
  CheckCircle2,
  Camera,
  Phone,
  MessageCircle,
  Copy,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  School,
  Building2,
  Calendar,
  MapPin,
  IdCard,
  Printer,
  Sparkles,
  AlertCircle,
  RefreshCw,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

const ITEMS_PER_PAGE = 20;

export function AdminAnggotaTab() {
  const {
    anggotaList,
    addAnggota,
    updateAnggota,
    deleteAnggota,
    importAnggotaBatch,
    clearAllAnggota,
    profile,
    showToast,
  } = usePgriStore();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRanting, setSelectedRanting] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAnggota, setEditingAnggota] = useState<AnggotaItem | null>(null);
  const [viewingAnggota, setViewingAnggota] = useState<AnggotaItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AnggotaItem | null>(null);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Import preview state
  const [importPreviewList, setImportPreviewList] = useState<Array<Omit<AnggotaItem, 'id'>>>([]);
  const importFileInputRef = useRef<HTMLInputElement>(null);

  // Form State for Create / Edit
  const initialFormState: Omit<AnggotaItem, 'id'> = {
    nama: '',
    npa: '',
    nik: '',
    tempatLahir: '',
    tanggalLahir: '',
    foto: '',
    noTelepon: '',
    unitKerja: '',
    ranting: 'Ranting Pasirwangi',
    statusKeanggotaan: 'Aktif',
    jenisKelamin: 'Laki-laki',
    email: '',
    alamat: '',
  };

  const [formData, setFormData] = useState<Omit<AnggotaItem, 'id'>>(initialFormState);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Unique lists for filters
  const rantingOptions = [
    'Ranting Pasirwangi',
    'Ranting Barusari',
    'Ranting Padaawas',
    'Ranting Sarimukti',
    'Ranting Sirnajaya',
    'Ranting Talaga',
    'Ranting Padamukti',
    'Ranting Karyamekar',
    'Ranting Padamulya',
  ];

  // Filtered and Searched Members
  const filteredList = useMemo(() => {
    return anggotaList.filter((a) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        a.nama.toLowerCase().includes(q) ||
        a.npa.toLowerCase().includes(q) ||
        a.nik.toLowerCase().includes(q) ||
        a.tempatLahir.toLowerCase().includes(q) ||
        a.noTelepon.toLowerCase().includes(q) ||
        (a.unitKerja && a.unitKerja.toLowerCase().includes(q)) ||
        (a.ranting && a.ranting.toLowerCase().includes(q));

      const matchRanting = selectedRanting === 'all' || a.ranting === selectedRanting;
      const matchStatus =
        selectedStatus === 'all' || (a.statusKeanggotaan || 'Aktif') === selectedStatus;

      return matchSearch && matchRanting && matchStatus;
    });
  }, [anggotaList, searchTerm, selectedRanting, selectedStatus]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredList.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredList.length);
  const paginatedList = filteredList.slice(startIndex, endIndex);

  // Reset to page 1 on search or filter change
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleRantingChange = (val: string) => {
    setSelectedRanting(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    setCurrentPage(1);
  };

  // Generate Suggested NPA
  const generateSuggestedNPA = () => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const suggested = `10.05.12.${randomSuffix}`;
    setFormData((prev) => ({ ...prev, npa: suggested }));
    showToast(`NPA disarankan dibuat: ${suggested}`, 'info');
  };

  // Image upload with Canvas Compression
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Pilih berkas foto gambar (JPG, PNG, atau WebP)!', 'error');
      return;
    }

    try {
      const compressed = await compressImageFile(file, 600, 600, 0.85);
      setFormData((prev) => ({ ...prev, foto: compressed }));
      showToast('Foto anggota berhasil dipilih dan dioptimalkan!', 'success');
    } catch {
      showToast('Gagal memproses foto anggota.', 'error');
    } finally {
      e.target.value = '';
    }
  };

  // Open Form Create
  const handleOpenCreate = () => {
    setFormData({
      ...initialFormState,
      npa: `10.05.12.${String(anggotaList.length + 1).padStart(5, '0')}`,
    });
    setEditingAnggota(null);
    setIsAddModalOpen(true);
  };

  // Open Form Edit
  const handleOpenEdit = (item: AnggotaItem) => {
    setEditingAnggota(item);
    setFormData({
      nama: item.nama,
      npa: item.npa,
      nik: item.nik,
      tempatLahir: item.tempatLahir,
      tanggalLahir: item.tanggalLahir,
      foto: item.foto || '',
      noTelepon: item.noTelepon,
      unitKerja: item.unitKerja || '',
      ranting: item.ranting || 'Ranting Pasirwangi',
      statusKeanggotaan: item.statusKeanggotaan || 'Aktif',
      jenisKelamin: item.jenisKelamin || 'Laki-laki',
      email: item.email || '',
      alamat: item.alamat || '',
    });
    setIsAddModalOpen(true);
  };

  // Submit Form (Create or Update)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama.trim()) {
      showToast('Nama Lengkap wajib diisi!', 'warning');
      return;
    }

    if (!formData.npa.trim()) {
      showToast('Nomor Pokok Anggota (NPA) wajib diisi!', 'warning');
      return;
    }

    if (!formData.nik.trim()) {
      showToast('Nomor Induk Kependudukan (NIK) wajib diisi!', 'warning');
      return;
    }

    if (editingAnggota) {
      updateAnggota(editingAnggota.id, formData);
      setIsAddModalOpen(false);
      setEditingAnggota(null);
    } else {
      addAnggota(formData);
      setIsAddModalOpen(false);
    }
  };

  // ==========================================
  // EXCEL EXPORT (Semua Data Anggota)
  // ==========================================
  const handleExportExcel = () => {
    if (anggotaList.length === 0) {
      showToast('Tidak ada data anggota untuk diekspor.', 'warning');
      return;
    }

    const exportRows = anggotaList.map((a, idx) => ({
      'No.': idx + 1,
      'Nama Lengkap': a.nama,
      'NPA PGRI': a.npa,
      'NIK KTP': a.nik,
      'Tempat Lahir': a.tempatLahir,
      'Tanggal Lahir': a.tanggalLahir,
      'No. Telepon / WA': a.noTelepon,
      'Unit Kerja / Sekolah': a.unitKerja || '-',
      'Ranting PGRI': a.ranting || 'Pasirwangi',
      'Status Keanggotaan': a.statusKeanggotaan || 'Aktif',
      'Jenis Kelamin': a.jenisKelamin || 'Laki-laki',
      Email: a.email || '-',
      'Alamat Domisili': a.alamat || '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 32 },
      { wch: 18 },
      { wch: 20 },
      { wch: 16 },
      { wch: 15 },
      { wch: 18 },
      { wch: 26 },
      { wch: 20 },
      { wch: 16 },
      { wch: 15 },
      { wch: 26 },
      { wch: 35 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar Anggota PGRI');

    const todayStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `Data_Anggota_PGRI_Pasirwangi_${todayStr}.xlsx`);
    showToast(`Berhasil mengekspor ${anggotaList.length} data anggota ke Excel!`, 'success');
  };

  // ==========================================
  // DOWNLOAD TEMPLATE EXCEL
  // ==========================================
  const handleDownloadTemplate = () => {
    const templateRows = [
      {
        'Nama Lengkap': 'H. Ahmad Sobari, S.Pd., M.M.Pd.',
        'NPA PGRI': '10.05.12.00001',
        'NIK KTP': '3205121405710002',
        'Tempat Lahir': 'Garut',
        'Tanggal Lahir': '1971-05-14',
        'No. Telepon / WA': '081223456789',
        'Unit Kerja / Sekolah': 'SMPN 1 Pasirwangi',
        'Ranting PGRI': 'Ranting Pasirwangi',
        'Status Keanggotaan': 'Aktif',
        'Jenis Kelamin': 'Laki-laki',
        Email: 'ahmad.sobari@gmail.com',
        'Alamat Domisili': 'Jl. Raya Pasirwangi No. 14, Desa Pasirwangi',
      },
      {
        'Nama Lengkap': 'Dra. Hj. Nunung Rohanah, M.Pd.',
        'NPA PGRI': '10.05.12.00002',
        'NIK KTP': '3205125208690001',
        'Tempat Lahir': 'Garut',
        'Tanggal Lahir': '1969-08-12',
        'No. Telepon / WA': '081394123456',
        'Unit Kerja / Sekolah': 'SDN 1 Pasirwangi',
        'Ranting PGRI': 'Ranting Pasirwangi',
        'Status Keanggotaan': 'Aktif',
        'Jenis Kelamin': 'Perempuan',
        Email: 'nunung.rohanah@gmail.com',
        'Alamat Domisili': 'Kp. Pasirwangi Hilir RT 02/04',
      },
      {
        'Nama Lengkap': 'Dudi Supriadi, S.Pd., Gr.',
        'NPA PGRI': '10.05.12.00003',
        'NIK KTP': '3205122104840003',
        'Tempat Lahir': 'Bandung',
        'Tanggal Lahir': '1984-04-21',
        'No. Telepon / WA': '085220789012',
        'Unit Kerja / Sekolah': 'SDN 2 Barusari',
        'Ranting PGRI': 'Ranting Barusari',
        'Status Keanggotaan': 'Aktif',
        'Jenis Kelamin': 'Laki-laki',
        Email: 'dudi.supriadi@guru.id',
        'Alamat Domisili': 'Desa Barusari RT 01/03',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateRows);
    worksheet['!cols'] = [
      { wch: 32 },
      { wch: 18 },
      { wch: 20 },
      { wch: 16 },
      { wch: 15 },
      { wch: 18 },
      { wch: 26 },
      { wch: 20 },
      { wch: 16 },
      { wch: 15 },
      { wch: 26 },
      { wch: 35 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Anggota');

    XLSX.writeFile(workbook, 'Template_Import_Anggota_PGRI_Pasirwangi.xlsx');
    showToast('Template Excel berhasil diunduh. Silakan isi data sesuai kolom.', 'success');
  };

  // ==========================================
  // EXCEL IMPORT PARSER
  // ==========================================
  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });
        if (!rawData || rawData.length === 0) {
          showToast('Berkas Excel kosong atau format tabel tidak terbaca!', 'error');
          return;
        }

        const parsedRows: Array<Omit<AnggotaItem, 'id'>> = [];

        rawData.forEach((row, idx) => {
          // Flexible column lookup
          const namaVal =
            row['Nama Lengkap'] ||
            row['Nama'] ||
            row['nama'] ||
            row['NAMA'] ||
            row['NAMA LENGKAP'] ||
            '';
          const npaVal =
            row['NPA PGRI'] ||
            row['NPA'] ||
            row['npa'] ||
            row['No Anggota'] ||
            row['Nomor Anggota'] ||
            `10.05.12.${String(anggotaList.length + idx + 1).padStart(5, '0')}`;
          const nikVal =
            row['NIK KTP'] || row['NIK'] || row['nik'] || row['No KTP'] || '';
          const tempatVal =
            row['Tempat Lahir'] || row['tempat_lahir'] || row['Tempat'] || 'Garut';
          const tanggalVal =
            row['Tanggal Lahir'] || row['tanggal_lahir'] || row['Tgl Lahir'] || '1985-01-01';
          const telpVal =
            row['No. Telepon / WA'] ||
            row['No Telepon'] ||
            row['No HP'] ||
            row['No WA'] ||
            row['Telepon'] ||
            '081234567890';
          const unitVal =
            row['Unit Kerja / Sekolah'] ||
            row['Unit Kerja'] ||
            row['Sekolah'] ||
            row['Instansi'] ||
            '';
          const rantingVal =
            row['Ranting PGRI'] || row['Ranting'] || 'Ranting Pasirwangi';
          const statusVal =
            (row['Status Keanggotaan'] || row['Status'] || 'Aktif') as AnggotaItem['statusKeanggotaan'];
          const jkVal =
            (row['Jenis Kelamin'] || row['Gender'] || 'Laki-laki') as AnggotaItem['jenisKelamin'];
          const emailVal = row['Email'] || row['email'] || '';
          const alamatVal = row['Alamat Domisili'] || row['Alamat'] || '';

          const nama = String(namaVal).trim();
          if (nama) {
            parsedRows.push({
              nama,
              npa: String(npaVal).trim(),
              nik: String(nikVal).trim(),
              tempatLahir: String(tempatVal).trim(),
              tanggalLahir: String(tanggalVal).trim(),
              foto: '',
              noTelepon: String(telpVal).trim(),
              unitKerja: String(unitVal).trim(),
              ranting: String(rantingVal).trim(),
              statusKeanggotaan: (statusVal as any) || 'Aktif',
              jenisKelamin: (jkVal as any) || 'Laki-laki',
              email: String(emailVal).trim(),
              alamat: String(alamatVal).trim(),
            });
          }
        });

        if (parsedRows.length === 0) {
          showToast('Tidak ada data nama yang valid di dalam file Excel!', 'warning');
          return;
        }

        setImportPreviewList(parsedRows);
        setIsImportModalOpen(true);
      } catch (err) {
        showToast('Gagal memproses file Excel. Pastikan format tabel sesuai template!', 'error');
      } finally {
        e.target.value = '';
      }
    };

    reader.readAsBinaryString(file);
  };

  // Confirm Import
  const handleConfirmImport = () => {
    if (importPreviewList.length === 0) return;
    importAnggotaBatch(importPreviewList);
    setIsImportModalOpen(false);
    setImportPreviewList([]);
  };

  // Copy SQL to Clipboard
  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_ANGGOTA_SQL);
    setCopiedSql(true);
    showToast('Skrip SQL Supabase berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // Helper date formatter
  const formatDateIndo = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const [year, month, day] = dateStr.split('-');
      if (!year || !month || !day) return dateStr;
      const months = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ];
      const mIdx = parseInt(month, 10) - 1;
      return `${parseInt(day, 10)} ${months[mIdx] || month} ${year}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-slate-50 border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
                <span>Daftar Anggota PGRI</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {anggotaList.length} Anggota Terdata
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sistem Informasi Manajemen Keanggotaan (SIM) Cabang Kecamatan Pasirwangi
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Tombol Tambah Anggota */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Anggota</span>
          </button>

          {/* Tombol Export Excel */}
          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-emerald-700 border border-emerald-300 text-xs font-semibold rounded-xl shadow-2xs transition-all cursor-pointer"
            title="Ekspor seluruh data anggota ke Excel (.xlsx)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>

          {/* Tombol Import Excel */}
          <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl shadow-2xs transition-all cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import Excel</span>
            <input
              type="file"
              ref={importFileInputRef}
              accept=".xlsx, .xls"
              onChange={handleImportFileChange}
              className="hidden"
            />
          </label>

          {/* Tombol Unduh Template */}
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl shadow-2xs transition-all cursor-pointer"
            title="Unduh format template Excel untuk data anggota baru"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Template Excel</span>
          </button>

          {/* Tombol Skrip SQL Supabase */}
          <button
            type="button"
            onClick={() => setIsSqlModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-2xs transition-all cursor-pointer"
            title="Lihat skrip SQL untuk membuat tabel public.pgri_anggota di Supabase"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>Skrip SQL Supabase</span>
          </button>
        </div>
      </div>

      {/* 2. Search, Filter & Quick Count Indicator */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari Nama, NPA, NIK, Tempat Lahir, atau No Telepon..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Ranting */}
          <select
            value={selectedRanting}
            onChange={(e) => handleRantingChange(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Ranting ({anggotaList.length})</option>
            {rantingOptions.map((r) => (
              <option key={r} value={r}>
                {r} ({anggotaList.filter((a) => a.ranting === r).length})
              </option>
            ))}
          </select>

          {/* Filter Status */}
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Cuti">Cuti</option>
            <option value="Pensiun">Pensiun</option>
            <option value="Mutasi">Mutasi</option>
          </select>
        </div>

        {/* Counter Info */}
        <div className="text-xs text-slate-500 whitespace-nowrap self-end md:self-center font-medium">
          Ditemukan <span className="font-bold text-slate-800">{filteredList.length}</span> anggota
          {filteredList.length > 0 && (
            <span> (Hal. {validCurrentPage} dari {totalPages})</span>
          )}
        </div>
      </div>

      {/* 3. Main Data Table with 20 items pagination */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 text-center w-12">No</th>
                <th className="py-3 px-3 text-center w-14">Foto</th>
                <th className="py-3 px-3">Nama Lengkap & Unit Kerja</th>
                <th className="py-3 px-3">NPA PGRI</th>
                <th className="py-3 px-3">NIK KTP</th>
                <th className="py-3 px-3">Tempat, Tanggal Lahir</th>
                <th className="py-3 px-3">No. Telepon / WA</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-slate-600">Tidak ada data anggota ditemukan</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Coba sesuaikan kata kunci pencarian atau tambah data anggota baru.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedList.map((item, index) => {
                  const rowNumber = startIndex + index + 1;
                  const cleanPhone = item.noTelepon ? item.noTelepon.replace(/[^0-9]/g, '') : '';
                  const waNumber = cleanPhone.startsWith('0')
                    ? '62' + cleanPhone.substring(1)
                    : cleanPhone;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* No */}
                      <td className="py-3 px-3 text-center text-slate-500 font-medium">
                        {rowNumber}
                      </td>

                      {/* Foto */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => setViewingAnggota(item)}
                          className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 inline-block shadow-2xs hover:scale-105 transition-transform"
                          title="Klik untuk melihat kartu KTA"
                        >
                          {item.foto ? (
                            <Image
                              src={item.foto}
                              alt={item.nama}
                              fill
                              sizes="40px"
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold text-xs">
                              {item.nama.charAt(0)}
                            </div>
                          )}
                        </button>
                      </td>

                      {/* Nama Lengkap & Unit Kerja */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {item.nama}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 flex-wrap">
                          <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                            <School className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{item.unitKerja || 'Belum diisi'}</span>
                          </span>
                          {item.ranting && (
                            <>
                              <span>•</span>
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px]">
                                {item.ranting}
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* NPA */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200/80">
                          {item.npa}
                        </span>
                      </td>

                      {/* NIK */}
                      <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600">
                        {item.nik || '-'}
                      </td>

                      {/* Tempat, Tanggal Lahir */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">
                          {item.tempatLahir || '-'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {formatDateIndo(item.tanggalLahir)}
                        </div>
                      </td>

                      {/* No Telepon / WA */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {item.noTelepon ? (
                          <a
                            href={`https://wa.me/${waNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium hover:underline"
                            title="Kirim pesan WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{item.noTelepon}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.statusKeanggotaan === 'Aktif' || !item.statusKeanggotaan
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.statusKeanggotaan === 'Cuti'
                              ? 'bg-amber-100 text-amber-800'
                              : item.statusKeanggotaan === 'Pensiun'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.statusKeanggotaan || 'Aktif'}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          {/* Lihat KTA */}
                          <button
                            type="button"
                            onClick={() => setViewingAnggota(item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            title="Lihat KTA Digital"
                          >
                            <IdCard className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                            title="Edit Data Anggota"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Hapus */}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="Hapus Anggota"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (20 per page) */}
        {filteredList.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200 gap-3 text-xs">
            <div className="text-slate-500">
              Menampilkan <span className="font-semibold text-slate-800">{startIndex + 1}</span> -{' '}
              <span className="font-semibold text-slate-800">{endIndex}</span> dari{' '}
              <span className="font-bold text-slate-900">{filteredList.length}</span> anggota
            </div>

            <div className="flex items-center gap-1">
              {/* First Page */}
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={validCurrentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Halaman Pertama"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Prev Page */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validCurrentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                // Show only nearby pages if totalPages is large
                if (
                  pg === 1 ||
                  pg === totalPages ||
                  (pg >= validCurrentPage - 1 && pg <= validCurrentPage + 1)
                ) {
                  return (
                    <button
                      key={pg}
                      type="button"
                      onClick={() => setCurrentPage(pg)}
                      className={`min-w-[32px] h-8 px-2 rounded-lg font-semibold transition-all ${
                        validCurrentPage === pg
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pg}
                    </button>
                  );
                } else if (pg === validCurrentPage - 2 || pg === validCurrentPage + 2) {
                  return (
                    <span key={pg} className="px-1 text-slate-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              {/* Next Page */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validCurrentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Halaman Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last Page */}
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={validCurrentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Halaman Terakhir"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          MODAL: TAMBAH / EDIT ANGGOTA
          ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {editingAnggota ? 'Edit Data Anggota' : 'Tambah Anggota Baru'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    SIM PGRI Cabang Kecamatan Pasirwangi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Photo Upload Section */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center shrink-0">
                  {formData.foto ? (
                    <Image
                      src={formData.foto}
                      alt="Foto Anggota"
                      fill
                      sizes="80px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Camera className="w-7 h-7 text-slate-400" />
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Foto Profil / Pas Foto KTA
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Format JPG, PNG, atau WebP. Gambar dikompresi otomatis agar hemat kuota.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{formData.foto ? 'Ganti Foto' : 'Unggah Foto'}</span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {formData.foto && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, foto: '' }))}
                        className="text-xs text-rose-600 hover:underline"
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama Lengkap */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: H. Ahmad Sobari, S.Pd., M.M.Pd."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* NPA */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      NPA PGRI <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={generateSuggestedNPA}
                      className="text-[10px] text-emerald-600 hover:underline font-semibold"
                    >
                      Sarankan NPA
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.npa}
                    onChange={(e) => setFormData({ ...formData, npa: e.target.value })}
                    placeholder="Contoh: 10.05.12.00123"
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* NIK */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    NIK KTP (16 Digit) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={formData.nik}
                    onChange={(e) =>
                      setFormData({ ...formData, nik: e.target.value.replace(/[^0-9]/g, '') })
                    }
                    placeholder="Contoh: 3205121405710002"
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Tempat Lahir */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Tempat Lahir <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tempatLahir}
                    onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                    placeholder="Contoh: Garut"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Tanggal Lahir */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Tanggal Lahir <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalLahir}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* No Telepon / WA */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    No. Telepon / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.noTelepon}
                    onChange={(e) => setFormData({ ...formData, noTelepon: e.target.value })}
                    placeholder="Contoh: 081223456789"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Unit Kerja / Sekolah */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Unit Kerja / Sekolah</label>
                  <input
                    type="text"
                    value={formData.unitKerja}
                    onChange={(e) => setFormData({ ...formData, unitKerja: e.target.value })}
                    placeholder="Contoh: SMPN 1 Pasirwangi / SDN 2 Barusari"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Ranting PGRI */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Ranting PGRI</label>
                  <select
                    value={formData.ranting}
                    onChange={(e) => setFormData({ ...formData, ranting: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {rantingOptions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Keanggotaan */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Status Keanggotaan</label>
                  <select
                    value={formData.statusKeanggotaan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        statusKeanggotaan: e.target.value as AnggotaItem['statusKeanggotaan'],
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Cuti">Cuti</option>
                    <option value="Pensiun">Pensiun</option>
                    <option value="Mutasi">Mutasi</option>
                  </select>
                </div>

                {/* Jenis Kelamin */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Jenis Kelamin</label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jenisKelamin: e.target.value as AnggotaItem['jenisKelamin'],
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Alamat Email (Opsional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Contoh: guru@gmail.com"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Alamat Domisili */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Alamat Domisili</label>
                  <textarea
                    rows={2}
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    placeholder="Contoh: Kp. Pasirwangi Tonggoh RT 01 RW 04, Desa Pasirwangi, Garut"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingAnggota ? 'Simpan Perubahan' : 'Tambah Anggota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: KARTU DIGITAL / KTA ANGGOTA (DETAIL VIEW)
          ======================================================== */}
      {viewingAnggota && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IdCard className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Kartu Tanda Anggota (KTA) Digital
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setViewingAnggota(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable KTA Card View */}
            <div className="p-6">
              <div className="relative rounded-2xl p-5 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white shadow-xl border border-emerald-500/40 overflow-hidden">
                {/* Background Watermark PGRI Emblem */}
                <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                  <PgriLogo size={220} />
                </div>

                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-emerald-600/50 pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <PgriLogo size={36} className="shrink-0 drop-shadow-sm" />
                    <div>
                      <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest leading-none">
                        Persatuan Guru Republik Indonesia
                      </div>
                      <div className="text-xs font-extrabold text-white tracking-tight mt-0.5">
                        Cabang Kecamatan Pasirwangi
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-700/60 border border-emerald-400/40 text-emerald-200">
                    KTA RESMI
                  </span>
                </div>

                {/* Card Content Grid */}
                <div className="flex gap-4 items-start">
                  {/* Member Photo */}
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-slate-800 border-2 border-amber-400 shadow-md shrink-0">
                    {viewingAnggota.foto ? (
                      <Image
                        src={viewingAnggota.foto}
                        alt={viewingAnggota.nama}
                        fill
                        sizes="80px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-950 text-emerald-200 font-bold text-xl">
                        {viewingAnggota.nama.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Member Details */}
                  <div className="flex-1 space-y-1.5 text-xs">
                    <div>
                      <div className="text-[10px] text-emerald-300 uppercase font-semibold">
                        Nama Lengkap
                      </div>
                      <div className="font-extrabold text-sm text-white tracking-tight">
                        {viewingAnggota.nama}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <div className="text-[9px] text-emerald-300 uppercase font-semibold">
                          NPA PGRI
                        </div>
                        <div className="font-mono font-bold text-amber-300">
                          {viewingAnggota.npa}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-emerald-300 uppercase font-semibold">
                          NIK
                        </div>
                        <div className="font-mono text-slate-200">
                          {viewingAnggota.nik || '-'}
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px]">
                      <div className="text-[9px] text-emerald-300 uppercase font-semibold">
                        Tempat, Tanggal Lahir
                      </div>
                      <div className="text-slate-200">
                        {viewingAnggota.tempatLahir}, {formatDateIndo(viewingAnggota.tanggalLahir)}
                      </div>
                    </div>

                    <div className="text-[11px]">
                      <div className="text-[9px] text-emerald-300 uppercase font-semibold">
                        Unit Kerja & Ranting
                      </div>
                      <div className="text-slate-200 font-medium">
                        {viewingAnggota.unitKerja || '-'} ({viewingAnggota.ranting || 'Pasirwangi'})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Barcode Dummy */}
                <div className="mt-4 pt-3 border-t border-emerald-600/40 flex items-center justify-between text-[10px] text-emerald-300">
                  <div className="flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-300" />
                    <span className="font-mono tracking-wider">{viewingAnggota.npa}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-emerald-400">Garut, Jawa Barat</div>
                    <div className="font-semibold text-white">Masa Berlaku: Aktif</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `*KTA PGRI Cabang Pasirwangi*\nNama: ${viewingAnggota.nama}\nNPA: ${viewingAnggota.npa}\nNIK: ${viewingAnggota.nik}\nUnit Kerja: ${viewingAnggota.unitKerja}`
                    );
                    showToast('Data KTA berhasil disalin!', 'success');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Data KTA</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Simpan PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: PREVIEW IMPORT EXCEL
          ======================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Pratinjau Impor Data Excel</h4>
                  <p className="text-[11px] text-slate-400">
                    Ditemukan {importPreviewList.length} data anggota siap diimpor
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Table */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">No</th>
                      <th className="py-2 px-3">Nama Lengkap</th>
                      <th className="py-2 px-3">NPA</th>
                      <th className="py-2 px-3">NIK</th>
                      <th className="py-2 px-3">Tempat, Tgl Lahir</th>
                      <th className="py-2 px-3">No Telepon</th>
                      <th className="py-2 px-3">Unit Kerja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {importPreviewList.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-slate-500 font-medium">{idx + 1}</td>
                        <td className="py-2 px-3 font-semibold text-slate-800">{row.nama}</td>
                        <td className="py-2 px-3 font-mono text-[11px]">{row.npa}</td>
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-600">
                          {row.nik || '-'}
                        </td>
                        <td className="py-2 px-3 text-[11px]">
                          {row.tempatLahir}, {row.tanggalLahir}
                        </td>
                        <td className="py-2 px-3 text-[11px]">{row.noTelepon}</td>
                        <td className="py-2 px-3 text-[11px] text-slate-600">
                          {row.unitKerja || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="text-xs text-slate-500">
                Data akan ditambahkan ke sistem lokal & disinkronkan ke Supabase.
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  Simpan & Impor {importPreviewList.length} Anggota
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: SKRIP SQL SUPABASE
          ======================================================== */}
      {isSqlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Skrip SQL Tabel Anggota (Supabase)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Jalankan skrip ini di SQL Editor proyek Supabase Anda
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSqlModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instruction & SQL Code */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Petunjuk Eksekusi di Dashboard Supabase:</span>
                </div>
                <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-emerald-800 pt-1">
                  <li>Klik tombol <b>Salin Skrip SQL</b> di bawah ini.</li>
                  <li>
                    Buka tab <b>SQL Editor</b> di dashboard Supabase (atau klik{' '}
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-bold text-emerald-900"
                    >
                      supabase.com/dashboard
                    </a>
                    ).
                  </li>
                  <li>Tempelkan (Paste) skrip SQL dan klik tombol <b>Run</b>.</li>
                  <li>Tabel <code>public.pgri_anggota</code> beserta aturan keamanan RLS langsung aktif!</li>
                </ol>
              </div>

              {/* Code Box */}
              <div className="relative">
                <pre className="p-4 bg-slate-950 text-emerald-400 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
                  {SUPABASE_ANGGOTA_SQL}
                </pre>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-all active:scale-95"
                >
                  {copiedSql ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Skrip SQL</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 flex justify-end bg-slate-50">
              <button
                type="button"
                onClick={() => setIsSqlModalOpen(false)}
                className="px-5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION MODAL
          ======================================================== */}
      {deleteTarget && (
        <DeleteConfirmationModal
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteAnggota(deleteTarget.id);
            setDeleteTarget(null);
          }}
          title="Hapus Data Anggota"
          itemName={deleteTarget.nama}
          itemType="Anggota PGRI"
          description={`Data anggota dengan NPA ${deleteTarget.npa} akan dihapus secara permanen dari daftar anggota dan database.`}
        />
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { usePgriStore } from '@/lib/store';
import { PendaftaranItem } from '@/lib/types';
import {
  FileEdit,
  CheckCircle2,
  ShieldCheck,
  Send,
  Printer,
  Copy,
  Search,
  AlertCircle,
  IdCard,
} from 'lucide-react';

export function PendaftaranSection() {
  const { submitPendaftaran, pendaftaranList, showToast } = usePgriStore();

  const [formData, setFormData] = useState({
    namaLengkap: '',
    nikNip: '',
    nuptk: '',
    tempatTanggalLahir: '',
    jenisKelamin: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    instansi: '',
    jabatan: 'Guru Kelas',
    mapel: '',
    alamat: '',
    noWhatsApp: '',
    email: '',
    kecamatan: 'Pasirwangi',
    statusKepegawaian: 'PNS' as PendaftaranItem['statusKepegawaian'],
    nomorAnggotaLama: '',
  });

  const [agreement, setAgreement] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status check tab
  const [activeTab, setActiveTab] = useState<'form' | 'check'>('form');
  const [searchRegCode, setSearchRegCode] = useState('');
  const [searchResult, setSearchResult] = useState<PendaftaranItem | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreement) {
      showToast('Harap centang pernyataan kebenaran data terlebih dahulu!', 'warning');
      return;
    }

    if (!formData.namaLengkap || !formData.nikNip || !formData.instansi || !formData.noWhatsApp) {
      showToast('Harap lengkapi semua kolom wajib!', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const regCode = submitPendaftaran(formData);
      setSubmittedCode(regCode);
      setIsSubmitting(false);

      // Reset form
      setFormData({
        namaLengkap: '',
        nikNip: '',
        nuptk: '',
        tempatTanggalLahir: '',
        jenisKelamin: 'Laki-laki',
        instansi: '',
        jabatan: 'Guru Kelas',
        mapel: '',
        alamat: '',
        noWhatsApp: '',
        email: '',
        kecamatan: 'Pasirwangi',
        statusKepegawaian: 'PNS',
        nomorAnggotaLama: '',
      });
      setAgreement(false);
    }, 600);
  };

  const handleSearchRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRegCode.trim()) return;

    const found = pendaftaranList.find(
      (p) => p.nomorPendaftaran.toLowerCase() === searchRegCode.trim().toLowerCase()
    );
    setSearchResult(found || null);
    setHasSearched(true);
  };

  const handlePrintProof = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <section id="pendaftaran-pgri" className="py-16 md:py-24 bg-slate-50 border-t border-slate-200/80 scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3">
            <FileEdit className="h-3.5 w-3.5" />
            <span>Penerimaan Anggota & KTA Digital</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pendaftaran Anggota PGRI Pasirwangi
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Formulir resmi registrasi anggota baru dan pemutakhiran data guru/tenaga kependidikan se-Kecamatan Pasirwangi untuk penerbitan KTA Digital.
          </p>
        </div>

        {/* Form vs Check Status Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-200/70 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-300/60">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeTab === 'form'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Formulir Pendaftaran
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('check')}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeTab === 'check'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lacak Status Pendaftaran
            </button>
          </div>
        </div>

        {activeTab === 'check' ? (
          /* Check Registration Status View */
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
              Lacak Verifikasi Berkas Pendaftaran
            </h3>
            <p className="text-xs text-slate-500 text-center mb-6">
              Masukkan Nomor Registrasi yang Anda dapatkan saat mengirimkan formulir (Contoh: REG-2026-0041).
            </p>

            <form onSubmit={handleSearchRegistration} className="flex gap-2 mb-8">
              <input
                type="text"
                value={searchRegCode}
                onChange={(e) => setSearchRegCode(e.target.value)}
                placeholder="REG-2026-XXXX"
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono uppercase"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </form>

            {hasSearched && (
              <div>
                {searchResult ? (
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {searchResult.nomorPendaftaran}
                        </span>
                        <h4 className="text-base font-bold text-slate-900">
                          {searchResult.namaLengkap}
                        </h4>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          searchResult.status === 'Diterima'
                            ? 'bg-emerald-100 text-emerald-800'
                            : searchResult.status === 'Diverifikasi'
                            ? 'bg-sky-100 text-sky-800'
                            : searchResult.status === 'Ditolak'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {searchResult.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block">Unit Kerja:</span>
                        <span className="font-semibold text-slate-800">{searchResult.instansi}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Tanggal Daftar:</span>
                        <span className="font-semibold text-slate-800">{searchResult.tanggalDaftar}</span>
                      </div>
                    </div>

                    <div className="pt-2 text-xs text-slate-700">
                      <span className="text-slate-400 block mb-1">Catatan Pengurus:</span>
                      <p className="bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                        {searchResult.catatanAdmin || 'Berkas Anda sedang dalam proses verifikasi data dapodik.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                    Nomor registrasi tidak ditemukan. Pastikan format nomor sudah benar.
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Form View */
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
            {submittedCode ? (
              /* Success Confirmation */
              <div className="text-center py-8 max-w-lg mx-auto space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Pendaftaran Berhasil Dikirim!
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Data Anda akan diverifikasi oleh pengurus PGRI Kecamatan Pasirwangi. Simpan nomor pendaftaran berikut untuk melacak status verifikasi:
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl inline-block w-full">
                  <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">
                    Nomor Pendaftaran Resmi
                  </div>
                  <div className="text-2xl font-mono font-black text-emerald-700 mt-1 select-all">
                    {submittedCode}
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrintProof}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Cetak Bukti Pendaftaran</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubmittedCode(null)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors"
                  >
                    <span>Daftarkan Anggota Lain</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Data Pribadi Pendidik
                  </h3>
                  <p className="text-xs text-slate-500">
                    Isi data sesuai dokumen resmi kependudukan dan surat tugas mengajar.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
                  {/* Nama Lengkap */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="font-semibold text-slate-700">
                      Nama Lengkap & Gelar <span className="text-emerald-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Gunawan, S.Pd., M.Pd."
                      value={formData.namaLengkap}
                      onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* NIK / NIP */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">
                      NIK / NIP <span className="text-emerald-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="16 Digit NIK KTP atau NIP ASN"
                      value={formData.nikNip}
                      onChange={(e) => setFormData({ ...formData, nikNip: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  {/* NUPTK */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">
                      NUPTK / PegID (Jika ada)
                    </label>
                    <input
                      type="text"
                      placeholder="16 Digit NUPTK resmi"
                      value={formData.nuptk}
                      onChange={(e) => setFormData({ ...formData, nuptk: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  {/* Tempat, Tanggal Lahir */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">
                      Tempat, Tanggal Lahir <span className="text-emerald-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Garut, 12 Agustus 1988"
                      value={formData.tempatTanggalLahir}
                      onChange={(e) => setFormData({ ...formData, tempatTanggalLahir: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Jenis Kelamin */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">
                      Jenis Kelamin <span className="text-emerald-600">*</span>
                    </label>
                    <select
                      value={formData.jenisKelamin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jenisKelamin: e.target.value as 'Laki-laki' | 'Perempuan',
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div className="border-b border-slate-100 pt-4 pb-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    Instansi & Tugas Pendidik
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
                  {/* Instansi / Sekolah */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">
                      Pangkalan Sekolah / Instansi <span className="text-emerald-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: SDN Pasirwangi 1 / SMPN 1 Pasirwangi"
                      value={formData.instansi}
                      onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Status Kepegawaian */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">
                      Status Kepegawaian <span className="text-emerald-600">*</span>
                    </label>
                    <select
                      value={formData.statusKepegawaian}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          statusKepegawaian: e.target.value as PendaftaranItem['statusKepegawaian'],
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                      <option value="PPPK">PPPK</option>
                      <option value="Guru Tetap Yayasan">Guru Tetap Yayasan (GTY)</option>
                      <option value="Guru Honorer Sekolah">Guru Honorer Sekolah / Non-ASN</option>
                      <option value="Tenaga Kependidikan">Tenaga Kependidikan (TU/Operator)</option>
                    </select>
                  </div>

                  {/* Jabatan */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">
                      Jabatan di Sekolah
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Guru Kelas, Guru Mapel, Kepala Sekolah"
                      value={formData.jabatan}
                      onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Mata Pelajaran */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">
                      Mata Pelajaran yang Diampu
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Guru Kelas SD, IPA, Matematika, PJOK"
                      value={formData.mapel}
                      onChange={(e) => setFormData({ ...formData, mapel: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* No Anggota Lama jika ada */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="font-semibold text-slate-700">
                      Nomor Anggota PGRI Lama (Bila pembaruan KTA)
                    </label>
                    <input
                      type="text"
                      placeholder="Kosongkan jika mendaftar baru pertama kali"
                      value={formData.nomorAnggotaLama}
                      onChange={(e) => setFormData({ ...formData, nomorAnggotaLama: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="border-b border-slate-100 pt-4 pb-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    Kontak & Domisili
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
                  {/* WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">
                      Nomor WhatsApp Aktif <span className="text-emerald-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={formData.noWhatsApp}
                      onChange={(e) => setFormData({ ...formData, noWhatsApp: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">
                      Alamat Email Aktif <span className="text-emerald-600">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nama@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Kecamatan */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Kecamatan</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.kecamatan}
                      className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-semibold cursor-not-allowed"
                    />
                  </div>

                  {/* Alamat Lengkap */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="font-semibold text-slate-700">
                      Alamat Domisili Lengkap (Kp/Desa/RT/RW)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Kp. Pasirwangi RT 02 RW 01 Desa Pasirwangi"
                      value={formData.alamat}
                      onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="pt-4 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={agreement}
                    onChange={(e) => setAgreement(e.target.checked)}
                    className="h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 mt-0.5"
                  />
                  <label htmlFor="agreement" className="text-xs text-slate-700 leading-snug cursor-pointer select-none">
                    <strong>Saya menyatakan data yang saya masukkan benar.</strong> Saya bersedia mematuhi Anggaran Dasar / Anggaran Rumah Tangga (AD/ART) serta kode etik profesi PGRI.
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50 active:scale-95"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? 'Mengirim Data...' : 'Kirim Pendaftaran PGRI'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

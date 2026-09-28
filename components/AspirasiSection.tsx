'use client';

import React, { useState } from 'react';
import { usePgriStore } from '@/lib/store';
import { AspirasiItem } from '@/lib/types';
import {
  MessageSquareQuote,
  Send,
  CheckCircle2,
  Search,
  Clock,
  UserCheck,
  Shield,
  HelpCircle,
} from 'lucide-react';

export function AspirasiSection() {
  const { submitAspirasi, aspirasiList, showToast } = usePgriStore();

  const [formData, setFormData] = useState({
    nama: '',
    isAnonim: false,
    noWhatsApp: '',
    instansi: '',
    kategori: 'Pendidikan' as AspirasiItem['kategori'],
    judul: '',
    isi: '',
  });

  const [ticketResult, setTicketResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'track'>('form');
  const [searchTicket, setSearchTicket] = useState('');
  const [foundAspirasi, setFoundAspirasi] = useState<AspirasiItem | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const categories: AspirasiItem['kategori'][] = [
    'Organisasi',
    'Pendidikan',
    'Kesejahteraan',
    'Keanggotaan',
    'Kegiatan',
    'Pelayanan',
    'Sarana dan Prasarana',
    'Lainnya',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.judul || !formData.isi || (!formData.isAnonim && !formData.nama)) {
      showToast('Harap lengkapi judul dan uraian aspirasi!', 'warning');
      return;
    }

    const ticketId = submitAspirasi(formData);
    setTicketResult(ticketId);

    // Reset form
    setFormData({
      nama: '',
      isAnonim: false,
      noWhatsApp: '',
      instansi: '',
      kategori: 'Pendidikan',
      judul: '',
      isi: '',
    });
  };

  const handleSearchTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTicket.trim()) return;

    const found = aspirasiList.find(
      (a) => a.tiketId.toLowerCase() === searchTicket.trim().toLowerCase()
    );
    setFoundAspirasi(found || null);
    setHasSearched(true);
  };

  return (
    <section id="aspirasi" className="py-16 md:py-24 bg-white scroll-mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3">
            <MessageSquareQuote className="h-3.5 w-3.5" />
            <span>Kanal Suara Guru & Pendidik</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Formulir Aspirasi Anggota
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Saluran resmi penyampaian usulan, masukan kebijakan pendidikan, perbaikan fasilitas belajar, serta perlindungan hak guru secara terbuka maupun anonim.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeTab === 'form'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kirim Aspirasi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('track')}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeTab === 'track'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lacak Status Tiket
            </button>
          </div>
        </div>

        {activeTab === 'track' ? (
          /* Track Ticket View */
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
              Lacak Tindak Lanjut Aspirasi
            </h3>
            <p className="text-xs text-slate-500 text-center mb-6">
              Masukkan Nomor Tiket Aspirasi Anda (Contoh: ASP-2026-0001).
            </p>

            <form onSubmit={handleSearchTicket} className="flex gap-2 max-w-md mx-auto mb-8">
              <input
                type="text"
                value={searchTicket}
                onChange={(e) => setSearchTicket(e.target.value)}
                placeholder="ASP-2026-XXXX"
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono uppercase"
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
              <div className="max-w-xl mx-auto">
                {foundAspirasi ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {foundAspirasi.tiketId}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-0.5">
                          {foundAspirasi.judul}
                        </h4>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          foundAspirasi.status === 'Selesai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : foundAspirasi.status === 'Diproses'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {foundAspirasi.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>Kategori: <strong>{foundAspirasi.kategori}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Tanggal: {foundAspirasi.tanggal}</span>
                      <span aria-hidden="true">·</span>
                      <span>Pengirim: {foundAspirasi.isAnonim ? 'Anonim' : foundAspirasi.nama}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-100">
                      <span className="font-semibold block text-slate-800 mb-1">Isi Aspirasi:</span>
                      {foundAspirasi.isi}
                    </div>

                    <div className="pt-2">
                      <span className="text-xs font-semibold text-emerald-700 block mb-1">
                        Respon / Tindak Lanjut Pengurus PGRI:
                      </span>
                      <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-slate-800 leading-relaxed">
                        {foundAspirasi.responAdmin || 'Aspirasi Anda sedang dalam kajian pengurus harian.'}
                        {foundAspirasi.tanggalRespon && (
                          <div className="mt-2 text-[10px] text-slate-400">
                            Direspon pada: {foundAspirasi.tanggalRespon}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                    Nomor tiket tidak ditemukan. Pastikan format tiket sudah sesuai.
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Form View */
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
            {ticketResult ? (
              <div className="text-center py-8 max-w-lg mx-auto space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Aspirasi Berhasil Disampaikan!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Terima kasih atas kontribusi rekan guru dalam memajukan organisasi. Catat nomor tiket berikut untuk memantau tanggapan:
                </p>

                <div className="p-4 bg-white border border-slate-200 rounded-2xl inline-block w-full shadow-sm">
                  <div className="text-xs text-slate-400 uppercase font-semibold">
                    Nomor Tiket Aspirasi Anda
                  </div>
                  <div className="text-2xl font-mono font-black text-emerald-600 mt-1 select-all">
                    {ticketResult}
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => setTicketResult(null)}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Kirim Aspirasi Baru
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
                {/* Anonymous Toggle */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      Publikasikan aspirasi secara anonim
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Identitas nama Anda akan dirahasiakan dari publik.
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAnonim}
                      onChange={(e) => setFormData({ ...formData, isAnonim: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nama */}
                  {!formData.isAnonim && (
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700">Nama Lengkap</label>
                      <input
                        type="text"
                        placeholder="Nama Bapak/Ibu Guru"
                        value={formData.nama}
                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  )}

                  {/* WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">
                      Nomor WhatsApp (Untuk notifikasi balasan)
                    </label>
                    <input
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={formData.noWhatsApp}
                      onChange={(e) => setFormData({ ...formData, noWhatsApp: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  {/* Sekolah / Instansi */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Pangkalan Sekolah / Instansi</label>
                    <input
                      type="text"
                      placeholder="Nama Sekolah di Pasirwangi"
                      value={formData.instansi}
                      onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Kategori Aspirasi */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Kategori Aspirasi</label>
                    <select
                      value={formData.kategori}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kategori: e.target.value as AspirasiItem['kategori'],
                        })
                      }
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Judul Aspirasi */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">
                    Judul Pokok Aspirasi <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Usulan Bimbingan Teknis Karya Tulis Ilmiah untuk Kenaikan Pangkat"
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Isi Aspirasi */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">
                    Uraian Rinci Masukan / Aspirasi <span className="text-emerald-600">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan latar belakang masalah, saran solutif, atau permohonan pendampingan dengan santun dan jelas..."
                    value={formData.isi}
                    onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <Send className="h-4 w-4" />
                    <span>Kirim Aspirasi ke Pengurus</span>
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

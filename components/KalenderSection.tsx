'use client';

import React, { useState } from 'react';
import { usePgriStore } from '@/lib/store';
import { KalenderItem } from '@/lib/types';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react';

export function KalenderSection() {
  const { kalenderList } = usePgriStore();
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<KalenderItem | null>(null);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const categories = [
    { key: 'all', label: 'Semua Kategori' },
    { key: 'Rapat', label: 'Rapat' },
    { key: 'Pelatihan', label: 'Pelatihan' },
    { key: 'Upacara', label: 'Upacara' },
    { key: 'Sosialisasi', label: 'Sosialisasi' },
    { key: 'Lomba', label: 'Lomba' },
  ];

  const getCategoryColor = (kategori: string) => {
    switch (kategori) {
      case 'Rapat':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pelatihan':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Upacara':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Sosialisasi':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Lomba':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const filteredEvents = kalenderList.filter((event) => {
    const eventDate = new Date(event.tanggal);
    const matchMonth = eventDate.getMonth() === selectedMonth;
    const matchCat = selectedCategory === 'all' || event.kategori === selectedCategory;
    return matchMonth && matchCat;
  });

  return (
    <section id="kalender" className="py-16 md:py-24 bg-slate-50 border-t border-slate-200/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Agenda & Rencana Kegiatan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kalender Kegiatan PGRI Pasirwangi
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Jadwal kegiatan resmi, rapat koordinasi pengurus cabang, pembinaan guru, upacara, dan agenda kebersamaan organisasi.
          </p>
        </div>

        {/* Calendar Controller Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Month Switcher */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1))}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <span className="text-base sm:text-lg font-bold text-slate-900 min-w-[160px] text-center">
              {monthNames[selectedMonth]} 2026
            </span>

            <button
              type="button"
              onClick={() => setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1))}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Bulan berikutnya"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  selectedCategory === cat.key
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Agenda Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => setSelectedEvent(evt)}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(
                      evt.kategori
                    )}`}
                  >
                    {evt.kategori}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {evt.tanggal}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                  {evt.judul}
                </h3>

                <p className="mt-2.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {evt.deskripsi}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{evt.jamMulai} - {evt.jamSelesai} WIB</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{evt.lokasi}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">PIC: {evt.penanggungJawab}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
            <CalendarIcon className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 font-medium text-sm">
              Belum ada agenda kegiatan yang dijadwalkan pada {monthNames[selectedMonth]} 2026.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Silakan periksa bulan lain atau hubungi sekretariat cabang.
            </p>
          </div>
        )}

        {/* Modal Detail Agenda */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span
                    className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(
                      selectedEvent.kategori
                    )}`}
                  >
                    {selectedEvent.kategori}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">
                    {selectedEvent.judul}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="py-5 space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
                  <CalendarIcon className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold">{selectedEvent.tanggal}</span>
                  <span className="text-slate-400">·</span>
                  <span>{selectedEvent.jamMulai} - {selectedEvent.jamSelesai} WIB</span>
                </div>

                <div className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl">
                  <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{selectedEvent.lokasi}</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
                  <User className="h-4 w-4 text-emerald-600" />
                  <span>Penanggung Jawab: <strong>{selectedEvent.penanggungJawab}</strong></span>
                </div>

                <div className="pt-2">
                  <span className="text-slate-400 text-xs font-semibold block mb-1">
                    Deskripsi Lengkap Kegiatan:
                  </span>
                  <p className="text-slate-700 leading-relaxed bg-white border border-slate-100 p-3 rounded-xl">
                    {selectedEvent.deskripsi}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-5 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                >
                  Tutup Agenda
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

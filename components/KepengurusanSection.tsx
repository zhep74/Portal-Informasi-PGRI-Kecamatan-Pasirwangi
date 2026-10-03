'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePgriStore } from '@/lib/store';
import { PengurusItem } from '@/lib/types';
import {
  Users2,
  Briefcase,
  School,
  IdCard,
  ChevronRight,
  X,
  ShieldAlert,
} from 'lucide-react';

export function KepengurusanSection() {
  const { pengurusList } = usePgriStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPengurus, setSelectedPengurus] = useState<PengurusItem | null>(null);

  const categories = [
    { key: 'all', label: 'Semua Pengurus' },
    { key: 'pimpinan', label: 'Pimpinan Harian' },
    { key: 'sekretariat', label: 'Sekretariat' },
    { key: 'kebendaharaan', label: 'Kebendaharaan' },
    { key: 'bidang', label: 'Ketua Bidang' },
  ];

  const filteredPengurus = pengurusList
    .filter((p) => (selectedCategory === 'all' ? true : p.kategori === selectedCategory))
    .sort((a, b) => a.noUrut - b.noUrut);

  return (
    <section id="kepengurusan" className="py-16 md:py-24 bg-slate-50 border-t border-slate-200/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3">
            <Users2 className="h-3.5 w-3.5" />
            <span>Struktur Organisasi Resmi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pengurus PGRI Cabang Pasirwangi
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Jajaran pengurus masa bakti 2025 - 2030 yang berdedikasi mengayomi, mengadvokasi, dan memajukan seluruh insan pendidik di Kecamatan Pasirwangi.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                selectedCategory === cat.key
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Pengurus Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPengurus.map((pengurus, pIdx) => (
            <div
              key={`${pengurus.id}-${pIdx}`}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Circular Photo container */}
                <div className="relative pt-6 pb-2 px-4 flex flex-col items-center bg-gradient-to-b from-emerald-50/40 via-slate-50/30 to-white">
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs">
                    {pengurus.kategori}
                  </div>

                  {/* Circular Portrait Frame */}
                  <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-md ring-4 ring-emerald-500/20 bg-slate-100 group-hover:ring-emerald-500/50 transition-all duration-300">
                    <Image
                      src={pengurus.fotoUrl || '/images/ketua_pgri.jpg'}
                      alt={pengurus.nama}
                      fill
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 pt-2">
                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                    {pengurus.nama}
                  </h3>
                  <div className="text-xs font-semibold text-emerald-600 mt-1">
                    {pengurus.jabatan}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <School className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{pengurus.unitKerja}</span>
                    </div>
                    {pengurus.nip && (
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <IdCard className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>NIP. {pengurus.nip}</span>
                      </div>
                    )}
                  </div>

                  <p className="mt-2.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {pengurus.keteranganSingkat}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedPengurus(pengurus)}
                  className="w-full flex items-center justify-center gap-1 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors border border-slate-100"
                >
                  <span>Lihat Profil Lengkap</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Detail Pengurus */}
        {selectedPengurus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
              <button
                type="button"
                onClick={() => setSelectedPengurus(null)}
                className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-emerald-500/30 ring-4 ring-emerald-100 shadow-xl shrink-0 bg-slate-100">
                  <Image
                    src={selectedPengurus.fotoUrl || '/images/ketua_pgri.jpg'}
                    alt={selectedPengurus.nama}
                    fill
                    className="object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {selectedPengurus.kategori}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                    {selectedPengurus.nama}
                  </h3>
                  <div className="text-sm font-semibold text-emerald-600 mt-0.5">
                    {selectedPengurus.jabatan}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Periode: {selectedPengurus.periode}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Unit Kerja / Pangkalan:</span>
                  <span className="font-semibold text-slate-900">{selectedPengurus.unitKerja}</span>
                </div>
                {selectedPengurus.nip && (
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">NIP:</span>
                    <span className="font-mono text-slate-900">{selectedPengurus.nip}</span>
                  </div>
                )}
                {selectedPengurus.nuptk && (
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">NUPTK:</span>
                    <span className="font-mono text-slate-900">{selectedPengurus.nuptk}</span>
                  </div>
                )}
                <div className="pt-2">
                  <span className="text-slate-400 block mb-1">Catatan Tugas / Keterangan:</span>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedPengurus.keteranganSingkat}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedPengurus(null)}
                  className="px-5 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

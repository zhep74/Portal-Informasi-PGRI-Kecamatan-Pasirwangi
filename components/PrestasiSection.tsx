'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePgriStore } from '@/lib/store';
import { Award, Trophy, Medal, Star, Calendar, User, ChevronRight } from 'lucide-react';

export function PrestasiSection() {
  const { prestasiList } = usePgriStore();
  const [selectedTingkat, setSelectedTingkat] = useState<string>('all');

  const tingkatOptions = [
    { key: 'all', label: 'Semua Tingkat' },
    { key: 'Nasional', label: 'Tingkat Nasional' },
    { key: 'Provinsi', label: 'Tingkat Provinsi' },
    { key: 'Kabupaten', label: 'Tingkat Kabupaten' },
    { key: 'Kecamatan', label: 'Tingkat Kecamatan' },
  ];

  const filteredPrestasi = prestasiList.filter((p) =>
    selectedTingkat === 'all' ? true : p.tingkat === selectedTingkat
  );

  return (
    <section id="prestasi" className="py-16 md:py-24 bg-slate-50 border-t border-slate-200/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3">
            <Trophy className="h-3.5 w-3.5" />
            <span>Dedikasi & Prestasi Gemilang</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Prestasi & Penghargaan
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Apresiasi atas capaian inovasi pembelajaran, karya ilmiah, dan dedikasi luar biasa guru serta organisasi PGRI Cabang Pasirwangi.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {tingkatOptions.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setSelectedTingkat(t.key)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                selectedTingkat === t.key
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Prestasi Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPrestasi.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                    Tingkat {item.tingkat}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    {item.tahun}
                  </span>
                </div>

                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                  <Medal className="h-6 w-6" />
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                  {item.namaPrestasi}
                </h3>

                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <User className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>{item.penerima}</span>
                </div>

                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                Kategori: <span className="text-slate-700 font-semibold">{item.kategori}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredPrestasi.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 text-sm">Tidak ada penghargaan untuk filter tingkat ini.</p>
          </div>
        )}
      </div>
    </section>
  );
}

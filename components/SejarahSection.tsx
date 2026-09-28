'use client';

import React, { useState } from 'react';
import { usePgriStore } from '@/lib/store';
import { SejarahItem } from '@/lib/types';
import { History, BookOpen, Clock, ChevronRight, X } from 'lucide-react';

export function SejarahSection() {
  const { sejarahList } = usePgriStore();
  const [selectedItem, setSelectedItem] = useState<SejarahItem | null>(null);

  // Sort chronological
  const sorted = [...sejarahList].sort((a, b) => parseInt(a.tahun) - parseInt(b.tahun));

  return (
    <section id="sejarah" className="py-16 md:py-24 bg-slate-50 border-t border-slate-200/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3">
            <History className="h-3.5 w-3.5" />
            <span>Rekam Jejak & Pengabdian</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sejarah PGRI Kecamatan Pasirwangi
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Perjalanan panjang perjuangan guru di lereng dataran tinggi Kamojang Pasirwangi dari era perintisan hingga transformasi abad ke-21.
          </p>
        </div>

        {/* Timeline Component */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical central hairline line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 bg-slate-200" />

          <div className="space-y-12">
            {sorted.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  } gap-6 group`}
                >
                  {/* Timeline Badge in Center */}
                  <div className="absolute left-4 sm:left-1/2 top-1.5 -translate-x-1/2 w-9 h-9 rounded-full bg-white border-2 border-emerald-600 text-emerald-700 font-extrabold text-xs flex items-center justify-center shadow-md z-10 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Clock className="h-4 w-4" />
                  </div>

                  {/* Spacer for 2-column layout on desktop */}
                  <div className="hidden sm:block sm:w-1/2" />

                  {/* Content Card */}
                  <div className="ml-12 sm:ml-0 sm:w-1/2">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
                      <div className="inline-block text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded mb-2">
                        {item.tahun}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {item.judul}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.ringkasan}
                      </p>

                      <button
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Baca Selengkapnya</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Detail Sejarah */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    Tahun {selectedItem.tahun}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                    {selectedItem.judul}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="py-6 space-y-4 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                <p>{selectedItem.isiLengkap || selectedItem.ringkasan}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Tutup Informasi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

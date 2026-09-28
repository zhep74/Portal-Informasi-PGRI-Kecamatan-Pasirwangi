'use client';

import React from 'react';
import { usePgriStore } from '@/lib/store';
import { Target, Compass, Award, CheckCircle2 } from 'lucide-react';

export function VisiMisiSection() {
  const { visiMisi } = usePgriStore();

  return (
    <section id="visi-misi" className="py-16 md:py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3">
            <Compass className="h-3.5 w-3.5" />
            <span>Arah Langkah & Komitmen Organisasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Visi dan Misi PGRI Pasirwangi
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Pedoman strategis kepengurusan dalam mewujudkan kemandirian profesi pendidik dan kemajuan mutu pembelajaran.
          </p>
        </div>

        {/* VISI CARD - Large, Elegant, Eye-Catching */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-950 p-8 sm:p-12 md:p-14 text-white shadow-xl mb-14 border border-emerald-700/40">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <Target className="h-3.5 w-3.5 text-amber-300" />
              <span>Visi Utama PGRI Pasirwangi</span>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight text-white tracking-tight text-balance">
              &ldquo;{visiMisi.visi}&rdquo;
            </h3>

            <div className="pt-4 flex items-center justify-center gap-2 text-xs text-emerald-200 font-medium tracking-wide">
              <span>Masa Bakti 2025 - 2030</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-300 font-semibold">{visiMisi.moto}</span>
            </div>
          </div>
        </div>

        {/* MISI CARDS - Numbered Clean Modern Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-emerald-600 rounded-sm inline-block" />
              <span>Misi Perjuangan Organisasi</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">5 Pilar Prioritas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visiMisi.misi.map((misiItem, idx) => {
              const numberStr = String(idx + 1).padStart(2, '0');

              return (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-7 hover:border-emerald-300 hover:bg-white transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-emerald-700/80 font-mono">
                        {numberStr}
                      </span>
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-800 leading-relaxed">
                      {misiItem}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-slate-400">
                    Pilar Aksi Strategis
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TUJUAN ORGANISASI */}
        {visiMisi.tujuan && visiMisi.tujuan.length > 0 && (
          <div className="mt-14 bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
            <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-600" />
              <span>Tujuan Konkret PGRI Cabang Pasirwangi</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
              {visiMisi.tujuan.map((tujuan, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                  <span>{tujuan}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

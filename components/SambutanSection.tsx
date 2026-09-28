'use client';

import React from 'react';
import Image from 'next/image';
import { usePgriStore } from '@/lib/store';
import { Quote, Award, Sparkles } from 'lucide-react';

export function SambutanSection() {
  const { profile } = usePgriStore();
  const { sambutanKetua } = profile;

  return (
    <section className="py-16 md:py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Portrait & Identity Badge */}
            <div className="lg:col-span-4 bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 p-8 sm:p-10 text-white flex flex-col items-center justify-between text-center relative">
              <div className="w-full flex justify-between items-center text-xs text-emerald-300 mb-6">
                <span className="font-semibold uppercase tracking-wider">Amanat Organisasi</span>
                <span className="bg-emerald-800/60 px-2.5 py-0.5 rounded text-[10px] text-white">Resmi</span>
              </div>

              {/* Portrait Frame */}
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl my-auto">
                <Image
                  src={sambutanKetua.fotoUrl || '/images/ketua_pgri.jpg'}
                  alt={sambutanKetua.nama}
                  fill
                  className="object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Identity lockup */}
              <div className="mt-6 w-full">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {sambutanKetua.nama}
                </h3>
                <p className="text-xs text-emerald-300 font-medium mt-0.5">
                  {sambutanKetua.jabatan}
                </p>
                <div className="mt-2 text-[11px] text-slate-400">
                  NIP. {sambutanKetua.nip}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  {sambutanKetua.periode}
                </div>
              </div>
            </div>

            {/* Right Column: Sambutan Content */}
            <div className="lg:col-span-8 p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Sambutan Resmi Ketua Cabang</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Meneguhkan Solidaritas Pendidik, Mengabdi untuk Masa Depan Pasirwangi
                </h2>

                <div className="relative mt-6">
                  <Quote className="absolute -top-3 -left-3 h-10 w-10 text-emerald-100 pointer-events-none -z-0" />
                  <p className="relative z-10 text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:text-emerald-700 first-letter:float-left first-letter:mr-2">
                    {sambutanKetua.pesan}
                  </p>
                </div>
              </div>

              {/* Official Closing & Signature Block */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500">Pasirwangi, Garut, Jawa Barat</div>
                  <div className="text-xs font-medium text-slate-700">
                    Pengurus PGRI Cabang Kecamatan Pasirwangi
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end">
                  <div className="font-serif italic text-emerald-800 text-lg font-bold tracking-wider select-none">
                    {sambutanKetua.tandaTanganNama}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Ketua PGRI Cabang Pasirwangi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

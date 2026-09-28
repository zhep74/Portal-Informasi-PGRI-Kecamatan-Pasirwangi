'use client';

import React, { useState } from 'react';
import { usePgriStore } from '@/lib/store';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Calendar,
  User,
  Filter,
  Layers,
  Sparkles,
} from 'lucide-react';

export function ProgramKerjaSection() {
  const { programKerjaList } = usePgriStore();
  const [selectedBidang, setSelectedBidang] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Extract distinct bidang & years
  const distinctBidang = Array.from(new Set(programKerjaList.map((p) => p.bidang)));
  const distinctYears = Array.from(new Set(programKerjaList.map((p) => p.tahun)));

  const filteredPrograms = programKerjaList.filter((prog) => {
    if (selectedBidang !== 'all' && prog.bidang !== selectedBidang) return false;
    if (selectedStatus !== 'all' && prog.status !== selectedStatus) return false;
    if (selectedYear !== 'all' && prog.tahun !== selectedYear) return false;
    return true;
  });

  return (
    <section id="program-kerja" className="py-16 md:py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Rencana Aksi & Realisasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Program Kerja PGRI Kecamatan Pasirwangi
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Agenda strategis yang terukur untuk meningkatkan kompetensi, perlindungan hukum, dan kesejahteraan anggota secara berkelanjutan.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 mb-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 shrink-0">
            <Filter className="h-4 w-4 text-emerald-600" />
            <span>Filter Program:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Bidang Filter */}
            <select
              value={selectedBidang}
              onChange={(e) => setSelectedBidang(e.target.value)}
              className="text-xs font-medium bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Semua Bidang</option>
              {distinctBidang.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-medium bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Semua Status</option>
              <option value="Sedang Berjalan">Sedang Berjalan</option>
              <option value="Selesai">Selesai</option>
              <option value="Direncanakan">Direncanakan</option>
            </select>

            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-xs font-medium bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Semua Tahun</option>
              {distinctYears.map((y) => (
                <option key={y} value={y}>
                  Tahun {y}
                </option>
              ))}
            </select>

            {(selectedBidang !== 'all' || selectedStatus !== 'all' || selectedYear !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSelectedBidang('all');
                  setSelectedStatus('all');
                  setSelectedYear('all');
                }}
                className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold px-2 py-1"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((prog) => {
            const isCompleted = prog.status === 'Selesai';
            const isOngoing = prog.status === 'Sedang Berjalan';

            return (
              <div
                key={prog.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-emerald-300 transition-all"
              >
                <div>
                  {/* Status & Bidang tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {prog.bidang}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isOngoing
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="h-3 w-3" />}
                      {isOngoing && <Clock className="h-3 w-3" />}
                      <span>{prog.status}</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {prog.nama}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {prog.deskripsi}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                      <span>Progres Pelaksanaan</span>
                      <span className="font-bold text-slate-800 tabular-nums">
                        {prog.progressPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-emerald-600'
                            : isOngoing
                            ? 'bg-sky-600'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${prog.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Metadata fields */}
                  <div className="space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{prog.waktuPelaksanaan} ({prog.tahun})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">PIC: {prog.penanggungJawab}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="font-semibold text-slate-400">Target:</span>
                      <span className="truncate">{prog.target}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 text-sm">Tidak ada program kerja yang sesuai dengan filter.</p>
          </div>
        )}
      </div>
    </section>
  );
}

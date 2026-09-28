'use client';

import React from 'react';
import Image from 'next/image';
import { usePgriStore } from '@/lib/store';
import { PgriLogo } from './PgriLogo';
import {
  Users,
  School,
  CheckCircle,
  FileCheck2,
  ChevronRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

export function HeroSection() {
  const { profile, siteSettings } = usePgriStore();

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {/* Background Photography with measured scrim */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity scale-105 transform">
        <Image
          src="/images/hero_pgri.jpg"
          alt="Para Guru PGRI Pasirwangi Garut"
          fill
          className="object-cover object-center"
          priority
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Multi-layer gradient overlays for contrast & brand colors (Red & Navy) */}
      <div className="absolute inset-0 z-1 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950/80" />
      <div className="absolute inset-0 z-1 bg-radial-at-t from-emerald-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-8 text-left space-y-6">
            {/* Unboxed Metadata Tagline with dot separator */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-emerald-400 uppercase">
              <span className="inline-flex items-center gap-1.5 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Portal Resmi Organisasi Profesi</span>
              </span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span>Kecamatan Pasirwangi, Kab. Garut</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] text-balance">
              {siteSettings.portalTitle}
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-emerald-100/90 leading-snug">
              {siteSettings.tagline}
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {siteSettings.deskripsiHero}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="#profil"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-950/40 hover:shadow-emerald-700/30 transition-all active:scale-95"
              >
                <BookOpen className="h-4 w-4" />
                <span>Jelajahi Profil</span>
                <ChevronRight className="h-4 w-4" />
              </a>

              <a
                href="#layanan"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm rounded-xl backdrop-blur-sm transition-all active:scale-95"
              >
                <Users className="h-4 w-4 text-emerald-400" />
                <span>Layanan Anggota</span>
              </a>

              <a
                href="#pendaftaran-pgri"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl transition-all active:scale-95"
              >
                <FileCheck2 className="h-4 w-4 text-amber-400" />
                <span>Pendaftaran PGRI</span>
              </a>
            </div>

            {/* Trust Markers Bar */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Terverifikasi PGRI Kabupaten Garut</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Pelayanan Anggota Terbuka & Transparan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Perlindungan Profesi & Hukum Siaga</span>
              </div>
            </div>
          </div>

          {/* Right Column: Emblem Shield & Quick Stat Showcase */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/60 shadow-2xl backdrop-blur-md w-full max-w-sm text-center">
              <div className="relative mx-auto mb-4 w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-600/30 rounded-full blur-xl animate-pulse" />
                <PgriLogo className="relative z-10 w-24 h-24 drop-shadow-2xl" size={96} />
              </div>

              <h2 className="text-base font-bold text-white tracking-tight">
                PGRI Cabang Pasirwangi
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Kecamatan Pasirwangi, Kabupaten Garut
              </p>

              {/* Mini Highlights */}
              <div className="mt-5 grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Users className="h-3 w-3 text-emerald-400" />
                    <span>Anggota</span>
                  </div>
                  <div className="text-xl font-extrabold text-white mt-0.5 tabular-nums">
                    {profile.statistik.jumlahAnggota}+
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <School className="h-3 w-3 text-sky-400" />
                    <span>Sekolah</span>
                  </div>
                  <div className="text-xl font-extrabold text-white mt-0.5 tabular-nums">
                    {profile.statistik.jumlahSekolah}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <BookOpen className="h-3 w-3 text-amber-400" />
                    <span>Ranting</span>
                  </div>
                  <div className="text-xl font-extrabold text-white mt-0.5 tabular-nums">
                    {profile.statistik.jumlahRanting}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-emerald-400" />
                    <span>Program</span>
                  </div>
                  <div className="text-xl font-extrabold text-white mt-0.5 tabular-nums">
                    {profile.statistik.programTerlaksana}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                Masa Bakti Kepengurusan: <span className="text-slate-200 font-semibold">2025 - 2030</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

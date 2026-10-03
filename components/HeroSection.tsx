'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePgriStore } from '@/lib/store';
import { BeritaItem } from '@/lib/types';
import { PgriLogo } from './PgriLogo';
import {
  Users,
  School,
  CheckCircle,
  FileCheck2,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  Flame,
  Calendar,
  User,
  Eye,
  X,
  Share2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export function HeroSection() {
  const { profile, siteSettings, beritaList, incrementBeritaViews, showToast } = usePgriStore();
  const [selectedBerita, setSelectedBerita] = useState<BeritaItem | null>(null);

  // Active Berita Utama from store
  const beritaUtama = beritaList.find((b) => b.featured) || beritaList[0];

  const handleOpenBerita = (b: BeritaItem) => {
    setSelectedBerita(b);
    incrementBeritaViews(b.id);
  };

  const handleShareWhatsApp = (b: BeritaItem) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = encodeURIComponent(
      `*${b.judul}*\n\n${b.ringkasan}\n\nBaca selengkapnya di Portal PGRI Pasirwangi:\n${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {/* Background Photography with measured scrim - dynamically uses Berita Utama photo kegiatan if available */}
      <div className="absolute inset-0 z-0 opacity-30 mix-blend-luminosity scale-105 transform transition-all duration-700">
        <Image
          src={beritaUtama?.fotoUrl || '/images/hero_pgri.jpg'}
          alt={beritaUtama?.judul || 'Kegiatan Guru PGRI Pasirwangi Garut'}
          fill
          className="object-cover object-center"
          priority
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Multi-layer gradient overlays for contrast & brand colors (Navy & Emerald) */}
      <div className="absolute inset-0 z-1 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-950/85" />
      <div className="absolute inset-0 z-1 bg-radial-at-t from-emerald-900/25 via-transparent to-transparent pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* Header Badges: Portal Resmi & Berita Utama Ticker */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 bg-emerald-600/25 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider self-start shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Portal Resmi PGRI Pasirwangi</span>
              </span>

              {beritaUtama && (
                <button
                  type="button"
                  onClick={() => handleOpenBerita(beritaUtama)}
                  className="inline-flex items-center gap-1.5 p-1 pr-3 bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-500/30 hover:border-amber-400 rounded-full text-xs font-medium transition-all group backdrop-blur-md cursor-pointer self-start max-w-full text-left"
                >
                  <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 shadow-2xs">
                    <Flame className="w-3 h-3 fill-slate-950 text-slate-950" />
                    <span>Berita Utama</span>
                  </span>
                  <span className="truncate max-w-[200px] sm:max-w-[260px] text-[11px] font-semibold text-slate-100 group-hover:text-amber-300 transition-colors">
                    {beritaUtama.judul}
                  </span>
                  <ChevronRight className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              )}
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.15] text-balance">
              {siteSettings.portalTitle}
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl font-semibold text-emerald-200/90 leading-snug">
              {siteSettings.tagline}
            </p>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
              {siteSettings.deskripsiHero}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="#profil"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/40 hover:shadow-emerald-700/30 transition-all active:scale-95 cursor-pointer"
              >
                <BookOpen className="h-4 w-4" />
                <span>Jelajahi Profil</span>
                <ChevronRight className="h-4 w-4" />
              </a>

              <a
                href="#layanan"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-xs sm:text-sm rounded-xl backdrop-blur-sm transition-all active:scale-95 cursor-pointer"
              >
                <Users className="h-4 w-4 text-emerald-400" />
                <span>Layanan Anggota</span>
              </a>

              <a
                href="#pendaftaran-pgri"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <FileCheck2 className="h-4 w-4 text-amber-400" />
                <span>Pendaftaran PGRI</span>
              </a>
            </div>

            {/* Trust Markers Bar */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Terverifikasi PGRI Garut</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Pelayanan Digital Terbuka</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Perlindungan Profesi Siaga</span>
              </div>
            </div>
          </div>

          {/* Right Column: BERITA UTAMA & FOTO KEGIATAN SHOWCASE */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {beritaUtama ? (
              <div className="relative p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-slate-800/90 via-slate-900/95 to-slate-950 border border-slate-700/80 shadow-2xl backdrop-blur-md overflow-hidden group">
                {/* Decorative glow */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Card Topbar */}
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>Berita & Kegiatan Utama</span>
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {beritaUtama.tanggal}
                  </span>
                </div>

                {/* Uploaded Photo Kegiatan Showcase */}
                <div
                  onClick={() => handleOpenBerita(beritaUtama)}
                  className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border-2 border-slate-700/70 shadow-lg cursor-pointer bg-slate-950 relative group/photo"
                >
                  <Image
                    src={beritaUtama.fotoUrl || '/images/hero_pgri.jpg'}
                    alt={beritaUtama.judul}
                    fill
                    className="object-cover object-center group-hover/photo:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Category Pill Over Photo */}
                  <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    {beritaUtama.kategori}
                  </div>

                  {/* Hover action overlay */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Klik untuk Baca Selengkapnya</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="mt-4 space-y-2 text-left">
                  <h3
                    onClick={() => handleOpenBerita(beritaUtama)}
                    className="text-base sm:text-lg font-bold text-white hover:text-amber-300 transition-colors cursor-pointer leading-snug line-clamp-2"
                  >
                    {beritaUtama.judul}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-normal">
                    {beritaUtama.ringkasan}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{beritaUtama.penulis}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenBerita(beritaUtama)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                    >
                      <span>Baca Lengkap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Footer Quick Stat Lockup */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <PgriLogo size={24} className="shrink-0" />
                    <span className="font-semibold text-slate-300">
                      {profile.statistik.jumlahAnggota}+ Anggota Terdaftar
                    </span>
                  </div>
                  <a
                    href="#berita"
                    className="text-emerald-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>Warta Lainnya</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              /* Fallback Emblem Card if no news is present */
              <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/60 shadow-2xl backdrop-blur-md w-full text-center">
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL BACA BERITA UTAMA LENGKAP */}
      {selectedBerita && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal Header Bar */}
            <div className="px-5 sm:px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                  <Flame className="w-3 h-3 fill-slate-950" />
                  <span>Berita Utama Hero</span>
                </span>
                <span className="text-xs text-slate-400">· {selectedBerita.kategori}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBerita(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-8 overflow-y-auto space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  {selectedBerita.judul}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedBerita.tanggal}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Penulis: {selectedBerita.penulis}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>Dibaca {selectedBerita.dibacaCount} kali</span>
                  </div>
                </div>
              </div>

              {/* Big Activity Photo */}
              <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                <Image
                  src={selectedBerita.fotoUrl || '/images/hero_pgri.jpg'}
                  alt={selectedBerita.judul}
                  fill
                  className="object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Ringkasan Box */}
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                <strong>Ringkasan:</strong> {selectedBerita.ringkasan}
              </div>

              {/* Full Article Text */}
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 whitespace-pre-line">
                {selectedBerita.isi || selectedBerita.ringkasan}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleShareWhatsApp(selectedBerita)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan ke WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBerita(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

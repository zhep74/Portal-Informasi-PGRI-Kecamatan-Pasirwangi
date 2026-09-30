'use client';

import React from 'react';
import { PgriLogo } from './PgriLogo';
import { usePgriStore } from '@/lib/store';
import {
  ArrowUp,
  Shield,
  Eye,
  Calendar,
  Users,
  Heart,
  ChevronRight,
} from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export function Footer({ onOpenAdmin }: FooterProps) {
  const { siteSettings, profile, isAdminLoggedIn } = usePgriStore();

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const quickLinks = [
    { label: 'Profil Cabang', href: '#profil' },
    { label: 'Sejarah Perjuangan', href: '#sejarah' },
    { label: 'Visi & Misi', href: '#visi-misi' },
    { label: 'Struktur Kepengurusan', href: '#kepengurusan' },
    { label: 'Program Kerja', href: '#program-kerja' },
    { label: 'Berita & Informasi', href: '#berita' },
    { label: 'Dokumentasi Kegiatan', href: '#kegiatan' },
    { label: 'Layanan Anggota', href: '#layanan' },
    { label: 'Pendaftaran PGRI', href: '#pendaftaran-pgri' },
    { label: 'Aspirasi Guru', href: '#aspirasi' },
    { label: 'Kontak & Sekretariat', href: '#kontak' },
  ];

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1: Identity & Description */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <PgriLogo className="h-10 w-10 shrink-0" size={42} />
              <div>
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  PGRI Cabang Kecamatan Pasirwangi
                </h3>
                <p className="text-xs text-emerald-400 font-medium">
                  Kabupaten Garut, Jawa Barat
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              &ldquo;Organisasi profesi guru untuk kemajuan pendidikan dan kesejahteraan anggota.&rdquo;
            </p>

            <p className="text-xs text-slate-400 leading-relaxed">
              Mewadahi seluruh pendidik jenjang PAUD/TK, SD, SMP, SMA, SMK, dan Madrasah di wilayah Kecamatan Pasirwangi dengan komitmen kegotongroyongan dan integritas profesional.
            </p>

            <div className="pt-2 text-xs text-slate-400">
              Sekretariat: {profile.alamatSekretariat}
            </div>
          </div>

          {/* Col 2: Menu Cepat */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Menu Navigasi Cepat
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 py-1"
                >
                  <ChevronRight className="h-3 w-3 text-emerald-600" />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Col 3: Visitor Counter & Admin Access */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Statistik Kunjungan Portal
            </h4>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-sky-400" />
                  <span>Pengunjung Hari Ini:</span>
                </span>
                <span className="font-mono font-bold text-white tabular-nums">
                  {siteSettings.visitorStats.hariIni}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-400" />
                  <span>Pengunjung Bulan Ini:</span>
                </span>
                <span className="font-mono font-bold text-white tabular-nums">
                  {siteSettings.visitorStats.bulanIni.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Total Kunjungan:</span>
                </span>
                <span className="font-mono font-black text-emerald-400 text-sm tabular-nums">
                  {siteSettings.visitorStats.total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
              >
                <Shield className="h-3.5 w-3.5 text-emerald-500" />
                <span>
                  {isAdminLoggedIn ? 'Buka Dashboard Admin' : 'Login Pengurus / Admin'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="text-center sm:text-left">
            <div>
              &copy; 2026 PGRI Cabang Kecamatan Pasirwangi. Developer Asep Akon, S.Pd. All Rights Reserved.
            </div>
            <div className="text-slate-400 mt-0.5">
              Portal Informasi Digital PGRI Kecamatan Pasirwangi
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-colors"
              title="Kembali ke atas"
            >
              <span>Ke Atas</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

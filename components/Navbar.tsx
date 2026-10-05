'use client';

import React, { useState, useEffect } from 'react';
import { PgriLogo } from './PgriLogo';
import { usePgriStore } from '@/lib/store';
import {
  Menu,
  X,
  Search,
  UserCheck,
  Shield,
  ChevronDown,
  Phone,
  FileEdit,
  MessageSquare,
  Calendar,
  Award,
  BookOpen,
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
}

export function Navbar({ onOpenSearch, onOpenAdmin }: NavbarProps) {
  const { isAdminLoggedIn, siteSettings, profile, supabaseUser, openMemberAuthModal } = usePgriStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Beranda', href: '#' },
    { label: 'Profil', href: '#profil' },
    { label: 'Visi & Misi', href: '#visi-misi' },
    { label: 'Kepengurusan', href: '#kepengurusan' },
    { label: 'Program', href: '#program-kerja' },
    { label: 'Berita', href: '#berita' },
  ];

  const secondaryLinks = [
    { label: 'Sejarah', href: '#sejarah', icon: BookOpen },
    { label: 'Dokumentasi Kegiatan', href: '#kegiatan', icon: Calendar },
    { label: 'Prestasi & Penghargaan', href: '#prestasi', icon: Award },
    { label: 'Galeri Foto & Video', href: '#galeri', icon: BookOpen },
    { label: 'Kalender Agenda', href: '#kalender', icon: Calendar },
    { label: 'Layanan Organisasi', href: '#layanan', icon: UserCheck },
    { label: 'Aspirasi Guru', href: '#aspirasi', icon: MessageSquare },
    { label: 'Kontak & Sekretariat', href: '#kontak', icon: Phone },
  ];

  return (
    <>
      {/* Top Banner Notice if any */}
      {siteSettings.pengumumanDarurat && (
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white text-xs py-1.5 px-4 text-center font-medium shadow-inner tracking-wide">
          <span className="inline-block mr-2 font-bold bg-white/20 px-2 py-0.5 rounded text-[10px]">
            INFORMASI
          </span>
          {siteSettings.pengumumanDarurat}
        </div>
      )}

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200'
            : 'bg-white border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Zone 1: Brand Wordmark (Cabang PGRI dan Kecamatan Pasirwangi di bawahnya) */}
            <a
              href="#"
              className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-xl py-1 px-1 shrink-0"
              title="Cabang PGRI Kecamatan Pasirwangi"
            >
              <PgriLogo className="h-9 w-9 sm:h-10 sm:w-10 transition-transform duration-200 group-hover:scale-105 shrink-0 drop-shadow-xs" size={40} />
              <div className="flex flex-col text-left">
                <span className="neon-kilatan-text text-sm sm:text-base md:text-lg font-black tracking-tight leading-tight">
                  Cabang PGRI
                </span>
                <span className="neon-kilatan-text text-xs sm:text-sm md:text-[15px] font-bold tracking-tight leading-tight -mt-0.5">
                  Kecamatan Pasirwangi
                </span>
              </div>
            </a>

            {/* Zone 2: Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-600">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-1.5 rounded-md hover:text-emerald-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}

              {/* Dropdown for More Sections */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  onBlur={() => setTimeout(() => setMoreDropdownOpen(false), 200)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:text-emerald-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  <span>Lainnya</span>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {secondaryLinks.map((sub) => {
                      const Icon = sub.icon;
                      return (
                        <a
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setMoreDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <Icon className="h-4 w-4 text-slate-400 group-hover:text-emerald-600" />
                          <span>{sub.label}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            {/* Zone 3: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Button */}
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Pencarian Cepat (Ctrl+K)"
                aria-label="Cari informasi"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Member Portal Button (Supabase Auth) */}
              <button
                type="button"
                onClick={() => openMemberAuthModal('login')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  supabaseUser
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100 shadow-xs'
                    : 'text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100 hover:text-emerald-700'
                }`}
                title={supabaseUser ? 'Lihat Akun & Status Keanggotaan' : 'Masuk atau Daftar Akun Guru (Supabase)'}
              >
                <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden sm:inline max-w-[110px] truncate">
                  {supabaseUser
                    ? (supabaseUser.user_metadata?.full_name?.split(' ')[0] || 'Akun Saya')
                    : 'Masuk Guru'}
                </span>
              </button>

              {/* Admin Portal Button */}
              <button
                type="button"
                onClick={onOpenAdmin}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                  isAdminLoggedIn
                    ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                    : 'text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
                title="Akses Dashboard Pengurus"
              >
                <Shield className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden sm:inline">
                  {isAdminLoggedIn ? 'Admin Aktif' : 'Admin'}
                </span>
              </button>

              {/* Primary CTA: Daftar PGRI */}
              <a
                href="#pendaftaran-pgri"
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap active:scale-95"
              >
                <FileEdit className="h-4 w-4" />
                <span>Daftar PGRI</span>
              </a>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors ml-1"
                aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-1 shadow-2xl max-h-[82vh] overflow-y-auto">
            {/* Branded Mobile Header with Neon Kilatan */}
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white shadow-sm mb-3 border border-slate-800">
              <PgriLogo className="h-8 w-8 shrink-0" size={32} />
              <div className="flex flex-col text-left">
                <span className="neon-kilatan-text-dark text-xs sm:text-sm font-black tracking-tight leading-tight">
                  Cabang PGRI
                </span>
                <span className="neon-kilatan-text-dark text-[11px] sm:text-xs font-bold tracking-tight leading-tight -mt-0.5">
                  Kecamatan Pasirwangi
                </span>
              </div>
            </div>

            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
              Menu Utama
            </div>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                {link.label}
              </a>
            ))}

            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 pt-3 py-1">
              Layanan & Informasi
            </div>
            {secondaryLinks.map((sub) => {
              const Icon = sub.icon;
              return (
                <a
                  key={sub.label}
                  href={sub.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  <Icon className="h-4 w-4 text-slate-400" />
                  <span>{sub.label}</span>
                </a>
              );
            })}

            <div className="pt-4 border-t border-slate-100 mt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openMemberAuthModal('login');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs sm:text-sm rounded-lg"
              >
                <UserCheck className="h-4 w-4 text-emerald-600" />
                <span>
                  {supabaseUser
                    ? `Akun Guru (${supabaseUser.user_metadata?.full_name || supabaseUser.email})`
                    : 'Masuk / Daftar Akun Guru (Supabase)'}
                </span>
              </button>

              <a
                href="#pendaftaran-pgri"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm"
              >
                <FileEdit className="h-4 w-4" />
                <span>Formulir Pendaftaran PGRI</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium text-xs rounded-lg transition-colors"
              >
                <Shield className="h-4 w-4 text-emerald-600" />
                <span>Masuk Dashboard Pengurus</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

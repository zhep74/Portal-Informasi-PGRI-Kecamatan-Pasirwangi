'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { SambutanSection } from '@/components/SambutanSection';
import { ProfilSection } from '@/components/ProfilSection';
import { VisiMisiSection } from '@/components/VisiMisiSection';
import { KepengurusanSection } from '@/components/KepengurusanSection';
import { ProgramKerjaSection } from '@/components/ProgramKerjaSection';
import { KegiatanSection } from '@/components/KegiatanSection';
import { BeritaSection } from '@/components/BeritaSection';
import { PrestasiSection } from '@/components/PrestasiSection';
import { SejarahSection } from '@/components/SejarahSection';
import { GaleriSection } from '@/components/GaleriSection';
import { KalenderSection } from '@/components/KalenderSection';
import { LayananSection } from '@/components/LayananSection';
import { PendaftaranSection } from '@/components/PendaftaranSection';
import { AspirasiSection } from '@/components/AspirasiSection';
import { KontakSection } from '@/components/KontakSection';
import { SocialMediaSection } from '@/components/SocialMediaSection';
import { Footer } from '@/components/Footer';
import { GlobalSearchModal } from '@/components/GlobalSearchModal';
import { AdminDashboardModal } from '@/components/AdminDashboardModal';
import { MemberAuthModal } from '@/components/MemberAuthModal';

export default function Home() {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Sticky Header Navigation */}
      <Navbar
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Sambutan Resmi Ketua Cabang */}
        <SambutanSection />

        {/* Identitas & Profil PGRI Pasirwangi */}
        <ProfilSection />

        {/* Visi dan Misi */}
        <VisiMisiSection />

        {/* Struktur Kepengurusan */}
        <KepengurusanSection />

        {/* Program Kerja */}
        <ProgramKerjaSection />

        {/* Dokumentasi Kegiatan */}
        <KegiatanSection />

        {/* Warta & Berita Pendidikan */}
        <BeritaSection />

        {/* Prestasi & Penghargaan */}
        <PrestasiSection />

        {/* Sejarah Organisasi */}
        <SejarahSection />

        {/* Galeri Foto & Video */}
        <GaleriSection />

        {/* Kalender Agenda Kegiatan */}
        <KalenderSection />

        {/* Pelayanan Organisasi */}
        <LayananSection />

        {/* Pendaftaran Anggota & KTA Digital */}
        <PendaftaranSection />

        {/* Aspirasi & Suara Pendidik */}
        <AspirasiSection />

        {/* Kontak Sekretariat & Peta Lokasi */}
        <KontakSection />

        {/* Tautan Media Sosial */}
        <SocialMediaSection />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setAdminModalOpen(true)} />

      {/* Interactive Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Full Admin Management Dashboard Modal */}
      <AdminDashboardModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />

      {/* Member / Teacher Login & Register Modal (Supabase Auth) */}
      <MemberAuthModal />
    </div>
  );
}

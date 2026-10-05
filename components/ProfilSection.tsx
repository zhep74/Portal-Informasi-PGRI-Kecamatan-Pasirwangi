'use client';

import React from 'react';
import { usePgriStore } from '@/lib/store';
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  Users,
  School,
  CheckCircle,
  Award,
  Layers,
} from 'lucide-react';

export function ProfilSection() {
  const { profile, anggotaList } = usePgriStore();
  const totalAnggota = anggotaList && anggotaList.length > 0 ? anggotaList.length : profile.statistik.jumlahAnggota;

  return (
    <section id="profil" className="py-16 md:py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3">
            <Building2 className="h-3.5 w-3.5" />
            <span>Identitas & Legitimasi Organisasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Profil PGRI Cabang Kecamatan Pasirwangi
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Wadah persatuan, perjuangan, dan pembinaan profesionalisme seluruh guru dan tenaga kependidikan di bawah naungan PGRI Kabupaten Garut, Jawa Barat.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 sm:p-6 text-center hover:border-emerald-300 transition-all shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {totalAnggota.toLocaleString('id-ID')}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
              Jumlah Anggota Terdaftar
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Tabel Anggota ({anggotaList.length})</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 sm:p-6 text-center hover:border-sky-300 transition-all shadow-sm">
            <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-xl flex items-center justify-center mx-auto mb-3">
              <School className="h-6 w-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {profile.statistik.jumlahSekolah}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
              Sekolah & Madrasah Binaan
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">TK/PAUD, SD, SMP, SMA/SMK</div>
          </div>

          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 sm:p-6 text-center hover:border-amber-300 transition-all shadow-sm">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Layers className="h-6 w-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {profile.statistik.jumlahRanting}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
              Pengurus Ranting Terbina
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Gugus Sekolah & Wilayah</div>
          </div>

          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 sm:p-6 text-center hover:border-emerald-300 transition-all shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {profile.statistik.programTerlaksana}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
              Program Kerja Terlaksana
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Periode Berjalan 2025-2030</div>
          </div>
        </div>

        {/* Identity Details Card */}
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Nama Resmi Organisasi
              </div>
              <div className="font-bold text-slate-900 text-base">{profile.nama}</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Tingkat Kepengurusan
              </div>
              <div className="font-semibold text-slate-800">{profile.tingkat}</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Tahun Berdiri / Keaktifan
              </div>
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span>Tahun {profile.tahunBerdiri}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Wilayah Administrasi
              </div>
              <div className="font-semibold text-slate-800">
                Kec. {profile.kecamatan}, Kab. {profile.kabupaten}, {profile.provinsi}
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Alamat Kantor Sekretariat
              </div>
              <div className="font-medium text-slate-800 flex items-start gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{profile.alamatSekretariat}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Surat Elektronik (Email)
              </div>
              <a
                href={`mailto:${profile.email}`}
                className="font-medium text-emerald-700 hover:underline flex items-center gap-1.5"
              >
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </a>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Telepon / WhatsApp Layanan
              </div>
              <a
                href={`https://wa.me/${profile.nomorKontak.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-slate-800 hover:text-emerald-700 flex items-center gap-1.5"
              >
                <Phone className="h-4 w-4 text-emerald-600" />
                <span>{profile.nomorKontak}</span>
              </a>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Website Resmi
              </div>
              <div className="font-medium text-slate-800 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-sky-600" />
                <span>{profile.website}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import { usePgriStore } from '@/lib/store';
import { LayananItem } from '@/lib/types';
import {
  HeartHandshake,
  Shield,
  FileText,
  Users,
  BookOpen,
  MessageSquare,
  Clock,
  Phone,
  CheckCircle2,
  ChevronRight,
  X,
  ExternalLink,
} from 'lucide-react';

export function LayananSection() {
  const { layananList, profile } = usePgriStore();
  const [selectedLayanan, setSelectedLayanan] = useState<LayananItem | null>(null);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users':
        return Users;
      case 'FileText':
        return FileText;
      case 'Shield':
        return Shield;
      case 'BookOpen':
        return BookOpen;
      case 'HeartHandshake':
        return HeartHandshake;
      case 'MessageSquare':
        return MessageSquare;
      default:
        return HeartHandshake;
    }
  };

  return (
    <section id="layanan" className="py-16 md:py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3">
            <HeartHandshake className="h-3.5 w-3.5" />
            <span>Pelayanan Prima Anggota</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pelayanan PGRI Kecamatan Pasirwangi
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Layanan prima terpadu satu pintu untuk seluruh pendidik: pendaftaran anggota baru, konsultasi advokasi, santunan sosial, hingga pengaduan terpadu.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {layananList.map((lay) => {
            const IconComponent = getServiceIcon(lay.ikon);

            return (
              <div
                key={lay.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-emerald-300 hover:bg-white transition-all group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="h-6 w-6" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                    {lay.nama}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {lay.deskripsi}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>Estimasi: <strong>{lay.estimasiHari}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">PIC: {lay.kontakPic}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedLayanan(lay)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow transition-all"
                  >
                    <span>Ajukan Layanan</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Ajukan Layanan */}
        {selectedLayanan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                    Pelayanan Organisasi
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">
                    {selectedLayanan.nama}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLayanan(null)}
                  className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="py-5 space-y-4 text-xs sm:text-sm text-slate-700">
                <p className="text-slate-600 leading-relaxed">
                  {selectedLayanan.deskripsi}
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 text-xs mb-2">Persyaratan Pengajuan:</h4>
                  <ul className="space-y-1.5">
                    {selectedLayanan.syarat.map((syarat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{syarat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block">Estimasi Proses:</span>
                    <span className="font-bold text-slate-900">{selectedLayanan.estimasiHari}</span>
                  </div>
                  <div className="p-3 bg-slate-100/60 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Penanggung Jawab:</span>
                    <span className="font-bold text-slate-900 truncate block">{selectedLayanan.kontakPic}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2 justify-end">
                <a
                  href={`https://wa.me/${profile.nomorKontak.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Halo Pengurus PGRI Pasirwangi, saya ingin mengajukan layanan: *${selectedLayanan.nama}*. Mohon petunjuk selanjutnya.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Hubungi via WhatsApp</span>
                </a>

                {selectedLayanan.nama.toLowerCase().includes('pendaftaran') && (
                  <a
                    href="#pendaftaran-pgri"
                    onClick={() => setSelectedLayanan(null)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
                  >
                    <span>Isi Formulir Online</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedLayanan(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

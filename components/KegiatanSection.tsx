'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePgriStore } from '@/lib/store';
import { KegiatanItem } from '@/lib/types';
import {
  CalendarDays,
  MapPin,
  Users,
  Eye,
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export function KegiatanSection() {
  const { kegiatanList } = usePgriStore();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [selectedKegiatan, setSelectedKegiatan] = useState<KegiatanItem | null>(null);

  return (
    <section id="kegiatan" className="py-16 md:py-24 bg-slate-50 border-t border-slate-200/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Dokumentasi Nyata di Lapangan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Dokumentasi Kegiatan PGRI Pasirwangi
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Arsip visual dan catatan kegiatan nyata pengurus dan anggota dalam berbagai forum ilmiah, olahraga, sosial, dan musyawarah cabang.
          </p>
        </div>

        {/* Kegiatan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kegiatanList.map((keg) => (
            <div
              key={keg.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Photo with Overlay */}
                <div className="relative w-full h-52 bg-slate-100 overflow-hidden">
                  <Image
                    src={keg.fotoUtama || '/images/hero_pgri.jpg'}
                    alt={keg.nama}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => setLightboxImage(keg.fotoUtama || '/images/hero_pgri.jpg')}
                    className="absolute bottom-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-lg text-xs backdrop-blur-sm transition-all"
                    title="Perbesar Foto"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded shadow">
                    {keg.pesertaCount} Peserta
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                    {keg.nama}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <CalendarDays className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{keg.tanggal} ({keg.waktu})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{keg.lokasi}</span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {keg.deskripsi}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedKegiatan(keg)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors border border-slate-100"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Rincian & Foto Lengkap</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Detail Kegiatan */}
        {selectedKegiatan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                    {selectedKegiatan.tanggal}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">
                    {selectedKegiatan.nama}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedKegiatan(null)}
                  className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Photo Showcase */}
              <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mt-4 bg-slate-100">
                <Image
                  src={selectedKegiatan.fotoUtama || '/images/hero_pgri.jpg'}
                  alt={selectedKegiatan.nama}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5 p-4 rounded-xl bg-slate-50 text-xs">
                <div>
                  <span className="text-slate-400 block">Waktu:</span>
                  <span className="font-semibold text-slate-800">{selectedKegiatan.waktu}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Lokasi:</span>
                  <span className="font-semibold text-slate-800">{selectedKegiatan.lokasi}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Peserta Terlibat:</span>
                  <span className="font-semibold text-slate-800">{selectedKegiatan.pesertaCount} Orang</span>
                </div>
              </div>

              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Deskripsi Kegiatan:</h4>
                <p>{selectedKegiatan.deskripsi}</p>
              </div>

              {/* Galeri Tambahan */}
              {selectedKegiatan.galeriDokumentasi && selectedKegiatan.galeriDokumentasi.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 text-xs mb-3">Foto Dokumentasi Tambahan:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedKegiatan.galeriDokumentasi.map((foto, idx) => (
                      <div
                        key={idx}
                        onClick={() => setLightboxImage(foto)}
                        className="relative h-24 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 border border-slate-200"
                      >
                        <Image
                          src={foto}
                          alt="Dokumentasi"
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedKegiatan(null)}
                  className="px-5 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-150"
            onClick={() => setLightboxImage(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-5 right-5 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative max-w-4xl max-h-[85vh] w-full h-[70vh] rounded-2xl overflow-hidden">
              <Image
                src={lightboxImage}
                alt="Pratinjau Foto"
                fill
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePgriStore } from '@/lib/store';
import { GaleriItem } from '@/lib/types';
import {
  Image as ImageIcon,
  Video,
  Play,
  Maximize2,
  X,
  ExternalLink,
  Film,
} from 'lucide-react';

export function GaleriSection() {
  const { galeriList } = usePgriStore();
  const [activeTab, setActiveTab] = useState<'foto' | 'video'>('foto');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<GaleriItem | null>(null);

  const filteredItems = galeriList.filter((g) => g.tipe === activeTab);

  return (
    <section id="galeri" className="py-16 md:py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3">
            <Film className="h-3.5 w-3.5" />
            <span>Dokumentasi Visual & Multimedia</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Galeri PGRI Cabang Pasirwangi
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Kumpulan momen bersejarah, aksi kepedulian sosial, dan tayangan video kegiatan kebersamaan guru Pasirwangi.
          </p>
        </div>

        {/* Tab Toggle: Foto vs Video */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('foto')}
              className={`flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeTab === 'foto'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="h-4 w-4 text-emerald-600" />
              <span>Galeri Foto</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeTab === 'video'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="h-4 w-4 text-emerald-600" />
              <span>Galeri Video</span>
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isVideo = item.tipe === 'video';

            return (
              <div
                key={item.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
              >
                {/* Media Container */}
                <div
                  className="relative w-full h-52 bg-slate-900 overflow-hidden cursor-pointer"
                  onClick={() => {
                    if (isVideo) {
                      setActiveVideo(item);
                    } else {
                      setLightboxImage(item.url);
                    }
                  }}
                >
                  <Image
                    src={
                      item.thumbnailUrl ||
                      (item.youtubeId
                        ? `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`
                        : item.url || '/images/hero_pgri.jpg')
                    }
                    alt={item.judul}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />

                  {isVideo ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors">
                      <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 fill-white ml-0.5" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="h-4 w-4" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                    {item.kategori}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="text-[11px] font-mono text-slate-400 mb-1">
                    Tahun {item.tahun}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                    {item.judul}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.deskripsi}
                  </p>
                </div>

                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (isVideo) setActiveVideo(item);
                      else setLightboxImage(item.url);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors border border-slate-200"
                  >
                    {isVideo ? <Play className="h-3.5 w-3.5 text-emerald-600" /> : <Maximize2 className="h-3.5 w-3.5" />}
                    <span>{isVideo ? 'Putar Video' : 'Lihat Foto'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Video Player Modal */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-150">
            <div className="bg-slate-900 rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-slate-800 text-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white truncate max-w-[80%]">
                  {activeVideo.judul}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* YouTube Embed Player */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden my-4 bg-black">
                {activeVideo.youtubeId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                    title={activeVideo.judul}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                    URL Video tidak valid
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activeVideo.deskripsi}
              </p>
            </div>
          </div>
        )}

        {/* Image Lightbox Modal */}
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
                alt="Foto Galeri"
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

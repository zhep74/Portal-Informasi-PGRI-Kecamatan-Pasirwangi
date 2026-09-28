'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePgriStore } from '@/lib/store';
import { BeritaItem } from '@/lib/types';
import {
  Newspaper,
  Calendar,
  User,
  Eye,
  Search,
  Share2,
  Copy,
  Check,
  ChevronRight,
  X,
  MessageCircle,
} from 'lucide-react';

export function BeritaSection() {
  const { beritaList, incrementBeritaViews, showToast } = usePgriStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeBerita, setActiveBerita] = useState<BeritaItem | null>(null);
  const [copied, setCopied] = useState(false);

  const categories = [
    { key: 'all', label: 'Semua Kategori' },
    { key: 'Organisasi', label: 'Organisasi' },
    { key: 'Pendidikan', label: 'Pendidikan' },
    { key: 'Kegiatan', label: 'Kegiatan' },
    { key: 'Informasi Anggota', label: 'Informasi Anggota' },
    { key: 'Prestasi', label: 'Prestasi' },
    { key: 'Pengumuman', label: 'Pengumuman' },
  ];

  const filteredBerita = beritaList.filter((b) => {
    const matchCat = selectedCategory === 'all' || b.kategori === selectedCategory;
    const matchSearch =
      b.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ringkasan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = beritaList.find((b) => b.featured) || beritaList[0];

  const handleOpenDetail = (b: BeritaItem) => {
    setActiveBerita(b);
    incrementBeritaViews(b.id);
  };

  const handleShareWhatsApp = (b: BeritaItem) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = encodeURIComponent(
      `*${b.judul}*\n\n${b.ringkasan}\n\nBaca selengkapnya di Portal PGRI Pasirwangi:\n${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast('Tautan berita berhasil disalin ke clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="berita" className="py-16 md:py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3">
            <Newspaper className="h-3.5 w-3.5" />
            <span>Kabar & Warta Edukasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Berita PGRI Cabang Pasirwangi
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Publikasi informasi resmi seputar dinamika organisasi, advokasi guru, inovasi pendidikan, dan kegiatan cabang Pasirwangi.
          </p>
        </div>

        {/* Featured Story Marquee */}
        {featured && (
          <div className="mb-12 bg-slate-900 rounded-3xl overflow-hidden shadow-xl text-white grid grid-cols-1 lg:grid-cols-12 border border-slate-800">
            <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto min-h-[280px]">
              <Image
                src={featured.fotoUrl || '/images/hero_pgri.jpg'}
                alt={featured.judul}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Berita Utama
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold mb-2">
                  <span>{featured.kategori}</span>
                  <span aria-hidden="true">·</span>
                  <span>{featured.tanggal}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold leading-snug text-white">
                  {featured.judul}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                  {featured.ringkasan}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <User className="h-3.5 w-3.5" />
                  <span>{featured.penulis}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenDetail(featured)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                >
                  <span>Baca Warta</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Categories Tab */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  selectedCategory === cat.key
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul berita..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>
        </div>

        {/* Berita Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBerita.map((item) => (
            <article
              key={item.id}
              className="bg-slate-50 rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                  <Image
                    src={item.fotoUrl || '/images/hero_pgri.jpg'}
                    alt={item.judul}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                    {item.kategori}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                    <Calendar className="h-3 w-3" />
                    <span>{item.tanggal}</span>
                    <span aria-hidden="true">·</span>
                    <Eye className="h-3 w-3" />
                    <span>{item.dibacaCount}x</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                    {item.judul}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.ringkasan}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-200/50 mt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                  Oleh: {item.penulis}
                </span>

                <button
                  type="button"
                  onClick={() => handleOpenDetail(item)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800"
                >
                  <span>Baca</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Modal Reader Detail Berita */}
        {activeBerita && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                    {activeBerita.kategori}
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mt-2 leading-snug">
                    {activeBerita.judul}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      <span>{activeBerita.penulis}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{activeBerita.tanggal}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>Dibaca {activeBerita.dibacaCount} kali</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveBerita(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Photo */}
              <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden my-6 bg-slate-100">
                <Image
                  src={activeBerita.fotoUrl || '/images/hero_pgri.jpg'}
                  alt={activeBerita.judul}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Article Content */}
              <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-4 whitespace-pre-line border-b border-slate-100 pb-6">
                <p className="font-semibold text-slate-900 text-base leading-snug">
                  {activeBerita.ringkasan}
                </p>
                <p>{activeBerita.isi}</p>
              </div>

              {/* Share & Actions Footer */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Bagikan Berita:</span>
                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(activeBerita)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Tersalin' : 'Salin Tautan'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveBerita(null)}
                  className="px-5 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Tutup Berita
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

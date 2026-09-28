'use client';

import React, { useState, useEffect } from 'react';
import { usePgriStore } from '@/lib/store';
import {
  Search,
  X,
  Newspaper,
  Calendar,
  Briefcase,
  Users,
  Award,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const { beritaList, kegiatanList, programKerjaList, pengurusList, prestasiList } = usePgriStore();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Search Results
  const matchedBerita = q
    ? beritaList.filter(
        (b) => b.judul.toLowerCase().includes(q) || b.ringkasan.toLowerCase().includes(q)
      )
    : [];

  const matchedKegiatan = q
    ? kegiatanList.filter(
        (k) => k.nama.toLowerCase().includes(q) || k.deskripsi.toLowerCase().includes(q)
      )
    : [];

  const matchedProgram = q
    ? programKerjaList.filter(
        (p) =>
          p.nama.toLowerCase().includes(q) ||
          p.bidang.toLowerCase().includes(q) ||
          p.deskripsi.toLowerCase().includes(q)
      )
    : [];

  const matchedPengurus = q
    ? pengurusList.filter(
        (p) =>
          p.nama.toLowerCase().includes(q) ||
          p.jabatan.toLowerCase().includes(q) ||
          p.unitKerja.toLowerCase().includes(q)
      )
    : [];

  const matchedPrestasi = q
    ? prestasiList.filter(
        (p) =>
          p.namaPrestasi.toLowerCase().includes(q) ||
          p.penerima.toLowerCase().includes(q) ||
          p.deskripsi.toLowerCase().includes(q)
      )
    : [];

  const totalResults =
    matchedBerita.length +
    matchedKegiatan.length +
    matchedProgram.length +
    matchedPengurus.length +
    matchedPrestasi.length;

  const handleNavigate = (hash: string) => {
    onClose();
    if (typeof window !== 'undefined') {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Box */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3">
          <Search className="h-5 w-5 text-emerald-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari berita, pengurus, program, kegiatan, atau prestasi..."
            className="flex-1 text-sm sm:text-base bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-800 placeholder-slate-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg text-xs"
            >
              Hapus
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Results Container */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {!q ? (
            <div className="text-center py-10 space-y-3">
              <Search className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-slate-500 font-medium">
                Ketik kata kunci untuk mencari seluruh konten Portal PGRI Pasirwangi.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setQuery('KTA')}
                  className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-slate-600"
                >
                  KTA Digital
                </button>
                <button
                  type="button"
                  onClick={() => setQuery('Kurikulum')}
                  className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-slate-600"
                >
                  Kurikulum Merdeka
                </button>
                <button
                  type="button"
                  onClick={() => setQuery('Advokasi')}
                  className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-slate-600"
                >
                  Bantuan Hukum
                </button>
                <button
                  type="button"
                  onClick={() => setQuery('Ketua')}
                  className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-slate-600"
                >
                  Pengurus Harian
                </button>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-10 text-slate-500">
              Tidak ditemukan hasil untuk pencarian &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Berita Results */}
              {matchedBerita.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                    <Newspaper className="h-3.5 w-3.5" />
                    <span>Warta Berita ({matchedBerita.length})</span>
                  </div>
                  <div className="space-y-2">
                    {matchedBerita.map((b, idx) => (
                      <div
                        key={`${b.id}-${idx}`}
                        onClick={() => handleNavigate('#berita')}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{b.judul}</h4>
                          <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">{b.ringkasan}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Program Kerja Results */}
              {matchedProgram.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-wider mb-2">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>Program Kerja ({matchedProgram.length})</span>
                  </div>
                  <div className="space-y-2">
                    {matchedProgram.map((p, idx) => (
                      <div
                        key={`${p.id}-${idx}`}
                        onClick={() => handleNavigate('#program-kerja')}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-100 cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{p.nama}</h4>
                          <span className="text-[11px] text-slate-500">{p.bidang} · {p.status}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pengurus Results */}
              {matchedPengurus.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                    <Users className="h-3.5 w-3.5" />
                    <span>Pengurus Organisasi ({matchedPengurus.length})</span>
                  </div>
                  <div className="space-y-2">
                    {matchedPengurus.map((p, idx) => (
                      <div
                        key={`${p.id}-${idx}`}
                        onClick={() => handleNavigate('#kepengurusan')}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{p.nama}</h4>
                          <span className="text-[11px] text-slate-500">{p.jabatan} · {p.unitKerja}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kegiatan Results */}
              {matchedKegiatan.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Dokumentasi Kegiatan ({matchedKegiatan.length})</span>
                  </div>
                  <div className="space-y-2">
                    {matchedKegiatan.map((k, idx) => (
                      <div
                        key={`${k.id}-${idx}`}
                        onClick={() => handleNavigate('#kegiatan')}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-100 cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{k.nama}</h4>
                          <span className="text-[11px] text-slate-500">{k.tanggal} · {k.lokasi}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prestasi Results */}
              {matchedPrestasi.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                    <Award className="h-3.5 w-3.5" />
                    <span>Prestasi & Penghargaan ({matchedPrestasi.length})</span>
                  </div>
                  <div className="space-y-2">
                    {matchedPrestasi.map((pres, idx) => (
                      <div
                        key={`${pres.id}-${idx}`}
                        onClick={() => handleNavigate('#prestasi')}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-100 cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{pres.namaPrestasi}</h4>
                          <span className="text-[11px] text-slate-500">{pres.penerima} ({pres.tingkat})</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 px-5">
          <span>Tekan ESC untuk menutup</span>
          <span>Pencarian Real-time Seluruh Sistem</span>
        </div>
      </div>
    </div>
  );
}

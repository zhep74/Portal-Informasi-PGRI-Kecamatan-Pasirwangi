'use client';

import React from 'react';
import { usePgriStore } from '@/lib/store';
import {
  Globe,
  MessageCircle,
  Send,
  Video,
  ExternalLink,
  Share2,
} from 'lucide-react';

export function SocialMediaSection() {
  const { socialMedia } = usePgriStore();

  const channels = [
    {
      name: 'Facebook',
      url: socialMedia.facebook,
      bg: 'hover:bg-blue-600',
      text: 'PGRI Pasirwangi',
      badge: 'Komunitas',
    },
    {
      name: 'Instagram',
      url: socialMedia.instagram,
      bg: 'hover:bg-pink-600',
      text: '@pgri_pasirwangi',
      badge: 'Galeri Foto & Cerita',
    },
    {
      name: 'YouTube',
      url: socialMedia.youtube,
      bg: 'hover:bg-emerald-600',
      text: 'Kanal Video Edukasi',
      badge: 'Dokumenter & Mars',
    },
    {
      name: 'TikTok',
      url: socialMedia.tiktok,
      bg: 'hover:bg-slate-900',
      text: '@pgripasirwangi',
      badge: 'Tips Guru Kreatif',
    },
    {
      name: 'WhatsApp',
      url: socialMedia.whatsapp,
      bg: 'hover:bg-emerald-600',
      text: 'Saluran Informasi Resmi',
      badge: 'Warta Kilat',
    },
    {
      name: 'Telegram',
      url: socialMedia.telegram,
      bg: 'hover:bg-sky-500',
      text: 'Grup Diskusi Guru',
      badge: 'Arsip Berkas',
    },
  ];

  // Only display channels with non-empty URLs
  const activeChannels = channels.filter((c) => c.url && c.url.trim().length > 0);

  if (activeChannels.length === 0) return null;

  return (
    <section className="py-12 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">
              <Share2 className="h-3.5 w-3.5" />
              <span>Jejaring Komunikasi Digital</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Ikuti PGRI Kecamatan Pasirwangi
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              Dapatkan pembaruan tercepat seputar informasi kenaikan pangkat, sertifikasi, perlindungan guru, dan agenda seminar.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto">
            {activeChannels.map((ch) => (
              <a
                key={ch.name}
                href={ch.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold border border-white/15 backdrop-blur-sm transition-all active:scale-95 group"
              >
                <span>{ch.name}</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

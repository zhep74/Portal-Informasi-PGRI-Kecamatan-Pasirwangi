'use client';

import React from 'react';
import { usePgriStore } from '@/lib/store';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  MessageCircle,
  Building,
} from 'lucide-react';

export function KontakSection() {
  const { profile } = usePgriStore();

  const cleanWaNumber = profile.nomorKontak.replace(/[^0-9]/g, '');

  return (
    <section id="kontak" className="py-16 md:py-24 bg-slate-50 border-t border-slate-200/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3">
            <Building className="h-3.5 w-3.5" />
            <span>Pusat Komunikasi & Sekretariat</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kontak PGRI Cabang Kecamatan Pasirwangi
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Hubungi kami untuk koordinasi kedinasan, konsultasi organisasi, ataupun silaturahmi langsung ke kantor sekretariat cabang.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards & Info */}
          <div className="lg:col-span-5 space-y-4">
            {/* Address Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Kantor Sekretariat</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {profile.alamatSekretariat}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Kecamatan Pasirwangi, Kabupaten Garut, Jawa Barat 44161
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp & Phone Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900">Layanan WhatsApp & Telepon</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {profile.nomorKontak}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
                        'Halo Pengurus PGRI Pasirwangi, saya ingin menanyakan perihal layanan organisasi.'
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Chat WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Surat Elektronik (Email)</h3>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-xs text-emerald-600 hover:underline mt-1 block font-medium"
                  >
                    {profile.email}
                  </a>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Menerima tembusan surat undangan kedinasan & permohonan rekomendasi.
                  </p>
                </div>
              </div>
            </div>

            {/* Jam Pelayanan Card */}
            <div className="bg-slate-100/70 rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span>Jam Pelayanan Sekretariat:</span>
              </div>
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Senin - Jumat:</span>
                  <span className="font-semibold text-slate-900">08:00 - 15:30 WIB</span>
                </div>
                <div className="flex justify-between">
                  <span>Sabtu:</span>
                  <span className="font-semibold text-slate-900">08:00 - 13:00 WIB</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Minggu / Hari Libur:</span>
                  <span>Tutup (Konsultasi Darurat via WA)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Interactive Embed & Directions */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between h-full min-h-[460px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Peta Lokasi Wilayah Pasirwangi, Garut
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kawasan lereng pegunungan Kamojang & Darajat, Kabupaten Garut
                  </p>
                </div>

                <a
                  href="https://maps.google.com/?q=Pasirwangi+Garut"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Buka Google Maps</span>
                </a>
              </div>

              {/* Map Embed Frame */}
              <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <iframe
                  title="Peta Lokasi Pasirwangi Garut"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63321.72472935222!2d107.74659795!3d-7.2144365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68ba9b0849fc3f%3A0xc3b83d1c8c88f342!2sPasirwangi%2C%20Garut%20Regency%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Sekretariat PGRI Pasirwangi mudah diakses kendaraan roda 2 dan 4.</span>
              <span className="font-semibold text-emerald-700">Dekat Kantor Kecamatan Pasirwangi</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

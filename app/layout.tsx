import type { Metadata } from 'next';
import './globals.css';
import { PgriProvider } from '@/lib/store';
import { ToastContainer } from '@/components/ToastContainer';

export const metadata: Metadata = {
  title: 'PGRI Kecamatan Pasirwangi | Portal Informasi Digital',
  description:
    'Portal Informasi Digital PGRI Cabang Kecamatan Pasirwangi berisi profil organisasi, kepengurusan, program kerja, kegiatan, berita, layanan anggota, pendaftaran PGRI, dan informasi organisasi.',
  keywords: [
    'PGRI Pasirwangi',
    'PGRI Cabang Kecamatan Pasirwangi',
    'PGRI Garut',
    'Guru Pasirwangi',
    'Pendaftaran PGRI',
    'KTA Digital PGRI',
    'Pendidikan Pasirwangi',
    'Persatuan Guru Republik Indonesia',
  ],
  authors: [{ name: 'Pengurus Cabang PGRI Kecamatan Pasirwangi' }],
  openGraph: {
    title: 'PGRI Kecamatan Pasirwangi | Portal Informasi Digital',
    description:
      'Portal Informasi Digital PGRI Cabang Kecamatan Pasirwangi berisi profil organisasi, kepengurusan, program kerja, kegiatan, berita, layanan anggota, pendaftaran PGRI, dan informasi organisasi.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Portal PGRI Pasirwangi',
    images: [
      {
        url: '/images/hero_pgri.jpg',
        width: 1200,
        height: 630,
        alt: 'PGRI Cabang Kecamatan Pasirwangi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PGRI Kecamatan Pasirwangi | Portal Informasi Digital',
    description:
      'Portal Informasi Digital PGRI Cabang Kecamatan Pasirwangi berisi profil organisasi, kepengurusan, program kerja, kegiatan, berita, layanan anggota, pendaftaran PGRI, dan informasi organisasi.',
    images: ['/images/hero_pgri.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'PGRI Cabang Kecamatan Pasirwangi',
  alternateName: 'Persatuan Guru Republik Indonesia Cabang Pasirwangi',
  url: 'https://pgri-pasirwangi.or.id',
  logo: '/images/hero_pgri.jpg',
  description:
    'Organisasi profesi guru tingkat cabang di Kecamatan Pasirwangi, Kabupaten Garut, Jawa Barat.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. Raya Pasirwangi No. 12',
    addressLocality: 'Pasirwangi',
    addressRegion: 'Jawa Barat',
    postalCode: '44161',
    addressCountry: 'ID',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+62-812-2345-6789',
    contactType: 'customer support',
    availableLanguage: ['Indonesian', 'Sundanese'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-slate-50 text-slate-800 antialiased selection:bg-emerald-600 selection:text-white" suppressHydrationWarning>
        <PgriProvider>
          {children}
          <ToastContainer />
        </PgriProvider>
      </body>
    </html>
  );
}

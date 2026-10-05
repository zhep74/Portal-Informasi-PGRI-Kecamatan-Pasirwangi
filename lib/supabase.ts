import { createClient, User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';
import {
  OrgProfile,
  SejarahItem,
  VisiMisi,
  PengurusItem,
  ProgramKerjaItem,
  KegiatanItem,
  BeritaItem,
  PrestasiItem,
  GaleriItem,
  KalenderItem,
  LayananItem,
  PendaftaranItem,
  AspirasiItem,
  SocialMediaLinks,
  SiteSettings,
  AnggotaItem,
} from './types';

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vokxvtbijnubrzbdazxs.supabase.co';
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_IkMLaK5ws_UzfJpdJszBtA_7dFM7LUJ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_COMPLETE_SQL = `-- ====================================================================
-- SKRIP TABEL BASIS DATA LENGKAP PGRI CABANG KECAMATAN PASIRWANGI
-- Proyek Supabase: vokxvtbijnubrzbdazxs
-- Tautan SQL Editor: https://supabase.com/dashboard/project/vokxvtbijnubrzbdazxs/sql/new
-- ====================================================================

-- 1. TABEL PROFIL & STATISTIK (Kelola Profil & Statistik)
create table if not exists public.pgri_profil (
  id text primary key default 'main',
  nama text not null,
  tingkat text not null,
  kecamatan text not null,
  kabupaten text not null,
  provinsi text not null,
  alamat_sekretariat text not null,
  email text not null,
  nomor_kontak text not null,
  website text default '',
  tahun_berdiri text default '1962',
  logo_url text default '',
  favicon_url text default '',
  browser_title text default '',
  sambutan_ketua jsonb not null default '{}'::jsonb,
  statistik jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TABEL SEJARAH (Kelola Sejarah)
create table if not exists public.pgri_sejarah (
  id text primary key,
  tahun text not null,
  judul text not null,
  ringkasan text not null,
  isi_lengkap text not null,
  gambar_url text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. TABEL VISI & MISI (Kelola Visi & Misi)
create table if not exists public.pgri_visi_misi (
  id text primary key default 'main',
  visi text not null,
  misi jsonb not null default '[]'::jsonb,
  tujuan jsonb not null default '[]'::jsonb,
  moto text default '',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TABEL PENGURUS (Kelola Pengurus)
create table if not exists public.pgri_pengurus (
  id text primary key,
  nama text not null,
  jabatan text not null,
  kategori text not null,
  bidang_nama text default '',
  foto_url text default '',
  periode text not null,
  nip text default '',
  nuptk text default '',
  unit_kerja text default '',
  no_urut integer default 0,
  keterangan_singkat text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. TABEL PROGRAM KERJA (Kelola Program Kerja)
create table if not exists public.pgri_program_kerja (
  id text primary key,
  nama text not null,
  deskripsi text not null,
  bidang text not null,
  target text not null,
  waktu_pelaksanaan text not null,
  tahun text not null,
  status text not null default 'Direncanakan',
  penanggung_jawab text not null,
  progress_percent integer default 0,
  dokumentasi_url text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. TABEL KEGIATAN (Kelola Kegiatan)
create table if not exists public.pgri_kegiatan (
  id text primary key,
  nama text not null,
  tanggal text not null,
  waktu text not null,
  lokasi text not null,
  deskripsi text not null,
  peserta_count integer default 0,
  foto_utama text default '',
  galeri_dokumentasi jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. TABEL BERITA (Kelola Berita)
create table if not exists public.pgri_berita (
  id text primary key,
  slug text not null,
  judul text not null,
  ringkasan text not null,
  isi text not null,
  kategori text not null,
  tanggal text not null,
  penulis text not null,
  foto_url text default '',
  dibaca_count integer default 0,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. TABEL PRESTASI (Kelola Prestasi)
create table if not exists public.pgri_prestasi (
  id text primary key,
  nama_prestasi text not null,
  tahun text not null,
  penerima text not null,
  kategori text not null,
  tingkat text not null,
  foto_piagam text default '',
  deskripsi text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. TABEL GALERI (Kelola Galeri)
create table if not exists public.pgri_galeri (
  id text primary key,
  tipe text not null default 'foto',
  judul text not null,
  deskripsi text default '',
  url text not null,
  youtube_id text default '',
  thumbnail_url text default '',
  kategori text default 'Kegiatan',
  tahun text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. TABEL KALENDER (Kelola Kalender)
create table if not exists public.pgri_kalender (
  id text primary key,
  judul text not null,
  tanggal text not null,
  jam_mulai text default '',
  jam_selesai text default '',
  lokasi text not null,
  penanggung_jawab text default '',
  deskripsi text default '',
  kategori text not null,
  status text not null default 'Akan Datang',
  link_informasi text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. TABEL LAYANAN (Kelola Layanan)
create table if not exists public.pgri_layanan (
  id text primary key,
  nama text not null,
  deskripsi text not null,
  syarat jsonb not null default '[]'::jsonb,
  ikon text default 'HeartHandshake',
  kontak_pic text default '',
  estimasi_hari text default '1-3 Hari Kerja',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. TABEL ASPIRASI ANGGOTA (Aspirasi Anggota)
create table if not exists public.pgri_aspirasi (
  id text primary key,
  tiket_id text not null,
  tanggal text not null,
  nama text not null,
  is_anonim boolean default false,
  no_whatsapp text default '',
  instansi text default '',
  kategori text not null,
  judul text not null,
  isi text not null,
  status text not null default 'Diterima',
  respon_admin text default '',
  tanggal_respon text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 13. TABEL PENDAFTARAN ANGGOTA (Pendaftaran Masuk)
create table if not exists public.pgri_pendaftaran (
  id text primary key,
  nomor_pendaftaran text not null,
  nama_lengkap text not null,
  nik_nip text default '',
  nuptk text default '',
  tempat_tanggal_lahir text default '',
  jenis_kelamin text default 'Laki-laki',
  instansi text default '',
  jabatan text default '',
  mapel text default '',
  alamat text default '',
  no_whatsapp text default '',
  email text default '',
  kecamatan text default 'Pasirwangi',
  status_kepegawaian text default 'Guru Honorer Sekolah',
  nomor_anggota_lama text default '',
  tanggal_daftar text not null,
  status text default 'Baru' not null,
  catatan_admin text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 14. TABEL STORE UMUM & CADANGAN
create table if not exists public.pgri_store (
  key text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 15. TABEL DAFTAR ANGGOTA (SIM PGRI Pasirwangi)
create table if not exists public.pgri_anggota (
  id text primary key,
  nama text not null,
  npa text not null,
  nik text not null,
  tempat_lahir text not null,
  tanggal_lahir text not null,
  foto text default '',
  no_telepon text not null,
  unit_kerja text default '',
  ranting text default '',
  status_keanggotaan text default 'Aktif',
  jenis_kelamin text default 'Laki-laki',
  email text default '',
  alamat text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_pgri_anggota_npa on public.pgri_anggota(npa);
create index if not exists idx_pgri_anggota_nik on public.pgri_anggota(nik);
create index if not exists idx_pgri_anggota_nama on public.pgri_anggota(nama);

-- ====================================================================
-- AKTIFKAN ROW LEVEL SECURITY (RLS) & KEBIJAKAN AKSES
-- ====================================================================

alter table public.pgri_profil enable row level security;
alter table public.pgri_sejarah enable row level security;
alter table public.pgri_visi_misi enable row level security;
alter table public.pgri_pengurus enable row level security;
alter table public.pgri_program_kerja enable row level security;
alter table public.pgri_kegiatan enable row level security;
alter table public.pgri_berita enable row level security;
alter table public.pgri_prestasi enable row level security;
alter table public.pgri_galeri enable row level security;
alter table public.pgri_kalender enable row level security;
alter table public.pgri_layanan enable row level security;
alter table public.pgri_aspirasi enable row level security;
alter table public.pgri_pendaftaran enable row level security;
alter table public.pgri_store enable row level security;
alter table public.pgri_anggota enable row level security;

-- HAPUS KEBIJAKAN SEBELUMNYA AGAR DAPAT DI-RUN ULANG DENGAN AMAN
drop policy if exists "policy_profil_select" on public.pgri_profil;
drop policy if exists "policy_profil_all" on public.pgri_profil;
drop policy if exists "policy_sejarah_select" on public.pgri_sejarah;
drop policy if exists "policy_sejarah_all" on public.pgri_sejarah;
drop policy if exists "policy_visi_select" on public.pgri_visi_misi;
drop policy if exists "policy_visi_all" on public.pgri_visi_misi;
drop policy if exists "policy_pengurus_select" on public.pgri_pengurus;
drop policy if exists "policy_pengurus_all" on public.pgri_pengurus;
drop policy if exists "policy_program_select" on public.pgri_program_kerja;
drop policy if exists "policy_program_all" on public.pgri_program_kerja;
drop policy if exists "policy_kegiatan_select" on public.pgri_kegiatan;
drop policy if exists "policy_kegiatan_all" on public.pgri_kegiatan;
drop policy if exists "policy_berita_select" on public.pgri_berita;
drop policy if exists "policy_berita_all" on public.pgri_berita;
drop policy if exists "policy_prestasi_select" on public.pgri_prestasi;
drop policy if exists "policy_prestasi_all" on public.pgri_prestasi;
drop policy if exists "policy_galeri_select" on public.pgri_galeri;
drop policy if exists "policy_galeri_all" on public.pgri_galeri;
drop policy if exists "policy_kalender_select" on public.pgri_kalender;
drop policy if exists "policy_kalender_all" on public.pgri_kalender;
drop policy if exists "policy_layanan_select" on public.pgri_layanan;
drop policy if exists "policy_layanan_all" on public.pgri_layanan;
drop policy if exists "policy_aspirasi_select" on public.pgri_aspirasi;
drop policy if exists "policy_aspirasi_all" on public.pgri_aspirasi;
drop policy if exists "policy_pendaftaran_select" on public.pgri_pendaftaran;
drop policy if exists "policy_pendaftaran_all" on public.pgri_pendaftaran;
drop policy if exists "policy_store_select" on public.pgri_store;
drop policy if exists "policy_store_all" on public.pgri_store;
drop policy if exists "policy_anggota_select" on public.pgri_anggota;
drop policy if exists "policy_anggota_all" on public.pgri_anggota;

-- BUAT KEBIJAKAN IZIN BACA PUBLIK
create policy "policy_profil_select" on public.pgri_profil for select using (true);
create policy "policy_profil_all" on public.pgri_profil for all using (true) with check (true);

create policy "policy_sejarah_select" on public.pgri_sejarah for select using (true);
create policy "policy_sejarah_all" on public.pgri_sejarah for all using (true) with check (true);

create policy "policy_visi_select" on public.pgri_visi_misi for select using (true);
create policy "policy_visi_all" on public.pgri_visi_misi for all using (true) with check (true);

create policy "policy_pengurus_select" on public.pgri_pengurus for select using (true);
create policy "policy_pengurus_all" on public.pgri_pengurus for all using (true) with check (true);

create policy "policy_program_select" on public.pgri_program_kerja for select using (true);
create policy "policy_program_all" on public.pgri_program_kerja for all using (true) with check (true);

create policy "policy_kegiatan_select" on public.pgri_kegiatan for select using (true);
create policy "policy_kegiatan_all" on public.pgri_kegiatan for all using (true) with check (true);

create policy "policy_berita_select" on public.pgri_berita for select using (true);
create policy "policy_berita_all" on public.pgri_berita for all using (true) with check (true);

create policy "policy_prestasi_select" on public.pgri_prestasi for select using (true);
create policy "policy_prestasi_all" on public.pgri_prestasi for all using (true) with check (true);

create policy "policy_galeri_select" on public.pgri_galeri for select using (true);
create policy "policy_galeri_all" on public.pgri_galeri for all using (true) with check (true);

create policy "policy_kalender_select" on public.pgri_kalender for select using (true);
create policy "policy_kalender_all" on public.pgri_kalender for all using (true) with check (true);

create policy "policy_layanan_select" on public.pgri_layanan for select using (true);
create policy "policy_layanan_all" on public.pgri_layanan for all using (true) with check (true);

create policy "policy_aspirasi_select" on public.pgri_aspirasi for select using (true);
create policy "policy_aspirasi_all" on public.pgri_aspirasi for all using (true) with check (true);

create policy "policy_pendaftaran_select" on public.pgri_pendaftaran for select using (true);
create policy "policy_pendaftaran_all" on public.pgri_pendaftaran for all using (true) with check (true);

create policy "policy_store_select" on public.pgri_store for select using (true);
create policy "policy_store_all" on public.pgri_store for all using (true) with check (true);

create policy "policy_anggota_select" on public.pgri_anggota for select using (true);
create policy "policy_anggota_all" on public.pgri_anggota for all using (true) with check (true);

-- AKTIFKAN REPLIKASI REALTIME SUPABASE UNTUK SELURUH TABEL
-- Menggunakan SET TABLE agar aman dieksekusi berkali-kali tanpa error
alter publication supabase_realtime set table 
  public.pgri_profil,
  public.pgri_sejarah,
  public.pgri_visi_misi,
  public.pgri_pengurus,
  public.pgri_program_kerja,
  public.pgri_kegiatan,
  public.pgri_berita,
  public.pgri_prestasi,
  public.pgri_galeri,
  public.pgri_kalender,
  public.pgri_layanan,
  public.pgri_aspirasi,
  public.pgri_pendaftaran,
  public.pgri_store,
  public.pgri_anggota;
`;

export const SUPABASE_ANGGOTA_SQL = `-- ====================================================================
-- SKRIP TABEL DAFTAR ANGGOTA PGRI CABANG KECAMATAN PASIRWANGI
-- Salin dan jalankan di SQL Editor Supabase:
-- https://supabase.com/dashboard/project/vokxvtbijnubrzbdazxs/sql/new
-- ====================================================================

-- 1. Buat Tabel Anggota PGRI
create table if not exists public.pgri_anggota (
  id text primary key,
  nama text not null,
  npa text not null,
  nik text not null,
  tempat_lahir text not null,
  tanggal_lahir text not null,
  foto text default '',
  no_telepon text not null,
  unit_kerja text default '',
  ranting text default '',
  status_keanggotaan text default 'Aktif',
  jenis_kelamin text default 'Laki-laki',
  email text default '',
  alamat text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Buat Index Pencarian Cepat
create index if not exists idx_pgri_anggota_npa on public.pgri_anggota(npa);
create index if not exists idx_pgri_anggota_nik on public.pgri_anggota(nik);
create index if not exists idx_pgri_anggota_nama on public.pgri_anggota(nama);

-- 3. Aktifkan Keamanan Row Level Security (RLS)
alter table public.pgri_anggota enable row level security;

-- 4. Buat Kebijakan Akses (RLS Policies)
drop policy if exists "policy_anggota_select" on public.pgri_anggota;
drop policy if exists "policy_anggota_all" on public.pgri_anggota;

create policy "policy_anggota_select" on public.pgri_anggota for select using (true);
create policy "policy_anggota_all" on public.pgri_anggota for all using (true) with check (true);

-- 5. Tambahkan ke Realtime Publication Supabase secara Aman (Idempoten)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
    and schemaname = 'public' 
    and tablename = 'pgri_anggota'
  ) then
    alter publication supabase_realtime add table public.pgri_anggota;
  end if;
end $$;
`;

export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  totalTablesReady: number;
  tableDetails: Record<string, boolean>;
  pendaftaranTableExists: boolean;
  storeTableExists: boolean;
  message: string;
}> {
  const tableList = [
    'pgri_profil',
    'pgri_sejarah',
    'pgri_visi_misi',
    'pgri_pengurus',
    'pgri_program_kerja',
    'pgri_kegiatan',
    'pgri_berita',
    'pgri_prestasi',
    'pgri_galeri',
    'pgri_kalender',
    'pgri_layanan',
    'pgri_aspirasi',
    'pgri_pendaftaran',
    'pgri_store',
  ];

  const tableDetails: Record<string, boolean> = {};
  let totalReady = 0;

  try {
    for (const t of tableList) {
      const res = await supabase.from(t).select('id').limit(1);
      if (!res.error) {
        tableDetails[t] = true;
        totalReady++;
      } else {
        tableDetails[t] = false;
      }
    }

    const pendaftaranTableExists = !!tableDetails['pgri_pendaftaran'];
    const storeTableExists = !!tableDetails['pgri_store'];

    if (totalReady === tableList.length) {
      return {
        connected: true,
        totalTablesReady: totalReady,
        tableDetails,
        pendaftaranTableExists,
        storeTableExists,
        message: `Koneksi aktif! Seluruh ${totalReady} tabel menu admin telah siap di Supabase.`,
      };
    } else if (totalReady > 0) {
      return {
        connected: true,
        totalTablesReady: totalReady,
        tableDetails,
        pendaftaranTableExists,
        storeTableExists,
        message: `Tersambung ke Supabase. ${totalReady} dari ${tableList.length} tabel siap. Jalankan skrip SQL lengkap untuk mengaktifkan seluruh tabel.`,
      };
    } else {
      return {
        connected: true,
        totalTablesReady: 0,
        tableDetails,
        pendaftaranTableExists: false,
        storeTableExists: false,
        message: 'Tersambung ke Supabase! Harap jalankan skrip SQL di Supabase SQL Editor.',
      };
    }
  } catch (err: any) {
    return {
      connected: false,
      totalTablesReady: 0,
      tableDetails,
      pendaftaranTableExists: false,
      storeTableExists: false,
      message: err.message || 'Gagal menghubungi server Supabase',
    };
  }
}

// -------------------------------------------------------------------
// CRUD FUNCTIONS FOR ALL ADMIN SIDEBAR MENUS IN SUPABASE
// -------------------------------------------------------------------

// 1. Profil & Statistik
export async function saveProfilToSupabase(p: OrgProfile): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_profil').upsert({
      id: 'main',
      nama: p.nama,
      tingkat: p.tingkat,
      kecamatan: p.kecamatan,
      kabupaten: p.kabupaten,
      provinsi: p.provinsi,
      alamat_sekretariat: p.alamatSekretariat,
      email: p.email,
      nomor_kontak: p.nomorKontak,
      website: p.website || '',
      tahun_berdiri: p.tahunBerdiri || '1962',
      logo_url: p.logoUrl || '',
      favicon_url: p.faviconUrl || '',
      browser_title: p.browserTitle || '',
      sambutan_ketua: p.sambutanKetua,
      statistik: p.statistik,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

// 2. Sejarah
export async function saveSejarahToSupabase(item: SejarahItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_sejarah').upsert({
      id: item.id,
      tahun: item.tahun,
      judul: item.judul,
      ringkasan: item.ringkasan,
      isi_lengkap: item.isiLengkap,
      gambar_url: item.gambarUrl || '',
      created_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteSejarahFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_sejarah').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// 3. Visi & Misi
export async function saveVisiMisiToSupabase(vm: VisiMisi): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_visi_misi').upsert({
      id: 'main',
      visi: vm.visi,
      misi: vm.misi,
      tujuan: vm.tujuan,
      moto: vm.moto,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

// 4. Pengurus
export async function savePengurusToSupabase(item: PengurusItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_pengurus').upsert({
      id: item.id,
      nama: item.nama,
      jabatan: item.jabatan,
      kategori: item.kategori,
      bidang_nama: item.bidangNama || '',
      foto_url: item.fotoUrl || '',
      periode: item.periode,
      nip: item.nip || '',
      nuptk: item.nuptk || '',
      unit_kerja: item.unitKerja || '',
      no_urut: item.noUrut || 0,
      keterangan_singkat: item.keteranganSingkat || '',
      created_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deletePengurusFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_pengurus').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// 5. Program Kerja
export async function saveProgramKerjaToSupabase(item: ProgramKerjaItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_program_kerja').upsert({
      id: item.id,
      nama: item.nama,
      deskripsi: item.deskripsi,
      bidang: item.bidang,
      target: item.target,
      waktu_pelaksanaan: item.waktuPelaksanaan,
      tahun: item.tahun,
      status: item.status,
      penanggung_jawab: item.penanggungJawab,
      progress_percent: item.progressPercent || 0,
      dokumentasi_url: item.dokumentasiUrl || '',
      created_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteProgramKerjaFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_program_kerja').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// 6. Kegiatan
export async function saveKegiatanToSupabase(item: KegiatanItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_kegiatan').upsert({
      id: item.id,
      nama: item.nama,
      tanggal: item.tanggal,
      waktu: item.waktu,
      lokasi: item.lokasi,
      deskripsi: item.deskripsi,
      peserta_count: item.pesertaCount || 0,
      foto_utama: item.fotoUtama || '',
      galeri_dokumentasi: item.galeriDokumentasi || [],
      created_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteKegiatanFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_kegiatan').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// 7. Berita
export async function saveBeritaToSupabase(item: BeritaItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_berita').upsert({
      id: item.id,
      slug: item.slug,
      judul: item.judul,
      ringkasan: item.ringkasan,
      isi: item.isi,
      kategori: item.kategori,
      tanggal: item.tanggal,
      penulis: item.penulis,
      foto_url: item.fotoUrl || '',
      dibaca_count: item.dibacaCount || 0,
      featured: !!item.featured,
      created_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteBeritaFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_berita').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// 8. Prestasi
export async function savePrestasiToSupabase(item: PrestasiItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_prestasi').upsert({
      id: item.id,
      nama_prestasi: item.namaPrestasi,
      tahun: item.tahun,
      penerima: item.penerima,
      kategori: item.kategori,
      tingkat: item.tingkat,
      foto_piagam: item.fotoPiagam || '',
      deskripsi: item.deskripsi || '',
      created_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deletePrestasiFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_prestasi').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// 9. Galeri
export async function saveGaleriToSupabase(item: GaleriItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_galeri').upsert({
      id: item.id,
      tipe: item.tipe,
      judul: item.judul,
      deskripsi: item.deskripsi || '',
      url: item.url,
      youtube_id: item.youtubeId || '',
      thumbnail_url: item.thumbnailUrl || '',
      kategori: item.kategori || 'Kegiatan',
      tahun: item.tahun,
      created_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteGaleriFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_galeri').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// 10. Kalender
export async function saveKalenderToSupabase(item: KalenderItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_kalender').upsert({
      id: item.id,
      judul: item.judul,
      tanggal: item.tanggal,
      jam_mulai: item.jamMulai || '',
      jam_selesai: item.jamSelesai || '',
      lokasi: item.lokasi,
      penanggung_jawab: item.penanggungJawab || '',
      deskripsi: item.deskripsi || '',
      kategori: item.kategori,
      status: item.status,
      link_informasi: item.linkInformasi || '',
      created_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteKalenderFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_kalender').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// 11. Layanan
export async function saveLayananToSupabase(item: LayananItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_layanan').upsert({
      id: item.id,
      nama: item.nama,
      deskripsi: item.deskripsi,
      syarat: item.syarat || [],
      ikon: item.ikon || 'HeartHandshake',
      kontak_pic: item.kontakPic || '',
      estimasi_hari: item.estimasiHari || '',
      created_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteLayananFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_layanan').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// 12. Aspirasi
export async function saveAspirasiToSupabase(item: AspirasiItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_aspirasi').upsert({
      id: item.id,
      tiket_id: item.tiketId,
      tanggal: item.tanggal,
      nama: item.nama,
      is_anonim: !!item.isAnonim,
      no_whatsapp: item.noWhatsApp || '',
      instansi: item.instansi || '',
      kategori: item.kategori,
      judul: item.judul,
      isi: item.isi,
      status: item.status,
      respon_admin: item.responAdmin || '',
      tanggal_respon: item.tanggalRespon || '',
      created_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteAspirasiFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_aspirasi').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// 13. Pendaftaran
export async function savePendaftaranToSupabase(item: PendaftaranItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_pendaftaran').upsert({
      id: item.id,
      nomor_pendaftaran: item.nomorPendaftaran,
      nama_lengkap: item.namaLengkap,
      nik_nip: item.nikNip || '',
      nuptk: item.nuptk || '',
      tempat_tanggal_lahir: item.tempatTanggalLahir || '',
      jenis_kelamin: item.jenisKelamin || 'Laki-laki',
      instansi: item.instansi || '',
      jabatan: item.jabatan || '',
      mapel: item.mapel || '',
      alamat: item.alamat || '',
      no_whatsapp: item.noWhatsApp || '',
      email: item.email || '',
      kecamatan: item.kecamatan || 'Pasirwangi',
      status_kepegawaian: item.statusKepegawaian || 'Guru Honorer Sekolah',
      nomor_anggota_lama: item.nomorAnggotaLama || '',
      tanggal_daftar: item.tanggalDaftar || new Date().toISOString().split('T')[0],
      status: item.status || 'Baru',
      catatan_admin: item.catatanAdmin || '',
      created_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deletePendaftaranFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_pendaftaran').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// 14. Universal Store Item
export async function saveItemToSupabase(key: string, data: any): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_store').upsert({
      key,
      data,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

// 15. Daftar Anggota
export async function saveAnggotaToSupabase(item: AnggotaItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_anggota').upsert({
      id: item.id,
      nama: item.nama,
      npa: item.npa,
      nik: item.nik,
      tempat_lahir: item.tempatLahir,
      tanggal_lahir: item.tanggalLahir,
      foto: item.foto || '',
      no_telepon: item.noTelepon,
      unit_kerja: item.unitKerja || '',
      ranting: item.ranting || '',
      status_keanggotaan: item.statusKeanggotaan || 'Aktif',
      jenis_kelamin: item.jenisKelamin || 'Laki-laki',
      email: item.email || '',
      alamat: item.alamat || '',
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteAnggotaFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('pgri_anggota').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function saveAnggotaBatchToSupabase(items: AnggotaItem[]): Promise<boolean> {
  try {
    const rows = items.map((item) => ({
      id: item.id,
      nama: item.nama,
      npa: item.npa,
      nik: item.nik,
      tempat_lahir: item.tempatLahir,
      tanggal_lahir: item.tanggalLahir,
      foto: item.foto || '',
      no_telepon: item.noTelepon,
      unit_kerja: item.unitKerja || '',
      ranting: item.ranting || '',
      status_keanggotaan: item.statusKeanggotaan || 'Aktif',
      jenis_kelamin: item.jenisKelamin || 'Laki-laki',
      email: item.email || '',
      alamat: item.alamat || '',
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('pgri_anggota').upsert(rows);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchAllFromSupabase(): Promise<Record<string, any> | null> {
  try {
    const { data, error } = await supabase.from('pgri_store').select('key, data');
    if (error || !data || data.length === 0) return null;

    const result: Record<string, any> = {};
    for (const row of data) {
      result[row.key] = row.data;
    }
    return result;
  } catch {
    return null;
  }
}

// -------------------------------------------------------------------
// AUTHENTICATION HELPERS
// -------------------------------------------------------------------
export async function signUpWithSupabase(
  email: string,
  password: string,
  fullName: string
): Promise<{ user: SupabaseUser | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) return { user: null, error: error.message };
    return { user: data.user, error: null };
  } catch (err: any) {
    return { user: null, error: err.message || 'Gagal mendaftar akun' };
  }
}

export async function signInWithSupabase(
  email: string,
  password: string
): Promise<{ user: SupabaseUser | null; session: SupabaseSession | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { user: null, session: null, error: error.message };
    return { user: data.user, session: data.session, error: null };
  } catch (err: any) {
    return { user: null, session: null, error: err.message || 'Gagal masuk akun' };
  }
}

export async function signOutSupabase(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('Supabase signOut error:', err);
  }
}

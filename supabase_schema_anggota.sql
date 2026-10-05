-- ====================================================================
-- SKRIP SQL TABEL DAFTAR ANGGOTA (SIM PGRI CABANG KECAMATAN PASIRWANGI)
-- Proyek Supabase: vokxvtbijnubrzbdazxs
-- Tautan SQL Editor: https://supabase.com/dashboard/project/vokxvtbijnubrzbdazxs/sql/new
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

-- 2. Buat Index Pencarian Cepat (NPA, NIK, Nama)
create index if not exists idx_pgri_anggota_npa on public.pgri_anggota(npa);
create index if not exists idx_pgri_anggota_nik on public.pgri_anggota(nik);
create index if not exists idx_pgri_anggota_nama on public.pgri_anggota(nama);

-- 3. Aktifkan Keamanan Baris Data (Row Level Security / RLS)
alter table public.pgri_anggota enable row level security;

-- 4. Buat Kebijakan Akses (RLS Policies)
drop policy if exists "policy_anggota_select" on public.pgri_anggota;
drop policy if exists "policy_anggota_all" on public.pgri_anggota;

-- Kebijakan izin baca publik (select)
create policy "policy_anggota_select" on public.pgri_anggota 
  for select using (true);

-- Kebijakan izin kelola penuh untuk aplikasi (insert, update, delete)
create policy "policy_anggota_all" on public.pgri_anggota 
  for all using (true) with check (true);

-- 5. Tambahkan ke Replikasi Realtime Supabase (opsional)
alter publication supabase_realtime add table public.pgri_anggota;

-- ====================================================================
-- SELESAI: Tabel public.pgri_anggota siap digunakan!
-- ====================================================================

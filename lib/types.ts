export interface OrgProfile {
  nama: string;
  tingkat: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  alamatSekretariat: string;
  email: string;
  nomorKontak: string;
  website: string;
  tahunBerdiri: string;
  logoUrl?: string;
  faviconUrl?: string;
  browserTitle?: string;
  sambutanKetua: {
    nama: string;
    gelar: string;
    nip: string;
    jabatan: string;
    periode: string;
    fotoUrl: string;
    pesan: string;
    tandaTanganNama: string;
  };
  statistik: {
    jumlahAnggota: number;
    jumlahSekolah: number;
    jumlahRanting: number;
    programTerlaksana: number;
    guruSertifikasi: number;
  };
}

export interface SejarahItem {
  id: string;
  tahun: string;
  judul: string;
  ringkasan: string;
  isiLengkap: string;
  gambarUrl?: string;
}

export interface VisiMisi {
  visi: string;
  misi: string[];
  tujuan: string[];
  moto: string;
}

export interface PengurusItem {
  id: string;
  nama: string;
  jabatan: string;
  kategori: 'pimpinan' | 'sekretariat' | 'kebendaharaan' | 'bidang';
  bidangNama?: string;
  fotoUrl: string;
  periode: string;
  nip?: string;
  nuptk?: string;
  unitKerja: string;
  noUrut: number;
  keteranganSingkat: string;
}

export interface ProgramKerjaItem {
  id: string;
  nama: string;
  deskripsi: string;
  bidang: string;
  target: string;
  waktuPelaksanaan: string;
  tahun: string;
  status: 'Direncanakan' | 'Sedang Berjalan' | 'Selesai';
  penanggungJawab: string;
  progressPercent: number;
  dokumentasiUrl?: string;
}

export interface KegiatanItem {
  id: string;
  nama: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  deskripsi: string;
  pesertaCount: number;
  fotoUtama: string;
  galeriDokumentasi: string[];
}

export interface BeritaItem {
  id: string;
  slug: string;
  judul: string;
  ringkasan: string;
  isi: string;
  kategori: 'Organisasi' | 'Pendidikan' | 'Kegiatan' | 'Informasi Anggota' | 'Prestasi' | 'Pengumuman';
  tanggal: string;
  penulis: string;
  fotoUrl: string;
  dibacaCount: number;
  featured?: boolean;
}

export interface PrestasiItem {
  id: string;
  namaPrestasi: string;
  tahun: string;
  penerima: string;
  kategori: 'Guru' | 'Siswa' | 'Organisasi' | 'Sekolah';
  tingkat: 'Kecamatan' | 'Kabupaten' | 'Provinsi' | 'Nasional';
  fotoPiagam: string;
  deskripsi: string;
}

export interface GaleriItem {
  id: string;
  tipe: 'foto' | 'video';
  judul: string;
  deskripsi: string;
  url: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  kategori: string;
  tahun: string;
}

export interface KalenderItem {
  id: string;
  judul: string;
  tanggal: string; // YYYY-MM-DD
  jamMulai: string;
  jamSelesai: string;
  lokasi: string;
  penanggungJawab: string;
  deskripsi: string;
  kategori: 'Rapat' | 'Pelatihan' | 'Upacara' | 'Sosialisasi' | 'Lomba' | 'Lainnya';
  status: 'Akan Datang' | 'Sedang Berlangsung' | 'Selesai';
  linkInformasi?: string;
}

export interface LayananItem {
  id: string;
  nama: string;
  deskripsi: string;
  syarat: string[];
  ikon: string;
  kontakPic: string;
  estimasiHari: string;
}

export interface PendaftaranItem {
  id: string;
  nomorPendaftaran: string;
  tanggalDaftar: string;
  namaLengkap: string;
  nikNip: string;
  nuptk: string;
  tempatTanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  instansi: string;
  jabatan: string;
  mapel: string;
  alamat: string;
  noWhatsApp: string;
  email: string;
  kecamatan: string;
  statusKepegawaian: 'PNS' | 'PPPK' | 'Guru Tetap Yayasan' | 'Guru Honorer Sekolah' | 'Tenaga Kependidikan';
  nomorAnggotaLama?: string;
  status: 'Baru' | 'Diverifikasi' | 'Diterima' | 'Ditolak';
  catatanAdmin?: string;
}

export interface AspirasiItem {
  id: string;
  tiketId: string;
  tanggal: string;
  nama: string;
  isAnonim: boolean;
  noWhatsApp: string;
  instansi: string;
  kategori: 'Organisasi' | 'Pendidikan' | 'Kesejahteraan' | 'Keanggotaan' | 'Kegiatan' | 'Pelayanan' | 'Sarana dan Prasarana' | 'Lainnya';
  judul: string;
  isi: string;
  status: 'Diterima' | 'Diproses' | 'Selesai';
  responAdmin?: string;
  tanggalRespon?: string;
}

export interface SocialMediaLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  whatsapp: string;
  telegram: string;
  website: string;
}

export interface SiteSettings {
  portalTitle: string;
  tagline: string;
  deskripsiHero: string;
  pengumumanDarurat?: string;
  logoAplikasiUrl?: string;
  logoTitleUrl?: string;
  adminPassword?: string;
  visitorStats: {
    hariIni: number;
    bulanIni: number;
    total: number;
  };
}

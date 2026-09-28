'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
} from './types';
import {
  initialProfile,
  initialSejarahList,
  initialVisiMisi,
  initialPengurus,
  initialProgramKerja,
  initialKegiatan,
  initialBerita,
  initialPrestasi,
  initialGaleri,
  initialKalender,
  initialLayanan,
  initialPendaftaran,
  initialAspirasi,
  initialSocialMedia,
  initialSiteSettings,
} from './initialData';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface PgriContextType {
  profile: OrgProfile;
  sejarahList: SejarahItem[];
  visiMisi: VisiMisi;
  pengurusList: PengurusItem[];
  programKerjaList: ProgramKerjaItem[];
  kegiatanList: KegiatanItem[];
  beritaList: BeritaItem[];
  prestasiList: PrestasiItem[];
  galeriList: GaleriItem[];
  kalenderList: KalenderItem[];
  layananList: LayananItem[];
  pendaftaranList: PendaftaranItem[];
  aspirasiList: AspirasiItem[];
  socialMedia: SocialMediaLinks;
  siteSettings: SiteSettings;
  isAdminLoggedIn: boolean;
  toasts: ToastMessage[];

  // Admin Auth
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Profile
  updateProfile: (profile: Partial<OrgProfile>) => void;
  updateStatistik: (stats: Partial<OrgProfile['statistik']>) => void;

  // Sejarah
  addSejarah: (item: Omit<SejarahItem, 'id'>) => void;
  updateSejarah: (id: string, item: Partial<SejarahItem>) => void;
  deleteSejarah: (id: string) => void;

  // Visi Misi
  updateVisiMisi: (data: Partial<VisiMisi>) => void;

  // Pengurus
  addPengurus: (item: Omit<PengurusItem, 'id'>) => void;
  importPengurusBatch: (items: Array<Omit<PengurusItem, 'id'>>) => void;
  updatePengurus: (id: string, item: Partial<PengurusItem>) => void;
  deletePengurus: (id: string) => void;

  // Program Kerja
  addProgramKerja: (item: Omit<ProgramKerjaItem, 'id'>) => void;
  updateProgramKerja: (id: string, item: Partial<ProgramKerjaItem>) => void;
  deleteProgramKerja: (id: string) => void;

  // Kegiatan
  addKegiatan: (item: Omit<KegiatanItem, 'id'>) => void;
  updateKegiatan: (id: string, item: Partial<KegiatanItem>) => void;
  deleteKegiatan: (id: string) => void;

  // Berita
  addBerita: (item: Omit<BeritaItem, 'id' | 'slug' | 'dibacaCount'>) => void;
  updateBerita: (id: string, item: Partial<BeritaItem>) => void;
  deleteBerita: (id: string) => void;
  incrementBeritaViews: (id: string) => void;

  // Prestasi
  addPrestasi: (item: Omit<PrestasiItem, 'id'>) => void;
  updatePrestasi: (id: string, item: Partial<PrestasiItem>) => void;
  deletePrestasi: (id: string) => void;

  // Galeri
  addGaleri: (item: Omit<GaleriItem, 'id'>) => void;
  updateGaleri: (id: string, item: Partial<GaleriItem>) => void;
  deleteGaleri: (id: string) => void;

  // Kalender
  addKalender: (item: Omit<KalenderItem, 'id'>) => void;
  updateKalender: (id: string, item: Partial<KalenderItem>) => void;
  deleteKalender: (id: string) => void;

  // Layanan
  addLayanan: (item: Omit<LayananItem, 'id'>) => void;
  updateLayanan: (id: string, item: Partial<LayananItem>) => void;
  deleteLayanan: (id: string) => void;

  // Pendaftaran
  submitPendaftaran: (data: Omit<PendaftaranItem, 'id' | 'nomorPendaftaran' | 'tanggalDaftar' | 'status'>) => string;
  updatePendaftaranStatus: (id: string, status: PendaftaranItem['status'], catatan?: string) => void;
  deletePendaftaran: (id: string) => void;

  // Aspirasi
  submitAspirasi: (data: Omit<AspirasiItem, 'id' | 'tiketId' | 'tanggal' | 'status'>) => string;
  updateAspirasiStatus: (id: string, status: AspirasiItem['status'], responAdmin?: string) => void;
  deleteAspirasi: (id: string) => void;

  // Social & Settings
  updateSocialMedia: (data: Partial<SocialMediaLinks>) => void;
  updateSiteSettings: (data: Partial<SiteSettings>) => void;

  // Backup & Reset
  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
}

const PgriContext = createContext<PgriContextType | undefined>(undefined);

const STORAGE_KEY = 'pgri_pasirwangi_store_v1';
const AUTH_KEY = 'pgri_pasirwangi_admin_session';

function generateUniqueId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

function deduplicateItems<T extends { id: string }>(items: T[], prefix: string): T[] {
  if (!Array.isArray(items)) return [];
  const seenIds = new Set<string>();
  return items.map((item, index) => {
    let id = item.id;
    if (!id || seenIds.has(id)) {
      id = `${prefix}-${Date.now()}-${index + 1}-${Math.random().toString(36).substring(2, 7)}`;
    }
    seenIds.add(id);
    return { ...item, id };
  });
}

export function PgriProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<OrgProfile>(initialProfile);
  const [sejarahList, setSejarahList] = useState<SejarahItem[]>(initialSejarahList);
  const [visiMisi, setVisiMisi] = useState<VisiMisi>(initialVisiMisi);
  const [pengurusList, setPengurusList] = useState<PengurusItem[]>(initialPengurus);
  const [programKerjaList, setProgramKerjaList] = useState<ProgramKerjaItem[]>(initialProgramKerja);
  const [kegiatanList, setKegiatanList] = useState<KegiatanItem[]>(initialKegiatan);
  const [beritaList, setBeritaList] = useState<BeritaItem[]>(initialBerita);
  const [prestasiList, setPrestasiList] = useState<PrestasiItem[]>(initialPrestasi);
  const [galeriList, setGaleriList] = useState<GaleriItem[]>(initialGaleri);
  const [kalenderList, setKalenderList] = useState<KalenderItem[]>(initialKalender);
  const [layananList, setLayananList] = useState<LayananItem[]>(initialLayanan);
  const [pendaftaranList, setPendaftaranList] = useState<PendaftaranItem[]>(initialPendaftaran);
  const [aspirasiList, setAspirasiList] = useState<AspirasiItem[]>(initialAspirasi);
  const [socialMedia, setSocialMedia] = useState<SocialMediaLinks>(initialSocialMedia);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [hydrated, setHydrated] = useState<boolean>(false);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Hydrate from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedAuth = localStorage.getItem(AUTH_KEY);
        if (savedAuth === 'true') {
          setIsAdminLoggedIn(true);
        }

        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.profile) setProfile({ ...initialProfile, ...parsed.profile });
          if (parsed.sejarahList) setSejarahList(deduplicateItems(parsed.sejarahList, 'sej'));
          if (parsed.visiMisi) setVisiMisi(parsed.visiMisi);
          if (parsed.pengurusList) setPengurusList(deduplicateItems(parsed.pengurusList, 'peng'));
          if (parsed.programKerjaList) setProgramKerjaList(deduplicateItems(parsed.programKerjaList, 'prog'));
          if (parsed.kegiatanList) setKegiatanList(deduplicateItems(parsed.kegiatanList, 'keg'));
          if (parsed.beritaList) setBeritaList(deduplicateItems(parsed.beritaList, 'ber'));
          if (parsed.prestasiList) setPrestasiList(deduplicateItems(parsed.prestasiList, 'pres'));
          if (parsed.galeriList) setGaleriList(deduplicateItems(parsed.galeriList, 'gal'));
          if (parsed.kalenderList) setKalenderList(deduplicateItems(parsed.kalenderList, 'kal'));
          if (parsed.layananList) setLayananList(deduplicateItems(parsed.layananList, 'lay'));
          if (parsed.pendaftaranList) setPendaftaranList(deduplicateItems(parsed.pendaftaranList, 'pend'));
          if (parsed.aspirasiList) setAspirasiList(deduplicateItems(parsed.aspirasiList, 'asp'));
          if (parsed.socialMedia) setSocialMedia(parsed.socialMedia);
          if (parsed.siteSettings) {
            setSiteSettings({
              ...parsed.siteSettings,
              visitorStats: {
                ...parsed.siteSettings.visitorStats,
                hariIni: (parsed.siteSettings.visitorStats?.hariIni || 148) + 1,
                total: (parsed.siteSettings.visitorStats?.total || 31250) + 1,
              },
            });
          }
        }
      } catch (e) {
        console.error('Error hydrating PGRI store from localStorage:', e);
      } finally {
        setHydrated(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Dynamic Browser Favicon and Title synchronization
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Sync Window / Tab Title
    if (profile.browserTitle) {
      document.title = profile.browserTitle;
    }

    // 2. Sync Logo Title URL (Favicon & Apple Touch Icon)
    const targetFavicon = profile.faviconUrl || profile.logoUrl;
    if (targetFavicon) {
      let iconLink = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (!iconLink) {
        iconLink = document.createElement('link');
        iconLink.rel = 'icon';
        document.head.appendChild(iconLink);
      }
      iconLink.href = targetFavicon;

      let appleIconLink = document.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']");
      if (!appleIconLink) {
        appleIconLink = document.createElement('link');
        appleIconLink.rel = 'apple-touch-icon';
        document.head.appendChild(appleIconLink);
      }
      appleIconLink.href = targetFavicon;
    }
  }, [profile.faviconUrl, profile.logoUrl, profile.browserTitle]);

  // Sync to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      const dataToSave = {
        profile,
        sejarahList,
        visiMisi,
        pengurusList,
        programKerjaList,
        kegiatanList,
        beritaList,
        prestasiList,
        galeriList,
        kalenderList,
        layananList,
        pendaftaranList,
        aspirasiList,
        socialMedia,
        siteSettings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Error saving PGRI store to localStorage:', e);
    }
  }, [
    hydrated,
    profile,
    sejarahList,
    visiMisi,
    pengurusList,
    programKerjaList,
    kegiatanList,
    beritaList,
    prestasiList,
    galeriList,
    kalenderList,
    layananList,
    pendaftaranList,
    aspirasiList,
    socialMedia,
    siteSettings,
  ]);

  // Admin Auth
  const loginAdmin = (password: string) => {
    const validPasswords = ['pgri2026', 'admin123', 'pasirwangi'];
    if (validPasswords.includes(password.trim())) {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem(AUTH_KEY, 'true');
      } catch {}
      showToast('Berhasil masuk ke Dashboard Admin PGRI', 'success');
      return true;
    }
    showToast('Kata sandi salah! Gunakan: pgri2026', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {}
    showToast('Anda telah keluar dari Dashboard Admin', 'info');
  };

  // Profile
  const updateProfile = (updates: Partial<OrgProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    showToast('Profil organisasi berhasil diperbarui', 'success');
  };

  const updateStatistik = (stats: Partial<OrgProfile['statistik']>) => {
    setProfile((prev) => ({
      ...prev,
      statistik: { ...prev.statistik, ...stats },
    }));
    showToast('Statistik organisasi berhasil diperbarui', 'success');
  };

  // Sejarah
  const addSejarah = (item: Omit<SejarahItem, 'id'>) => {
    const newItem: SejarahItem = { ...item, id: generateUniqueId('sej') };
    setSejarahList((prev) => [...prev, newItem]);
    showToast('Peristiwa sejarah baru berhasil ditambahkan', 'success');
  };

  const updateSejarah = (id: string, item: Partial<SejarahItem>) => {
    setSejarahList((prev) => prev.map((s) => (s.id === id ? { ...s, ...item } : s)));
    showToast('Data sejarah berhasil diperbarui', 'success');
  };

  const deleteSejarah = (id: string) => {
    setSejarahList((prev) => prev.filter((s) => s.id !== id));
    showToast('Data sejarah berhasil dihapus', 'info');
  };

  // Visi Misi
  const updateVisiMisi = (data: Partial<VisiMisi>) => {
    setVisiMisi((prev) => ({ ...prev, ...data }));
    showToast('Visi & Misi berhasil diperbarui', 'success');
  };

  // Pengurus
  const addPengurus = (item: Omit<PengurusItem, 'id'>) => {
    const newItem: PengurusItem = { ...item, id: generateUniqueId('peng') };
    setPengurusList((prev) => [...prev, newItem]);
    showToast('Data pengurus baru berhasil ditambahkan', 'success');
  };

  const importPengurusBatch = (items: Array<Omit<PengurusItem, 'id'>>) => {
    if (!items || items.length === 0) return;
    const timestamp = Date.now();
    const newItems: PengurusItem[] = items.map((item, idx) => ({
      ...item,
      id: `peng-${timestamp}-${idx + 1}-${Math.random().toString(36).substring(2, 7)}`,
    }));
    setPengurusList((prev) => [...prev, ...newItems]);
    showToast(`Berhasil mengimpor ${newItems.length} data pengurus dari Excel!`, 'success');
  };

  const updatePengurus = (id: string, item: Partial<PengurusItem>) => {
    setPengurusList((prev) => prev.map((p) => (p.id === id ? { ...p, ...item } : p)));
    showToast('Data pengurus berhasil diperbarui', 'success');
  };

  const deletePengurus = (id: string) => {
    setPengurusList((prev) => prev.filter((p) => p.id !== id));
    showToast('Data pengurus berhasil dihapus', 'info');
  };

  // Program Kerja
  const addProgramKerja = (item: Omit<ProgramKerjaItem, 'id'>) => {
    const newItem: ProgramKerjaItem = { ...item, id: generateUniqueId('prog') };
    setProgramKerjaList((prev) => [...prev, newItem]);
    showToast('Program kerja baru berhasil ditambahkan', 'success');
  };

  const updateProgramKerja = (id: string, item: Partial<ProgramKerjaItem>) => {
    setProgramKerjaList((prev) => prev.map((p) => (p.id === id ? { ...p, ...item } : p)));
    showToast('Program kerja berhasil diperbarui', 'success');
  };

  const deleteProgramKerja = (id: string) => {
    setProgramKerjaList((prev) => prev.filter((p) => p.id !== id));
    showToast('Program kerja berhasil dihapus', 'info');
  };

  // Kegiatan
  const addKegiatan = (item: Omit<KegiatanItem, 'id'>) => {
    const newItem: KegiatanItem = { ...item, id: generateUniqueId('keg') };
    setKegiatanList((prev) => [...prev, newItem]);
    showToast('Dokumentasi kegiatan berhasil ditambahkan', 'success');
  };

  const updateKegiatan = (id: string, item: Partial<KegiatanItem>) => {
    setKegiatanList((prev) => prev.map((k) => (k.id === id ? { ...k, ...item } : k)));
    showToast('Dokumentasi kegiatan berhasil diperbarui', 'success');
  };

  const deleteKegiatan = (id: string) => {
    setKegiatanList((prev) => prev.filter((k) => k.id !== id));
    showToast('Dokumentasi kegiatan berhasil dihapus', 'info');
  };

  // Berita
  const addBerita = (item: Omit<BeritaItem, 'id' | 'slug' | 'dibacaCount'>) => {
    const slug = item.judul
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const newItem: BeritaItem = {
      ...item,
      id: generateUniqueId('ber'),
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      dibacaCount: 0,
    };
    setBeritaList((prev) => [newItem, ...prev]);
    showToast('Berita berhasil diterbitkan', 'success');
  };

  const updateBerita = (id: string, item: Partial<BeritaItem>) => {
    setBeritaList((prev) => prev.map((b) => (b.id === id ? { ...b, ...item } : b)));
    showToast('Berita berhasil diperbarui', 'success');
  };

  const deleteBerita = (id: string) => {
    setBeritaList((prev) => prev.filter((b) => b.id !== id));
    showToast('Berita berhasil dihapus', 'info');
  };

  const incrementBeritaViews = (id: string) => {
    setBeritaList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, dibacaCount: b.dibacaCount + 1 } : b))
    );
  };

  // Prestasi
  const addPrestasi = (item: Omit<PrestasiItem, 'id'>) => {
    const newItem: PrestasiItem = { ...item, id: generateUniqueId('pres') };
    setPrestasiList((prev) => [...prev, newItem]);
    showToast('Prestasi baru berhasil ditambahkan', 'success');
  };

  const updatePrestasi = (id: string, item: Partial<PrestasiItem>) => {
    setPrestasiList((prev) => prev.map((p) => (p.id === id ? { ...p, ...item } : p)));
    showToast('Prestasi berhasil diperbarui', 'success');
  };

  const deletePrestasi = (id: string) => {
    setPrestasiList((prev) => prev.filter((p) => p.id !== id));
    showToast('Prestasi berhasil dihapus', 'info');
  };

  // Galeri
  const addGaleri = (item: Omit<GaleriItem, 'id'>) => {
    let youtubeId = item.youtubeId;
    if (item.tipe === 'video' && item.url && !youtubeId) {
      const match = item.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match) youtubeId = match[1];
    }
    const newItem: GaleriItem = { ...item, id: generateUniqueId('gal'), youtubeId };
    setGaleriList((prev) => [...prev, newItem]);
    showToast('Item galeri berhasil ditambahkan', 'success');
  };

  const updateGaleri = (id: string, item: Partial<GaleriItem>) => {
    setGaleriList((prev) => prev.map((g) => (g.id === id ? { ...g, ...item } : g)));
    showToast('Item galeri berhasil diperbarui', 'success');
  };

  const deleteGaleri = (id: string) => {
    setGaleriList((prev) => prev.filter((g) => g.id !== id));
    showToast('Item galeri berhasil dihapus', 'info');
  };

  // Kalender
  const addKalender = (item: Omit<KalenderItem, 'id'>) => {
    const newItem: KalenderItem = { ...item, id: generateUniqueId('kal') };
    setKalenderList((prev) => [...prev, newItem]);
    showToast('Agenda kalender baru berhasil ditambahkan', 'success');
  };

  const updateKalender = (id: string, item: Partial<KalenderItem>) => {
    setKalenderList((prev) => prev.map((k) => (k.id === id ? { ...k, ...item } : k)));
    showToast('Agenda kegiatan berhasil diperbarui', 'success');
  };

  const deleteKalender = (id: string) => {
    setKalenderList((prev) => prev.filter((k) => k.id !== id));
    showToast('Agenda kegiatan berhasil dihapus', 'info');
  };

  // Layanan
  const addLayanan = (item: Omit<LayananItem, 'id'>) => {
    const newItem: LayananItem = { ...item, id: generateUniqueId('lay') };
    setLayananList((prev) => [...prev, newItem]);
    showToast('Layanan organisasi berhasil ditambahkan', 'success');
  };

  const updateLayanan = (id: string, item: Partial<LayananItem>) => {
    setLayananList((prev) => prev.map((l) => (l.id === id ? { ...l, ...item } : l)));
    showToast('Layanan organisasi berhasil diperbarui', 'success');
  };

  const deleteLayanan = (id: string) => {
    setLayananList((prev) => prev.filter((l) => l.id !== id));
    showToast('Layanan organisasi berhasil dihapus', 'info');
  };

  // Pendaftaran
  const submitPendaftaran = (
    data: Omit<PendaftaranItem, 'id' | 'nomorPendaftaran' | 'tanggalDaftar' | 'status'>
  ) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const nomorPendaftaran = `REG-2026-${randomSuffix}`;
    const today = new Date().toISOString().split('T')[0];

    const newItem: PendaftaranItem = {
      ...data,
      id: generateUniqueId('reg'),
      nomorPendaftaran,
      tanggalDaftar: today,
      status: 'Baru',
      catatanAdmin: 'Berkas baru masuk, menunggu pemeriksaan pengurus cabang.',
    };

    setPendaftaranList((prev) => [newItem, ...prev]);
    showToast('Pendaftaran berhasil dikirim! Simpan Nomor Pendaftaran Anda.', 'success');
    return nomorPendaftaran;
  };

  const updatePendaftaranStatus = (id: string, status: PendaftaranItem['status'], catatan?: string) => {
    setPendaftaranList((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status,
              ...(catatan !== undefined ? { catatanAdmin: catatan } : {}),
            }
          : p
      )
    );
    showToast(`Status pendaftaran berhasil diperbarui: ${status}`, 'success');
  };

  const deletePendaftaran = (id: string) => {
    setPendaftaranList((prev) => prev.filter((p) => p.id !== id));
    showToast('Data pendaftaran berhasil dihapus', 'info');
  };

  // Aspirasi
  const submitAspirasi = (
    data: Omit<AspirasiItem, 'id' | 'tiketId' | 'tanggal' | 'status'>
  ) => {
    const randomTicket = String(aspirasiList.length + 1).padStart(4, '0');
    const tiketId = `ASP-2026-${randomTicket}`;
    const today = new Date().toISOString().split('T')[0];

    const newItem: AspirasiItem = {
      ...data,
      id: generateUniqueId('asp'),
      tiketId,
      tanggal: today,
      status: 'Diterima',
      responAdmin: 'Aspirasi Anda telah diterima oleh sekretariat PGRI Pasirwangi dan sedang dijadwalkan untuk ditindaklanjuti.',
      tanggalRespon: today,
    };

    setAspirasiList((prev) => [newItem, ...prev]);
    showToast(`Aspirasi berhasil dikirim! Nomor Tiket Anda: ${tiketId}`, 'success');
    return tiketId;
  };

  const updateAspirasiStatus = (id: string, status: AspirasiItem['status'], responAdmin?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setAspirasiList((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              ...(responAdmin !== undefined ? { responAdmin, tanggalRespon: today } : {}),
            }
          : a
      )
    );
    showToast(`Status aspirasi berhasil diperbarui: ${status}`, 'success');
  };

  const deleteAspirasi = (id: string) => {
    setAspirasiList((prev) => prev.filter((a) => a.id !== id));
    showToast('Data aspirasi berhasil dihapus', 'info');
  };

  // Social & Settings
  const updateSocialMedia = (data: Partial<SocialMediaLinks>) => {
    setSocialMedia((prev) => ({ ...prev, ...data }));
    showToast('Tautan media sosial berhasil diperbarui', 'success');
  };

  const updateSiteSettings = (data: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...data }));
    showToast('Pengaturan website berhasil diperbarui', 'success');
  };

  // Reset & Backup
  const resetToDefaults = () => {
    setProfile(initialProfile);
    setSejarahList(initialSejarahList);
    setVisiMisi(initialVisiMisi);
    setPengurusList(initialPengurus);
    setProgramKerjaList(initialProgramKerja);
    setKegiatanList(initialKegiatan);
    setBeritaList(initialBerita);
    setPrestasiList(initialPrestasi);
    setGaleriList(initialGaleri);
    setKalenderList(initialKalender);
    setLayananList(initialLayanan);
    setPendaftaranList(initialPendaftaran);
    setAspirasiList(initialAspirasi);
    setSocialMedia(initialSocialMedia);
    setSiteSettings(initialSiteSettings);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    showToast('Data sistem berhasil dikembalikan ke standar awal', 'info');
  };

  const exportDataJSON = () => {
    const data = {
      profile,
      sejarahList,
      visiMisi,
      pengurusList,
      programKerjaList,
      kegiatanList,
      beritaList,
      prestasiList,
      galeriList,
      kalenderList,
      layananList,
      pendaftaranList,
      aspirasiList,
      socialMedia,
      siteSettings,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile) setProfile({ ...initialProfile, ...parsed.profile });
      if (parsed.sejarahList) setSejarahList(deduplicateItems(parsed.sejarahList, 'sej'));
      if (parsed.visiMisi) setVisiMisi(parsed.visiMisi);
      if (parsed.pengurusList) setPengurusList(deduplicateItems(parsed.pengurusList, 'peng'));
      if (parsed.programKerjaList) setProgramKerjaList(deduplicateItems(parsed.programKerjaList, 'prog'));
      if (parsed.kegiatanList) setKegiatanList(deduplicateItems(parsed.kegiatanList, 'keg'));
      if (parsed.beritaList) setBeritaList(deduplicateItems(parsed.beritaList, 'ber'));
      if (parsed.prestasiList) setPrestasiList(deduplicateItems(parsed.prestasiList, 'pres'));
      if (parsed.galeriList) setGaleriList(deduplicateItems(parsed.galeriList, 'gal'));
      if (parsed.kalenderList) setKalenderList(deduplicateItems(parsed.kalenderList, 'kal'));
      if (parsed.layananList) setLayananList(deduplicateItems(parsed.layananList, 'lay'));
      if (parsed.pendaftaranList) setPendaftaranList(deduplicateItems(parsed.pendaftaranList, 'pend'));
      if (parsed.aspirasiList) setAspirasiList(deduplicateItems(parsed.aspirasiList, 'asp'));
      if (parsed.socialMedia) setSocialMedia(parsed.socialMedia);
      if (parsed.siteSettings) setSiteSettings(parsed.siteSettings);
      showToast('Data berhasil diimpor ke sistem!', 'success');
      return true;
    } catch (e) {
      showToast('Format berkas JSON tidak valid!', 'error');
      return false;
    }
  };

  return (
    <PgriContext.Provider
      value={{
        profile,
        sejarahList,
        visiMisi,
        pengurusList,
        programKerjaList,
        kegiatanList,
        beritaList,
        prestasiList,
        galeriList,
        kalenderList,
        layananList,
        pendaftaranList,
        aspirasiList,
        socialMedia,
        siteSettings,
        isAdminLoggedIn,
        toasts,
        loginAdmin,
        logoutAdmin,
        showToast,
        removeToast,
        updateProfile,
        updateStatistik,
        addSejarah,
        updateSejarah,
        deleteSejarah,
        updateVisiMisi,
        addPengurus,
        importPengurusBatch,
        updatePengurus,
        deletePengurus,
        addProgramKerja,
        updateProgramKerja,
        deleteProgramKerja,
        addKegiatan,
        updateKegiatan,
        deleteKegiatan,
        addBerita,
        updateBerita,
        deleteBerita,
        incrementBeritaViews,
        addPrestasi,
        updatePrestasi,
        deletePrestasi,
        addGaleri,
        updateGaleri,
        deleteGaleri,
        addKalender,
        updateKalender,
        deleteKalender,
        addLayanan,
        updateLayanan,
        deleteLayanan,
        submitPendaftaran,
        updatePendaftaranStatus,
        deletePendaftaran,
        submitAspirasi,
        updateAspirasiStatus,
        deleteAspirasi,
        updateSocialMedia,
        updateSiteSettings,
        resetToDefaults,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </PgriContext.Provider>
  );
}

export function usePgriStore() {
  const context = useContext(PgriContext);
  if (!context) {
    throw new Error('usePgriStore must be used within a PgriProvider');
  }
  return context;
}

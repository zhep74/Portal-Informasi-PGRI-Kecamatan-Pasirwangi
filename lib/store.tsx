'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
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
import {
  supabase,
  saveItemToSupabase,
  fetchAllFromSupabase,
  testSupabaseConnection,
  signInWithSupabase,
  signUpWithSupabase,
  signOutSupabase,
  saveProfilToSupabase,
  saveSejarahToSupabase,
  deleteSejarahFromSupabase,
  saveVisiMisiToSupabase,
  savePengurusToSupabase,
  deletePengurusFromSupabase,
  saveProgramKerjaToSupabase,
  deleteProgramKerjaFromSupabase,
  saveKegiatanToSupabase,
  deleteKegiatanFromSupabase,
  saveBeritaToSupabase,
  deleteBeritaFromSupabase,
  savePrestasiToSupabase,
  deletePrestasiFromSupabase,
  saveGaleriToSupabase,
  deleteGaleriFromSupabase,
  saveKalenderToSupabase,
  deleteKalenderFromSupabase,
  saveLayananToSupabase,
  deleteLayananFromSupabase,
  saveAspirasiToSupabase,
  deleteAspirasiFromSupabase,
  savePendaftaranToSupabase,
  deletePendaftaranFromSupabase,
} from './supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { idbSet, idbGet, idbDelete } from './idb';

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
  adminUser: SupabaseUser | null;
  isCloudConnected: boolean;
  isSyncingCloud: boolean;
  toasts: ToastMessage[];

  // Supabase Auth & Member State
  supabaseUser: SupabaseUser | null;
  isMemberAuthModalOpen: boolean;
  memberAuthDefaultTab: 'login' | 'register';
  openMemberAuthModal: (mode?: 'login' | 'register') => void;
  closeMemberAuthModal: () => void;
  loginMemberWithSupabase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerMemberWithSupabase: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logoutMemberWithSupabase: () => Promise<void>;

  // Supabase Database Connection & Sync
  supabaseStatus: {
    connected: boolean;
    totalTablesReady: number;
    tableDetails: Record<string, boolean>;
    pendaftaranTableExists: boolean;
    storeTableExists: boolean;
    message: string;
    checking: boolean;
  };
  isSyncingSupabase: boolean;
  checkSupabaseStatus: () => Promise<void>;
  syncAllToSupabase: () => Promise<void>;

  // Admin Auth & Security
  loginAdmin: (password: string) => boolean;
  loginAdminWithGoogle: () => Promise<boolean>;
  logoutAdmin: () => void;
  changeAdminPassword: (currentPassword: string, newPassword: string) => { success: boolean; message: string };
  resetAdminPassword: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Cloud Synchronization (Supabase)
  syncAllToFirestore: () => Promise<void>;

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
  setBeritaUtama: (id: string) => void;
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

const STORAGE_KEY = 'pgri_pasirwangi_store_v1';
const AUTH_KEY = 'pgri_admin_auth';
const ADMIN_PASSWORD_KEY = 'pgri_custom_admin_password';

const PgriContext = createContext<PgriContextType | undefined>(undefined);

function deduplicateItems<T extends { id: string }>(items: T[], prefix: string): T[] {
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

function sanitizeForLocalStorage(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    // If it's a base64 data URL or heavy string (> 500 chars), replace with lightweight placeholder so localStorage never exceeds quota
    if ((obj.startsWith('data:') || obj.includes(';base64,')) && obj.length > 500) {
      return '/images/hero_pgri.jpg';
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForLocalStorage);
  }
  if (typeof obj === 'object') {
    const res: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      res[key] = sanitizeForLocalStorage(obj[key]);
    }
    return res;
  }
  return obj;
}

function safeSaveLocalStorage(key: string, data: any) {
  if (typeof window === 'undefined') return;
  try {
    const sanitized = sanitizeForLocalStorage(data);
    localStorage.setItem(key, JSON.stringify(sanitized));
  } catch {
    // Safely handle quota exceeded: full uncompressed data is safely stored in IndexedDB
    try {
      localStorage.removeItem(key);
    } catch {}
  }
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

  // Supabase states
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isMemberAuthModalOpen, setIsMemberAuthModalOpen] = useState<boolean>(false);
  const [memberAuthDefaultTab, setMemberAuthDefaultTab] = useState<'login' | 'register'>('login');
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean;
    totalTablesReady: number;
    tableDetails: Record<string, boolean>;
    pendaftaranTableExists: boolean;
    storeTableExists: boolean;
    message: string;
    checking: boolean;
  }>({
    connected: false,
    totalTablesReady: 0,
    tableDetails: {},
    pendaftaranTableExists: false,
    storeTableExists: false,
    message: 'Memeriksa koneksi Supabase...',
    checking: true,
  });
  const [isSyncingSupabase, setIsSyncingSupabase] = useState<boolean>(false);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const openMemberAuthModal = (mode: 'login' | 'register' = 'login') => {
    setMemberAuthDefaultTab(mode);
    setIsMemberAuthModalOpen(true);
  };

  const closeMemberAuthModal = () => {
    setIsMemberAuthModalOpen(false);
  };

  // Check Supabase connection and tables status
  const checkSupabaseStatus = useCallback(async () => {
    setSupabaseStatus((prev) => ({ ...prev, checking: true }));
    try {
      const res = await testSupabaseConnection();
      setSupabaseStatus({
        connected: res.connected,
        totalTablesReady: res.totalTablesReady,
        tableDetails: res.tableDetails,
        pendaftaranTableExists: res.pendaftaranTableExists,
        storeTableExists: res.storeTableExists,
        message: res.message,
        checking: false,
      });
    } catch {
      setSupabaseStatus((prev) => ({
        ...prev,
        connected: false,
        checking: false,
        message: 'Tidak dapat tersambung ke database Supabase.',
      }));
    }
  }, []);

  // Supabase Auth Methods
  const loginMemberWithSupabase = async (email: string, password: string) => {
    const res = await signInWithSupabase(email, password);
    if (res.error) {
      showToast(`Gagal masuk: ${res.error}`, 'error');
      return { success: false, error: res.error };
    }
    showToast(`Selamat datang kembali!`, 'success');
    if (res.user?.email?.toLowerCase() === 'asepakon74@gmail.com') {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem(AUTH_KEY, 'true');
      } catch {}
    }
    return { success: true };
  };

  const registerMemberWithSupabase = async (email: string, password: string, fullName: string) => {
    const res = await signUpWithSupabase(email, password, fullName);
    if (res.error) {
      showToast(`Gagal mendaftar: ${res.error}`, 'error');
      return { success: false, error: res.error };
    }
    showToast('Pendaftaran akun berhasil dibuat di Supabase!', 'success');
    return { success: true };
  };

  const logoutMemberWithSupabase = async () => {
    await signOutSupabase();
    setSupabaseUser(null);
    showToast('Berhasil keluar dari akun.', 'info');
  };

  // 1. Listen to Supabase Auth state & check connection
  useEffect(() => {
    const timer = setTimeout(() => {
      checkSupabaseStatus();
    }, 0);

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setSupabaseUser(data.session.user);
        if (data.session.user.email?.toLowerCase() === 'asepakon74@gmail.com') {
          setIsAdminLoggedIn(true);
        }
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null;
      setSupabaseUser(user);
      if (user?.email?.toLowerCase() === 'asepakon74@gmail.com') {
        setIsAdminLoggedIn(true);
      }
    });

    return () => {
      clearTimeout(timer);
      authListener.subscription.unsubscribe();
    };
  }, [checkSupabaseStatus]);

  // 2. Hydrate from IndexedDB first, with localStorage fallback
  useEffect(() => {
    let isCancelled = false;

    const hydrateState = async () => {
      try {
        const savedAuth = localStorage.getItem(AUTH_KEY);
        if (savedAuth === 'true') {
          setIsAdminLoggedIn(true);
        }

        // Try IndexedDB first (contains complete full-resolution images)
        let parsed = await idbGet<any>(STORAGE_KEY);

        // Fallback to localStorage if IndexedDB is empty
        if (!parsed) {
          const savedData = localStorage.getItem(STORAGE_KEY);
          if (savedData) {
            parsed = JSON.parse(savedData);
          }
        }

        if (parsed && !isCancelled) {
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
        }
      } catch (e) {
        console.warn('Hydration cache notice:', e);
      } finally {
        if (!isCancelled) {
          setHydrated(true);
        }
      }
    };

    hydrateState();

    return () => {
      isCancelled = true;
    };
  }, []);

  // 3. Load initial remote data from Supabase pgri_store if available
  useEffect(() => {
    const loadFromSupabase = async () => {
      try {
        const remoteData = await fetchAllFromSupabase();
        if (remoteData) {
          if (remoteData.profile) setProfile((prev) => ({ ...prev, ...remoteData.profile }));
          if (remoteData.sejarahList) setSejarahList(deduplicateItems(remoteData.sejarahList, 'sej'));
          if (remoteData.visiMisi) setVisiMisi(remoteData.visiMisi);
          if (remoteData.pengurusList) setPengurusList(deduplicateItems(remoteData.pengurusList, 'peng'));
          if (remoteData.programKerjaList) setProgramKerjaList(deduplicateItems(remoteData.programKerjaList, 'prog'));
          if (remoteData.kegiatanList) setKegiatanList(deduplicateItems(remoteData.kegiatanList, 'keg'));
          if (remoteData.beritaList) setBeritaList(deduplicateItems(remoteData.beritaList, 'ber'));
          if (remoteData.prestasiList) setPrestasiList(deduplicateItems(remoteData.prestasiList, 'pres'));
          if (remoteData.galeriList) setGaleriList(deduplicateItems(remoteData.galeriList, 'gal'));
          if (remoteData.kalenderList) setKalenderList(deduplicateItems(remoteData.kalenderList, 'kal'));
          if (remoteData.layananList) setLayananList(deduplicateItems(remoteData.layananList, 'lay'));
          if (remoteData.pendaftaranList) setPendaftaranList(deduplicateItems(remoteData.pendaftaranList, 'pend'));
          if (remoteData.aspirasiList) setAspirasiList(deduplicateItems(remoteData.aspirasiList, 'asp'));
          if (remoteData.socialMedia) setSocialMedia(remoteData.socialMedia);
          if (remoteData.siteSettings) setSiteSettings(remoteData.siteSettings);
        }
      } catch (err) {
        console.warn('Supabase fetch initial data notice:', err);
      }
    };

    loadFromSupabase();
  }, []);

  // 4. Supabase Realtime channel subscription for multi-user sync
  useEffect(() => {
    const channel = supabase
      .channel('pgri_realtime_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pgri_store' },
        (payload: any) => {
          if (payload.new && payload.new.key && payload.new.data) {
            const { key, data } = payload.new;
            if (key === 'profile') setProfile((prev) => ({ ...prev, ...data }));
            else if (key === 'visiMisi') setVisiMisi(data);
            else if (key === 'socialMedia') setSocialMedia(data);
            else if (key === 'siteSettings') setSiteSettings(data);
            else if (key === 'sejarahList') setSejarahList(deduplicateItems(data, 'sej'));
            else if (key === 'pengurusList') setPengurusList(deduplicateItems(data, 'peng'));
            else if (key === 'programKerjaList') setProgramKerjaList(deduplicateItems(data, 'prog'));
            else if (key === 'kegiatanList') setKegiatanList(deduplicateItems(data, 'keg'));
            else if (key === 'beritaList') setBeritaList(deduplicateItems(data, 'ber'));
            else if (key === 'prestasiList') setPrestasiList(deduplicateItems(data, 'pres'));
            else if (key === 'galeriList') setGaleriList(deduplicateItems(data, 'gal'));
            else if (key === 'kalenderList') setKalenderList(deduplicateItems(data, 'kal'));
            else if (key === 'layananList') setLayananList(deduplicateItems(data, 'lay'));
            else if (key === 'pendaftaranList') setPendaftaranList(deduplicateItems(data, 'pend'));
            else if (key === 'aspirasiList') setAspirasiList(deduplicateItems(data, 'asp'));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 5. Browser Title & Favicon sync
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (profile.browserTitle) {
      document.title = profile.browserTitle;
    }

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

  // 6. Cache state: IndexedDB for complete data with images, safe sanitized localStorage for fast client fallback
  useEffect(() => {
    if (!hydrated) return;
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

    // 1. IndexedDB stores full uncompressed data (photos, images, text) safely with no quota limits
    idbSet(STORAGE_KEY, dataToSave).catch(() => {});

    // 2. Safe sanitized localStorage for fast instant boot
    safeSaveLocalStorage(STORAGE_KEY, dataToSave);
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

  // Admin Auth Actions
  const getActiveAdminPasswords = useCallback(() => {
    const list = ['pgri2026', 'admin123', 'pasirwangi'];
    if (siteSettings.adminPassword) {
      list.unshift(siteSettings.adminPassword);
    }
    try {
      const localCustom = localStorage.getItem(ADMIN_PASSWORD_KEY);
      if (localCustom && !list.includes(localCustom)) {
        list.unshift(localCustom);
      }
    } catch {}
    return list;
  }, [siteSettings.adminPassword]);

  const loginAdmin = (password: string) => {
    const validPasswords = getActiveAdminPasswords();
    if (validPasswords.includes(password.trim())) {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem(AUTH_KEY, 'true');
      } catch {}
      showToast('Berhasil masuk panel admin!', 'success');
      return true;
    }
    showToast('Kata sandi salah!', 'error');
    return false;
  };

  const changeAdminPassword = (currentPassword: string, newPassword: string) => {
    const validPasswords = getActiveAdminPasswords();
    if (!validPasswords.includes(currentPassword.trim())) {
      showToast('Kata sandi saat ini tidak cocok!', 'error');
      return { success: false, message: 'Kata sandi saat ini tidak cocok!' };
    }

    if (!newPassword || newPassword.trim().length < 6) {
      showToast('Kata sandi baru minimal harus 6 karakter!', 'warning');
      return { success: false, message: 'Kata sandi baru minimal 6 karakter!' };
    }

    const cleanPass = newPassword.trim();
    // Update siteSettings
    setSiteSettings((prev) => {
      const updated = { ...prev, adminPassword: cleanPass };
      saveItemToSupabase('siteSettings', updated);
      return updated;
    });

    try {
      localStorage.setItem(ADMIN_PASSWORD_KEY, cleanPass);
    } catch {}

    showToast('Kata sandi admin berhasil diperbarui!', 'success');
    return { success: true, message: 'Kata sandi admin berhasil diperbarui!' };
  };

  const resetAdminPassword = () => {
    setSiteSettings((prev) => {
      const updated = { ...prev };
      delete updated.adminPassword;
      saveItemToSupabase('siteSettings', updated);
      return updated;
    });
    try {
      localStorage.removeItem(ADMIN_PASSWORD_KEY);
    } catch {}
    showToast('Kata sandi admin dikembalikan ke setelan bawaan (pgri2026)', 'info');
  };

  const loginAdminWithGoogle = async (): Promise<boolean> => {
    openMemberAuthModal('login');
    return true;
  };

  const logoutAdmin = async () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {}
    showToast('Anda telah keluar dari panel admin', 'info');
  };

  // Supabase Sync: Seeds Supabase dedicated tables and pgri_store
  const syncAllToSupabase = async () => {
    setIsSyncingSupabase(true);
    showToast('Menyinkronkan seluruh data ke tabel Supabase...', 'info');

    try {
      // 1. Profil & Statistik
      await saveProfilToSupabase(profile);

      // 2. Visi Misi
      await saveVisiMisiToSupabase(visiMisi);

      // 3. Sejarah
      for (const item of sejarahList) {
        await saveSejarahToSupabase(item);
      }

      // 4. Pengurus
      for (const item of pengurusList) {
        await savePengurusToSupabase(item);
      }

      // 5. Program Kerja
      for (const item of programKerjaList) {
        await saveProgramKerjaToSupabase(item);
      }

      // 6. Kegiatan
      for (const item of kegiatanList) {
        await saveKegiatanToSupabase(item);
      }

      // 7. Berita
      for (const item of beritaList) {
        await saveBeritaToSupabase(item);
      }

      // 8. Prestasi
      for (const item of prestasiList) {
        await savePrestasiToSupabase(item);
      }

      // 9. Galeri
      for (const item of galeriList) {
        await saveGaleriToSupabase(item);
      }

      // 10. Kalender
      for (const item of kalenderList) {
        await saveKalenderToSupabase(item);
      }

      // 11. Layanan
      for (const item of layananList) {
        await saveLayananToSupabase(item);
      }

      // 12. Aspirasi
      for (const item of aspirasiList) {
        await saveAspirasiToSupabase(item);
      }

      // 13. Pendaftaran
      for (const p of pendaftaranList) {
        await savePendaftaranToSupabase(p);
      }

      // 14. Universal Store Backup
      const storeItems = [
        { key: 'profile', data: profile },
        { key: 'visiMisi', data: visiMisi },
        { key: 'socialMedia', data: socialMedia },
        { key: 'siteSettings', data: siteSettings },
        { key: 'sejarahList', data: sejarahList },
        { key: 'pengurusList', data: pengurusList },
        { key: 'programKerjaList', data: programKerjaList },
        { key: 'kegiatanList', data: kegiatanList },
        { key: 'beritaList', data: beritaList },
        { key: 'prestasiList', data: prestasiList },
        { key: 'galeriList', data: galeriList },
        { key: 'kalenderList', data: kalenderList },
        { key: 'layananList', data: layananList },
        { key: 'pendaftaranList', data: pendaftaranList },
        { key: 'aspirasiList', data: aspirasiList },
      ];

      for (const item of storeItems) {
        await saveItemToSupabase(item.key, item.data);
      }

      await checkSupabaseStatus();
      showToast('Seluruh data pada semua menu admin berhasil disimpan ke tabel Supabase!', 'success');
    } catch (err: any) {
      console.error('Supabase sync error:', err);
      showToast(`Gagal sinkron ke Supabase: ${err.message || 'Cek tabel di Supabase SQL Editor'}`, 'error');
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  const syncAllToFirestore = async () => {
    // Aliased to Supabase sync for backward compatibility
    await syncAllToSupabase();
  };

  // Helper function to generate unique ID
  const generateUniqueId = (prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  };

  // Profile Mutations
  const updateProfile = (updates: Partial<OrgProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      saveProfilToSupabase(updated);
      saveItemToSupabase('profile', updated);
      return updated;
    });
    showToast('Profil organisasi berhasil diperbarui di Supabase', 'success');
  };

  const updateStatistik = (stats: Partial<OrgProfile['statistik']>) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        statistik: { ...prev.statistik, ...stats },
      };
      saveProfilToSupabase(updated);
      saveItemToSupabase('profile', updated);
      return updated;
    });
    showToast('Statistik organisasi berhasil diperbarui di Supabase', 'success');
  };

  // Sejarah Mutations
  const addSejarah = (item: Omit<SejarahItem, 'id'>) => {
    const newItem: SejarahItem = { ...item, id: generateUniqueId('sej') };
    setSejarahList((prev) => {
      const next = [newItem, ...prev];
      saveItemToSupabase('sejarahList', next);
      return next;
    });
    saveSejarahToSupabase(newItem);
    showToast('Peristiwa sejarah baru berhasil disimpan ke Supabase', 'success');
  };

  const updateSejarah = (id: string, item: Partial<SejarahItem>) => {
    setSejarahList((prev) => {
      const next = prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...item };
          saveSejarahToSupabase(updated);
          return updated;
        }
        return s;
      });
      saveItemToSupabase('sejarahList', next);
      return next;
    });
    showToast('Peristiwa sejarah berhasil diperbarui di Supabase', 'success');
  };

  const deleteSejarah = (id: string) => {
    setSejarahList((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveItemToSupabase('sejarahList', next);
      return next;
    });
    deleteSejarahFromSupabase(id);
    showToast('Peristiwa sejarah berhasil dihapus dari Supabase', 'info');
  };

  // Visi Misi Mutations
  const updateVisiMisi = (data: Partial<VisiMisi>) => {
    setVisiMisi((prev) => {
      const updated = { ...prev, ...data };
      saveVisiMisiToSupabase(updated);
      saveItemToSupabase('visiMisi', updated);
      return updated;
    });
    showToast('Visi & Misi berhasil disimpan ke Supabase', 'success');
  };

  // Pengurus Mutations
  const addPengurus = (item: Omit<PengurusItem, 'id'>) => {
    const newItem: PengurusItem = { ...item, id: generateUniqueId('peng') };
    setPengurusList((prev) => {
      const next = [...prev, newItem];
      saveItemToSupabase('pengurusList', next);
      return next;
    });
    savePengurusToSupabase(newItem);
    showToast('Data pengurus baru tersimpan ke Supabase', 'success');
  };

  const importPengurusBatch = async (items: Array<Omit<PengurusItem, 'id'>>) => {
    if (!items || items.length === 0) return;
    const timestamp = Date.now();
    const newItems: PengurusItem[] = items.map((item, idx) => ({
      ...item,
      id: `peng-${timestamp}-${idx + 1}-${Math.random().toString(36).substring(2, 7)}`,
    }));
    setPengurusList((prev) => {
      const next = [...prev, ...newItems];
      saveItemToSupabase('pengurusList', next);
      return next;
    });

    for (const item of newItems) {
      savePengurusToSupabase(item);
    }
    showToast(`Berhasil menyimpan ${newItems.length} data pengurus ke Supabase!`, 'success');
  };

  const updatePengurus = (id: string, item: Partial<PengurusItem>) => {
    setPengurusList((prev) => {
      const next = prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...item };
          savePengurusToSupabase(updated);
          return updated;
        }
        return p;
      });
      saveItemToSupabase('pengurusList', next);
      return next;
    });
    showToast('Data pengurus berhasil diperbarui di Supabase', 'success');
  };

  const deletePengurus = (id: string) => {
    setPengurusList((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveItemToSupabase('pengurusList', next);
      return next;
    });
    deletePengurusFromSupabase(id);
    showToast('Data pengurus berhasil dihapus dari Supabase', 'info');
  };

  // Program Kerja Mutations
  const addProgramKerja = (item: Omit<ProgramKerjaItem, 'id'>) => {
    const newItem: ProgramKerjaItem = { ...item, id: generateUniqueId('prog') };
    setProgramKerjaList((prev) => {
      const next = [...prev, newItem];
      saveItemToSupabase('programKerjaList', next);
      return next;
    });
    saveProgramKerjaToSupabase(newItem);
    showToast('Program kerja baru berhasil disimpan ke Supabase', 'success');
  };

  const updateProgramKerja = (id: string, item: Partial<ProgramKerjaItem>) => {
    setProgramKerjaList((prev) => {
      const next = prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...item };
          saveProgramKerjaToSupabase(updated);
          return updated;
        }
        return p;
      });
      saveItemToSupabase('programKerjaList', next);
      return next;
    });
    showToast('Program kerja berhasil diperbarui di Supabase', 'success');
  };

  const deleteProgramKerja = (id: string) => {
    setProgramKerjaList((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveItemToSupabase('programKerjaList', next);
      return next;
    });
    deleteProgramKerjaFromSupabase(id);
    showToast('Program kerja berhasil dihapus dari Supabase', 'info');
  };

  // Kegiatan Mutations
  const addKegiatan = (item: Omit<KegiatanItem, 'id'>) => {
    const newItem: KegiatanItem = { ...item, id: generateUniqueId('keg') };
    setKegiatanList((prev) => {
      const next = [...prev, newItem];
      saveItemToSupabase('kegiatanList', next);
      return next;
    });
    saveKegiatanToSupabase(newItem);
    showToast('Dokumentasi kegiatan berhasil disimpan ke Supabase', 'success');
  };

  const updateKegiatan = (id: string, item: Partial<KegiatanItem>) => {
    setKegiatanList((prev) => {
      const next = prev.map((k) => {
        if (k.id === id) {
          const updated = { ...k, ...item };
          saveKegiatanToSupabase(updated);
          return updated;
        }
        return k;
      });
      saveItemToSupabase('kegiatanList', next);
      return next;
    });
    showToast('Dokumentasi kegiatan berhasil diperbarui di Supabase', 'success');
  };

  const deleteKegiatan = (id: string) => {
    setKegiatanList((prev) => {
      const next = prev.filter((k) => k.id !== id);
      saveItemToSupabase('kegiatanList', next);
      return next;
    });
    deleteKegiatanFromSupabase(id);
    showToast('Dokumentasi kegiatan berhasil dihapus dari Supabase', 'info');
  };

  // Berita Mutations
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
      featured: item.featured ?? false,
    };
    setBeritaList((prev) => {
      let list = prev;
      if (newItem.featured) {
        list = list.map((b) => ({ ...b, featured: false }));
      }
      const next = [newItem, ...list];
      saveItemToSupabase('beritaList', next);
      return next;
    });
    saveBeritaToSupabase(newItem);
    showToast(newItem.featured ? 'Berita Utama berhasil diterbitkan & tampil di Hero Landingpage!' : 'Berita berhasil diterbitkan dan disimpan ke Supabase', 'success');
  };

  const updateBerita = (id: string, item: Partial<BeritaItem>) => {
    setBeritaList((prev) => {
      const next = prev.map((b) => {
        if (b.id === id) {
          const updated = { ...b, ...item };
          saveBeritaToSupabase(updated);
          return updated;
        }
        if (item.featured && b.id !== id) {
          return { ...b, featured: false };
        }
        return b;
      });
      saveItemToSupabase('beritaList', next);
      return next;
    });
    showToast(item.featured ? 'Berita Utama berhasil diperbarui & tampil di Hero Landingpage!' : 'Berita berhasil diperbarui di Supabase', 'success');
  };

  const setBeritaUtama = (id: string) => {
    updateBerita(id, { featured: true });
  };

  const deleteBerita = (id: string) => {
    setBeritaList((prev) => {
      const next = prev.filter((b) => b.id !== id);
      saveItemToSupabase('beritaList', next);
      return next;
    });
    deleteBeritaFromSupabase(id);
    showToast('Berita berhasil dihapus dari Supabase', 'info');
  };

  const incrementBeritaViews = (id: string) => {
    setBeritaList((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const count = (b.dibacaCount || 0) + 1;
          const updated = { ...b, dibacaCount: count };
          return updated;
        }
        return b;
      })
    );
  };

  // Prestasi Mutations
  const addPrestasi = (item: Omit<PrestasiItem, 'id'>) => {
    const newItem: PrestasiItem = { ...item, id: generateUniqueId('pres') };
    setPrestasiList((prev) => {
      const next = [newItem, ...prev];
      saveItemToSupabase('prestasiList', next);
      return next;
    });
    savePrestasiToSupabase(newItem);
    showToast('Prestasi baru tersimpan ke Supabase', 'success');
  };

  const updatePrestasi = (id: string, item: Partial<PrestasiItem>) => {
    setPrestasiList((prev) => {
      const next = prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...item };
          savePrestasiToSupabase(updated);
          return updated;
        }
        return p;
      });
      saveItemToSupabase('prestasiList', next);
      return next;
    });
    showToast('Prestasi berhasil diperbarui di Supabase', 'success');
  };

  const deletePrestasi = (id: string) => {
    setPrestasiList((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveItemToSupabase('prestasiList', next);
      return next;
    });
    deletePrestasiFromSupabase(id);
    showToast('Prestasi berhasil dihapus dari Supabase', 'info');
  };

  // Galeri Mutations
  const addGaleri = (item: Omit<GaleriItem, 'id'>) => {
    let youtubeId = item.youtubeId;
    if (item.tipe === 'video' && item.url && !youtubeId) {
      const match = item.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match) youtubeId = match[1];
    }
    const newItem: GaleriItem = { ...item, id: generateUniqueId('gal'), youtubeId };
    setGaleriList((prev) => {
      const next = [newItem, ...prev];
      saveItemToSupabase('galeriList', next);
      return next;
    });
    saveGaleriToSupabase(newItem);
    showToast('Item galeri berhasil disimpan ke Supabase', 'success');
  };

  const updateGaleri = (id: string, item: Partial<GaleriItem>) => {
    setGaleriList((prev) => {
      const next = prev.map((g) => {
        if (g.id === id) {
          const updated = { ...g, ...item };
          saveGaleriToSupabase(updated);
          return updated;
        }
        return g;
      });
      saveItemToSupabase('galeriList', next);
      return next;
    });
    showToast('Item galeri berhasil diperbarui di Supabase', 'success');
  };

  const deleteGaleri = (id: string) => {
    setGaleriList((prev) => {
      const next = prev.filter((g) => g.id !== id);
      saveItemToSupabase('galeriList', next);
      return next;
    });
    deleteGaleriFromSupabase(id);
    showToast('Item galeri berhasil dihapus dari Supabase', 'info');
  };

  // Kalender Mutations
  const addKalender = (item: Omit<KalenderItem, 'id'>) => {
    const newItem: KalenderItem = { ...item, id: generateUniqueId('kal') };
    setKalenderList((prev) => {
      const next = [...prev, newItem];
      saveItemToSupabase('kalenderList', next);
      return next;
    });
    saveKalenderToSupabase(newItem);
    showToast('Agenda kalender berhasil disimpan ke Supabase', 'success');
  };

  const updateKalender = (id: string, item: Partial<KalenderItem>) => {
    setKalenderList((prev) => {
      const next = prev.map((k) => {
        if (k.id === id) {
          const updated = { ...k, ...item };
          saveKalenderToSupabase(updated);
          return updated;
        }
        return k;
      });
      saveItemToSupabase('kalenderList', next);
      return next;
    });
    showToast('Agenda kegiatan berhasil diperbarui di Supabase', 'success');
  };

  const deleteKalender = (id: string) => {
    setKalenderList((prev) => {
      const next = prev.filter((k) => k.id !== id);
      saveItemToSupabase('kalenderList', next);
      return next;
    });
    deleteKalenderFromSupabase(id);
    showToast('Agenda kegiatan berhasil dihapus dari Supabase', 'info');
  };

  // Layanan Mutations
  const addLayanan = (item: Omit<LayananItem, 'id'>) => {
    const newItem: LayananItem = { ...item, id: generateUniqueId('lay') };
    setLayananList((prev) => {
      const next = [...prev, newItem];
      saveItemToSupabase('layananList', next);
      return next;
    });
    saveLayananToSupabase(newItem);
    showToast('Layanan organisasi berhasil disimpan ke Supabase', 'success');
  };

  const updateLayanan = (id: string, item: Partial<LayananItem>) => {
    setLayananList((prev) => {
      const next = prev.map((l) => {
        if (l.id === id) {
          const updated = { ...l, ...item };
          saveLayananToSupabase(updated);
          return updated;
        }
        return l;
      });
      saveItemToSupabase('layananList', next);
      return next;
    });
    showToast('Layanan organisasi berhasil diperbarui di Supabase', 'success');
  };

  const deleteLayanan = (id: string) => {
    setLayananList((prev) => {
      const next = prev.filter((l) => l.id !== id);
      saveItemToSupabase('layananList', next);
      return next;
    });
    deleteLayananFromSupabase(id);
    showToast('Layanan organisasi berhasil dihapus dari Supabase', 'info');
  };

  // Pendaftaran (Member Registration Submission)
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

    setPendaftaranList((prev) => {
      const next = [newItem, ...prev];
      saveItemToSupabase('pendaftaranList', next);
      return next;
    });

    // Save to Supabase dedicated table
    savePendaftaranToSupabase(newItem);

    showToast('Pendaftaran berhasil dikirim! Data tersimpan di Supabase.', 'success');
    return nomorPendaftaran;
  };

  const updatePendaftaranStatus = (id: string, status: PendaftaranItem['status'], catatan?: string) => {
    setPendaftaranList((prev) => {
      const next = prev.map((p) => {
        if (p.id === id) {
          const updated = {
            ...p,
            status,
            ...(catatan !== undefined ? { catatanAdmin: catatan } : {}),
          };
          savePendaftaranToSupabase(updated);
          return updated;
        }
        return p;
      });
      saveItemToSupabase('pendaftaranList', next);
      return next;
    });
    showToast(`Status pendaftaran berhasil diperbarui: ${status}`, 'success');
  };

  const deletePendaftaran = (id: string) => {
    setPendaftaranList((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveItemToSupabase('pendaftaranList', next);
      return next;
    });
    deletePendaftaranFromSupabase(id);
    showToast('Data pendaftaran berhasil dihapus dari Supabase', 'info');
  };

  // Aspirasi (Public Aspirations)
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

    setAspirasiList((prev) => {
      const next = [newItem, ...prev];
      saveItemToSupabase('aspirasiList', next);
      return next;
    });
    saveAspirasiToSupabase(newItem);
    showToast(`Aspirasi berhasil dikirim! Nomor Tiket Anda: ${tiketId}`, 'success');
    return tiketId;
  };

  const updateAspirasiStatus = (id: string, status: AspirasiItem['status'], responAdmin?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setAspirasiList((prev) => {
      const next = prev.map((a) => {
        if (a.id === id) {
          const updated = {
            ...a,
            status,
            ...(responAdmin !== undefined ? { responAdmin, tanggalRespon: today } : {}),
          };
          saveAspirasiToSupabase(updated);
          return updated;
        }
        return a;
      });
      saveItemToSupabase('aspirasiList', next);
      return next;
    });
    showToast(`Status aspirasi berhasil diperbarui: ${status}`, 'success');
  };

  const deleteAspirasi = (id: string) => {
    setAspirasiList((prev) => {
      const next = prev.filter((a) => a.id !== id);
      saveItemToSupabase('aspirasiList', next);
      return next;
    });
    deleteAspirasiFromSupabase(id);
    showToast('Data aspirasi berhasil dihapus dari Supabase', 'info');
  };

  // Social & Settings Mutations
  const updateSocialMedia = (data: Partial<SocialMediaLinks>) => {
    setSocialMedia((prev) => {
      const updated = { ...prev, ...data };
      saveItemToSupabase('socialMedia', updated);
      return updated;
    });
    showToast('Tautan media sosial berhasil disimpan ke Supabase', 'success');
  };

  const updateSiteSettings = (data: Partial<SiteSettings>) => {
    setSiteSettings((prev) => {
      const updated = { ...prev, ...data };
      saveItemToSupabase('siteSettings', updated);
      return updated;
    });
    showToast('Pengaturan website berhasil disimpan ke Supabase', 'success');
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
    showToast('Data sistem lokal dikembalikan ke standar awal', 'info');
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
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) setProfile(data.profile);
      if (data.sejarahList) setSejarahList(data.sejarahList);
      if (data.visiMisi) setVisiMisi(data.visiMisi);
      if (data.pengurusList) setPengurusList(data.pengurusList);
      if (data.programKerjaList) setProgramKerjaList(data.programKerjaList);
      if (data.kegiatanList) setKegiatanList(data.kegiatanList);
      if (data.beritaList) setBeritaList(data.beritaList);
      if (data.prestasiList) setPrestasiList(data.prestasiList);
      if (data.galeriList) setGaleriList(data.galeriList);
      if (data.kalenderList) setKalenderList(data.kalenderList);
      if (data.layananList) setLayananList(data.layananList);
      if (data.pendaftaranList) setPendaftaranList(data.pendaftaranList);
      if (data.aspirasiList) setAspirasiList(data.aspirasiList);
      if (data.socialMedia) setSocialMedia(data.socialMedia);
      if (data.siteSettings) setSiteSettings(data.siteSettings);
      showToast('Data cadangan berhasil diimpor ke aplikasi!', 'success');
      return true;
    } catch {
      showToast('Format berkas cadangan JSON tidak valid', 'error');
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
        adminUser: supabaseUser,
        isCloudConnected: supabaseStatus.connected,
        isSyncingCloud: isSyncingSupabase,
        toasts,
        loginAdmin,
        loginAdminWithGoogle,
        logoutAdmin,
        changeAdminPassword,
        resetAdminPassword,
        showToast,
        removeToast,
        syncAllToFirestore,
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
        setBeritaUtama,
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
        supabaseUser,
        isMemberAuthModalOpen,
        memberAuthDefaultTab,
        openMemberAuthModal,
        closeMemberAuthModal,
        loginMemberWithSupabase,
        registerMemberWithSupabase,
        logoutMemberWithSupabase,
        supabaseStatus,
        isSyncingSupabase,
        checkSupabaseStatus,
        syncAllToSupabase,
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

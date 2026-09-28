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
  auth,
  db,
  googleAuthProvider,
  handleFirestoreError,
  OperationType,
} from './firebase';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';

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
  adminUser: User | null;
  isCloudConnected: boolean;
  isSyncingCloud: boolean;
  toasts: ToastMessage[];

  // Admin Auth
  loginAdmin: (password: string) => boolean;
  loginAdminWithGoogle: () => Promise<boolean>;
  logoutAdmin: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Cloud Synchronization
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
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [hydrated, setHydrated] = useState<boolean>(false);

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

  // 1. Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAdminUser(user);
        setIsAdminLoggedIn(true);
        try {
          localStorage.setItem(AUTH_KEY, 'true');
        } catch {}
      } else {
        setAdminUser(null);
        const savedAuth = typeof window !== 'undefined' ? localStorage.getItem(AUTH_KEY) : null;
        if (savedAuth !== 'true') {
          setIsAdminLoggedIn(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Hydrate from localStorage for instant initial paint
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
          if (parsed.siteSettings) setSiteSettings(parsed.siteSettings);
        }
      } catch (e) {
        console.error('Error reading localStorage:', e);
      } finally {
        setHydrated(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // 3. REALTIME CLOUD FIRESTORE SUBSCRIPTIONS
  // Every user who opens the website connects to Firestore and gets instant updates
  useEffect(() => {
    // A. Settings (Profile, VisiMisi, SocialMedia, SiteSettings)
    const unsubProfile = onSnapshot(
      doc(db, 'settings', 'profile'),
      (snapshot) => {
        if (snapshot.exists()) {
          setProfile((prev) => ({ ...prev, ...(snapshot.data() as OrgProfile) }));
        }
      },
      (err) => {
        console.warn('Firestore profile snapshot info:', err.message);
      }
    );

    const unsubVisiMisi = onSnapshot(
      doc(db, 'settings', 'visiMisi'),
      (snapshot) => {
        if (snapshot.exists()) {
          setVisiMisi(snapshot.data() as VisiMisi);
        }
      },
      (err) => console.warn('Firestore visiMisi snapshot info:', err.message)
    );

    const unsubSocial = onSnapshot(
      doc(db, 'settings', 'socialMedia'),
      (snapshot) => {
        if (snapshot.exists()) {
          setSocialMedia(snapshot.data() as SocialMediaLinks);
        }
      },
      (err) => console.warn('Firestore socialMedia snapshot info:', err.message)
    );

    const unsubSite = onSnapshot(
      doc(db, 'settings', 'siteSettings'),
      (snapshot) => {
        if (snapshot.exists()) {
          setSiteSettings(snapshot.data() as SiteSettings);
        }
      },
      (err) => console.warn('Firestore siteSettings snapshot info:', err.message)
    );

    // B. Collections
    const unsubSejarah = onSnapshot(
      collection(db, 'sejarah'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((d) => d.data() as SejarahItem);
          setSejarahList(deduplicateItems(items, 'sej'));
        }
      },
      (err) => console.warn('Firestore sejarah snapshot info:', err.message)
    );

    const unsubPengurus = onSnapshot(
      collection(db, 'pengurus'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((d) => d.data() as PengurusItem);
          // Sort by noUrut
          items.sort((a, b) => (a.noUrut || 0) - (b.noUrut || 0));
          setPengurusList(deduplicateItems(items, 'peng'));
        }
      },
      (err) => console.warn('Firestore pengurus snapshot info:', err.message)
    );

    const unsubProgram = onSnapshot(
      collection(db, 'programKerja'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((d) => d.data() as ProgramKerjaItem);
          setProgramKerjaList(deduplicateItems(items, 'prog'));
        }
      },
      (err) => console.warn('Firestore programKerja snapshot info:', err.message)
    );

    const unsubKegiatan = onSnapshot(
      collection(db, 'kegiatan'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((d) => d.data() as KegiatanItem);
          setKegiatanList(deduplicateItems(items, 'keg'));
        }
      },
      (err) => console.warn('Firestore kegiatan snapshot info:', err.message)
    );

    const unsubBerita = onSnapshot(
      collection(db, 'berita'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((d) => d.data() as BeritaItem);
          setBeritaList(deduplicateItems(items, 'ber'));
        }
      },
      (err) => console.warn('Firestore berita snapshot info:', err.message)
    );

    const unsubPrestasi = onSnapshot(
      collection(db, 'prestasi'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((d) => d.data() as PrestasiItem);
          setPrestasiList(deduplicateItems(items, 'pres'));
        }
      },
      (err) => console.warn('Firestore prestasi snapshot info:', err.message)
    );

    const unsubGaleri = onSnapshot(
      collection(db, 'galeri'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((d) => d.data() as GaleriItem);
          setGaleriList(deduplicateItems(items, 'gal'));
        }
      },
      (err) => console.warn('Firestore galeri snapshot info:', err.message)
    );

    const unsubKalender = onSnapshot(
      collection(db, 'kalender'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((d) => d.data() as KalenderItem);
          setKalenderList(deduplicateItems(items, 'kal'));
        }
      },
      (err) => console.warn('Firestore kalender snapshot info:', err.message)
    );

    const unsubLayanan = onSnapshot(
      collection(db, 'layanan'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((d) => d.data() as LayananItem);
          setLayananList(deduplicateItems(items, 'lay'));
        }
      },
      (err) => console.warn('Firestore layanan snapshot info:', err.message)
    );

    return () => {
      unsubProfile();
      unsubVisiMisi();
      unsubSocial();
      unsubSite();
      unsubSejarah();
      unsubPengurus();
      unsubProgram();
      unsubKegiatan();
      unsubBerita();
      unsubPrestasi();
      unsubGaleri();
      unsubKalender();
      unsubLayanan();
    };
  }, []);

  // 4. Listen to Pendaftaran & Aspirasi (only when Admin is logged in to respect PII Security Rules)
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    const unsubPendaftaran = onSnapshot(
      collection(db, 'pendaftaran'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((d) => d.data() as PendaftaranItem);
          setPendaftaranList(deduplicateItems(items, 'pend'));
        }
      },
      (err) => console.warn('Pendaftaran listener:', err.message)
    );

    const unsubAspirasi = onSnapshot(
      collection(db, 'aspirasi'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((d) => d.data() as AspirasiItem);
          setAspirasiList(deduplicateItems(items, 'asp'));
        }
      },
      (err) => console.warn('Aspirasi listener:', err.message)
    );

    return () => {
      unsubPendaftaran();
      unsubAspirasi();
    };
  }, [isAdminLoggedIn]);

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

  // 6. Cache state to localStorage as fast client fallback
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
      console.error('Error saving local cache:', e);
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

  // Admin Auth Actions
  const loginAdmin = (password: string) => {
    const validPasswords = ['pgri2026', 'admin123', 'pasirwangi'];
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

  const loginAdminWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      if (result.user) {
        setAdminUser(result.user);
        setIsAdminLoggedIn(true);
        try {
          localStorage.setItem(AUTH_KEY, 'true');
        } catch {}
        showToast(`Berhasil masuk sebagai Admin: ${result.user.email}`, 'success');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      showToast(error.message || 'Gagal masuk dengan Google', 'error');
      return false;
    }
  };

  const logoutAdmin = async () => {
    try {
      await signOut(auth);
    } catch {}
    setAdminUser(null);
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {}
    showToast('Anda telah keluar dari panel admin', 'info');
  };

  // Cloud Sync Function: Seeds or overrides Firestore with all current data
  const syncAllToFirestore = async () => {
    setIsSyncingCloud(true);
    showToast('Memulai sinkronisasi seluruh data ke Cloud Firestore...', 'info');

    try {
      // 1. Settings
      await setDoc(doc(db, 'settings', 'profile'), profile);
      await setDoc(doc(db, 'settings', 'visiMisi'), visiMisi);
      await setDoc(doc(db, 'settings', 'socialMedia'), socialMedia);
      await setDoc(doc(db, 'settings', 'siteSettings'), siteSettings);

      // 2. Sejarah
      for (const item of sejarahList) {
        await setDoc(doc(db, 'sejarah', item.id), item);
      }

      // 3. Pengurus
      for (const item of pengurusList) {
        await setDoc(doc(db, 'pengurus', item.id), item);
      }

      // 4. Program Kerja
      for (const item of programKerjaList) {
        await setDoc(doc(db, 'programKerja', item.id), item);
      }

      // 5. Kegiatan
      for (const item of kegiatanList) {
        await setDoc(doc(db, 'kegiatan', item.id), item);
      }

      // 6. Berita
      for (const item of beritaList) {
        await setDoc(doc(db, 'berita', item.id), item);
      }

      // 7. Prestasi
      for (const item of prestasiList) {
        await setDoc(doc(db, 'prestasi', item.id), item);
      }

      // 8. Galeri
      for (const item of galeriList) {
        await setDoc(doc(db, 'galeri', item.id), item);
      }

      // 9. Kalender
      for (const item of kalenderList) {
        await setDoc(doc(db, 'kalender', item.id), item);
      }

      // 10. Layanan
      for (const item of layananList) {
        await setDoc(doc(db, 'layanan', item.id), item);
      }

      showToast('Seluruh data berhasil disinkronkan ke Cloud Firestore!', 'success');
    } catch (error) {
      console.error('Error during cloud sync:', error);
      handleFirestoreError(error, OperationType.WRITE, 'syncAll');
      showToast('Gagal sinkronisasi data ke cloud. Pastikan Anda sudah login Admin.', 'error');
    } finally {
      setIsSyncingCloud(false);
    }
  };

  // Profile Mutations
  const updateProfile = (updates: Partial<OrgProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      setDoc(doc(db, 'settings', 'profile'), updated).catch((err) =>
        handleFirestoreError(err, OperationType.UPDATE, 'settings/profile')
      );
      return updated;
    });
    showToast('Profil organisasi berhasil diperbarui ke Cloud', 'success');
  };

  const updateStatistik = (stats: Partial<OrgProfile['statistik']>) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        statistik: { ...prev.statistik, ...stats },
      };
      setDoc(doc(db, 'settings', 'profile'), updated).catch((err) =>
        handleFirestoreError(err, OperationType.UPDATE, 'settings/profile')
      );
      return updated;
    });
    showToast('Statistik organisasi berhasil diperbarui ke Cloud', 'success');
  };

  // Sejarah Mutations
  const addSejarah = (item: Omit<SejarahItem, 'id'>) => {
    const newItem: SejarahItem = { ...item, id: generateUniqueId('sej') };
    setSejarahList((prev) => [newItem, ...prev]);
    setDoc(doc(db, 'sejarah', newItem.id), newItem).catch((err) =>
      handleFirestoreError(err, OperationType.CREATE, `sejarah/${newItem.id}`)
    );
    showToast('Peristiwa sejarah baru berhasil disimpan ke Cloud', 'success');
  };

  const updateSejarah = (id: string, item: Partial<SejarahItem>) => {
    setSejarahList((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...item };
          setDoc(doc(db, 'sejarah', id), updated).catch((err) =>
            handleFirestoreError(err, OperationType.UPDATE, `sejarah/${id}`)
          );
          return updated;
        }
        return s;
      })
    );
    showToast('Peristiwa sejarah berhasil diperbarui', 'success');
  };

  const deleteSejarah = (id: string) => {
    setSejarahList((prev) => prev.filter((s) => s.id !== id));
    deleteDoc(doc(db, 'sejarah', id)).catch((err) =>
      handleFirestoreError(err, OperationType.DELETE, `sejarah/${id}`)
    );
    showToast('Peristiwa sejarah berhasil dihapus dari Cloud', 'info');
  };

  // Visi Misi Mutations
  const updateVisiMisi = (data: Partial<VisiMisi>) => {
    setVisiMisi((prev) => {
      const updated = { ...prev, ...data };
      setDoc(doc(db, 'settings', 'visiMisi'), updated).catch((err) =>
        handleFirestoreError(err, OperationType.UPDATE, 'settings/visiMisi')
      );
      return updated;
    });
    showToast('Visi & Misi berhasil disimpan ke Cloud', 'success');
  };

  // Pengurus Mutations
  const addPengurus = (item: Omit<PengurusItem, 'id'>) => {
    const newItem: PengurusItem = { ...item, id: generateUniqueId('peng') };
    setPengurusList((prev) => [...prev, newItem]);
    setDoc(doc(db, 'pengurus', newItem.id), newItem).catch((err) =>
      handleFirestoreError(err, OperationType.CREATE, `pengurus/${newItem.id}`)
    );
    showToast('Data pengurus baru tersimpan ke Cloud', 'success');
  };

  const importPengurusBatch = async (items: Array<Omit<PengurusItem, 'id'>>) => {
    if (!items || items.length === 0) return;
    const timestamp = Date.now();
    const newItems: PengurusItem[] = items.map((item, idx) => ({
      ...item,
      id: `peng-${timestamp}-${idx + 1}-${Math.random().toString(36).substring(2, 7)}`,
    }));
    setPengurusList((prev) => [...prev, ...newItems]);

    try {
      const batch = writeBatch(db);
      for (const item of newItems) {
        batch.set(doc(db, 'pengurus', item.id), item);
      }
      await batch.commit();
      showToast(`Berhasil menyimpan ${newItems.length} data pengurus ke Cloud Firestore!`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'pengurus/batch');
    }
  };

  const updatePengurus = (id: string, item: Partial<PengurusItem>) => {
    setPengurusList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...item };
          setDoc(doc(db, 'pengurus', id), updated).catch((err) =>
            handleFirestoreError(err, OperationType.UPDATE, `pengurus/${id}`)
          );
          return updated;
        }
        return p;
      })
    );
    showToast('Data pengurus berhasil diperbarui di Cloud', 'success');
  };

  const deletePengurus = (id: string) => {
    setPengurusList((prev) => prev.filter((p) => p.id !== id));
    deleteDoc(doc(db, 'pengurus', id)).catch((err) =>
      handleFirestoreError(err, OperationType.DELETE, `pengurus/${id}`)
    );
    showToast('Data pengurus berhasil dihapus dari Cloud', 'info');
  };

  // Program Kerja Mutations
  const addProgramKerja = (item: Omit<ProgramKerjaItem, 'id'>) => {
    const newItem: ProgramKerjaItem = { ...item, id: generateUniqueId('prog') };
    setProgramKerjaList((prev) => [...prev, newItem]);
    setDoc(doc(db, 'programKerja', newItem.id), newItem).catch((err) =>
      handleFirestoreError(err, OperationType.CREATE, `programKerja/${newItem.id}`)
    );
    showToast('Program kerja baru berhasil disimpan ke Cloud', 'success');
  };

  const updateProgramKerja = (id: string, item: Partial<ProgramKerjaItem>) => {
    setProgramKerjaList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...item };
          setDoc(doc(db, 'programKerja', id), updated).catch((err) =>
            handleFirestoreError(err, OperationType.UPDATE, `programKerja/${id}`)
          );
          return updated;
        }
        return p;
      })
    );
    showToast('Program kerja berhasil diperbarui', 'success');
  };

  const deleteProgramKerja = (id: string) => {
    setProgramKerjaList((prev) => prev.filter((p) => p.id !== id));
    deleteDoc(doc(db, 'programKerja', id)).catch((err) =>
      handleFirestoreError(err, OperationType.DELETE, `programKerja/${id}`)
    );
    showToast('Program kerja berhasil dihapus dari Cloud', 'info');
  };

  // Kegiatan Mutations
  const addKegiatan = (item: Omit<KegiatanItem, 'id'>) => {
    const newItem: KegiatanItem = { ...item, id: generateUniqueId('keg') };
    setKegiatanList((prev) => [newItem, ...prev]);
    setDoc(doc(db, 'kegiatan', newItem.id), newItem).catch((err) =>
      handleFirestoreError(err, OperationType.CREATE, `kegiatan/${newItem.id}`)
    );
    showToast('Dokumentasi kegiatan berhasil disimpan ke Cloud', 'success');
  };

  const updateKegiatan = (id: string, item: Partial<KegiatanItem>) => {
    setKegiatanList((prev) =>
      prev.map((k) => {
        if (k.id === id) {
          const updated = { ...k, ...item };
          setDoc(doc(db, 'kegiatan', id), updated).catch((err) =>
            handleFirestoreError(err, OperationType.UPDATE, `kegiatan/${id}`)
          );
          return updated;
        }
        return k;
      })
    );
    showToast('Dokumentasi kegiatan berhasil diperbarui', 'success');
  };

  const deleteKegiatan = (id: string) => {
    setKegiatanList((prev) => prev.filter((k) => k.id !== id));
    deleteDoc(doc(db, 'kegiatan', id)).catch((err) =>
      handleFirestoreError(err, OperationType.DELETE, `kegiatan/${id}`)
    );
    showToast('Dokumentasi kegiatan berhasil dihapus dari Cloud', 'info');
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
    };
    setBeritaList((prev) => [newItem, ...prev]);
    setDoc(doc(db, 'berita', newItem.id), newItem).catch((err) =>
      handleFirestoreError(err, OperationType.CREATE, `berita/${newItem.id}`)
    );
    showToast('Berita berhasil diterbitkan dan disimpan ke Cloud', 'success');
  };

  const updateBerita = (id: string, item: Partial<BeritaItem>) => {
    setBeritaList((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const updated = { ...b, ...item };
          setDoc(doc(db, 'berita', id), updated).catch((err) =>
            handleFirestoreError(err, OperationType.UPDATE, `berita/${id}`)
          );
          return updated;
        }
        return b;
      })
    );
    showToast('Berita berhasil diperbarui', 'success');
  };

  const deleteBerita = (id: string) => {
    setBeritaList((prev) => prev.filter((b) => b.id !== id));
    deleteDoc(doc(db, 'berita', id)).catch((err) =>
      handleFirestoreError(err, OperationType.DELETE, `berita/${id}`)
    );
    showToast('Berita berhasil dihapus dari Cloud', 'info');
  };

  const incrementBeritaViews = (id: string) => {
    setBeritaList((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const count = (b.dibacaCount || 0) + 1;
          const updated = { ...b, dibacaCount: count };
          // Fire-and-forget view count update to firestore
          setDoc(doc(db, 'berita', id), { dibacaCount: count }, { merge: true }).catch(() => {});
          return updated;
        }
        return b;
      })
    );
  };

  // Prestasi Mutations
  const addPrestasi = (item: Omit<PrestasiItem, 'id'>) => {
    const newItem: PrestasiItem = { ...item, id: generateUniqueId('pres') };
    setPrestasiList((prev) => [newItem, ...prev]);
    setDoc(doc(db, 'prestasi', newItem.id), newItem).catch((err) =>
      handleFirestoreError(err, OperationType.CREATE, `prestasi/${newItem.id}`)
    );
    showToast('Prestasi baru tersimpan ke Cloud', 'success');
  };

  const updatePrestasi = (id: string, item: Partial<PrestasiItem>) => {
    setPrestasiList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...item };
          setDoc(doc(db, 'prestasi', id), updated).catch((err) =>
            handleFirestoreError(err, OperationType.UPDATE, `prestasi/${id}`)
          );
          return updated;
        }
        return p;
      })
    );
    showToast('Prestasi berhasil diperbarui di Cloud', 'success');
  };

  const deletePrestasi = (id: string) => {
    setPrestasiList((prev) => prev.filter((p) => p.id !== id));
    deleteDoc(doc(db, 'prestasi', id)).catch((err) =>
      handleFirestoreError(err, OperationType.DELETE, `prestasi/${id}`)
    );
    showToast('Prestasi berhasil dihapus dari Cloud', 'info');
  };

  // Galeri Mutations
  const addGaleri = (item: Omit<GaleriItem, 'id'>) => {
    let youtubeId = item.youtubeId;
    if (item.tipe === 'video' && item.url && !youtubeId) {
      const match = item.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match) youtubeId = match[1];
    }
    const newItem: GaleriItem = { ...item, id: generateUniqueId('gal'), youtubeId };
    setGaleriList((prev) => [newItem, ...prev]);
    setDoc(doc(db, 'galeri', newItem.id), newItem).catch((err) =>
      handleFirestoreError(err, OperationType.CREATE, `galeri/${newItem.id}`)
    );
    showToast('Item galeri berhasil disimpan ke Cloud', 'success');
  };

  const updateGaleri = (id: string, item: Partial<GaleriItem>) => {
    setGaleriList((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updated = { ...g, ...item };
          setDoc(doc(db, 'galeri', id), updated).catch((err) =>
            handleFirestoreError(err, OperationType.UPDATE, `galeri/${id}`)
          );
          return updated;
        }
        return g;
      })
    );
    showToast('Item galeri berhasil diperbarui di Cloud', 'success');
  };

  const deleteGaleri = (id: string) => {
    setGaleriList((prev) => prev.filter((g) => g.id !== id));
    deleteDoc(doc(db, 'galeri', id)).catch((err) =>
      handleFirestoreError(err, OperationType.DELETE, `galeri/${id}`)
    );
    showToast('Item galeri berhasil dihapus dari Cloud', 'info');
  };

  // Kalender Mutations
  const addKalender = (item: Omit<KalenderItem, 'id'>) => {
    const newItem: KalenderItem = { ...item, id: generateUniqueId('kal') };
    setKalenderList((prev) => [...prev, newItem]);
    setDoc(doc(db, 'kalender', newItem.id), newItem).catch((err) =>
      handleFirestoreError(err, OperationType.CREATE, `kalender/${newItem.id}`)
    );
    showToast('Agenda kalender berhasil disimpan ke Cloud', 'success');
  };

  const updateKalender = (id: string, item: Partial<KalenderItem>) => {
    setKalenderList((prev) =>
      prev.map((k) => {
        if (k.id === id) {
          const updated = { ...k, ...item };
          setDoc(doc(db, 'kalender', id), updated).catch((err) =>
            handleFirestoreError(err, OperationType.UPDATE, `kalender/${id}`)
          );
          return updated;
        }
        return k;
      })
    );
    showToast('Agenda kegiatan berhasil diperbarui di Cloud', 'success');
  };

  const deleteKalender = (id: string) => {
    setKalenderList((prev) => prev.filter((k) => k.id !== id));
    deleteDoc(doc(db, 'kalender', id)).catch((err) =>
      handleFirestoreError(err, OperationType.DELETE, `kalender/${id}`)
    );
    showToast('Agenda kegiatan berhasil dihapus dari Cloud', 'info');
  };

  // Layanan Mutations
  const addLayanan = (item: Omit<LayananItem, 'id'>) => {
    const newItem: LayananItem = { ...item, id: generateUniqueId('lay') };
    setLayananList((prev) => [...prev, newItem]);
    setDoc(doc(db, 'layanan', newItem.id), newItem).catch((err) =>
      handleFirestoreError(err, OperationType.CREATE, `layanan/${newItem.id}`)
    );
    showToast('Layanan organisasi berhasil disimpan ke Cloud', 'success');
  };

  const updateLayanan = (id: string, item: Partial<LayananItem>) => {
    setLayananList((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const updated = { ...l, ...item };
          setDoc(doc(db, 'layanan', id), updated).catch((err) =>
            handleFirestoreError(err, OperationType.UPDATE, `layanan/${id}`)
          );
          return updated;
        }
        return l;
      })
    );
    showToast('Layanan organisasi berhasil diperbarui di Cloud', 'success');
  };

  const deleteLayanan = (id: string) => {
    setLayananList((prev) => prev.filter((l) => l.id !== id));
    deleteDoc(doc(db, 'layanan', id)).catch((err) =>
      handleFirestoreError(err, OperationType.DELETE, `layanan/${id}`)
    );
    showToast('Layanan organisasi berhasil dihapus dari Cloud', 'info');
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

    setPendaftaranList((prev) => [newItem, ...prev]);
    setDoc(doc(db, 'pendaftaran', newItem.id), newItem).catch((err) =>
      handleFirestoreError(err, OperationType.CREATE, `pendaftaran/${newItem.id}`)
    );
    showToast('Pendaftaran berhasil dikirim! Tersimpan di Cloud.', 'success');
    return nomorPendaftaran;
  };

  const updatePendaftaranStatus = (id: string, status: PendaftaranItem['status'], catatan?: string) => {
    setPendaftaranList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = {
            ...p,
            status,
            ...(catatan !== undefined ? { catatanAdmin: catatan } : {}),
          };
          setDoc(doc(db, 'pendaftaran', id), updated).catch((err) =>
            handleFirestoreError(err, OperationType.UPDATE, `pendaftaran/${id}`)
          );
          return updated;
        }
        return p;
      })
    );
    showToast(`Status pendaftaran berhasil diperbarui: ${status}`, 'success');
  };

  const deletePendaftaran = (id: string) => {
    setPendaftaranList((prev) => prev.filter((p) => p.id !== id));
    deleteDoc(doc(db, 'pendaftaran', id)).catch((err) =>
      handleFirestoreError(err, OperationType.DELETE, `pendaftaran/${id}`)
    );
    showToast('Data pendaftaran berhasil dihapus dari Cloud', 'info');
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

    setAspirasiList((prev) => [newItem, ...prev]);
    setDoc(doc(db, 'aspirasi', newItem.id), newItem).catch((err) =>
      handleFirestoreError(err, OperationType.CREATE, `aspirasi/${newItem.id}`)
    );
    showToast(`Aspirasi berhasil dikirim! Nomor Tiket Anda: ${tiketId}`, 'success');
    return tiketId;
  };

  const updateAspirasiStatus = (id: string, status: AspirasiItem['status'], responAdmin?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setAspirasiList((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = {
            ...a,
            status,
            ...(responAdmin !== undefined ? { responAdmin, tanggalRespon: today } : {}),
          };
          setDoc(doc(db, 'aspirasi', id), updated).catch((err) =>
            handleFirestoreError(err, OperationType.UPDATE, `aspirasi/${id}`)
          );
          return updated;
        }
        return a;
      })
    );
    showToast(`Status aspirasi berhasil diperbarui: ${status}`, 'success');
  };

  const deleteAspirasi = (id: string) => {
    setAspirasiList((prev) => prev.filter((a) => a.id !== id));
    deleteDoc(doc(db, 'aspirasi', id)).catch((err) =>
      handleFirestoreError(err, OperationType.DELETE, `aspirasi/${id}`)
    );
    showToast('Data aspirasi berhasil dihapus dari Cloud', 'info');
  };

  // Social & Settings Mutations
  const updateSocialMedia = (data: Partial<SocialMediaLinks>) => {
    setSocialMedia((prev) => {
      const updated = { ...prev, ...data };
      setDoc(doc(db, 'settings', 'socialMedia'), updated).catch((err) =>
        handleFirestoreError(err, OperationType.UPDATE, 'settings/socialMedia')
      );
      return updated;
    });
    showToast('Tautan media sosial berhasil disimpan ke Cloud', 'success');
  };

  const updateSiteSettings = (data: Partial<SiteSettings>) => {
    setSiteSettings((prev) => {
      const updated = { ...prev, ...data };
      setDoc(doc(db, 'settings', 'siteSettings'), updated).catch((err) =>
        handleFirestoreError(err, OperationType.UPDATE, 'settings/siteSettings')
      );
      return updated;
    });
    showToast('Pengaturan website berhasil disimpan ke Cloud', 'success');
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
      showToast('Data berhasil diimpor! Silakan klik Sinkronkan ke Cloud.', 'success');
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
        adminUser,
        isCloudConnected,
        isSyncingCloud,
        toasts,
        loginAdmin,
        loginAdminWithGoogle,
        logoutAdmin,
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

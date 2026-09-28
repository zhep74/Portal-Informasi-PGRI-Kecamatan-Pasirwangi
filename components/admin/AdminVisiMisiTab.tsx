'use client';

import React, { useState } from 'react';
import { usePgriStore } from '@/lib/store';
import {
  Compass,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Target,
  Flag,
  Sparkles,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export function AdminVisiMisiTab() {
  const { visiMisi, updateVisiMisi, showToast } = usePgriStore();

  const [visi, setVisi] = useState(visiMisi.visi);
  const [moto, setMoto] = useState(visiMisi.moto);
  const [misiList, setMisiList] = useState<string[]>([...visiMisi.misi]);
  const [tujuanList, setTujuanList] = useState<string[]>([...visiMisi.tujuan]);

  const [newMisiText, setNewMisiText] = useState('');
  const [newTujuanText, setNewTujuanText] = useState('');

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateVisiMisi({
      visi,
      moto,
      misi: misiList,
      tujuan: tujuanList,
    });
    showToast('Visi, Misi, Moto & Tujuan berhasil disimpan!', 'success');
  };

  const addMisi = () => {
    if (!newMisiText.trim()) return;
    setMisiList([...misiList, newMisiText.trim()]);
    setNewMisiText('');
  };

  const removeMisi = (index: number) => {
    setMisiList(misiList.filter((_, idx) => idx !== index));
  };

  const addTujuan = () => {
    if (!newTujuanText.trim()) return;
    setTujuanList([...tujuanList, newTujuanText.trim()]);
    setNewTujuanText('');
  };

  const removeTujuan = (index: number) => {
    setTujuanList(tujuanList.filter((_, idx) => idx !== index));
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider mb-1">
            <Compass className="h-3.5 w-3.5" />
            <span>Arah & Haluan Organisasi</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Kelola Visi, Misi, Moto & Tujuan Organisasi
          </h3>
          <p className="text-xs text-slate-500">
            Sesuaikan landasan filosofis dan program jangka panjang kepengurusan PGRI Pasirwangi.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all shrink-0"
        >
          <Save className="h-4 w-4" />
          <span>Simpan Seluruh Perubahan</span>
        </button>
      </div>

      {/* 1. Visi & Moto Card */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 shadow-xs">
        <div>
          <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1.5">
            <Target className="h-4 w-4 text-emerald-600" />
            <span>Rumusan Visi Organisasi (Masa Bakti 2025 - 2030)</span>
          </label>
          <textarea
            rows={3}
            value={visi}
            onChange={(e) => setVisi(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 leading-relaxed font-medium"
            placeholder="Tuliskan visi utama organisasi..."
          />
        </div>

        <div>
          <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1.5">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Moto / Semboyan Perjuangan Guru</span>
          </label>
          <input
            type="text"
            value={moto}
            onChange={(e) => setMoto(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 font-semibold text-emerald-800"
            placeholder="Contoh: Solidaritas, Pengabdian, dan Kemajuan Pendidikan!"
          />
        </div>
      </div>

      {/* 2. Misi Organisasi (Poin-Poin) */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Flag className="h-4 w-4 text-emerald-600" />
            <span>Daftar Misi Organisasi ({misiList.length} Butir)</span>
          </h4>
        </div>

        <div className="space-y-2">
          {misiList.map((m, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 bg-white p-3 rounded-2xl border border-slate-200 text-xs shadow-2xs"
            >
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                {idx + 1}
              </span>
              <input
                type="text"
                value={m}
                onChange={(e) => {
                  const updated = [...misiList];
                  updated[idx] = e.target.value;
                  setMisiList(updated);
                }}
                className="flex-1 bg-transparent border-0 focus:ring-0 text-xs text-slate-800 p-0"
              />
              <button
                type="button"
                onClick={() => removeMisi(idx)}
                className="p-1 text-slate-400 hover:text-teal-600 rounded transition-colors"
                title="Hapus butir misi"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Input tambah butir misi baru */}
        <div className="flex gap-2 pt-2 border-t border-slate-200">
          <input
            type="text"
            placeholder="Ketik butir misi baru..."
            value={newMisiText}
            onChange={(e) => setNewMisiText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addMisi();
              }
            }}
            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="button"
            onClick={addMisi}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Misi</span>
          </button>
        </div>
      </div>

      {/* 3. Tujuan Strategis (Poin-Poin) */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Target className="h-4 w-4 text-emerald-600" />
            <span>Tujuan Strategis Organisasi ({tujuanList.length} Butir)</span>
          </h4>
        </div>

        <div className="space-y-2">
          {tujuanList.map((t, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 bg-white p-3 rounded-2xl border border-slate-200 text-xs shadow-2xs"
            >
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                {idx + 1}
              </span>
              <input
                type="text"
                value={t}
                onChange={(e) => {
                  const updated = [...tujuanList];
                  updated[idx] = e.target.value;
                  setTujuanList(updated);
                }}
                className="flex-1 bg-transparent border-0 focus:ring-0 text-xs text-slate-800 p-0"
              />
              <button
                type="button"
                onClick={() => removeTujuan(idx)}
                className="p-1 text-slate-400 hover:text-teal-600 rounded transition-colors"
                title="Hapus butir tujuan"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Input tambah butir tujuan baru */}
        <div className="flex gap-2 pt-2 border-t border-slate-200">
          <input
            type="text"
            placeholder="Ketik butir tujuan strategis baru..."
            value={newTujuanText}
            onChange={(e) => setNewTujuanText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTujuan();
              }
            }}
            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="button"
            onClick={addTujuan}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Tujuan</span>
          </button>
        </div>
      </div>
    </form>
  );
}

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  Check,
  Sparkles,
  RefreshCw,
  Eye,
  Sliders,
  Maximize2,
  Info,
} from 'lucide-react';

interface PrecisionPhotoCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  title?: string;
  onClose: () => void;
  onSave: (croppedDataUrl: string) => void;
}

export function PrecisionPhotoCropModal({
  isOpen,
  imageSrc,
  title = 'Pengaturan Presisi Foto Lingkaran',
  onClose,
  onSave,
}: PrecisionPhotoCropModalProps) {
  // Adjustment states
  const [scale, setScale] = useState(1.0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [prevImage, setPrevImage] = useState(imageSrc);
  if (imageSrc !== prevImage) {
    setPrevImage(imageSrc);
    setScale(1.0);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
    setShowGrid(true);
  }

  // Mouse & Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      // Limit range to prevent losing image
      setPosition({
        x: Math.max(-250, Math.min(250, newX)),
        y: Math.max(-250, Math.min(250, newY)),
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const newX = e.touches[0].clientX - dragStart.x;
    const newY = e.touches[0].clientY - dragStart.y;
    setPosition({
      x: Math.max(-250, Math.min(250, newX)),
      y: Math.max(-250, Math.min(250, newY)),
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Preset alignments
  const applyPreset = (preset: 'face' | 'center' | 'bust') => {
    if (preset === 'face') {
      setScale(1.3);
      setPosition({ x: 0, y: 25 });
    } else if (preset === 'bust') {
      setScale(1.1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(1.0);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }
  };

  // Render and export cropped square/circle image via Canvas
  const handleApply = () => {
    if (!imageRef.current) return;
    setIsProcessing(true);

    try {
      const img = imageRef.current;
      const outputSize = 512; // 512x512 high quality square
      const canvas = document.createElement('canvas');
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Clear
      ctx.clearRect(0, 0, outputSize, outputSize);

      // Move center of canvas
      ctx.translate(outputSize / 2, outputSize / 2);

      // Apply rotation
      ctx.rotate((rotation * Math.PI) / 180);

      // The circular viewfinder in UI has diameter 240px
      const viewfinderRadius = 120;
      const scaleFactor = (outputSize / (viewfinderRadius * 2));

      // Apply translation in output coords
      const exportX = position.x * scaleFactor;
      const exportY = position.y * scaleFactor;
      ctx.translate(exportX, exportY);

      // Calculate image drawing dimensions to fit aspect ratio properly
      const naturalWidth = img.naturalWidth || 400;
      const naturalHeight = img.naturalHeight || 400;
      const imgAspect = naturalWidth / naturalHeight;

      let drawWidth = outputSize;
      let drawHeight = outputSize;

      if (imgAspect > 1) {
        // Landscape
        drawHeight = outputSize;
        drawWidth = outputSize * imgAspect;
      } else {
        // Portrait
        drawWidth = outputSize;
        drawHeight = outputSize / imgAspect;
      }

      drawWidth *= scale;
      drawHeight *= scale;

      ctx.drawImage(
        img,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      const croppedUrl = canvas.toDataURL('image/jpeg', 0.92);
      onSave(croppedUrl);
      onClose();
    } catch (err) {
      console.error('Error cropping image:', err);
      // Fallback
      onSave(imageSrc);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {title}
              </h3>
              <p className="text-[11px] text-slate-400">
                Posisikan dan zoom foto agar pas presisi di dalam bingkai bundar pengurus
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Viewport and Controls Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Circular Viewfinder Canvas Area */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-slate-950/95 p-6 rounded-3xl border border-slate-800">
            {/* Viewfinder Frame */}
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-emerald-500 shadow-2xl select-none touch-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{
                boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.75)',
              }}
            >
              {/* Image with transform */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Pengurus"
                crossOrigin="anonymous"
                className="w-full h-full object-cover pointer-events-none transition-none"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                }}
              />

              {/* Precision Guide Ring & Crosshair */}
              {showGrid && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Outer circle guide */}
                  <div className="absolute inset-2 rounded-full border border-dashed border-emerald-400/60" />
                  {/* Face oval target guide */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40 rounded-[50%] border border-emerald-400/40" />
                  {/* Center Crosshair lines */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-emerald-400/30 -translate-x-1/2" />
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-400/30 -translate-y-1/2" />
                  {/* Eye alignment guide line */}
                  <div className="absolute top-[38%] left-10 right-10 h-px border-b border-dashed border-amber-300/50" />
                </div>
              )}

              {/* Drag indicator hint */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-900/80 text-[10px] text-emerald-300 font-medium pointer-events-none flex items-center gap-1 shadow-xs">
                <Move className="w-3 h-3" />
                <span>Geser foto untuk memposisikan</span>
              </div>
            </div>

            {/* Live Round Preview Avatars */}
            <div className="flex flex-col items-center justify-center space-y-3 shrink-0">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Pratinjau Bundar
              </div>

              {/* Big preview (Card size) */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-emerald-400 shadow-lg relative bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    style={{
                      transform: `translate(${position.x * (96 / 260)}px, ${
                        position.y * (96 / 260)
                      }px) scale(${scale}) rotate(${rotation}deg)`,
                      transformOrigin: 'center center',
                    }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1">Kartu Web</span>
              </div>

              {/* Small preview (Table size) */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400 shadow-md relative bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt="Preview Small"
                    className="w-full h-full object-cover"
                    style={{
                      transform: `translate(${position.x * (48 / 260)}px, ${
                        position.y * (48 / 260)
                      }px) scale(${scale}) rotate(${rotation}deg)`,
                      transformOrigin: 'center center',
                    }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1">Tabel Admin</span>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Preset Presisi:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset('face')}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
              >
                Fokus Wajah (1.3x)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('bust')}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-200/80 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
              >
                Setengah Badan (1.1x)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('center')}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Pusat / Reset</span>
              </button>
            </div>
          </div>

          {/* Precision Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Zoom Slider */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <ZoomIn className="w-4 h-4 text-emerald-600" />
                  <span>Zoom / Skala:</span>
                </span>
                <span className="font-mono text-emerald-700 font-bold">
                  {Math.round(scale * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setScale((prev) => Math.max(0.8, Number((prev - 0.1).toFixed(2))))}
                  className="p-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  title="Perkecil"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="0.8"
                  max="2.5"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setScale((prev) => Math.min(2.5, Number((prev + 0.1).toFixed(2))))}
                  className="p-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  title="Perbesar"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rotation & Guide Controls */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <RotateCw className="w-4 h-4 text-emerald-600" />
                  <span>Rotasi & Panduan:</span>
                </span>
                <span className="font-mono text-slate-600 font-bold">{rotation}°</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RotateCw className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Putar 90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowGrid(!showGrid)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1 ${
                    showGrid
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Garis Bantu</span>
                </button>
              </div>
            </div>

            {/* Horizontal Alignment */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>Posisi Horizontal (Kiri - Kanan):</span>
                <span className="font-mono text-slate-600 font-bold">{position.x}px</span>
              </div>
              <input
                type="range"
                min="-150"
                max="150"
                step="2"
                value={position.x}
                onChange={(e) => setPosition((prev) => ({ ...prev, x: parseInt(e.target.value) }))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Vertical Alignment */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>Posisi Vertikal (Atas - Bawah):</span>
                <span className="font-mono text-slate-600 font-bold">{position.y}px</span>
              </div>
              <input
                type="range"
                min="-150"
                max="150"
                step="2"
                value={position.y}
                onChange={(e) => setPosition((prev) => ({ ...prev, y: parseInt(e.target.value) }))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleApply}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isProcessing ? 'Memproses Foto...' : 'Terapkan Presisi Lingkaran'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

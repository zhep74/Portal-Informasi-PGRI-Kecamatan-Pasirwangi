'use client';

import React, { useState } from 'react';
import { usePgriStore } from '@/lib/store';

export interface PgriLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  src?: string;
  forceDefaultSvg?: boolean;
  alt?: string;
}

export function PgriSvgEmblem({
  className = 'h-10 w-10',
  size = 44,
  ariaLabel = 'Lambang Resmi PGRI',
}: {
  className?: string;
  size?: number;
  ariaLabel?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={ariaLabel}
    >
      {/* Outer circular shield with red & gold borders */}
      <circle cx="60" cy="60" r="58" fill="#047857" stroke="#FBBF24" strokeWidth="3" />
      <circle cx="60" cy="60" r="51" fill="#FFFFFF" stroke="#059669" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="43" fill="#1E3A8A" />

      {/* Decorative Wreath - Padi & Kapas leaves */}
      <g stroke="#FBBF24" strokeWidth="1.8" fill="none" opacity="0.9">
        <path d="M26 65 C26 80, 42 94, 60 95 C78 94, 94 80, 94 65" />
        {/* Leaf accents left */}
        <circle cx="30" cy="72" r="2.5" fill="#FBBF24" />
        <circle cx="38" cy="83" r="2.5" fill="#FBBF24" />
        <circle cx="48" cy="90" r="2.5" fill="#FBBF24" />
        {/* Leaf accents right */}
        <circle cx="90" cy="72" r="2.5" fill="#FBBF24" />
        <circle cx="82" cy="83" r="2.5" fill="#FBBF24" />
        <circle cx="72" cy="90" r="2.5" fill="#FBBF24" />
      </g>

      {/* Open Book of Knowledge at the bottom */}
      <g fill="#FFFFFF" stroke="#0F172A" strokeWidth="1">
        {/* Left page */}
        <path d="M60 84 C52 79, 44 80, 36 82 L38 72 C45 70, 53 69, 60 74 Z" fill="#F8FAFC" />
        {/* Right page */}
        <path d="M60 84 C68 79, 76 80, 84 82 L82 72 C75 70, 67 69, 60 74 Z" fill="#F8FAFC" />
        {/* Book spine line */}
        <line x1="60" y1="74" x2="60" y2="85" stroke="#059669" strokeWidth="1.5" />
      </g>

      {/* Torch Handle & Cawan Obor */}
      <path
        d="M57 66 L63 66 L61 74 L59 74 Z"
        fill="#FBBF24"
        stroke="#D97706"
        strokeWidth="0.8"
      />
      {/* Cawan Obor (Torch Bowl) */}
      <path
        d="M52 64 C52 67, 68 67, 68 64 L65 59 L55 59 Z"
        fill="#FFFFFF"
        stroke="#059669"
        strokeWidth="1.2"
      />

      {/* Five-rayed Sacred Torch Flame (Nyala Api Panca Dharma) */}
      <g>
        {/* Center Main Flame */}
        <path
          d="M60 30 C56 40, 56 48, 60 58 C64 48, 64 40, 60 30 Z"
          fill="#059669"
        />
        <path
          d="M60 36 C58 43, 58 48, 60 56 C62 48, 62 43, 60 36 Z"
          fill="#F59E0B"
        />
        <circle cx="60" cy="50" r="2.5" fill="#FEF3C7" />

        {/* Left Outer Flame */}
        <path
          d="M52 38 C47 45, 50 51, 55 58 C51 51, 48 46, 52 38 Z"
          fill="#10B981"
        />
        {/* Right Outer Flame */}
        <path
          d="M68 38 C73 45, 70 51, 65 58 C69 51, 72 46, 68 38 Z"
          fill="#10B981"
        />

        {/* Far Left Flame Ray */}
        <path
          d="M45 46 C42 50, 46 54, 52 58 C47 54, 43 51, 45 46 Z"
          fill="#F59E0B"
        />
        {/* Far Right Flame Ray */}
        <path
          d="M75 46 C78 50, 74 54, 68 58 C73 54, 77 51, 75 46 Z"
          fill="#F59E0B"
        />
      </g>

      {/* Center 5 Rays Star at the top */}
      <path
        d="M60 22 L62 26 L66 26 L63 29 L64 33 L60 31 L56 33 L57 29 L54 26 L58 26 Z"
        fill="#FBBF24"
      />

      {/* Curved Text: PGRI */}
      <text
        x="60"
        y="108"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="10"
        fontWeight="800"
        letterSpacing="2"
        fontFamily="sans-serif"
      >
        PGRI
      </text>
    </svg>
  );
}

export function PgriLogo({
  className = 'h-10 w-10',
  size = 44,
  src,
  forceDefaultSvg = false,
  alt = 'Logo PGRI',
}: PgriLogoProps) {
  const { profile } = usePgriStore();
  const [imgFailed, setImgFailed] = useState(false);

  const customLogo = !forceDefaultSvg ? (src || profile?.logoUrl) : undefined;

  if (customLogo && !imgFailed) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden ${className}`}
        style={size ? { width: size, height: size } : undefined}
      >
        <img
          src={customLogo}
          alt={alt}
          className="w-full h-full object-contain"
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return <PgriSvgEmblem className={className} size={size} ariaLabel={alt} />;
}

export function PgriBrand({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <PgriLogo className="h-10 w-10 shrink-0 drop-shadow-sm" size={40} />
      <div className="flex flex-col text-left">
        <span className="text-base font-bold tracking-tight text-slate-900 leading-tight">
          PGRI Pasirwangi
        </span>
        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
          Cabang Kab. Garut
        </span>
      </div>
    </div>
  );
}
